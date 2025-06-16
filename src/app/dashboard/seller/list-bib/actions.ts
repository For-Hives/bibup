'use server'

import { auth } from '@clerk/nextjs/server'
import * as v from 'valibot'

import { fetchUserByClerkId } from '@/services/user.services'
import { createBib } from '@/services/bib.services'
import { Bib } from '@/models/bib.model'

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
		unlistedEventName: (formData.get('unlistedEventName') as string) ?? undefined,
		unlistedEventLocation: (formData.get('unlistedEventLocation') as string) ?? undefined,
		unlistedEventDate: (formData.get('unlistedEventDate') as string) ?? undefined,
		size: formData.get('size') == '' ? undefined : (formData.get('size') as string),
		registrationNumber: formData.get('registrationNumber') as string,
		price: priceStr ? parseFloat(priceStr) : undefined,
		originalPrice: originalPriceStr ? parseFloat(originalPriceStr) : undefined,
		isNotListedEvent: isNotListedEvent,
		gender: gender,
		eventId: formData.get('eventId') as string,
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

	const bibToCreate: Omit<Bib, 'id'> = {
		validated: false,

		updatedAt: new Date(),
		status: 'available',
		sellerUserId: sellerUserIdFromAuth,
		registrationNumber: validatedData.registrationNumber,
		price: validatedData.price,
		originalPrice: validatedData.originalPrice ?? 0,
		optionValues: {},
		listed: null,
		eventId: validatedData.eventId ?? '',
		createdAt: new Date(),
	}

	try {
		const newBib = await createBib(bibToCreate)

		if (!newBib) {
			throw new Error('Failed to list bib after creation attempt.')
		}
		return newBib.status
	} catch (error: unknown) {
		throw new Error(`Failed to list bib: ${error instanceof Error ? error.message : String(error)}`)
	}
}
