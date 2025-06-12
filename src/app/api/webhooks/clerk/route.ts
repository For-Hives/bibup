import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'

import { createUser, CreateUserDTO, updateUser, UpdateUserDTO, fetchUserByClerkId } from '@/services/user.services'; // Adjust path as necessary
import { User } from '@/models/user.model'; // If needed for casting or types

// Make sure to set CLERK_WEBHOOK_SECRET in your environment variables
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET

export async function POST(req: Request) {
	if (WEBHOOK_SECRET === undefined || WEBHOOK_SECRET === null || WEBHOOK_SECRET.trim() === '') {
		console.error('CLERK_WEBHOOK_SECRET is not set')
		return NextResponse.json({ error: 'Internal Server Error: Webhook secret not configured' }, { status: 500 })
	}

	// Get the headers
	const headerPayload = await headers()
	const svix_id = headerPayload.get('svix-id')
	const svix_timestamp = headerPayload.get('svix-timestamp')
	const svix_signature = headerPayload.get('svix-signature')

	// If there are no headers, error out
	if (svix_id == null || svix_timestamp == null || svix_signature == null) {
		return NextResponse.json({ error: 'Error occured -- no svix headers' }, { status: 400 })
	}

	// Get the body
	const payload: unknown = await req.json()
	const body = JSON.stringify(payload)

	// Create a new Svix instance with your secret.
	const wh = new Webhook(WEBHOOK_SECRET)

	let evt: WebhookEvent

	// Verify the payload with the headers
	try {
		evt = wh.verify(body, {
			'svix-timestamp': svix_timestamp,
			'svix-signature': svix_signature,
			'svix-id': svix_id,
		}) as WebhookEvent
	} catch (err) {
		console.error('Error verifying webhook:', err)
		return NextResponse.json({ error: 'Error occured during webhook verification' }, { status: 400 })
	}

	// Get the ID and type
	const eventType = evt.type

	if (eventType === 'user.created') {
		const {
			email_addresses,
			id: clerkId,
			first_name,
			last_name,
			public_metadata, // Access public_metadata
		} = evt.data;

		if (!clerkId) {
			console.error('Received user.created event without clerkId')
			return NextResponse.json({ error: 'Missing Clerk User ID in webhook payload' }, { status: 400 })
		}

		const primaryEmail = email_addresses?.find(email => email.id === evt.data.primary_email_address_id)?.email_address

		if (primaryEmail === undefined || primaryEmail === null || primaryEmail.trim() === '') {
			console.error(`User ${clerkId} has no primary email address.`)
			return NextResponse.json({ error: 'Primary email address missing' }, { status: 400 })
		}

		// Extract custom attributes
		const phone = public_metadata?.phone as string | undefined;
		const dateOfBirth = public_metadata?.dateOfBirth as string | undefined; // Expects YYYY-MM-DD
		const addressStreet = public_metadata?.addressStreet as string | undefined;
		const addressCity = public_metadata?.addressCity as string | undefined;
		const addressPostalCode = public_metadata?.addressPostalCode as string | undefined;
		const addressCountry = public_metadata?.addressCountry as string | undefined;

		let address: CreateUserDTO['address'] | undefined = undefined;
		if (addressStreet && addressCity && addressPostalCode && addressCountry) {
			address = {
				street: addressStreet,
				city: addressCity,
				postalCode: addressPostalCode,
				country: addressCountry,
			};
		}

		const userData: CreateUserDTO = {
			firstName: first_name ?? '',
			lastName: last_name ?? '',
			email: primaryEmail, // primaryEmail is already defined in the existing code
			clerkId,
			phone,         // New
			dateOfBirth,   // New
			address,       // New
		};

		try {
			// Create user in PocketBase
			const newUserInDb = await createUser(userData)

			if (!newUserInDb) {
				console.error(`Failed to create user ${clerkId} in PocketBase.`)
				// Potentially, Clerk might retry the webhook. If not, this user will be out of sync.
				return NextResponse.json({ error: 'Failed to create user in database' }, { status: 500 })
			}

			// Update Clerk user metadata with default role
			// Note: public_metadata from the event might not be up-to-date if it was just created.
			// We explicitly set the roles we want as the default.
			// await clerkClient.users.updateUserMetadata(clerkId, {
			//   publicMetadata: {
			//     roles: ["buyer"], // Default role
			//   },
			// });

			return NextResponse.json({ message: 'User created and metadata updated successfully' }, { status: 200 })
		} catch (error) {
			console.error(`Error processing user.created event for ${clerkId}:`, error)
			// Check if the error is from Clerk SDK or PocketBase service
			let errorMessage = 'Internal server error processing user creation.'
			if (error instanceof Error) {
				errorMessage = error.message
			}
			return NextResponse.json({ error: errorMessage }, { status: 500 })
		}
	} else if (eventType === 'user.updated') {
		const {
			id: clerkId,
			first_name,
			last_name,
			public_metadata,
		} = evt.data;

		if (!clerkId) {
			console.error('Received user.updated event without clerkId');
			return NextResponse.json({ error: 'Missing Clerk User ID in webhook payload' }, { status: 400 });
		}

		try {
			const existingUser = await fetchUserByClerkId(clerkId);
			if (!existingUser || !existingUser.id) {
				console.warn(`User with Clerk ID ${clerkId} not found in PocketBase. Cannot update.`);
				// This might happen if user.created failed or was missed.
				// Optionally, you could attempt to create the user here as a fallback.
				return NextResponse.json({ error: 'User not found in database for update' }, { status: 404 });
			}

			const phone = public_metadata?.phone as string | undefined;
			const dateOfBirth = public_metadata?.dateOfBirth as string | undefined;
			const addressStreet = public_metadata?.addressStreet as string | undefined;
			const addressCity = public_metadata?.addressCity as string | undefined;
			const addressPostalCode = public_metadata?.addressPostalCode as string | undefined;
			const addressCountry = public_metadata?.addressCountry as string | undefined;

			const updateData: UpdateUserDTO = {};

			if (first_name !== undefined) updateData.firstName = first_name;
			if (last_name !== undefined) updateData.lastName = last_name;
			if (phone !== undefined) updateData.phone = phone;
			if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;

			if (addressStreet && addressCity && addressPostalCode && addressCountry) {
				updateData.address = {
					street: addressStreet,
					city: addressCity,
					postalCode: addressPostalCode,
					country: addressCountry,
				};
			} else if (public_metadata && (public_metadata.addressStreet !== undefined || public_metadata.addressCity !== undefined || public_metadata.addressPostalCode !== undefined || public_metadata.addressCountry !== undefined)) {
				// Handle partial address updates if needed, or decide if address is all-or-nothing
				// For now, if any address component is present in metadata but not all, it won't update the address.
				// To clear an address, one might need a specific mechanism or ensure all fields are empty strings.
				console.warn(`Partial address data received for user ${clerkId}. Address update skipped unless all parts are present.`);
			}


			if (Object.keys(updateData).length === 0) {
				return NextResponse.json({ message: 'No updatable data received in webhook for user.updated' }, { status: 200 });
			}

			const updatedUser = await updateUser(existingUser.id, updateData);

			if (!updatedUser) {
				console.error(`Failed to update user ${clerkId} (DB ID: ${existingUser.id}) in PocketBase.`);
				return NextResponse.json({ error: 'Failed to update user in database' }, { status: 500 });
			}

			return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });

		} catch (error) {
			console.error(`Error processing user.updated event for ${clerkId}:`, error);
			let errorMessage = 'Internal server error processing user update.';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			return NextResponse.json({ error: errorMessage }, { status: 500 });
		}
	} else {
		return NextResponse.json({ message: `Webhook received: ${eventType}, but no handler configured.` }, { status: 200 })
	}
}
