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
		throw new Error('Authentication required.')
	}

	const sellerUser = await fetchUserByClerkId(clerkId)
	if (!sellerUser) {
		throw new Error('User not found.')
	}

	const bibWithEvent = await fetchBibByIdForSeller(bibId, sellerUser.id)
	if (!bibWithEvent) {
		throw new Error('Bib not found.')
	}

	if (bibWithEvent.status === 'validation_failed' && newStatus === 'listed_public') {
		throw new Error('Cannot make public until event details are verified by admin.')
	}

	if (bibWithEvent.status === 'sold' || bibWithEvent.status === 'expired') {
		throw new Error(`Cannot change listing status from ${bibWithEvent.status}.`)
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
			throw new Error('Private listing token is required for private listings.')
		}
		const partialUpdatedBib = await updateBibBySeller(bibId, newBibData, sellerUser.id)

		if (!partialUpdatedBib) {
			throw new Error('Failed to change bib status.')
		}
		// Fetch the full bib to ensure all fields, including eventId, are present and correctly typed
		const fullUpdatedBib = await fetchBibByIdForSeller(bibId, sellerUser.id)
		if (!fullUpdatedBib) {
			// This case means the update might have succeeded but fetching the full bib failed
			throw new Error('Failed to retrieve full bib details after status change.')
		}
		return {
			message: `Bib status changed to ${newStatus.replace('_', ' ')}.`,
			updatedBib: fullUpdatedBib,
			success: true,
		}
	} catch (e: unknown) {
		const error = e instanceof Error ? e.message : String(e)
		throw new Error(`An error occurred while changing the bib status: ${error}`)
	}
}

export async function handleUpdateBibDetails(
	bibId: string,
	formData: FormData
): Promise<{ error?: string; message?: string; success: boolean; updatedBib?: Bib }> {
	const { userId: clerkId } = await auth()

	if (clerkId == null || clerkId === '') {
		throw new Error('Authentication required.')
	}

	const sellerUser = await fetchUserByClerkId(clerkId)
	if (!sellerUser) {
		throw new Error('User not found.')
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
		throw new Error('Registration number is required.')
	}

	const price = parseFloat(priceValue)
	if (isNaN(price) || price <= 0) {
		throw new Error('Valid price is required.')
	}

	// Assuming 'status' and 'eventId' are not changed by this action directly or are pre-filled in the form.
	// If they are part of the form, they should be read from formData like other fields.
	// For this example, we'll assume they are not part of this specific update form or are handled elsewhere.
	// Fetching the original bib would be safer to get current status and eventId.
	const currentBib = await fetchBibByIdForSeller(bibId, sellerUser.id)
	if (!currentBib) {
		throw new Error('Original bib not found.')
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
			throw new Error('Invalid original price format.')
		}
	} else {
		dataToUpdate.originalPrice = undefined // Or 0, depending on your model
	}

	dataToUpdate.size = size && size.trim() !== '' ? size.trim() : undefined
	dataToUpdate.gender = gender && gender.trim() !== '' ? (gender as Bib['gender']) : undefined

	try {
		const partialUpdatedBib = await updateBibBySeller(bibId, dataToUpdate, sellerUser.id)

		if (!partialUpdatedBib) {
			throw new Error('Failed to update bib details.')
		}
		// Fetch the full bib to ensure all fields are present and correctly typed
		const fullUpdatedBib = await fetchBibByIdForSeller(bibId, sellerUser.id)
		if (!fullUpdatedBib) {
			throw new Error('Failed to retrieve full bib details after update.')
		}
		return { message: 'Bib details updated successfully!', updatedBib: fullUpdatedBib, success: true }
	} catch (e: unknown) {
		const error = e instanceof Error ? e.message : String(e)
		throw new Error(`An error occurred while updating the bib: ${error}`)
	}
}

export async function handleWithdrawBib(
	bibId: string
	// formData: FormData // formData might not be needed if we just set status to withdrawn
): Promise<{ error?: string; redirectPath?: string; success: boolean }> {
	const { userId: clerkId } = await auth()

	if (clerkId == null || clerkId === '') {
		throw new Error('Authentication required.')
	}
	const sellerUser = await fetchUserByClerkId(clerkId)
	if (!sellerUser) {
		throw new Error('User not found.')
	}

	const currentBib = await fetchBibByIdForSeller(bibId, sellerUser.id)
	if (!currentBib) {
		throw new Error('Bib not found or not owned by user.')
	}

	// Check if bib can be withdrawn
	if (currentBib.status === 'sold' || currentBib.status === 'expired' || currentBib.status === 'withdrawn') {
		throw new Error(`Cannot withdraw bib with status: ${currentBib.status}.`)
	}

	try {
		const bibDataToUpdate: Partial<Bib> = {
			buyerUserId: undefined, // Clear buyer if any (though unlikely for non-sold bibs)
			status: 'withdrawn',
		}

		const updatedBib = await updateBibBySeller(bibId, { ...currentBib, ...bibDataToUpdate }, sellerUser.id)

		if (!updatedBib) {
			throw new Error('Failed to withdraw bib.')
		}
		return { redirectPath: '/dashboard/seller?success=Bib+listing+withdrawn', success: true }
	} catch (e: unknown) {
		const error = e instanceof Error ? e.message : String(e)
		throw new Error(`An error occurred while withdrawing the bib: ${error}`)
	}
}
