'use server'

import type { Bib } from '@/models/bib.model'

import { auth } from '@clerk/nextjs/server'

import { fetchBibByIdForSeller, updateBibBySeller } from '@/services/bib.services'
import { fetchUserByClerkId } from '@/services/user.services'

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
		const fullUpdatedBib = await fetchBibByIdForSeller(bibId, sellerUser.id)
		if (!fullUpdatedBib) {
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

	const currentBib = await fetchBibByIdForSeller(bibId, sellerUser.id)
	if (!currentBib) {
		throw new Error('Original bib not found.')
	}

	const dataToUpdate: Bib = {
		...currentBib,
		registrationNumber: registrationNumber,
		price: price,
	}

	if (originalPriceValue && originalPriceValue.trim() !== '') {
		const originalPrice = parseFloat(originalPriceValue)
		if (!isNaN(originalPrice) && originalPrice >= 0) {
			dataToUpdate.originalPrice = originalPrice
		} else {
			throw new Error('Invalid original price format.')
		}
	} else {
		dataToUpdate.originalPrice = undefined
	}

	dataToUpdate.size = size && size.trim() !== '' ? size.trim() : undefined
	dataToUpdate.gender = gender && gender.trim() !== '' ? (gender as Bib['gender']) : undefined

	try {
		const partialUpdatedBib = await updateBibBySeller(bibId, dataToUpdate, sellerUser.id)

		if (!partialUpdatedBib) {
			throw new Error('Failed to update bib details.')
		}
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

	if (currentBib.status === 'sold' || currentBib.status === 'expired' || currentBib.status === 'withdrawn') {
		throw new Error(`Cannot withdraw bib with status: ${currentBib.status}.`)
	}

	try {
		const bibDataToUpdate: Partial<Bib> = {
			buyerUserId: undefined,
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
