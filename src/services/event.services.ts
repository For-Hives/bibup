'use server'

import type { Event } from '@/models/event.model'

import { pb } from '@/lib/pocketbaseClient'

/**
 * Creates a new event. This function is intended for use by organizers.
 * @param eventData Partial data for the new event. Fields like name, date, location, description are expected.
 * @param organizerId The ID of the user (organizer) creating the event.
 */
export async function createEvent(eventData: Event): Promise<Event | null> {
	if (!eventData.organizerId) {
		console.error('Organizer ID is required to create an event.')
		return null
	}
	if (eventData.name === '' || isNaN(eventData.date.getTime()) || eventData.location === '') {
		console.error('Event name, date, and location are required.')
		return null
	}

	try {
		const dataToCreate: Omit<Event, 'id'> = {
			participantCount: eventData.participantCount ?? 0,
			isPartnered: eventData.isPartnered ?? false,
			description: eventData.description ?? '',
			organizerId: eventData.organizerId,
			date: new Date(eventData.date),
			location: eventData.location,
			status: 'pending_approval',
			name: eventData.name,
			bibsSold: 0,
		}

		const record = await pb.collection('events').create<Event>(dataToCreate)
		return record
	} catch (error: unknown) {
		throw new Error('Error creating event: ' + (error instanceof Error ? error.message : String(error)))
	}
}

/**
 * Fetches all events that are approved and public.
 */
export async function fetchApprovedPublicEvents(): Promise<Event[]> {
	try {
		const records = await pb.collection('events').getFullList<Event>({
			filter: "status = 'approved'",
			sort: 'date',
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
		const filter = pb.filter('organizerId = {:organizerId}', { organizerId })
		const records = await pb.collection('events').getFullList<Event>({
			sort: '-created',
			filter,
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
			filter: "status = 'approved' && isPartnered = true",
			sort: 'date',
		})
		return records
	} catch (error: unknown) {
		throw new Error(
			'Error fetching partnered and approved events: ' + (error instanceof Error ? error.message : String(error))
		)
	}
}
