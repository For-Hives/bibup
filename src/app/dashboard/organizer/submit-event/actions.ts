'use server'

import { auth } from '@clerk/nextjs/server'
import { createEvent } from '@/services/event.services'
import { fetchUserByClerkId } from '@/services/user.services'
import type { Event } from '@/models/event.model' // Assuming Event model path
import * as v from 'valibot'

// Define a schema for event form data validation (similar to BibFormSchema if you have one)
// This is a basic example; adjust validation rules as needed.
const EventFormSchema = v.object({
	name: v.pipe(v.string(), v.minLength(1, 'Event name is required.')),
	date: v.pipe(
		v.string(),
		v.minLength(1, 'Event date is required.'),
		v.transform(value => new Date(value)),
	),
	location: v.pipe(v.string(), v.minLength(1, 'Event location is required.')),
	description: v.optional(v.string(), ''),
	// Add other fields as necessary, e.g., isPartnered, participantCount
})

export async function handleSubmitEvent(formData: FormData): Promise<{
	success: boolean
	error?: string
	redirectPath?: string
}> {
	const { userId: clerkId } = auth()

	if (!clerkId) {
		return { success: false, error: 'User not authenticated. Please log in.' }
	}

	const user = await fetchUserByClerkId(clerkId)
	if (!user) {
		return { success: false, error: 'Authenticated user not found in database.' }
	}

	const dataToValidate = {
		name: formData.get('name') as string,
		date: formData.get('date') as string, // Keep as string for validation, transform will convert
		location: formData.get('location') as string,
		description: formData.get('description') as string,
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
		return { success: false, error: errorMessages }
	}

	const { name, date, location, description }_ = validationResult.output

	const eventData: Omit<Event, 'id' | 'status' | 'bibsSold' | 'participantCount' | 'isPartnered'> &
		Partial<Pick<Event, 'participantCount' | 'isPartnered'>> = {
		name,
		date, // Already a Date object due to transform
		location,
		description: description ?? '', // Ensure description is not undefined
		organizerId: user.id, // Use the PocketBase user ID
		// Default values for other fields if not provided by form
		// status: 'pending_approval', // Set by createEvent service if not provided
		// bibsSold: 0,
		// participantCount: 0, // Example: default to 0, or get from form
		// isPartnered: false, // Example: default to false, or get from form
	}

	try {
		const newEvent = await createEvent(eventData as Event) // Cast needed if createEvent expects full Event type
		if (newEvent) {
			return { success: true, redirectPath: '/dashboard/organizer?success=true' }
		} else {
			return { success: false, error: 'Failed to create event. Please try again.' }
		}
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : String(error)
		return { success: false, error: `Error creating event: ${errorMessage}` }
	}
}
