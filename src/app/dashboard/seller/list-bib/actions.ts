'use server'

import { redirect } from 'next/navigation'

import { createBib } from '@/services/bib.services'
import { Bib } from '@/models'
import { BibFormSchema } from './schemas'

// Server action for handling bib listing
export async function handleListBibServerAction(
	formData: FormData,
	sellerUserIdFromAuth: null | string
) {
	const sellerUserId = sellerUserIdFromAuth
	if (!sellerUserId) {
		redirect('/dashboard/seller/list-bib?error=User not authenticated')
	}

	// Extraction des données du formulaire
	const isNotListedEvent = formData.get('isNotListedEvent') === 'on'
	const priceStr = formData.get('price') as string
	const originalPriceStr = formData.get('originalPrice') as string

	// Préparation des données pour la validation Zod
	const formDataToValidate = {
		registrationNumber: formData.get('registrationNumber') as string,
		price: priceStr ? parseFloat(priceStr) : 0,
		originalPrice: originalPriceStr ? parseFloat(originalPriceStr) : undefined,
		gender: formData.get('gender') as 'female' | 'male' | 'unisex' | undefined,
		size: formData.get('size') as string | undefined,
		eventId: formData.get('eventId') as string,
		isNotListedEvent: isNotListedEvent,
		unlistedEventName: formData.get('unlistedEventName') as string,
		unlistedEventDate: formData.get('unlistedEventDate') as string,
		unlistedEventLocation: formData.get('unlistedEventLocation') as string,
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
		id: '', // Sera généré par le service
		eventId: validatedData.eventId || '',
		price: validatedData.price,
		originalPrice: validatedData.originalPrice || 0,
		registrationNumber: validatedData.registrationNumber,
		sellerUserId: sellerUserId,
		status: 'pending_validation',
		gender: validatedData.gender,
		size: validatedData.size,
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
