'use server'

import { redirect } from 'next/navigation'
import { Bib } from '@/models/bib.model'

import { createBib } from '@/services/bib.services'

import { BibFormSchema } from './schemas'

// Server action for handling bib listing
export async function handleListBibServerAction(
	formData: FormData,
	sellerUserIdFromAuth: null | string
) {
	const sellerUserId = sellerUserIdFromAuth
	if (sellerUserId == null) {
		redirect('/dashboard/seller/list-bib?error=User not authenticated')
	}

	// Extraction des données du formulaire
	const isNotListedEvent = formData.get('isNotListedEvent') === 'on'
	const priceStr = formData.get('price') as string
	const originalPriceStr = formData.get('originalPrice') as string

	// Préparation des données pour la validation Zod
	const formDataToValidate = {
		originalPrice: originalPriceStr ? parseFloat(originalPriceStr) : undefined,
		gender: formData.get('gender') as 'female' | 'male' | 'unisex' | undefined,
		unlistedEventLocation: formData.get('unlistedEventLocation') as string,
		registrationNumber: formData.get('registrationNumber') as string,
		unlistedEventName: formData.get('unlistedEventName') as string,
		unlistedEventDate: formData.get('unlistedEventDate') as string,
		size: formData.get('size') as string | undefined,
		price: priceStr ? parseFloat(priceStr) : 0,
		eventId: formData.get('eventId') as string,
		isNotListedEvent: isNotListedEvent,
	}

	// Validation avec Zod
	const validationResult = BibFormSchema.safeParse(formDataToValidate)

	if (!validationResult.success) {
		const errorMessages = validationResult.error.errors
			.map(err => err.message)
			.join(', ')
		redirect(
			`/dashboard/seller/list-bib?error=${encodeURIComponent(errorMessages)}`
		)
		return
	}

	const validatedData = validationResult.data

	// Préparation de l'objet Bib complet pour createBib
	const bibToCreate: Bib = {
		registrationNumber: validatedData.registrationNumber,
		originalPrice: validatedData.originalPrice ?? 0,
		gender: validatedData.gender ?? undefined,
		eventId: validatedData.eventId ?? '',
		status: 'pending_validation',
		price: validatedData.price,
		sellerUserId: sellerUserId,
		size: validatedData.size,
		id: '', // Sera généré par le service
	}

	try {
		const newBib = await createBib(bibToCreate)

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
