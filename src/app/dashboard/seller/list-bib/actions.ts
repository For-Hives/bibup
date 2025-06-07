'use server'

import { redirect } from 'next/navigation'

import { createBib, CreateBibData } from '@/services/bib.services'

// Server action for handling bib listing
export async function handleListBibServerAction(
	formData: FormData,
	sellerUserIdFromAuth: null | string
) {
	const sellerUserId = sellerUserIdFromAuth
	if (!sellerUserId) {
		redirect('/dashboard/seller/list-bib?error=User not authenticated')
		return
	}

	const isNotListedEvent = formData.get('isNotListedEvent') === 'on'
	const priceStr = formData.get('price') as string
	const originalPriceStr = formData.get('originalPrice') as string

	// Explicitly type the extended CreateBibData for clarity
	type ExtendedCreateBibData = CreateBibData & {
		isNotListedEvent?: boolean
		unlistedEventDate?: string
		unlistedEventLocation?: string
		unlistedEventName?: string
	}

	let bibData: ExtendedCreateBibData = {
		originalPrice: originalPriceStr ? parseFloat(originalPriceStr) : undefined,
		gender: formData.get('gender') as 'female' | 'male' | 'unisex' | undefined,
		registrationNumber: formData.get('registrationNumber') as string,
		size: formData.get('size') as string | undefined,
		eventId: formData.get('eventId') as string,
		isNotListedEvent: isNotListedEvent,
		price: parseFloat(priceStr),
	}

	if (isNotListedEvent) {
		bibData.unlistedEventName = formData.get('unlistedEventName') as string
		bibData.unlistedEventDate = formData.get('unlistedEventDate') as string
		bibData.unlistedEventLocation = formData.get(
			'unlistedEventLocation'
		) as string
		bibData.eventId = '' // Ensure eventId is empty for unlisted
		if (
			!bibData.unlistedEventName ||
			!bibData.unlistedEventDate ||
			!bibData.unlistedEventLocation
		) {
			redirect(
				`/dashboard/seller/list-bib?error=${encodeURIComponent('For unlisted events, event name, date, and location are required.')}`
			)
			return
		}
	} else {
		if (!bibData.eventId) {
			redirect(
				`/dashboard/seller/list-bib?error=${encodeURIComponent("Please select a partnered event or check 'My event is not listed'.")}`
			)
			return
		}
	}

	if (
		!bibData.registrationNumber ||
		isNaN(bibData.price) ||
		bibData.price <= 0
	) {
		redirect(
			`/dashboard/seller/list-bib?error=${encodeURIComponent('Registration Number and a valid Price are required.')}`
		)
		return
	}

	try {
		const newBib = await createBib(bibData, sellerUserId)

		if (newBib) {
			redirect(`/dashboard/seller?success=true&bibStatus=${newBib.status}`)
		} else {
			redirect(
				`/dashboard/seller/list-bib?error=${encodeURIComponent('Failed to list bib. Please check details and try again.')}`
			)
		}
	} catch (error) {
		console.error('Error listing bib:', error)
		let message = 'An unexpected error occurred.'
		if (error instanceof Error) message = error.message
		redirect(`/dashboard/seller/list-bib?error=${encodeURIComponent(message)}`)
	}
}
