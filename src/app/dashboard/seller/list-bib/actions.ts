'use server'

import { auth } from '@clerk/nextjs/server'
import { Bib } from '@/models/bib.model'
import * as v from 'valibot'

import { fetchUserByClerkId } from '@/services/user.services'
import { createBib } from '@/services/bib.services'

import { BibFormSchema } from './schemas'

export async function handleListBibServerAction(formData: FormData): Promise<Bib['status']> {
	const { userId: clerkid } = await auth()
	if (clerkid == null) {
		throw new Error('Authentication required.')
	}
	const sellerUserIdFromAuth = await fetchUserByClerkId(clerkid)
		.then(user => user?.id)
		.catch(() => {
			return null
		})

	if (sellerUserIdFromAuth == null) {
		throw new Error('User not found or application setup issue.')
	}

	const isNotListedEvent = formData.get('isNotListedEvent') === 'on'
	const priceStr = formData.get('price') as string
	const originalPriceStr = formData.get('originalPrice') as string
	const gender = formData.get('gender') == '' ? undefined : (formData.get('gender') as 'female' | 'male' | 'unisex')

	const formDataToValidate = {
		unlistedEventLocation: (formData.get('unlistedEventLocation') as string) ?? undefined,
		size: formData.get('size') == '' ? undefined : (formData.get('size') as string),
		unlistedEventName: (formData.get('unlistedEventName') as string) ?? undefined,
		unlistedEventDate: (formData.get('unlistedEventDate') as string) ?? undefined,
		originalPrice: originalPriceStr ? parseFloat(originalPriceStr) : undefined,
		registrationNumber: formData.get('registrationNumber') as string,
		price: priceStr ? parseFloat(priceStr) : undefined,
		eventId: formData.get('eventId') as string,
		isNotListedEvent: isNotListedEvent,
		gender: gender,
	}

	const validationResult = v.safeParse(BibFormSchema, formDataToValidate)

	if (!validationResult.success) {
		const flatErrors = v.flatten(validationResult.issues)
		const errorMessages =
			flatErrors.root?.join(', ') ??
			Object.values(flatErrors.nested ?? {})
				.flat()
				.join(', ') ??
			'Validation error'
		throw new Error(`Validation failed: ${errorMessages}`)
	}

	const validatedData = validationResult.output

	// Construct the data payload for createBib based on CreateBibData type
	const dataForCreateBib: Parameters<typeof createBib>[0] = {
		unlistedEventLocation: validatedData.unlistedEventLocation,
		registrationNumber: validatedData.registrationNumber,
		// Optional unlisted event fields from the schema
		unlistedEventDate: validatedData.unlistedEventDate,
		unlistedEventName: validatedData.unlistedEventName,
		isNotListedEvent: validatedData.isNotListedEvent, // Schema ensures boolean
		originalPrice: validatedData.originalPrice, // Schema ensures it's number | undefined
		gender: validatedData.gender ?? undefined, // Convert null to undefined
		eventId: validatedData.eventId, // Schema ensures string | undefined
		price: validatedData.price, // Schema ensures number
		size: validatedData.size, // Schema ensures string | undefined
	}

	try {
		// Pass sellerUserIdFromAuth as the second argument
		const newBib = await createBib(dataForCreateBib, sellerUserIdFromAuth)

		if (!newBib) {
			throw new Error('Failed to list bib after creation attempt.')
		}
		return newBib.status
	} catch (error: unknown) {
		throw new Error(`Failed to list bib: ${error instanceof Error ? error.message : String(error)}`)
	}
}
