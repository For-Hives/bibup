'use server'

import { auth } from '@clerk/nextjs/server'
import { Bib } from '@/models/bib.model'
import * as v from 'valibot'

import { fetchUserByClerkId } from '@/services/user.services'
import { createBib } from '@/services/bib.services'

import { BibFormSchema } from './schemas'

export async function handleListBibServerAction(formData: FormData): Promise<{
	error?: string
	redirectPath?: string
	success: boolean
}> {
	const { userId: clerkid } = await auth()
	if (clerkid == null) {
		throw new Error('Authentication required.')
	}
	const sellerUserIdFromAuth = await fetchUserByClerkId(clerkid)
		.then(user => user?.id)
		.catch(() => {
			// This catch is for fetchUserByClerkId failing, not for user being null.
			// If fetchUserByClerkId throws, it will be caught by the outer try-catch if not handled here.
			// For now, let it return null, to be caught by the check below.
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

		// If createBib completes without error, newBib should be valid.
		// The explicit `if (newBib)` check might be redundant if createBib always throws on failure
		// (which it should, based on previous service refactoring).
		// However, keeping it for safety or if createBib's contract changes.
		if (!newBib) {
			// This case implies createBib returned null/undefined without throwing.
			throw new Error('Failed to list bib after creation attempt.')
		}
		return { redirectPath: `/dashboard/seller?success=true&bibStatus=${newBib.status}`, success: true }
	} catch (error: unknown) {
		// This will catch errors from createBib, fetchUserByClerkId (if it throws),
		// or any other unexpected errors in the try block.
		throw new Error(`Failed to list bib: ${error instanceof Error ? error.message : String(error)}`)
	}
}
