'use client'

import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { Calendar, MapPinned, ShoppingCart, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import Image from 'next/image'

import { BibSale } from '@/components/marketplace/CardMarket'
import { SlidingPanel } from '@/components/ui/SlidingPanel'
import { formatDateWithLocale } from '@/lib/dateUtils'
import { Button } from '@/components/ui/button'
import { Locale } from '@/lib/i18n-config'
import { cn } from '@/lib/utils'

interface PurchaseClientProps {
	bib: BibSale
	clientSecret: string
	locale: Locale
}

export default function PurchaseClient({ locale, clientSecret, bib }: PurchaseClientProps) {
	const stripe = useStripe()
	const elements = useElements()
	const [errorMessage, setErrorMessage] = useState<null | string>(null)
	const [isPanelOpen, setIsPanelOpen] = useState(false)

	useEffect(() => {
		if (!stripe || !clientSecret || !isPanelOpen) {
			return
		}

		void stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
			if (paymentIntent) {
				switch (paymentIntent.status) {
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
			} else {
				setErrorMessage('Failed to retrieve payment intent.')
			}
		})
	}, [stripe, clientSecret, isPanelOpen])

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

	function bgFromType(type: BibSale['event']['type']) {
		switch (type) {
			case 'cycling':
				return 'bg-cyan-500/15 border-cyan-500/50'
			case 'other':
				return 'bg-gray-500/15 border-gray-500/50'
			case 'running':
				return 'bg-green-500/15 border-green-500/50'
			case 'swimming':
				return 'bg-blue-500/15 border-blue-500/50'
			case 'trail':
				return 'bg-yellow-500/15 border-yellow-500/50'
			case 'triathlon':
				return 'bg-purple-500/15 border-purple-500/50'
		}
	}

	function formatParticipantCount(participantCount: number) {
		return participantCount.toLocaleString('en-US', {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		})
	}

	const bentoItemClasses =
		'relative rounded-xl border p-4 shadow-[inset_0_0_20px_hsl(var(--primary)/0.3),inset_0_0_40px_hsl(var(--accent)/0.2),0_0_30px_hsl(var(--primary)/0.4)] bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 overflow-hidden'

	return (
		<div className="flex min-h-[50vh] items-center justify-center p-4">
			<div className="bg-card/80 border-border relative grid w-full max-w-5xl grid-cols-1 gap-4 overflow-hidden rounded-2xl border p-6 shadow-[0_0_0_1px_hsl(var(--border)),inset_0_0_30px_hsl(var(--primary)/0.1),inset_0_0_60px_hsl(var(--accent)/0.05),0_0_50px_hsl(var(--primary)/0.2)] backdrop-blur-md md:auto-rows-min md:grid-cols-3">
				<div
					className={cn(
						'absolute inset-0 -z-20 opacity-50',
						'[background-size:20px_20px]',
						'[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]',
						'dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]'
					)}
				/>
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-25 dark:bg-black"></div>

				{/* Image Section - Spans 2 columns and 2 rows */}
				<div className={cn(bentoItemClasses, 'h-64 md:col-span-2 md:row-span-2 md:h-auto')}>
					<Image
						alt="Event Image"
						className="object-cover p-3"
						fill
						sizes="(max-width: 768px) 100vw, 66vw"
						src={bib.event.image}
					/>
					<div className="absolute inset-0 z-10 opacity-10">
						<div className="h-full w-full animate-pulse bg-[linear-gradient(90deg,hsl(var(--foreground)/0.3)_1px,transparent_1px),linear-gradient(hsl(var(--foreground)/0.3)_1px,transparent_1px)] bg-[length:15px_15px]" />
					</div>
					<div className="absolute top-0 left-0 z-20 m-2">
						<span
							className={cn(
								'inline-block rounded-full border px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md',
								bgFromType(bib.event.type)
							)}
						>
							{bib.event.type.charAt(0).toUpperCase() + bib.event.type.slice(1)}
						</span>
					</div>
					{!!bib.originalPrice && ((bib.originalPrice - bib.price) / bib.originalPrice) * 100 > 10 && (
						<div className="absolute top-0 right-0 z-20 m-2">
							<span
								className={cn('text-xs', {
									'rounded-full border border-red-500/50 bg-red-500/15 px-3 py-1 font-medium text-white/90 shadow-md shadow-red-500/20 backdrop-blur-md':
										true,
								})}
							>
								{(-((bib.originalPrice - bib.price) / bib.originalPrice) * 100).toFixed(0)}%
							</span>
						</div>
					)}
				</div>

				{/* Title and Seller Info */}
				<div className={bentoItemClasses}>
					<h1 className="text-foreground text-2xl font-bold">{bib.event.name}</h1>
					<p className="text-muted-foreground text-sm italic">
						Sold by {bib.user.firstName} {bib.user.lastName}
					</p>
				</div>

				{/* Price and Buy Button */}
				<div className={cn(bentoItemClasses, 'flex flex-col justify-between')}>
					<div className="flex flex-col">
						<p className="text-4xl font-bold text-white">{bib.price}€</p>
						{bib.originalPrice && bib.originalPrice > bib.price && (
							<p className="text-muted-foreground text-lg line-through">{bib.originalPrice}€</p>
						)}
					</div>
					<Button
						className="flex items-center gap-2 rounded-lg px-6 py-3 text-lg font-medium transition"
						onClick={() => setIsPanelOpen(true)}
					>
						<ShoppingCart className="h-6 w-6" />
						Buy Now
					</Button>
				</div>

				{/* Date */}
				<div className={bentoItemClasses}>
					<h2 className="text-lg font-semibold">Date</h2>
					<div className="mt-2 flex items-center gap-3">
						<Calendar className="text-primary h-5 w-5" />
						<p className="text-muted-foreground text-sm">{formatDateWithLocale(bib.event.date, locale)}</p>
					</div>
				</div>

				{/* Location and Distance */}
				<div className={bentoItemClasses}>
					<h2 className="text-lg font-semibold">Location & Distance</h2>
					<div className="mt-2 flex items-center gap-3">
						<MapPinned className="text-primary h-5 w-5" />
						<p className="text-muted-foreground text-sm">
							{bib.event.location} • {bib.event.distance}
							{bib.event.distanceUnit}
						</p>
					</div>
				</div>

				{/* Participants */}
				<div className={bentoItemClasses}>
					<h2 className="text-lg font-semibold">Participants</h2>
					<div className="mt-2 flex items-center gap-3">
						<User className="text-primary h-5 w-5" />
						<p className="text-muted-foreground text-sm">
							{formatParticipantCount(bib.event.participantCount)} participants
						</p>
					</div>
				</div>
			</div>

			<SlidingPanel
				className="z-[100]"
				isOpen={isPanelOpen}
				onClose={() => setIsPanelOpen(false)}
				title="Complete your purchase"
			>
				<form className="space-y-4" onSubmit={handleSubmit}>
					<h2 className="text-xl font-bold">Payment Details</h2>
					<PaymentElement id="payment-element" />
					<Button className="w-full" disabled={!stripe} type="submit">
						Pay {bib.price}€
					</Button>
					{errorMessage && <div className="text-sm text-red-500">{errorMessage}</div>}
				</form>
			</SlidingPanel>
		</div>
	)
}
