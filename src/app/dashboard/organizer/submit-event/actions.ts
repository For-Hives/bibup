'use server'

import type { Event } from '@/models/event.model'

import { auth } from '@clerk/nextjs/server'
import * as v from 'valibot'

import { fetchUserByClerkId } from '@/services/user.services'
import { createEvent } from '@/services/event.services'

const EventFormSchema = v.object({
	date: v.pipe(
		v.string(),
		v.minLength(1, 'Event date is required.'),
		v.transform(value => new Date(value))
	),
	location: v.pipe(v.string(), v.minLength(1, 'Event location is required.')),
	name: v.pipe(v.string(), v.minLength(1, 'Event name is required.')),
	description: v.optional(v.string(), ''),
})

export async function handleSubmitEvent(formData: FormData): Promise<void> {
	const { userId: clerkId } = await auth()

	if (clerkId == null) {
		throw new Error('You must be logged in to submit an event.')
	}

	const user = await fetchUserByClerkId(clerkId)
	if (user == null) {
		// Also updated this check for consistency, as fetchUserByClerkId can return null
		throw new Error('Organizer user record not found.')
	}

	const dataToValidate = {
		description: formData.get('description') as string,
		location: formData.get('location') as string,
		name: formData.get('name') as string,
		date: formData.get('date') as string,
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
		description: description ?? '',
		organizerId: user.id,
		location,
		name,
		date,
	}

	try {
		const newEvent = await createEvent(eventData as Event)
		if (!newEvent) {
			throw new Error('Failed to create event after submission.')
		}
	} catch (error: unknown) {
		throw new Error(`Failed to create event: ${error instanceof Error ? error.message : String(error)}`)
	}
}
