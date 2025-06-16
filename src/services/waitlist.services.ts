'use server'

import type { Waitlist } from '@/models/waitlist.model'
import type { Event } from '@/models/event.model'

import { pb } from '@/lib/pocketbaseClient'

/**
 * Adds a user to the waitlist for a specific event.
 * Prevents duplicate entries.
 * @param eventId The ID of the event.
 * @param userId The ID of the user joining the waitlist.
 * @returns The created waitlist entry, the existing entry if already added, or null on error.
 *          Returns an object with `error: 'already_on_waitlist'` for duplicates.
 */
export async function addToWaitlist(eventId: string, userId: string): Promise<null | (Waitlist & { error?: string })> {
	if (eventId === '' || userId === '') {
		console.error('Event ID and User ID are required to join a waitlist.')
		return null
	}

	try {
		// Check for existing waitlist entry
		try {
			const existingEntry = await pb
				.collection('waitlists')
				.getFirstListItem<Waitlist>(`userId = "${userId}" && eventId = "${eventId}"`)
			return { ...existingEntry, error: 'already_on_waitlist' }
		} catch (error: unknown) {
			// PocketBase's getFirstListItem throws a 404 error if no record is found,
			// which is the expected behavior if the user is not already on the waitlist.
			// We only re-throw if it's an unexpected error (not a 404).
			if (
				error != null &&
				typeof error === 'object' &&
				'status' in error &&
				(error as { status: unknown }).status !== 404
			) {
				throw error
			}
		}

		const dataToCreate: Omit<Waitlist, 'addedAt' | 'id' | 'notifiedAt'> & {
			addedAt: Date
		} = {
			userId: userId,
			optionPreferences: {},
			mailNotification: false,
			eventId: eventId,
			addedAt: new Date(),
		}

		const record = await pb.collection('waitlists').create<Waitlist>(dataToCreate)
		return record
	} catch (error: unknown) {
		if (error != null && typeof error === 'object') {
			if ('message' in error && typeof (error as { message: unknown }).message === 'string') {
				console.error('PocketBase error details:', (error as { message: string }).message)
			}
			if ('response' in error) {
				const response = (error as { response: unknown }).response
				if (response != null && typeof response === 'object' && 'data' in response) {
					console.error('PocketBase response data:', (response as { data: unknown }).data)
				}
			}
		}
		throw new Error(
			`Error adding user ${userId} to waitlist for event ${eventId}: ` +
				(error instanceof Error ? error.message : String(error))
		)
	}
}

/**
 * Fetches all waitlist entries for a specific user.
 * @param userId The ID of the user whose waitlist entries are to be fetched.
 */
export async function fetchUserWaitlists(userId: string): Promise<(Waitlist & { expand?: { eventId: Event } })[]> {
	if (userId === '') {
		console.error('User ID is required to fetch their waitlists.')
		return []
	}

	try {
		const records = await pb.collection('waitlists').getFullList<Waitlist & { expand?: { eventId: Event } }>({
			sort: '-addedAt',
			filter: `userId = "${userId}"`,
			expand: 'eventId',
		})
		return records
	} catch (error: unknown) {
		throw new Error(
			`Error fetching waitlists for user ID "${userId}": ` + (error instanceof Error ? error.message : String(error))
		)
	}
}
