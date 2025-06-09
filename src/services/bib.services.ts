'use server'

import type { Transaction } from '@/models/transaction.model'
import type { Event } from '@/models/event.model' // For expanding event details if possible
import type { Bib } from '@/models/bib.model'

import { pb } from '@/lib/pocketbaseClient' // Assuming this is the correct path to your PocketBase client

// Import Transaction services and User services for processBibSale
import { createTransaction } from './transaction.services'
import { updateUserBalance } from './user.services'

// Type for the data expected by createBib, accommodating both partnered and unlisted event scenarios
export type CreateBibData = Partial<
	Omit<Bib, 'buyerUserId' | 'eventId' | 'id' | 'privateListingToken' | 'sellerUserId' | 'status'>
> & {
	eventId?: string // Optional if isNotListedEvent is true
	// Fields for unlisted event
	isNotListedEvent?: boolean
	price: number
	registrationNumber: string
	unlistedEventDate?: string // Store as string, convert/validate as needed
	unlistedEventLocation?: string
	unlistedEventName?: string
}

// Allowed fields for update by seller. Status updates are specific.
export type UpdateBibData = Partial<Pick<Bib, 'gender' | 'originalPrice' | 'price' | 'size'>>

/**
 * Creates a new bib listing. Handles both partnered and unlisted events.
 * @param bibData Data for the new bib, including potential unlisted event details.
 * @param sellerUserId The ID of the user (seller) listing the bib.
 */
export async function createBib(bibData: Omit<Bib, 'id'>): Promise<Bib | null> {
	if (bibData.sellerUserId === '') {
		console.error('Seller ID is required to create a bib listing.')
		return null
	}
	if (bibData.registrationNumber === '' || bibData.price === undefined || bibData.price < 0) {
		console.error('Registration Number and a valid Price are required.')
		return null
	}

	let status: Bib['status'] = 'pending_validation'
	let finalEventId: string = bibData.eventId

	try {
		const dataToCreate: Omit<Bib, 'id'> = {
			registrationNumber: bibData.registrationNumber,
			originalPrice: bibData.originalPrice,
			sellerUserId: bibData.sellerUserId,
			privateListingToken: undefined,
			gender: bibData.gender,
			buyerUserId: undefined,
			eventId: finalEventId, // This will be undefined for unlisted events
			price: bibData.price,
			size: bibData.size,
			status: status,
		}

		const record = await pb.collection('bibs').create<Bib>(dataToCreate)
		return record
	} catch (error: unknown) {
		console.error('Error creating bib listing:', error)

		return null
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
		// Using getOne, which throws an error if not found.
		const record = await pb.collection('bibs').getOne<Bib & { expand?: { eventId: Event } }>(bibId, {
			expand: 'eventId', // Expand event details
		})

		return record
	} catch (error: unknown) {
		console.error(`Error fetching bib with ID "${bibId}":`, error)

		// For other errors, you might want to throw or return null based on your error handling strategy
		return null
	}
}

/**
 * Fetches a single bib by its ID for a specific seller, ensuring ownership.
 * @param bibId The ID of the bib to fetch.
 * @param sellerUserId The ID of the seller claiming ownership.
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
			return null // Not the owner
		}
		return record
	} catch (error: unknown) {
		console.error(`Error fetching bib ${bibId} for seller ${sellerUserId}:`, error)

		// For other errors, you might want to throw or return null based on your error handling strategy
		return null
	}
}

/**
 * Fetches all bibs purchased by a specific buyer.
 * @param buyerUserId The ID of the buyer whose purchased bibs are to be fetched.
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
			sort: '-updated', // Sort by last update (effectively purchase date for sold bibs), newest first
		})
		return records
	} catch (error: unknown) {
		console.error(`Error fetching bibs for buyer ID "${buyerUserId}":`, error)

		// For other errors, return empty array for safety
		return []
	}
}

/**
 * Fetches all bibs listed by a specific seller.
 * Optionally expands event details if your PocketBase setup allows and it's needed.
 * @param sellerUserId The ID of the seller whose bibs are to be fetched.
 */
export async function fetchBibsBySeller(sellerUserId: string): Promise<Bib[]> {
	if (sellerUserId === '') {
		console.error('Seller ID is required to fetch their bibs.')
		return []
	}

	try {
		// Example with expanding the 'eventId' to get event details (e.g., event name)
		// Adjust 'event' to whatever field name you use in PocketBase for the relation,
		// and ensure the 'events' collection is configured to be expandable.
		const records = await pb.collection('bibs').getFullList<Bib & { expand?: { eventId: Event } }>({
			filter: `sellerUserId = "${sellerUserId}"`,
			sort: '-created', // Sort by creation date, newest first
		})

		// Map records to include expanded event name, or handle as needed
		// The actual structure of 'expand' depends on your PocketBase relation setup.
		// This is a common pattern but might need adjustment.
		return records
	} catch (error: unknown) {
		console.error(`Error fetching bibs for seller ID "${sellerUserId}":`, error)

		// For other errors, return empty array for safety
		return []
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
			sort: 'price', // Sort by price, lowest first
			// Optionally expand seller details if needed, e.g., expand: 'sellerUserId'
			// This would require sellerUserId to be a relation field in PocketBase to a 'users' collection
		})
		return records
	} catch (error: unknown) {
		console.error(`Error fetching publicly listed bibs for event ${eventId}:`, error)

		// For other errors, return empty array for safety
		return []
	}
}

/**
 * Processes the sale of a bib.
 * This involves creating a transaction, updating seller's balance, and marking the bib as sold.
 * @param bibId The ID of the bib being sold.
 * @param buyerUserId The Clerk User ID of the buyer.
 */
export async function processBibSale(
	bibId: string,
	buyerUserId: string
): Promise<{ error?: string; success: boolean; transaction?: Transaction }> {
	if (bibId === '' || buyerUserId === '') {
		return { error: 'Bib ID and Buyer User ID are required.', success: false }
	}

	try {
		// 1. Fetch the Bib. Ensure it's available for sale.
		const bib = await pb.collection('bibs').getOne<Bib>(bibId)
		if (bib == null) {
			return { error: `Bib with ID ${bibId} not found.`, success: false }
		}
		if (bib.status !== 'listed_public') {
			// Could also allow 'listed_private' if a private sale mechanism is implemented
			return {
				error: `Bib is not available for sale. Current status: ${bib.status}.`,
				success: false,
			}
		}
		if (bib.sellerUserId === buyerUserId) {
			return { error: 'Seller cannot buy their own bib.', success: false }
		}

		// 2. Fetch the Seller (User) - though not strictly needed if just updating balance by ID.
		// const sellerUser = await fetchUserByClerkId(bib.dashboard.sellerUserId);
		// if (!sellerUser) {
		//   return { success: false, error: `Seller with ID ${bib.dashboard.sellerUserId} not found.` };
		// }

		// 3. Calculate platform fee and seller amount.
		const platformFeeAmount = bib.price * 0.1 // TODO: Replace with actual platform fee logic
		const amountToSeller = bib.price - platformFeeAmount

		// 4. Create the transaction record.
		const transaction = await createTransaction({
			sellerUserId: bib.sellerUserId,
			platformFee: platformFeeAmount,
			buyerUserId: buyerUserId,
			status: 'succeeded', // Assuming payment is processed successfully by this point
			amount: bib.price, // Total amount paid by buyer
			bibId: bib.id,
			// paymentIntentId would be set here if using a real payment gateway
		})

		if (transaction == null) {
			return { error: 'Failed to create transaction record.', success: false }
		}

		// 5. Update seller's balance.
		const sellerBalanceUpdated = await updateUserBalance(bib.sellerUserId, amountToSeller)
		if (sellerBalanceUpdated == null) {
			// Attempt to mark transaction as failed or requiring attention if seller balance update fails.
			// This is a critical error that needs monitoring/manual intervention.
			await pb.collection('transactions').update(transaction.id, {
				notes: 'Seller balance update failed after fund capture.',
				status: 'failed',
			})
			console.error(`CRITICAL: Failed to update seller ${bib.sellerUserId} balance for transaction ${transaction.id}.`)
			return {
				error: "Failed to update seller's balance. Transaction recorded but needs attention.",
				success: false,
			}
		}

		// 6. Update the Bib status to 'sold' and set buyerUserId.
		// Using a direct update here as this is a system action, not directly initiated by the seller for these specific fields.
		const updatedBib = await pb.collection('bibs').update<Bib>(bibId, {
			buyerUserId: buyerUserId,
			status: 'sold',
		})

		// 7. Initiate Organizer Notification (Conceptual)
		if (updatedBib != null) {
			// Ensure bib was successfully marked as sold
			// await initiateOrganizerNotification(
			//   updatedBib.id,
			//   updatedBib.buyerUserId!,
			//   updatedBib.eventId,
			// );
		}

		return { success: true, transaction }
	} catch (error: unknown) {
		console.error(`Error processing bib sale for bib ID ${bibId}:`, error)
		let errorMessage = 'An unexpected error occurred during bib sale processing.'
		if (error instanceof Error) {
			errorMessage = error.message
		} else if (typeof error === 'object' && error != null && 'message' in error && typeof error.message === 'string') {
			errorMessage = error.message
		}
		return { error: errorMessage, success: false }
	}
}

/**
 * Updates a bib listing by its seller.
 * @param bibId The ID of the bib to update.
 * @param dataToUpdate Data to update for the bib.
 * @param sellerUserId The ID of the seller performing the update.
 */
export async function updateBibBySeller(
	bibId: string,
	dataToUpdate: { status: Bib['status'] }, // Allow specific status updates or general data updates
	sellerUserId: string
): Promise<Bib | null> {
	if (bibId === '' || sellerUserId === '') {
		console.error('Bib ID and Seller ID are required for update.')
		return null
	}

	try {
		// First, verify ownership by fetching the bib
		const currentBib = await pb.collection('bibs').getOne<Bib>(bibId)
		if (currentBib.sellerUserId !== sellerUserId) {
			console.warn(`Unauthorized attempt by seller ${sellerUserId} to update bib ${bibId}.`)
			return null
		}

		// Prevent changing eventId or sellerUserId directly with this function
		// Certain status transitions might also be restricted here or by app logic (e.g., can't change sold bib)
		if (currentBib.status === 'sold' || currentBib.status === 'expired') {
			console.warn(`Attempt to update a bib that is already ${currentBib.status} (Bib ID: ${bibId})`)
			// return null; // Or throw an error
		}

		// If 'status' is part of dataToUpdate, ensure it's a valid transition
		if ('status' in dataToUpdate) {
			const newStatus = dataToUpdate.status
			// Example: Allow withdrawing, or changing between listed_public and listed_private
			const allowedStatusChanges: Record<Bib['status'], Bib['status'][]> = {
				pending_validation: ['listed_public', 'listed_private', 'withdrawn'], // Assuming admin moves to pending_validation_passed first
				listed_public: ['listed_private', 'withdrawn'],
				listed_private: ['listed_public', 'withdrawn'],
				withdrawn: ['listed_public', 'listed_private'], // Allow re-listing
				validation_failed: ['withdrawn'],
				expired: ['withdrawn'],
				sold: [], // Cannot be changed by seller
			}

			const allowedChanges = allowedStatusChanges[currentBib.status]
			if (!allowedChanges?.includes(newStatus)) {
				console.warn(`Invalid status transition from ${currentBib.status} to ${newStatus} for bib ${bibId}.`)
				// return null; // Or throw an error indicating invalid transition
			}
			// For now, we'll allow the update if it's a status change. More complex logic can be added.
		}

		const updatedRecord = await pb.collection('bibs').update<Bib>(bibId, dataToUpdate)
		return updatedRecord
	} catch (error: unknown) {
		console.error(`Error updating bib ${bibId}:`, error)

		return null
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

		// Direct update without seller ownership check.
		const updatedRecord = await pb.collection('bibs').update<Bib>(bibId, dataToUpdate)

		return updatedRecord
	} catch (error: unknown) {
		console.error(`Error updating bib ${bibId} status by admin:`, error)
		if (error != null && typeof error === 'object' && 'message' in error) {
			console.error('PocketBase error details:', (error as { message: string }).message)
		}
		return null
	}
}

// /**
//  * Conceptual placeholder for notifying the event organizer about a bib transfer.
//  * In a real scenario, this would trigger an email, webhook, or API call.
//  * @param bibId The ID of the bib that was transferred.
//  * @param newRunnerUserId The User ID of the new runner (buyer).
//  * @param eventId The ID of the event.
//  */
// async function initiateOrganizerNotification(
//   bibId: string,
//   newRunnerUserId: string,
//   eventId?: string,
// ) {
//   // TODO: In a real application:
//   // 1. Fetch event details, especially organizer contact info or API endpoint.
//   //    const event = await pb.collection('events').getOne(eventId);
//   //    const organizer = await pb.collection('users').getOne(event.organizerId);
//   // 2. Construct notification payload (bib details, new runner details).
//   // 3. Send notification (e.g., via email service, webhook).

//   // This is a good place to integrate with external notification services or internal task queues.
//   return Promise.resolve(); // Indicate async completion
// }
