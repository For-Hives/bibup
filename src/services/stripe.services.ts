'use server'

import Stripe from 'stripe'

import { fetchBibById } from '@/services/bib.services'

if (!(process.env.STRIPE_SECRET_KEY ?? '') && process.env.STRIPE_SECRET_KEY == '') {
	throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2025-05-28.basil',
})

export async function createPaymentIntent(bibId: string): Promise<string> {
	if (bibId == null || bibId === '') {
		throw new Error('Missing bibId')
	}

	const bib = await fetchBibById(bibId)

	if (!bib) {
		throw new Error('Bib not found')
	}

	const paymentIntent = await stripe.paymentIntents.create({
		metadata: { bibId: bib.id },
		currency: 'eur',
		amount: bib.price * 100, // amount in cents
	})

	if (paymentIntent.client_secret == null) {
		throw new Error('Failed to create payment intent')
	}

	return paymentIntent.client_secret
}
