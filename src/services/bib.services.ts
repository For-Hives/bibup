'use server'

import type { Transaction } from '@/models/transaction.model'
import type { Event } from '@/models/event.model'
import type { Bib } from '@/models/bib.model'

import { pb } from '@/lib/pocketbaseClient'

import { fetchUserById, updateUserBalance } from './user.services'
import { createTransaction } from './transaction.services'

const PLATFORM_FEE_PERCENTAGE = 0.1

export type CreateBibData = Partial<
	Omit<Bib, 'buyerUserId' | 'eventId' | 'id' | 'privateListingToken' | 'sellerUserId' | 'status'>
> & {
	eventId?: string
	isNotListedEvent?: boolean
	price: number
	registrationNumber: string
	unlistedEventDate?: string
	unlistedEventLocation?: string
	unlistedEventName?: string
}

export type UpdateBibData = Partial<Pick<Bib, 'gender' | 'originalPrice' | 'price' | 'size'>>

/**
 * Creates a new bib listing. Handles both partnered and unlisted events.
 * @param bibData Data for the new bib, including potential unlisted event details.
 * @param sellerUserId The ID of the user (seller) listing the bib.
 */
export async function createBib(bibData: CreateBibData, sellerUserId: string): Promise<Bib | null> {
	if (sellerUserId === '') {
		console.error('Seller ID is required to create a bib listing.')
		return null
	}
	if (bibData.registrationNumber === '' || bibData.price === undefined || bibData.price < 0) {
		console.error('Registration Number and a valid Price are required.')
		return null
	}

	let status: Bib['status'] = 'pending_validation'
	// Ensure finalEventId is a valid string. If it's an unlisted event or eventId is not provided,
	// set it to an empty string, otherwise use the provided eventId.
	let finalEventId: string = ''
	if (bibData.isNotListedEvent === true || bibData.eventId === undefined) {
		finalEventId = ''
	} else {
		finalEventId = bibData.eventId
	}

	try {
		const dataToCreate: Omit<Bib, 'id'> = {
			registrationNumber: bibData.registrationNumber,
			originalPrice: bibData.originalPrice,
			privateListingToken: undefined,
			sellerUserId: sellerUserId, // Use the function parameter
			gender: bibData.gender,
			buyerUserId: undefined,
			eventId: finalEventId,
			price: bibData.price,
			size: bibData.size,
			status: status,
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
			filter: `buyerUserId = "${buyerUserId}" && status = 'sold'`,
			expand: 'eventId',
			sort: '-updated',
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
			filter: `sellerUserId = "${sellerUserId}"`,
			sort: '-created',
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
			filter: `eventId = "${eventId}" && status = 'listed_public'`,
			sort: 'price',
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
 * This involves creating a transaction, updating seller's balance, and marking the bib as sold.
 * @param bibId The ID of the bib being sold.
 * @param buyerUserId The PocketBase User ID of the buyer.
 */
export async function processBibSale(
	bibId: string,
	buyerUserId: string
): Promise<{ error?: string; success: boolean; transaction?: Transaction }> {
	if (bibId === '' || buyerUserId === '') {
		return { error: 'Bib ID and Buyer User ID are required.', success: false }
	}

	try {
		const bib = await pb.collection('bibs').getOne<Bib>(bibId)
		if (bib == null) {
			return { error: `Bib with ID ${bibId} not found.`, success: false }
		}
		if (bib.status !== 'listed_public') {
			return {
				error: `Bib is not available for sale. Current status: ${bib.status}.`,
				success: false,
			}
		}
		if (bib.sellerUserId === buyerUserId) {
			return { error: 'Seller cannot buy their own bib.', success: false }
		}

		// 2. Fetch the Seller User to get their Clerk ID for balance update.
		const sellerUser = await fetchUserById(bib.sellerUserId)
		if (sellerUser == null) {
			return { error: `Seller user with PocketBase ID ${bib.sellerUserId} not found.`, success: false }
		}
		if (sellerUser.clerkId == null || sellerUser.clerkId === '') {
			return { error: `Clerk ID not found for seller user ${bib.sellerUserId}.`, success: false }
		}

		// 3. Calculate platform fee and seller amount.
		const platformFeeAmount = bib.price * PLATFORM_FEE_PERCENTAGE // TODO: Replace with actual platform fee logic
		const amountToSeller = bib.price - platformFeeAmount

		// 4. Create the transaction record.
		const transaction = await createTransaction({
			sellerUserId: bib.sellerUserId,
			platformFee: platformFeeAmount,
			buyerUserId: buyerUserId,
			status: 'succeeded',
			amount: bib.price,
			bibId: bib.id,
		})

		if (transaction == null) {
			return { error: 'Failed to create transaction record.', success: false }
		}

		// 5. Update seller's balance.
		const sellerBalanceUpdated = await updateUserBalance(sellerUser.clerkId, amountToSeller)
		if (sellerBalanceUpdated == null) {
			// This is a critical error that needs monitoring/manual intervention.
			await pb.collection('transactions').update(transaction.id, {
				notes: 'Seller balance update failed after fund capture.',
				status: 'failed',
			})
			console.error(
				`CRITICAL: Failed to update seller ${sellerUser.clerkId} balance for transaction ${transaction.id}.`
			)
			return {
				error: "Failed to update seller's balance. Transaction recorded but needs attention.",
				success: false,
			}
		}

		// 6. Update the Bib status to 'sold' and set buyerUserId.
		await pb.collection('bibs').update<Bib>(bibId, {
			buyerUserId: buyerUserId,
			status: 'sold',
		})

		// 7. Initiate Organizer Notification (Conceptual placeholder)
		// Example: if (updatedBibRecordFromPreviousLine != null) { ... }
		// Since updatedBib is not used, this conceptual part would need adjustment if re-enabled.

		return { success: true, transaction }
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
	dataToUpdate: UpdateBibData, // Allow specific status updates or general data updates
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

		// The 'status' field is not part of UpdateBibData, so sellers cannot change it via this function.
		// Status changes are handled by admin functions or specific lifecycle events.

		const updatedRecord = await pb.collection('bibs').update<Bib>(bibId, dataToUpdate as Partial<Bib>)
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
		if (error != null && typeof error === 'object' && 'message' in error) {
			console.error('PocketBase error details:', (error as { message: string }).message)
		}
		const messageSuffix: string = error instanceof Error ? error.message : String(error)
		const fullErrorMessage = `Error updating bib ${bibId} status by admin: ${messageSuffix}`
		throw new Error(fullErrorMessage)
	}
}
