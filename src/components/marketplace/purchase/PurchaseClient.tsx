'use client'

import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useEffect, useState } from 'react'

import { BibSale } from '@/components/marketplace/CardMarket'
import { Button } from '@/components/ui/button'
import { Locale } from '@/lib/i18n-config'

interface PurchaseClientProps {
	bib: BibSale
	clientSecret: string
	locale: Locale
}

export default function PurchaseClient({ locale, clientSecret, bib }: PurchaseClientProps) {
	const stripe = useStripe()
	const elements = useElements()
	const [errorMessage, setErrorMessage] = useState<null | string>(null)

	useEffect(() => {
		if (!stripe) {
			return
		}

		if (!clientSecret) {
			return
		}

		stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
			switch (paymentIntent?.status) {
				case 'processing':
					setErrorMessage('Your payment is processing.')
					break
				case 'requires_payment_method':
					setErrorMessage('Your payment was not successful, please try again.')
					break
				case 'succeeded':
					setErrorMessage(null)
					break
				default:
					setErrorMessage('Something went wrong.')
					break
			}
		})
	}, [stripe, clientSecret])

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()

		if (!stripe || !elements) {
			return
		}

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${window.location.origin}/${locale}/purchase/success`,
				redirect: 'if_required',
			},
			clientSecret,
		})

		if (error) {
			if (error.type === 'card_error' || error.type === 'validation_error') {
				setErrorMessage(error.message)
			} else {
				setErrorMessage('An unexpected error occurred.')
			}
		} else {
			// Payment successful, Stripe will redirect to return_url
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<h1>{bib.event.name}</h1>
			<p>Price: {bib.price} €</p>
			<PaymentElement id="payment-element" />
			<Button disabled={!stripe} type="submit">
				Pay
			</Button>
			{errorMessage && <div>{errorMessage}</div>}
		</form>
	)
}
