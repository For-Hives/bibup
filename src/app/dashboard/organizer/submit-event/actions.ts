'use server'

import type { Event } from '@/models/event.model' // Assuming Event model path

import { auth } from '@clerk/nextjs/server'
import * as v from 'valibot'

import { fetchUserByClerkId } from '@/services/user.services'
import { createEvent } from '@/services/event.services'

// Define a schema for event form data validation (similar to BibFormSchema if you have one)
// This is a basic example; adjust validation rules as needed.
const EventFormSchema = v.object({
	date: v.pipe(
		v.string(),
		v.minLength(1, 'Event date is required.'),
		v.transform(value => new Date(value))
	),
	location: v.pipe(v.string(), v.minLength(1, 'Event location is required.')),
	name: v.pipe(v.string(), v.minLength(1, 'Event name is required.')),
	description: v.optional(v.string(), ''),
	// Add other fields as necessary, e.g., isPartnered, participantCount
})

export async function handleSubmitEvent(formData: FormData): Promise<{
	error?: string
	redirectPath?: string
	success: boolean
}> {
	const { userId: clerkId } = await auth()

	if (!clerkId) {
		throw new Error('You must be logged in to submit an event.')
	}

	const user = await fetchUserByClerkId(clerkId)
	if (!user) {
		throw new Error('Organizer user record not found.')
	}

	const dataToValidate = {
		description: formData.get('description') as string,
		location: formData.get('location') as string,
		name: formData.get('name') as string,
		date: formData.get('date') as string, // Keep as string for validation, transform will convert
	}

	const validationResult = v.safeParse(EventFormSchema, dataToValidate)

	if (!validationResult.success) {
		const flatErrors = v.flatten(validationResult.issues)
		const errorMessages =
			flatErrors.root?.join(', ') ??
			Object.values(flatErrors.nested ?? {})
				.flat()
				.join(', ') ??
			'Validation failed.'
		throw new Error(`Validation failed: ${errorMessages}`)
	}

	const { description, location, name, date } = validationResult.output

	const eventData: Omit<Event, 'bibsSold' | 'id' | 'isPartnered' | 'participantCount' | 'status'> &
		Partial<Pick<Event, 'isPartnered' | 'participantCount'>> = {
		description: description ?? '', // Ensure description is not undefined
		organizerId: user.id, // Use the PocketBase user ID
		location,
		name,
		date, // Already a Date object due to transform
		// Default values for other fields if not provided by form
		// status: 'pending_approval', // Set by createEvent service if not provided
		// bibsSold: 0,
		// participantCount: 0, // Example: default to 0, or get from form
		// isPartnered: false, // Example: default to false, or get from form
	}

	try {
		const newEvent = await createEvent(eventData as Event) // Cast needed if createEvent expects full Event type
		if (!newEvent) {
			// This case implies createEvent returned null/undefined without throwing.
			// Based on service refactor, createEvent should throw on failure.
			throw new Error('Failed to create event after submission.')
		}
		return { redirectPath: '/dashboard/organizer?success=true', success: true }
	} catch (error: unknown) {
		throw new Error(`Failed to create event: ${error instanceof Error ? error.message : String(error)}`)
	}
}
