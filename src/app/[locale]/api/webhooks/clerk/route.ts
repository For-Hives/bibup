import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'

import { createUser } from '@/services/user.services' // Adjust path as necessary
import { User } from '@/models/user.model'

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
		const { last_name, id: clerkId, first_name, email_addresses } = evt.data

		if (!clerkId) {
			console.error('Received user.created event without clerkId')
			return NextResponse.json({ error: 'Missing Clerk User ID in webhook payload' }, { status: 400 })
		}

		const primaryEmail = email_addresses?.find(email => email.id === evt.data.primary_email_address_id)?.email_address

		if (primaryEmail === undefined || primaryEmail === null || primaryEmail.trim() === '') {
			console.error(`User ${clerkId} has no primary email address.`)
			return NextResponse.json({ error: 'Primary email address missing' }, { status: 400 })
		}

		const userData: Omit<User, 'created' | 'id' | 'updated'> = {
			role: 'user',
			lastName: last_name ?? '',
			firstName: first_name ?? '',
			email: primaryEmail,
			createdAt: new Date(),
			clerkId,
		}

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
			// We explicitly set the role we want as the default.
			// await clerkClient.users.updateUserMetadata(clerkId, {
			//   publicMetadata: {
			//     role: ["buyer"], // Default role
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
	} else {
		return NextResponse.json({ message: `Webhook received: ${eventType}, but no handler configured.` }, { status: 200 })
	}
}
