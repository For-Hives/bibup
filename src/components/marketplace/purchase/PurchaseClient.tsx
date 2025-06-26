
'use client'

import { Calendar, MapPinned, ShoppingCart, User } from 'lucide-react'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useEffect, useState } from 'react'

import Image from 'next/image'
import { BibSale } from '@/components/marketplace/CardMarket'
import { Button } from '@/components/ui/button'
import { SlidingPanel } from '@/components/ui/SlidingPanel'
import { Locale } from '@/lib/i18n-config'
import { cn } from '@/lib/utils'
import { formatDateWithLocale } from '@/lib/dateUtils'

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
		// format the number, to display it with ',' and ' '
		return participantCount.toLocaleString('en-US', {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		})
	}

	return (
		<div className="flex min-h-[80vh] items-center justify-center">
			<div className="bg-card/80 border-border relative flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border shadow-[0_0_0_1px_hsl(var(--border)),inset_0_0_30px_hsl(var(--primary)/0.1),inset_0_0_60px_hsl(var(--accent)/0.05),0_0_50px_hsl(var(--primary)/0.2)] backdrop-blur-md transition-all duration-300 hover:border-white/35">
				<div
					className={cn(
						'absolute inset-0 -z-20 opacity-50',
						'[background-size:20px_20px]',
						'[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]',
						'dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]'
					)}
				/>
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-25 dark:bg-black"></div>
				<div className="relative flex justify-center px-4 pt-4">
					<div className="from-primary/20 via-accent/20 to-secondary/20 before:from-primary before:via-accent before:via-secondary before:to-ring relative h-64 w-full overflow-hidden rounded-xl bg-gradient-to-br shadow-[inset_0_0_20px_hsl(var(--primary)/0.3),inset_0_0_40px_hsl(var(--accent)/0.2),0_0_30px_hsl(var(--primary)/0.4)] before:absolute before:inset-0 before:-z-10 before:m-[-1px] before:rounded-xl before:bg-gradient-to-br before:p-0.5">
						<Image
							alt="template-run"
							className="-z-10 rounded-2xl object-cover p-3"
							fill
							sizes="100vw"
							src={bib.event.image}
						/>
						<div className="absolute inset-0 z-10 opacity-10">
							<div className="h-full w-full animate-pulse bg-[linear-gradient(90deg,hsl(var(--foreground)/0.3)_1px,transparent_1px),linear-gradient(hsl(var(--foreground)/0.3)_1px,transparent_1px)] bg-[length:15px_15px]" />
						</div>
						{/* type of event */}
						<div className="absolute inset-0 top-0 left-0 z-20 m-2">
							<span
								className={cn(
									'mb-3 inline-block rounded-full border px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md',
									bgFromType(bib.event.type)
								)}
							>
								{bib.event.type.charAt(0).toUpperCase() + bib.event.type.slice(1)}
							</span>
						</div>
						{/* Calc of the discount - red if more than 10% off */}
						{((bib.originalPrice - bib.price) / bib.originalPrice) * 100 > 10 && (
							<div className="absolute top-0 right-0 z-20 m-2 flex justify-center">
								<span
									className={cn('text-xs', {
										'mb-2 rounded-full border border-red-500/50 bg-red-500/15 px-3 py-1 font-medium text-white/90 shadow-md shadow-red-500/20 backdrop-blur-md':
											((bib.originalPrice - bib.price) / bib.originalPrice) * 100 > 10,
									})}
								>
									{(-((bib.originalPrice - bib.price) / bib.originalPrice) * 100).toFixed(0)}%
								</span>
							</div>
						)}
					</div>
				</div>
				<div className="flex w-full items-center justify-center py-2">
					<div className="flex w-full items-center justify-center">
						<p className="text-muted-foreground text-xs leading-relaxed italic">
							Sold by {bib.user.firstName} {bib.user.lastName}
						</p>
					</div>
				</div>
				<div className="via-border h-px w-full bg-gradient-to-r from-transparent to-transparent" />
				<div className="flex flex-1 flex-col gap-2 px-4 py-2">
					<div className="flex w-full justify-between gap-2">
						<h3 className="text-foreground text-lg font-bold">{bib.event.name}</h3>
						<div className="relative flex flex-col items-center gap-2">
							<p className="text-2xl font-bold text-white">{bib.price}€</p>
							<p className="absolute top-8 right-0 text-sm italic line-through">{bib.originalPrice}€</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<Calendar className="h-5 w-5" />
						<p className="text-muted-foreground text-xs leading-relaxed">
							{formatDateWithLocale(bib.event.date, locale)}
						</p>
					</div>
					<div className="flex items-center gap-3">
						<MapPinned className="h-5 w-5" />
						<div className="flex items-center gap-1">
							<p className="text-muted-foreground text-xs leading-relaxed">{bib.event.location}</p>
							<span className="text-muted-foreground text-xs leading-relaxed">•</span>
							<p className="text-muted-foreground text-xs leading-relaxed">
								{bib.event.distance}
								<span className="text-muted-foreground text-xs leading-relaxed italic">
									{bib.event.distanceUnit}
								</span>
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<User className="h-5 w-5" />
						<p className="text-muted-foreground text-xs leading-relaxed">
							{formatParticipantCount(bib.event.participantCount)} participants
						</p>
					</div>
					<div className="flex h-full items-end justify-center py-2">
						<Button
							className="border-border bg-accent/20 text-accent-foreground hover:bg-accent/30 hover:text-foreground flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium backdrop-blur-md transition"
							onClick={() => setIsPanelOpen(true)}
						>
							<ShoppingCart className="h-5 w-5" />
							I want this bib
						</Button>
					</div>
				</div>
			</div>

			<SlidingPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} title="Complete your purchase">
				<form onSubmit={handleSubmit} className="space-y-4">
					<h2 className="text-xl font-bold">Payment Details</h2>
					<PaymentElement id="payment-element" />
					<Button type="submit" disabled={!stripe} className="w-full">
						Pay {bib.price}€
					</Button>
					{errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
				</form>
			</SlidingPanel>
		</div>
	)
}


