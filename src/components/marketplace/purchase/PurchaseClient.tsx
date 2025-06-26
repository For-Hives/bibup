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

export default function PurchaseClient({ locale, clientSecret, bib }: Readonly<PurchaseClientProps>) {
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
			},
		})

		if (error !== null) {
			if (error.type === 'card_error' || error.type === 'validation_error') {
				setErrorMessage(error.message ?? 'An error occurred')
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

	return (
		<div className="from-background via-primary/5 to-background relative bg-gradient-to-br">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

			<div className="relative pt-20 pb-12">
				<div className="container mx-auto max-w-4xl p-6">
					{/* Header */}
					<div className="mb-8 space-y-2 text-center">
						<h1 className="text-foreground text-3xl font-bold tracking-tight">Purchase Bib</h1>
						<p className="text-muted-foreground text-lg">Complete your purchase to secure your race bib</p>
					</div>

					{/* Main Content Grid */}
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
						{/* Event Image Card */}
						<div className="border-border/50 bg-card/80 relative overflow-hidden rounded-lg border backdrop-blur-sm transition-all duration-200 hover:shadow-lg lg:col-span-2">
							<div className="relative h-64 lg:h-80">
								<Image
									alt="Event Image"
									className="object-cover"
									fill
									sizes="(max-width: 1024px) 100vw, 66vw"
									src={bib.event.image}
								/>
								{/* Event Type Badge */}
								<div className="absolute top-4 left-4 z-10">
									<span
										className={cn(
											'inline-block rounded-full border px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md',
											bgFromType(bib.event.type)
										)}
									>
										{bib.event.type.charAt(0).toUpperCase() + bib.event.type.slice(1)}
									</span>
								</div>
								{/* Discount Badge */}
								{!!bib.originalPrice && ((bib.originalPrice - bib.price) / bib.originalPrice) * 100 > 10 && (
									<div className="absolute top-4 right-4 z-10">
										<span className="rounded-full border border-red-500/50 bg-red-500/15 px-3 py-1 text-xs font-medium text-white/90 shadow-md shadow-red-500/20 backdrop-blur-md">
											{(-((bib.originalPrice - bib.price) / bib.originalPrice) * 100).toFixed(0)}%
										</span>
									</div>
								)}
							</div>
							{/* Event Title */}
							<div className="p-6">
								<h2 className="text-foreground text-2xl font-bold">{bib.event.name}</h2>
								<p className="text-muted-foreground mt-1 text-sm italic">
									Sold by {bib.user.firstName} {bib.user.lastName}
								</p>
							</div>
						</div>

						{/* Price and Purchase Card */}
						<div className="border-border/50 bg-card/80 flex flex-col justify-between rounded-lg border p-6 backdrop-blur-sm transition-all duration-200 hover:shadow-lg">
							<div>
								<h3 className="mb-4 text-lg font-semibold">Price</h3>
								<div className="mb-6">
									<p className="text-foreground text-4xl font-bold">{bib.price}€</p>
									{Boolean(bib.originalPrice && bib.originalPrice > bib.price) && (
										<p className="text-muted-foreground text-lg line-through">{bib.originalPrice}€</p>
									)}
								</div>
							</div>
							<Button
								className="flex items-center justify-center gap-2 text-lg font-medium"
								onClick={() => setIsPanelOpen(true)}
								size="lg"
							>
								<ShoppingCart className="h-5 w-5" />
								Buy Now
							</Button>
						</div>
					</div>

					{/* Event Details Grid */}
					<div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
						{/* Date Card */}
						<div className="border-border/50 bg-card/80 rounded-lg border p-6 backdrop-blur-sm transition-all duration-200 hover:shadow-lg">
							<h3 className="mb-3 text-lg font-semibold">Date</h3>
							<div className="flex items-center gap-3">
								<div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
									<Calendar className="h-5 w-5" />
								</div>
								<p className="text-muted-foreground">{formatDateWithLocale(bib.event.date, locale)}</p>
							</div>
						</div>

						{/* Location Card */}
						<div className="border-border/50 bg-card/80 rounded-lg border p-6 backdrop-blur-sm transition-all duration-200 hover:shadow-lg">
							<h3 className="mb-3 text-lg font-semibold">Location & Distance</h3>
							<div className="flex items-center gap-3">
								<div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
									<MapPinned className="h-5 w-5" />
								</div>
								<div>
									<p className="text-muted-foreground text-sm">{bib.event.location}</p>
									<p className="text-muted-foreground text-sm font-medium">
										{bib.event.distance}
										{bib.event.distanceUnit}
									</p>
								</div>
							</div>
						</div>

						{/* Participants Card */}
						<div className="border-border/50 bg-card/80 rounded-lg border p-6 backdrop-blur-sm transition-all duration-200 hover:shadow-lg">
							<h3 className="mb-3 text-lg font-semibold">Participants</h3>
							<div className="flex items-center gap-3">
								<div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
									<User className="h-5 w-5" />
								</div>
								<p className="text-muted-foreground">
									{formatParticipantCount(bib.event.participantCount)} participants
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<SlidingPanel
				className="z-[100]"
				isOpen={isPanelOpen}
				onClose={() => setIsPanelOpen(false)}
				title="Complete your purchase"
			>
				<form
					className="space-y-4"
					onSubmit={event => {
						void handleSubmit(event)
					}}
				>
					<h2 className="text-xl font-bold">Payment Details</h2>
					<PaymentElement id="payment-element" />
					<Button className="w-full" disabled={!stripe} type="submit">
						Pay {bib.price}€
					</Button>
					{Boolean(errorMessage) && <div className="text-sm text-red-500">{errorMessage}</div>}
				</form>
			</SlidingPanel>
		</div>
	)
}
