import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'

import { createUser } from '@/services/user.services' // Adjust path as necessary
import { User } from '@/models/user.model'

// Make sure to set CLERK_WEBHOOK_SECRET in your environment variables
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET

interface ClerkUserData {
	email_addresses?: Array<{ email_address: string; id: string }>
	first_name?: string
	id: string
	last_name?: string
	primary_email_address_id?: string
}

interface SvixHeaders {
	svix_id: string
	svix_signature: string
	svix_timestamp: string
}

export async function POST(req: Request) {
	const secretValidation = validateWebhookSecret()
	if (secretValidation) {
		return secretValidation
	}

	const headersResult = await extractSvixHeaders()
	if (headersResult instanceof NextResponse) {
		return headersResult
	}

	const verificationResult = await verifyWebhookPayload(req, headersResult)
	if (verificationResult instanceof NextResponse) {
		return verificationResult
	}

	const evt = verificationResult
	const eventType = evt.type

	if (eventType === 'user.created') {
		return await handleUserCreatedEvent(evt)
	}

	return NextResponse.json({ message: `Webhook received: ${eventType}, but no handler configured.` }, { status: 200 })
}

function buildUserData(evt: WebhookEvent, primaryEmail: string): Omit<User, 'created' | 'id' | 'updated'> {
	const userData = evt.data as ClerkUserData
	const { last_name, id: clerkId, first_name } = userData

	return {
		updatedAt: new Date().toISOString(),
		stripeAccountVerified: false,
		stripeAccountId: null,
		role: 'user',
		postalCode: '',
		phoneNumber: '',
		lastName: last_name ?? '',
		isOrganizer: false,
		isAdmin: false,
		firstName: first_name ?? '',
		emergencyContactPhone: '',
		emergencyContactName: '',
		email: primaryEmail,
		createdAt: new Date().toISOString(),
		country: '',
		clerkId,
		city: '',
		birthDate: '',
		address: '',
	}
}

async function extractSvixHeaders(): Promise<NextResponse | SvixHeaders> {
	const headerPayload = await headers()
	const svix_id = headerPayload.get('svix-id')
	const svix_timestamp = headerPayload.get('svix-timestamp')
	const svix_signature = headerPayload.get('svix-signature')

	if (svix_id == null || svix_timestamp == null || svix_signature == null) {
		return NextResponse.json({ error: 'Error occured -- no svix headers' }, { status: 400 })
	}

	return { svix_timestamp, svix_signature, svix_id }
}

function extractUserData(evt: WebhookEvent): NextResponse | { clerkId: string; primaryEmail: string } {
	const userData = evt.data as ClerkUserData
	const { id: clerkId, email_addresses } = userData

	if (typeof clerkId !== 'string' || clerkId.trim() === '') {
		console.error('Received user.created event without clerkId')
		return NextResponse.json({ error: 'Missing Clerk User ID in webhook payload' }, { status: 400 })
	}

	const primaryEmail = email_addresses?.find(
		(email: { email_address: string; id: string }) => email.id === userData.primary_email_address_id
	)?.email_address

	if (typeof primaryEmail !== 'string' || primaryEmail.trim() === '') {
		console.error(`User ${clerkId} has no primary email address.`)
		return NextResponse.json({ error: 'Primary email address missing' }, { status: 400 })
	}

	return { primaryEmail, clerkId }
}

async function handleUserCreatedEvent(evt: WebhookEvent): Promise<NextResponse> {
	const extractionResult = extractUserData(evt)
	if (extractionResult instanceof NextResponse) {
		return extractionResult
	}

	const { primaryEmail, clerkId } = extractionResult
	const userData = buildUserData(evt, primaryEmail)

	return await processUserCreation(userData, clerkId)
}

async function processUserCreation(
	userData: Omit<User, 'created' | 'id' | 'updated'>,
	clerkId: string
): Promise<NextResponse> {
	try {
		const newUserInDb = await createUser(userData)

		if (newUserInDb === null) {
			console.error(`Failed to create user ${clerkId} in PocketBase.`)
			return NextResponse.json({ error: 'Failed to create user in database' }, { status: 500 })
		}

		return NextResponse.json({ message: 'User created and metadata updated successfully' }, { status: 200 })
	} catch (error) {
		console.error(`Error processing user.created event for ${clerkId}:`, error)
		const errorMessage = error instanceof Error ? error.message : 'Internal server error processing user creation.'
		return NextResponse.json({ error: errorMessage }, { status: 500 })
	}
}

function validateWebhookSecret(): NextResponse | null {
	if (WEBHOOK_SECRET === undefined || WEBHOOK_SECRET === null || WEBHOOK_SECRET.trim() === '') {
		console.error('CLERK_WEBHOOK_SECRET is not set')
		return NextResponse.json({ error: 'Internal Server Error: Webhook secret not configured' }, { status: 500 })
	}
	return null
}

async function verifyWebhookPayload(req: Request, headers: SvixHeaders): Promise<NextResponse | WebhookEvent> {
	const payload: unknown = await req.json()
	const body = JSON.stringify(payload)
	const wh = new Webhook(WEBHOOK_SECRET!)

	try {
		return wh.verify(body, {
			'svix-timestamp': headers.svix_timestamp,
			'svix-signature': headers.svix_signature,
			'svix-id': headers.svix_id,
		}) as WebhookEvent
	} catch (err) {
		console.error('Error verifying webhook:', err)
		return NextResponse.json({ error: 'Error occured during webhook verification' }, { status: 400 })
	}
}
