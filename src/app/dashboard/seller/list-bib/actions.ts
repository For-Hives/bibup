'use server'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Bib } from '@/models/bib.model'

import { fetchUserByClerkId } from '@/services/user.services'
import { createBib } from '@/services/bib.services'

import { BibFormSchema } from './schemas'

// Server action for handling bib listing
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

	// Extraction des données du formulaire
	const isNotListedEvent = formData.get('isNotListedEvent') === 'on'
	const priceStr = formData.get('price') as string
	const originalPriceStr = formData.get('originalPrice') as string
	const gender = formData.get('gender') == '' ? undefined : (formData.get('gender') as 'female' | 'male' | 'unisex')

	// Préparation des données pour la validation Zod
	const formDataToValidate = {
		unlistedEventLocation: (formData.get('unlistedEventLocation') as string) ?? undefined,
		size: formData.get('size') == '' ? undefined : (formData.get('size') as string),
		unlistedEventName: (formData.get('unlistedEventName') as string) ?? undefined,
		unlistedEventDate: (formData.get('unlistedEventDate') as string) ?? undefined,
		originalPrice: originalPriceStr ? parseFloat(originalPriceStr) : undefined,
		registrationNumber: formData.get('registrationNumber') as string,
		price: priceStr ? parseFloat(priceStr) : 0,
		eventId: formData.get('eventId') as string,
		isNotListedEvent: isNotListedEvent,
		gender: gender,
	}

	// Validation avec Zod
	const validationResult = BibFormSchema.safeParse(formDataToValidate)

	if (!validationResult.success) {
		console.error('object to validate:', formDataToValidate)
		console.error('Validation failed:', validationResult.error)
		const errorMessages = validationResult.error.errors.map(err => err.message).join(', ')
		redirect(`/dashboard/seller/list-bib?error=${encodeURIComponent(errorMessages)}`)
		return
	}

	const validatedData = validationResult.data

	// Préparation de l'objet Bib complet pour createBib
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
