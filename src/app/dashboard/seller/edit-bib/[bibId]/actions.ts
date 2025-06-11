'use server'

import type { Bib } from '@/models/bib.model'

import { auth } from '@clerk/nextjs/server'
// import { redirect } from 'next/navigation' // No longer using redirect directly

import { fetchBibByIdForSeller, updateBibBySeller } from '@/services/bib.services'
import { fetchUserByClerkId } from '@/services/user.services'

// Server action to toggle listing status
export async function handleToggleListingStatus(
	bibId: string,
	newStatus: 'listed_private' | 'listed_public',
	formData: FormData
): Promise<{ error?: string; message?: string; success: boolean; updatedBib?: Bib }> {
	const { userId: clerkId } = await auth()

	if (clerkId == null || clerkId === '') {
		return { error: 'Authentication required.', success: false }
	}

	const sellerUser = await fetchUserByClerkId(clerkId)
	if (!sellerUser) {
		return { error: 'User not found.', success: false }
	}

	const bibWithEvent = await fetchBibByIdForSeller(bibId, sellerUser.id)
	if (!bibWithEvent) {
		return { error: 'Bib not found.', success: false }
	}

	if (bibWithEvent.status === 'validation_failed' && newStatus === 'listed_public') {
		return { error: 'Cannot make public until event details are verified by admin.', success: false }
	}

	if (bibWithEvent.status === 'sold' || bibWithEvent.status === 'expired') {
		return { error: `Cannot change listing status from ${bibWithEvent.status}.`, success: false }
	}

	try {
		const newBibData: Bib = {
			...bibWithEvent,
			privateListingToken: newStatus === 'listed_private' ? (formData.get('privateListingToken') as string) : undefined,
			status: newStatus,
		}
		if (
			newStatus === 'listed_private' &&
			(newBibData.privateListingToken == null || newBibData.privateListingToken.trim() === '')
		) {
			return { error: 'Private listing token is required for private listings.', success: false }
		}
		const partialUpdatedBib = await updateBibBySeller(bibId, newBibData, sellerUser.id)

		if (partialUpdatedBib) {
			// Fetch the full bib to ensure all fields, including eventId, are present and correctly typed
			const fullUpdatedBib = await fetchBibByIdForSeller(bibId, sellerUser.id)
			if (fullUpdatedBib) {
				return {
					message: `Bib status changed to ${newStatus.replace('_', ' ')}.`,
					updatedBib: fullUpdatedBib,
					success: true,
				}
			} else {
				// This case means the update might have succeeded but fetching the full bib failed
				return { error: 'Failed to retrieve full bib details after status change.', success: false }
			}
		} else {
			return { error: 'Failed to change bib status.', success: false }
		}
	} catch (e: unknown) {
		const error = e instanceof Error ? e.message : String(e)
		return { error: `An error occurred while changing the bib status: ${error}`, success: false }
	}
}

export async function handleUpdateBibDetails(
	bibId: string,
	formData: FormData
): Promise<{ error?: string; message?: string; success: boolean; updatedBib?: Bib }> {
	const { userId: clerkId } = await auth()

	if (clerkId == null || clerkId === '') {
		return { error: 'Authentication required.', success: false }
	}

	const sellerUser = await fetchUserByClerkId(clerkId)
	if (!sellerUser) {
		return { error: 'User not found.', success: false }
	}

	// It's good practice to fetch the existing bib to ensure it exists and belongs to the user
	// and to merge with existing data if only partial updates are allowed.
	// However, the current updateBibBySeller might handle full updates or overwrite.
	// For simplicity, we'll proceed with constructing dataToUpdate from formData.

	const priceValue = formData.get('price') as string
	const originalPriceValue = formData.get('originalPrice') as string
	const size = formData.get('size') as null | string
	const gender = formData.get('gender') as null | string
	const registrationNumber = formData.get('registrationNumber') as null | string

	if (!registrationNumber || registrationNumber.trim() === '') {
		return { error: 'Registration number is required.', success: false }
	}

	const price = parseFloat(priceValue)
	if (isNaN(price) || price <= 0) {
		return { error: 'Valid price is required.', success: false }
	}

	// Assuming 'status' and 'eventId' are not changed by this action directly or are pre-filled in the form.
	// If they are part of the form, they should be read from formData like other fields.
	// For this example, we'll assume they are not part of this specific update form or are handled elsewhere.
	// Fetching the original bib would be safer to get current status and eventId.
	let currentBib;
	try {
		currentBib = await fetchBibByIdForSeller(bibId, sellerUser.id);
	} catch (error) {
		return { error: 'Failed to fetch the original bib. Please try again later.', success: false };
	}
	if (!currentBib) {
		return { error: 'Original bib not found.', success: false };
	}

	const dataToUpdate: Bib = {
		...currentBib, // Start with existing data
		registrationNumber: registrationNumber,
		price: price,
		// id: bibId, // already in currentBib
		// sellerUserId: sellerUser.id, // already in currentBib
	}

	if (originalPriceValue && originalPriceValue.trim() !== '') {
		const originalPrice = parseFloat(originalPriceValue)
		if (!isNaN(originalPrice) && originalPrice >= 0) {
			// Allow 0 for original price
			dataToUpdate.originalPrice = originalPrice
		} else {
			return { error: 'Invalid original price format.', success: false }
		}
	} else {
		dataToUpdate.originalPrice = undefined // Or 0, depending on your model
	}

	dataToUpdate.size = size && size.trim() !== '' ? size.trim() : undefined
	dataToUpdate.gender = gender && gender.trim() !== '' ? (gender as Bib['gender']) : undefined

	try {
		const partialUpdatedBib = await updateBibBySeller(bibId, dataToUpdate, sellerUser.id)

		if (partialUpdatedBib) {
			// Fetch the full bib to ensure all fields are present and correctly typed
			const fullUpdatedBib = await fetchBibByIdForSeller(bibId, sellerUser.id)
			if (fullUpdatedBib) {
				return { message: 'Bib details updated successfully!', updatedBib: fullUpdatedBib, success: true }
			} else {
				return { error: 'Failed to retrieve full bib details after update.', success: false }
			}
		} else {
			return { error: 'Failed to update bib details.', success: false }
		}
	} catch (e: unknown) {
		const error = e instanceof Error ? e.message : String(e)
		return { error: `An error occurred while updating the bib: ${error}`, success: false }
	}
}

export async function handleWithdrawBib(
	bibId: string
	// formData: FormData // formData might not be needed if we just set status to withdrawn
): Promise<{ error?: string; redirectPath?: string; success: boolean }> {
	const { userId: clerkId } = await auth()

	if (clerkId == null || clerkId === '') {
		return { error: 'Authentication required.', success: false }
	}
	const sellerUser = await fetchUserByClerkId(clerkId)
	if (!sellerUser) {
		return { error: 'User not found.', success: false }
	}

	const currentBib = await fetchBibByIdForSeller(bibId, sellerUser.id)
	if (!currentBib) {
		return { error: 'Bib not found or not owned by user.', success: false }
	}

	// Check if bib can be withdrawn
	if (currentBib.status === 'sold' || currentBib.status === 'expired' || currentBib.status === 'withdrawn') {
		return { error: `Cannot withdraw bib with status: ${currentBib.status}.`, success: false }
	}

	try {
		const bibDataToUpdate: Partial<Bib> = {
			buyerUserId: undefined, // Clear buyer if any (though unlikely for non-sold bibs)
			status: 'withdrawn',
		}

		const updatedBib = await updateBibBySeller(bibId, { ...currentBib, ...bibDataToUpdate }, sellerUser.id)

		if (updatedBib) {
			return { redirectPath: '/dashboard/seller?success=Bib+listing+withdrawn', success: true }
		} else {
			return { error: 'Failed to withdraw bib.', success: false }
		}
	} catch (e: unknown) {
		const error = e instanceof Error ? e.message : String(e)
		return { error: `An error occurred while withdrawing the bib: ${error}`, success: false }
	}
}
