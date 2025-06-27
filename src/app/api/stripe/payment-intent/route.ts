import { NextResponse } from 'next/server'
import Stripe from 'stripe'

import { fetchBibById } from '@/services/bib.services'

if (!(process.env.STRIPE_SECRET_KEY ?? '') && process.env.STRIPE_SECRET_KEY == '') {
	throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2025-05-28.basil',
})

export async function POST(request: Request) {
	const body = (await request.json()) as { bibId: string }
	const { bibId } = body

	if (bibId == null || bibId === '') {
		return NextResponse.json({ error: 'Missing bibId' }, { status: 400 })
	}

	const bib = await fetchBibById(bibId)

	if (!bib) {
		return NextResponse.json({ error: 'Bib not found' }, { status: 404 })
	}

	const paymentIntent = await stripe.paymentIntents.create({
		metadata: { bibId: bib.id },
		currency: 'eur',
		amount: bib.price * 100, // amount in cents
	})

	return NextResponse.json({ clientSecret: paymentIntent.client_secret })
}
