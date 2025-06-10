'use server'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Bib } from '@/models/bib.model'
import * as v from 'valibot'

import { fetchUserByClerkId } from '@/services/user.services'
import { createBib } from '@/services/bib.services'

import { BibFormSchema } from './schemas'

export async function handleListBibServerAction(formData: FormData) {
	const { userId: clerkid } = await auth()
	if (clerkid == null) {
		throw new Error('User not authenticated')
	}
	const sellerUserIdFromAuth = await fetchUserByClerkId(clerkid)
		.then(user => user?.id)
		.catch(() => null)

	if (sellerUserIdFromAuth == null) {
		redirect('/dashboard/seller/list-bib?error=User not authenticated')
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
		const errorMessages = flatErrors.root?.join(', ') ?? 'Validation error'
		redirect(`/dashboard/seller/list-bib?error=${encodeURIComponent(errorMessages)}`)
		return
	}

	const validatedData = validationResult.output

	const bibToCreate: Omit<Bib, 'id'> = {
		registrationNumber: validatedData.registrationNumber,
		originalPrice: validatedData.originalPrice ?? 0,
		gender: validatedData.gender ?? undefined,
		eventId: validatedData.eventId ?? '', // TODO: Creer liste d'attente de vente pour les events non listés
		sellerUserId: sellerUserIdFromAuth,
		status: 'pending_validation',
		price: validatedData.price,
		size: validatedData.size,
	}

	try {
		const newBib = await createBib(bibToCreate)

		if (newBib) {
			redirect(`/dashboard/seller?success=true&bibStatus=${newBib.status}`)
		} else {
			redirect(`/dashboard/seller/list-bib?error=errorListBibFailed`)
		}
	} catch (error) {
		console.error('Error listing bib:', error)
		// Note: The original code used `error.message` if available.
		// For a generic unexpected error, we'll use the global key.
		// If specific error messages from `error.message` should be preserved and internationalized,
		// a more complex error handling and localization strategy would be needed here.
		redirect(`/dashboard/seller/list-bib?error=errorGlobalUnexpected`)
	}
}
