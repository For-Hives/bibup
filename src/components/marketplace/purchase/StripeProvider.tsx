'use client'

import { Elements } from '@stripe/react-stripe-js'
import React from 'react'

import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function StripeProvider({ clientSecret, children }: { children: React.ReactNode; clientSecret: string }) {
	return (
		<Elements options={{ clientSecret }} stripe={stripePromise}>
			{children}
		</Elements>
	)
}
