'use server'

import type { Transaction } from '@/models/transaction.model'
import type { Event } from '@/models/event.model'
import type { Bib } from '@/models/bib.model'

import { pb } from '@/lib/pocketbaseClient'

import { createTransaction } from './transaction.services'
import { fetchUserById } from './user.services'

/**
 * Creates a new bib listing. Handles both partnered and unlisted events.
 * @param bibData Data for the new bib, including potential unlisted event details.
 * @param sellerUserId The ID of the user (seller) listing the bib.
 */
export async function createBib(bibData: Omit<Bib, 'created' | 'id' | 'updated'>): Promise<Bib | null> {
	if (bibData.sellerUserId === '') {
		console.error('Seller ID is required to create a bib listing.')
		return null
	}
	if (bibData.registrationNumber === '' || bibData.price === undefined || bibData.price < 0) {
		console.error('Registration Number and a valid Price are required.')
		return null
	}

	let status: Bib['status'] = 'available'
	let finalEventId: string = bibData.eventId

	try {
		const dataToCreate: Omit<Bib, 'id'> = {
			validated: false,

			status: status,
			sellerUserId: bibData.sellerUserId,
			registrationNumber: bibData.registrationNumber,
			privateListingToken: undefined,

			price: bibData.price,
			originalPrice: bibData.originalPrice,
			optionValues: bibData.optionValues,
			listed: null,
			eventId: finalEventId,

			buyerUserId: undefined,
		}

		const record = await pb.collection('bibs').create<Bib>(dataToCreate)
		return record
	} catch (error: unknown) {
		throw new Error('Error creating bib listing: ' + (error instanceof Error ? error.message : String(error)))
	}
}

/**
 * Fetches a single bib by its ID for public display or pre-purchase.
 * @param bibId The ID of the bib to fetch.
 */
export async function fetchBibById(bibId: string): Promise<(Bib & { expand?: { eventId: Event } }) | null> {
	if (bibId === '') {
		console.error('Bib ID is required.')
		return null
	}
	try {
		const record = await pb.collection('bibs').getOne<Bib & { expand?: { eventId: Event } }>(bibId, {
			expand: 'eventId',
		})

		return record
	} catch (error: unknown) {
		throw new Error(
			`Error fetching bib with ID "${bibId}": ` + (error instanceof Error ? error.message : String(error))
		)
	}
}

/**
 * Fetches a single bib by its ID for a specific seller, ensuring ownership.
 * @param bibId The ID of the bib to fetch.
 * @param sellerUserId The PocketBase ID of the seller claiming ownership.
 */
export async function fetchBibByIdForSeller(
	bibId: string,
	sellerUserId: string
): Promise<(Bib & { expand?: { eventId: Event } }) | null> {
	if (bibId === '' || sellerUserId === '') {
		console.error('Bib ID and Seller ID are required.')
		return null
	}
	try {
		const record = await pb.collection('bibs').getOne<Bib & { expand?: { eventId: Event } }>(bibId, {
			expand: 'eventId',
		})
		if (record.sellerUserId !== sellerUserId) {
			console.warn(`Seller ${sellerUserId} attempted to access bib ${bibId} owned by ${record.sellerUserId}.`)
			return null
		}
		return record
	} catch (error: unknown) {
		throw new Error(
			`Error fetching bib ${bibId} for seller ${sellerUserId}: ` +
				(error instanceof Error ? error.message : String(error))
		)
	}
}

/**
 * Fetches all bibs purchased by a specific buyer.
 * @param buyerUserId The PocketBase ID of the buyer whose purchased bibs are to be fetched.
 */
export async function fetchBibsByBuyer(buyerUserId: string): Promise<(Bib & { expand?: { eventId: Event } })[]> {
	if (buyerUserId === '') {
		console.error('Buyer User ID is required to fetch their purchased bibs.')
		return []
	}

	try {
		const records = await pb.collection('bibs').getFullList<Bib & { expand?: { eventId: Event } }>({
			sort: '-updated',
			filter: `buyerUserId = "${buyerUserId}" && status = 'sold'`,
			expand: 'eventId',
		})
		return records
	} catch (error: unknown) {
		throw new Error(
			`Error fetching bibs for buyer ID "${buyerUserId}": ` + (error instanceof Error ? error.message : String(error))
		)
	}
}

/**
 * Fetches all bibs listed by a specific seller.
 * Optionally expands event details if your PocketBase setup allows and it's needed.
 * @param sellerUserId The PocketBase ID of the seller whose bibs are to be fetched.
 */
export async function fetchBibsBySeller(sellerUserId: string): Promise<Bib[]> {
	if (sellerUserId === '') {
		console.error('Seller ID is required to fetch their bibs.')
		return []
	}

	try {
		const records = await pb.collection('bibs').getFullList<Bib & { expand?: { eventId: Event } }>({
			sort: '-created',
			filter: `sellerUserId = "${sellerUserId}"`,
		})

		return records
	} catch (error: unknown) {
		throw new Error(
			`Error fetching bibs for seller ID "${sellerUserId}": ` + (error instanceof Error ? error.message : String(error))
		)
	}
}

/**
 * Fetches all publicly listed bibs for a specific event.
 * @param eventId The ID of the event.
 */
export async function fetchPubliclyListedBibsForEvent(eventId: string): Promise<Bib[]> {
	if (eventId === '') {
		console.error('Event ID is required to fetch publicly listed bibs.')
		return []
	}
	try {
		const records = await pb.collection('bibs').getFullList<Bib>({
			sort: 'price',
			filter: `eventId = "${eventId}" && status = 'listed_public'`,
		})
		return records
	} catch (error: unknown) {
		throw new Error(
			`Error fetching publicly listed bibs for event ${eventId}: ` +
				(error instanceof Error ? error.message : String(error))
		)
	}
}

/**
 * Processes the sale of a bib.
 * This involves creating a transaction and marking the bib as sold.
 * @param bibId The ID of the bib being sold.
 * @param buyerUserId The PocketBase User ID of the buyer.
 */
export async function processBibSale(
	bibId: string,
	buyerUserId: string
): Promise<{ error?: string; success: boolean; transaction?: Transaction }> {
	if (bibId === '' || buyerUserId === '') {
		return { success: false, error: 'Bib ID and Buyer User ID are required.' }
	}

	try {
		const bib = await pb.collection('bibs').getOne<Bib>(bibId)
		if (bib == null) {
			return { success: false, error: `Bib with ID ${bibId} not found.` }
		}
		if (bib.status !== 'available') {
			//TODO: fix this to check for 'listed_public' or 'listed_private' if needed
			return {
				success: false,
				error: `Bib is not available for sale. Current status: ${bib.status}.`,
			}
		}
		if (bib.sellerUserId === buyerUserId) {
			return { success: false, error: 'Seller cannot buy their own bib.' }
		}

		// 2. Fetch the Seller User to get their information for transaction creation.
		const sellerUser = await fetchUserById(bib.sellerUserId)
		if (sellerUser == null) {
			return { success: false, error: `Seller user with PocketBase ID ${bib.sellerUserId} not found.` }
		}
		if (sellerUser.clerkId == null || sellerUser.clerkId === '') {
			return { success: false, error: `Clerk ID not found for seller user ${bib.sellerUserId}.` }
		}

		// 3. Calculate platform fee.
		const platformFeeAmount = bib.price * 0.1 // TODO: Replace with actual platform fee logic

		// 4. Create the transaction record.
		const transaction = await createTransaction({
			status: 'succeeded',
			sellerUserId: bib.sellerUserId,
			platformFee: platformFeeAmount,

			buyerUserId: buyerUserId,
			bibId: bib.id,
			amount: bib.price,
		})

		if (transaction == null) {
			return { success: false, error: 'Failed to create transaction record.' }
		}

		// 6. Update the Bib status to 'sold' and set buyerUserId.
		await pb.collection('bibs').update<Bib>(bibId, {
			status: 'sold',
			buyerUserId: buyerUserId,
		})

		// 7. Initiate Organizer Notification (Conceptual placeholder)
		// Example: if (updatedBibRecordFromPreviousLine != null) { ... }
		// Since updatedBib is not used, this conceptual part would need adjustment if re-enabled.

		return { transaction, success: true }
	} catch (error: unknown) {
		throw new Error(
			`Error processing bib sale for bib ID ${bibId}: ` + (error instanceof Error ? error.message : String(error))
		)
	}
}

/**
 * Updates a bib listing by its seller.
 * @param bibId The ID of the bib to update.
 * @param dataToUpdate Data to update for the bib.
 * @param sellerUserId The PocketBase ID of the seller performing the update.
 */
export async function updateBibBySeller(
	bibId: string,
	dataToUpdate: Bib, // Allow specific status updates or general data updates
	sellerUserId: string
): Promise<Bib | null> {
	if (bibId === '' || sellerUserId === '') {
		console.error('Bib ID and Seller ID are required for update.')
		return null
	}

	try {
		const currentBib = await pb.collection('bibs').getOne<Bib>(bibId)
		if (currentBib.sellerUserId !== sellerUserId) {
			console.warn(`Unauthorized attempt by seller ${sellerUserId} to update bib ${bibId}.`)
			return null
		}

		// Prevent changing eventId or sellerUserId directly with this function.
		// Certain status transitions might also be restricted (e.g., can't change sold bib).
		if (currentBib.status === 'sold' || currentBib.status === 'expired') {
			console.warn(`Attempt to update a bib that is already ${currentBib.status} (Bib ID: ${bibId})`)
			// Consider throwing an error or returning specific result if update is not allowed.
		}

		// If 'status' is part of dataToUpdate, ensure it's a valid transition
		if ('status' in dataToUpdate) {
			const newStatus = dataToUpdate.status
			const allowedStatusChanges: Record<Bib['status'], Bib['status'][]> = {
				withdrawn: ['available'],
				validation_failed: ['withdrawn'],
				sold: [], // Cannot be changed by seller
				expired: ['withdrawn'],
				available: ['sold', 'withdrawn', 'expired'],
			}

			const allowedChanges = allowedStatusChanges[currentBib.status]
			if (!allowedChanges?.includes(newStatus)) {
				console.warn(`Invalid status transition from ${currentBib.status} to ${newStatus} for bib ${bibId}.`)
				// Consider throwing an error for invalid transitions.
			}
		}

		const updatedRecord = await pb.collection('bibs').update<Bib>(bibId, dataToUpdate)
		return updatedRecord
	} catch (error: unknown) {
		throw new Error(`Error updating bib ${bibId}: ` + (error instanceof Error ? error.message : String(error)))
	}
}

/**
 * Updates a bib's status and optionally adds admin notes.
 * This function is intended for admin use and bypasses seller ownership checks.
 * @param bibId The ID of the bib to update.
 * @param newStatus The new status to set for the bib.
 * @param adminNotes Optional notes from the admin regarding the status change.
 */
export async function updateBibStatusByAdmin(bibId: string, newStatus: Bib['status']): Promise<Bib | null> {
	if (bibId === '' || !newStatus) {
		console.error('Bib ID and new status are required for admin update.')
		return null
	}

	try {
		const dataToUpdate: Partial<Bib> = {
			status: newStatus,
		}

		const updatedRecord = await pb.collection('bibs').update<Bib>(bibId, dataToUpdate)

		return updatedRecord
	} catch (error: unknown) {
		if (
			error != null &&
			typeof error === 'object' &&
			'message' in error &&
			typeof (error as { message: unknown }).message === 'string'
		) {
			const errorMessage = (error as { message: string }).message
			console.error('PocketBase error details:', errorMessage)
		}
		throw new Error(
			`Error updating bib ${bibId} status by admin: ` + (error instanceof Error ? error.message : String(error))
		)
	}
}
