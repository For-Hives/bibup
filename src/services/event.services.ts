'use server'

import type { Event } from '@/models/event.model'

import { pb } from '@/lib/pocketbaseClient'

/**
 * Creates a new event. This function is intended for use by organizers.
 * @param eventData Partial data for the new event. Fields like name, date, location, description are expected.
 * @param organizerId The ID of the user (organizer) creating the event.
 */
export async function createEvent(eventData: Event): Promise<Event | null> {
	if (!eventData.name || isNaN(eventData.eventDate.getTime()) || !eventData.location) {
		console.error('Event name, date, and location are required.')
		return null
	}

	try {
		const dataToCreate: Omit<Event, 'id'> = {
			typeCourse: eventData.typeCourse ?? 'route',
			transferDeadline: eventData.transferDeadline,
			registrationUrl: eventData.registrationUrl,
			participantCount: eventData.participantCount ?? 0,
			parcoursUrl: eventData.parcoursUrl,
			options: eventData.options ?? [],
			officialStandardPrice: eventData.officialStandardPrice,
			name: eventData.name,
			logo: eventData.logo,
			location: eventData.location,
			isPartnered: eventData.isPartnered ?? false,

			eventDate: new Date(eventData.eventDate),
			elevationGainM: eventData.elevationGainM,
			// Optional fields
			distanceKm: eventData.distanceKm,
			description: eventData.description ?? '',
			bibPickupWindowEndDate: eventData.bibPickupWindowEndDate ?? new Date(),
			bibPickupWindowBeginDate: eventData.bibPickupWindowBeginDate ?? new Date(),
			bibPickupLocation: eventData.bibPickupLocation,
		}

		console.info('Creating event with PocketBase:', {
			url: pb.baseUrl,
			hasAuth: !!pb.authStore.token,
			eventName: dataToCreate.name,
		})

		const record = await pb.collection('events').create<Event>(dataToCreate)

		console.info('Event created successfully:', record.id)
		return record
	} catch (error: unknown) {
		console.error('PocketBase error details:', error)
		throw new Error('Error creating event: ' + (error instanceof Error ? error.message : String(error)))
	}
}

/**
 * Fetches all events that are approved and public.
 */
export async function fetchApprovedPublicEvents(): Promise<Event[]> {
	try {
		const records = await pb.collection('events').getFullList<Event>({
			sort: 'eventDate',
		})

		return records
	} catch (error: unknown) {
		throw new Error(
			'Error fetching approved public events: ' + (error instanceof Error ? error.message : String(error))
		)
	}
}

/**
 * Fetches a single event by its ID.
 * @param id The ID of the event to fetch.
 */
export async function fetchEventById(id: string): Promise<Event | null> {
	try {
		const record = await pb.collection('events').getOne<Event>(id)
		return record
	} catch (error: unknown) {
		throw new Error(`Error fetching event with ID "${id}": ` + (error instanceof Error ? error.message : String(error)))
	}
}

/**
 * Fetches all events submitted by a specific organizer.
 * @param organizerId The ID of the organizer whose events are to be fetched.
 */
export async function fetchEventsByOrganizer(organizerId: string): Promise<Event[]> {
	if (organizerId === '') {
		console.error('Organizer ID is required to fetch their events.')
		return []
	}
	try {
		const records = await pb.collection('events').getFullList<Event>({
			sort: '-created',
		})
		return records
	} catch (error: unknown) {
		throw new Error(
			`Error fetching events for organizer ID "${organizerId}": ` +
				(error instanceof Error ? error.message : String(error))
		)
	}
}

/**
 * Fetches all events that are approved AND partnered.
 * These are typically events for which bibs can be listed by sellers.
 */
export async function fetchPartneredApprovedEvents(): Promise<Event[]> {
	try {
		const records = await pb.collection('events').getFullList<Event>({
			sort: 'eventDate',
			filter: 'isPartnered = true',
		})
		return records
	} catch (error: unknown) {
		throw new Error(
			'Error fetching partnered and approved events: ' + (error instanceof Error ? error.message : String(error))
		)
	}
}

/**
 * Fetches all events for admin purposes.
 * This function should only be used by admin users.
 */
export async function getAllEvents(): Promise<Event[]> {
	try {
		const records = await pb.collection('events').getFullList<Event>({
			sort: '-created',
		})
		return records
	} catch (error: unknown) {
		throw new Error('Error fetching all events: ' + (error instanceof Error ? error.message : String(error)))
	}
}
