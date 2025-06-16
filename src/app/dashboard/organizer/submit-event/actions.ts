'use server'

import { auth } from '@clerk/nextjs/server'
import * as v from 'valibot'

import type { Event } from '@/models/event.model'

import { fetchUserByClerkId } from '@/services/user.services'
import { createEvent } from '@/services/event.services'

const EventFormSchema = v.object({
	name: v.pipe(v.string(), v.minLength(1, 'Event name is required.')),
	location: v.pipe(v.string(), v.minLength(1, 'Event location is required.')),
	description: v.optional(v.string(), ''),
	date: v.pipe(
		v.string(),
		v.minLength(1, 'Event date is required.'),
		v.transform(value => new Date(value))
	),
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
		name: formData.get('name') as string,
		location: formData.get('location') as string,
		description: formData.get('description') as string,
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

	const { name, location, description, date } = validationResult.output

	// const eventData: Omit<Event, 'bibsSold' | 'id' | 'isPartnered' | 'participantCount' | 'status'> &
	// 	Partial<Pick<Event, 'isPartnered' | 'participantCount'>> = {
	// 	organizerId: user.id,
	// 	name,
	// 	location,
	// 	description: description ?? '',
	// 	date,
	// }

	const eventData: Omit<Event, 'id'> = {
		typeCourse: 'route',
		participantCount: 0,
		options: [],
		name,
		location,
		isPartnered: false,
		eventDate: date,
		description: description ?? '',
		bibPickupWindowEndDate: new Date(date),
		bibPickupWindowBeginDate: new Date(date),
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
