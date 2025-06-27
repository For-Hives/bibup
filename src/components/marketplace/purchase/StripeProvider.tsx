'use client'

import { Elements } from '@stripe/react-stripe-js'
import React from 'react'

import { loadStripe } from '@stripe/stripe-js'

// Ensure the Stripe publishable key is set in your environment variables
if (!(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '') && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === '') {
	throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable')
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function StripeProvider({
	clientSecret,
	children,
}: Readonly<{ children: React.ReactNode; clientSecret: string }>) {
	return (
		<Elements options={{ clientSecret }} stripe={stripePromise}>
			{children}
		</Elements>
	)
}
