'use server'

import type { Bib } from '@/models/bib.model'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { fetchBibByIdForSeller, updateBibBySeller } from '@/services/bib.services'
import { fetchUserByClerkId } from '@/services/user.services'

// Server action to toggle listing status
export async function handleToggleListingStatus(
	bibId: string,
	newStatus: 'listed_private' | 'listed_public',
	formData: FormData
) {
	const { userId: clerkId } = await auth()

	if (clerkId == null || clerkId === '') {
		redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('Authentication required.')}`)
		return
	}

	// Fetch the current bib to validate status transitions
	const sellerUser = await fetchUserByClerkId(clerkId)
	if (!sellerUser) {
		redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('User not found.')}`)
		return
	}

	const bibWithEvent = await fetchBibByIdForSeller(bibId, sellerUser.id)
	if (!bibWithEvent) {
		redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('Bib not found.')}`)
		return
	}

	// Validation for status transitions
	if (bibWithEvent.status === 'validation_failed' && newStatus === 'listed_public') {
		redirect(
			`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('Cannot make public until event details are verified by admin.')}`
		)
		return
	}

	if (bibWithEvent.status === 'sold' || bibWithEvent.status === 'expired') {
		redirect(
			`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent(`Cannot change listing status from ${bibWithEvent.status}.`)}`
		)
		return
	}

	try {
		const newBibData: Bib = {
			...bibWithEvent,
			privateListingToken: newStatus === 'listed_private' ? (formData.get('privateListingToken') as string) : undefined,
			status: newStatus,
		}
		// Ensure the privateListingToken is set only for private listings
		if (newStatus === 'listed_private' && newBibData.privateListingToken == null) {
			redirect(
				`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('Private listing token is required for private listings.')}`
			)
			return
		}
		// Update the bib with the new status
		const updatedBib = await updateBibBySeller(bibId, newBibData, sellerUser.id)

		if (updatedBib) {
			redirect(
				`/dashboard/seller/edit-bib/${bibId}?success=${encodeURIComponent(`Bib status changed to ${newStatus.replace('_', ' ')}.`)}`
			)
		} else {
			redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('Failed to change bib status.')}`)
		}
	} catch {
		redirect(
			`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('An error occurred while changing the bib status.')}`
		)
	}
}

// Server action to update bib details
export async function handleUpdateBibDetails(bibId: string, formData: FormData) {
	const { userId: clerkId } = await auth()

	if (clerkId == null || clerkId === '') {
		redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('Authentication required.')}`)
		return
	}

	// Fetch the current bib and user
	const sellerUser = await fetchUserByClerkId(clerkId)
	if (!sellerUser) {
		redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('User not found.')}`)
		return
	}

	const priceValue = formData.get('price') as string
	const originalPriceValue = formData.get('originalPrice') as string
	const size = formData.get('size') as string
	const gender = formData.get('gender') as string

	const price = parseFloat(priceValue)

	if (isNaN(price) || price <= 0) {
		redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('Valid price is required.')}`)
		return
	}

	const dataToUpdate: Bib = {
		registrationNumber: formData.get('registrationNumber') as string,
		status: formData.get('status') as Bib['status'],
		eventId: formData.get('eventId') as string,
		sellerUserId: sellerUser.id,
		price: price,
		id: bibId,
	}

	// Add optional fields if they exist
	if (originalPriceValue && originalPriceValue.trim() !== '') {
		const originalPrice = parseFloat(originalPriceValue)
		if (!isNaN(originalPrice) && originalPrice > 0) {
			dataToUpdate.originalPrice = originalPrice
		}
	}

	if (size && size.trim() !== '') {
		dataToUpdate.size = size.trim()
	}

	if (gender && gender.trim() !== '') {
		dataToUpdate.gender = gender as Bib['gender']
	}

	try {
		const updatedBib = await updateBibBySeller(bibId, dataToUpdate, clerkId)

		if (updatedBib) {
			redirect(`/dashboard/seller/edit-bib/${bibId}?success=${encodeURIComponent('Bib details updated successfully!')}`)
		} else {
			redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('Failed to update bib details.')}`)
		}
	} catch {
		redirect(
			`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('An error occurred while updating the bib.')}`
		)
	}
}

// Server action to withdraw bib
export async function handleWithdrawBib(bibId: string, formData: FormData) {
	const { userId: clerkId } = await auth()

	if (clerkId == null || clerkId === '') {
		redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('Authentication required.')}`)
		return
	}
	// Fetch the current bib and user
	const sellerUser = await fetchUserByClerkId(clerkId)
	if (!sellerUser) {
		redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('User not found.')}`)
		return
	}

	try {
		const newBib: Bib = {
			originalPrice: parseFloat(formData.get('originalPrice') as string) || undefined,

			registrationNumber: formData.get('registrationNumber') as string,
			price: parseFloat(formData.get('price') as string),
			gender: formData.get('gender') as Bib['gender'],
			eventId: formData.get('eventId') as string,
			size: formData.get('size') as string,

			sellerUserId: sellerUser.id,
			buyerUserId: undefined, // Clear buyer if withdrawing
			status: 'withdrawn',
			id: bibId,
		}

		const updatedBib = await updateBibBySeller(bibId, newBib, clerkId)

		if (updatedBib) {
			redirect(`/dashboard/seller?success=${encodeURIComponent('Bib listing withdrawn.')}&bibStatus=withdrawn`)
		} else {
			redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('Failed to withdraw bib.')}`)
		}
	} catch {
		redirect(
			`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('An error occurred while withdrawing the bib.')}`
		)
	}
}
