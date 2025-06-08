'use server'

import type { Event } from '@/models/event.model' // Updated model import

import { pb } from '@/lib/pocketbaseClient' // Assuming this is the correct path to your PocketBase client

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
	if (!eventData.name || isNaN(eventData.date.getTime()) || !eventData.location) {
		console.error('Event name, date, and location are required.')
		return null
	}

	try {
		const dataToCreate: Omit<Event, 'id'> = {
			participantCount: eventData.participantCount ?? 0, // Default participantCount
			isPartnered: eventData.isPartnered ?? false, // Default isPartnered
			description: eventData.description ?? '',
			organizerId: eventData.organizerId,
			date: new Date(eventData.date), // Ensure date is a Date object
			location: eventData.location,
			status: 'pending_approval', // Default status
			name: eventData.name,
			bibsSold: 0, // Default bibsSold
			// Ensure any other required fields from the Event model are present with defaults if necessary
		}

		const record = await pb.collection('events').create<Event>(dataToCreate)
		return record
	} catch (error: unknown) {
		console.error('Error creating event:', error)

		return null
	}
}

/**
 * Fetches all events that are approved and public.
 */
export async function fetchApprovedPublicEvents(): Promise<Event[]> {
	try {
		// Filter for events with status 'approved'
		// Adjust the field name 'status' and value 'approved' if they differ in your PocketBase collection
		const records = await pb.collection('events').getFullList<Event>({
			filter: "status = 'approved'",
			sort: 'date', // Sort by event date, upcoming first
		})

		// PocketBase SDK should correctly type records if <Event> is used with getFullList
		return records
	} catch (error: unknown) {
		console.error('Error fetching approved public events:', error)
		// Return empty array on other errors for safety and consistency with other functions
		return []
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
		console.error(`Error fetching event with ID "${id}":`, error)

		return null // Return null if the event is not found or an error occurs
	}
}

/**
 * Fetches all events submitted by a specific organizer.
 * @param organizerId The ID of the organizer whose events are to be fetched.
 */
export async function fetchEventsByOrganizer(organizerId: string): Promise<Event[]> {
	if (!organizerId) {
		console.error('Organizer ID is required to fetch their events.')
		return [] // Return empty array if no organizerId is provided
	}
	try {
		const records = await pb.collection('events').getFullList<Event>({
			filter: `organizerId = "${organizerId}"`, // TODO: check if it is not possible to inject code here
			sort: '-created', // Sort by creation date, newest first. Or use '-date' for event date.
		})
		return records
	} catch (error: unknown) {
		console.error(`Error fetching events for organizer ID "${organizerId}":`, error)
		// For other errors (connection issues, collection doesn't exist, etc.)
		// Return empty array for safety to prevent UI crashes
		return []
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
			sort: 'date', // Sort by event date, upcoming first
		})
		return records
	} catch (error: unknown) {
		console.error('Error fetching partnered and approved events:', error)

		// For other errors, return empty array for safety
		return []
	}
}
