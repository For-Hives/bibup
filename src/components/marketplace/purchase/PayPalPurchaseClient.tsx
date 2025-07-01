'use client'

import { AlertTriangle, Calendar, MapPinned, ShoppingCart, User } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { PayPalButtons } from '@paypal/react-paypal-js'

import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'

import type { User as AppUser } from '@/models/user.model'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { handleSuccessfulPurchase } from '@/app/[locale]/purchase/actions'
import CardMarket, { BibSale } from '@/components/marketplace/CardMarket'
import { capturePayment, createOrder } from '@/services/paypal.services'
import { SlidingPanel } from '@/components/ui/SlidingPanel'
import { formatDateWithLocale } from '@/lib/dateUtils'
import { Button } from '@/components/ui/button'
import { Locale } from '@/lib/i18n-config'
import { cn } from '@/lib/utils'

interface PayPalPurchaseClientProps {
	bib: BibSale
	locale: Locale
	otherBibs?: BibSale[]
	user: AppUser | null
}

export default function PayPalPurchaseClient({
	user,
	otherBibs = [],
	locale,
	bib,
}: Readonly<PayPalPurchaseClientProps>) {
	const [errorMessage, setErrorMessage] = useState<null | string>(null)
	const [successMessage, setSuccessMessage] = useState<null | string>(null)
	const [isPanelOpen, setIsPanelOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const { isSignedIn } = useUser()
	const router = useRouter()
	const [isProfileComplete, setIsProfileComplete] = useState(false)

	useEffect(() => {
		if (user) {
			const {
				postalCode,
				phoneNumber,
				lastName,
				firstName,
				emergencyContactPhone,
				emergencyContactName,
				country,
				city,
				birthDate,
				address,
			} = user
			const isComplete = [
				firstName,
				lastName,
				birthDate,
				phoneNumber,
				emergencyContactName,
				emergencyContactPhone,
				address,
				postalCode,
				city,
				country,
			].every(Boolean)
			setIsProfileComplete(isComplete)
		}
	}, [user])

	// Check if user is authenticated when trying to open payment modal
	const handleBuyNowClick = () => {
		if (isSignedIn !== true) {
			router.push(`/${locale}/sign-in?redirect_url=${encodeURIComponent(window.location.pathname)}`)
			return
		}
		if (isProfileComplete) {
			setIsPanelOpen(true)
		}
	}

	const handleCreateOrder = useCallback(async () => {
		// Note: In a real implementation, we would need to get the seller's PayPal merchant ID
		// For now, we'll use a placeholder or get it from the bib's seller user data
		const sellerId = 'YOUR_SELLER_MERCHANT_ID' // This should be fetched from the seller's profile

		try {
			setLoading(true)
			setErrorMessage(null)

			const data = await createOrder(sellerId, bib.price.toString())
			if (data.error !== null && data.error !== undefined && data.error !== '') {
				throw new Error(data.error)
			}

			console.info('Order created:', data)
			return data.id ?? ''
		} catch (error: unknown) {
			const errorMsg = 'Error creating order: ' + (error instanceof Error ? error.message : 'Unknown error')
			console.error('Order creation error:', error instanceof Error ? error.message : 'Unknown error')
			setErrorMessage(errorMsg)
			throw new Error(errorMsg)
		} finally {
			setLoading(false)
		}
	}, [bib.price])

	const onApprove = useCallback(
		async (data: { orderID: string }) => {
			try {
				setLoading(true)
				setErrorMessage(null)

				const res = await capturePayment(data.orderID)
				if (res.error !== null && res.error !== undefined && res.error !== '') {
					throw new Error(res.error)
				}

				setSuccessMessage('Payment captured successfully!')
				console.info('Payment captured:', res)

				// Handle successful purchase
				await handleSuccessfulPurchase(data.orderID, bib.id)
				router.push(`/${locale}/purchase/success`)
			} catch (error: unknown) {
				const errorMsg = 'Error capturing payment: ' + (error instanceof Error ? error.message : 'Unknown error')
				console.error('Capture error:', error instanceof Error ? error.message : 'Unknown error')
				setErrorMessage(errorMsg)
			} finally {
				setLoading(false)
			}
		},
		[bib.id, locale, router]
	)

	const onError = useCallback((err: Record<string, unknown>) => {
		console.error('PayPal Error:', err)
		const message = typeof err.message === 'string' ? err.message : 'An unknown error occurred'
		setErrorMessage('PayPal Error: ' + message)
		setLoading(false)
	}, [])

	const onCancel = useCallback(() => {
		console.info('PayPal payment cancelled')
		setErrorMessage('Payment cancelled by user')
		setLoading(false)
	}, [])

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

	// Filter other bibs for the same event (excluding current bib)
	const samEventBibs = otherBibs.filter(otherBib => otherBib.event.id === bib.event.id && otherBib.id !== bib.id)

	return (
		<div className="from-background via-primary/5 to-background relative bg-gradient-to-br">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

			<div className="relative pt-12 pb-12">
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
									Sold by {bib.user.firstName ?? 'Anonymous'} {bib.user.lastName ?? ''}
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
							{!isProfileComplete && isSignedIn === true && (
								<Alert className="mb-4" variant="destructive">
									<AlertTriangle className="h-4 w-4" />
									<AlertTitle>Profile Incomplete</AlertTitle>
									<AlertDescription>
										Please complete your runner profile before purchasing a bib.{' '}
										<Link className="text-destructive-foreground font-bold" href={`/${locale}/profile`}>
											Complete Profile
										</Link>
									</AlertDescription>
								</Alert>
							)}
							<Button
								className="flex items-center justify-center gap-2 text-lg font-medium"
								disabled={!isProfileComplete && isSignedIn === true}
								onClick={handleBuyNowClick}
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

					{/* Other Bibs Section */}
					{samEventBibs.length > 0 && (
						<div className="mt-12">
							<div className="mb-6 text-center">
								<h2 className="text-foreground text-2xl font-bold tracking-tight">See other bibs for this event</h2>
								<p className="text-muted-foreground mt-1">More bibs available for {bib.event.name}</p>
							</div>

							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{samEventBibs.map(otherBib => (
									<CardMarket bibSale={otherBib} key={otherBib.id} locale={locale} />
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			<SlidingPanel
				className="z-[100]"
				isOpen={isPanelOpen}
				onClose={() => setIsPanelOpen(false)}
				title="Secure Payment with PayPal"
				variant="slide"
			>
				<div className="container mx-auto p-6">
					<div className="flex gap-6">
						<div className="flex flex-col gap-6 lg:w-2/3">
							{/* Event Summary Card */}
							<div className="bg-muted/30 border-border/20 rounded-lg border p-6">
								<div className="flex items-start gap-4">
									<div className="relative h-16 w-16 overflow-hidden rounded-lg">
										<Image alt="Event Image" className="object-cover" fill sizes="64px" src={bib.event.image} />
									</div>
									<div className="flex-1">
										<h3 className="font-semibold">{bib.event.name}</h3>
										<p className="text-muted-foreground text-sm">{formatDateWithLocale(bib.event.date, locale)}</p>
										<p className="text-muted-foreground text-sm">{bib.event.location}</p>
									</div>
									<div className="text-right">
										<p className="text-lg font-bold">{bib.price}€</p>
										{Boolean(bib.originalPrice && bib.originalPrice > bib.price) && (
											<p className="text-muted-foreground text-sm line-through">{bib.originalPrice}€</p>
										)}
									</div>
								</div>
							</div>

							{/* Order Summary */}
							<div className="bg-muted/30 border-border/20 rounded-lg border p-4">
								<h3 className="text-muted-foreground mb-3 text-sm font-medium">Order Summary</h3>
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-sm">Race bib</span>
										<span className="text-sm">{bib.price}€</span>
									</div>
									{Boolean(bib.originalPrice && bib.originalPrice > bib.price) && (
										<div className="flex items-center justify-between text-green-600">
											<span className="text-sm">Discount</span>
											<span className="text-sm">-{(bib.originalPrice - bib.price).toFixed(2)}€</span>
										</div>
									)}
									<div className="border-border/20 border-t pt-2">
										<div className="flex items-center justify-between font-semibold">
											<span>Total</span>
											<span>{bib.price}€</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* PayPal Payment Section */}
						<div className="space-y-6 lg:w-1/3">
							<div>
								<h3 className="text-muted-foreground mb-3 text-sm font-medium">Payment Method</h3>
								<div className="bg-background border-border/20 rounded-lg border p-4">
									{/* Error Messages */}
									{Boolean(errorMessage) && (
										<div className="bg-destructive/10 text-destructive border-destructive/20 mb-4 rounded-lg border p-3 text-sm">
											{errorMessage}
										</div>
									)}

									{/* Success Messages */}
									{Boolean(successMessage) && (
										<div className="mb-4 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-600">
											{successMessage}
										</div>
									)}

									<PayPalButtons
										createOrder={handleCreateOrder}
										disabled={loading || !isProfileComplete}
										onApprove={onApprove}
										onCancel={onCancel}
										onError={onError}
										style={{
											shape: 'rect' as const,
											layout: 'vertical' as const,
											label: 'paypal' as const,
											height: 50,
											color: 'blue' as const,
										}}
									/>
								</div>
							</div>

							{/* Enhanced Trust indicators */}
							<div className="space-y-4">
								<div className="border-border/20 border-t pt-4">
									<div className="text-muted-foreground flex items-center justify-center gap-6 text-xs">
										<div className="flex items-center gap-1">
											<svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
												<path
													clipRule="evenodd"
													d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
													fillRule="evenodd"
												/>
											</svg>
											256-bit SSL
										</div>
										<div className="flex items-center gap-1">
											<svg className="h-3 w-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
												<path
													clipRule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
													fillRule="evenodd"
												/>
											</svg>
											PayPal Secured
										</div>
										<div className="flex items-center gap-1">
											<svg className="h-3 w-3 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
												<path
													clipRule="evenodd"
													d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
													fillRule="evenodd"
												/>
											</svg>
											PCI Compliant
										</div>
									</div>
								</div>

								{/* Additional Trust Elements */}
								<div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
									<div className="flex items-start gap-3">
										<svg
											className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												clipRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												fillRule="evenodd"
											/>
										</svg>
										<div className="text-sm">
											<p className="font-medium text-green-800 dark:text-green-300">100% Secure Transaction</p>
											<p className="mt-1 text-green-700 dark:text-green-400">
												Your payment is processed securely through PayPal's trusted platform. We never store your
												payment details.
											</p>
										</div>
									</div>
								</div>

								<div className="space-y-2 text-center">
									<p className="text-muted-foreground text-xs">Trusted by thousands of athletes worldwide</p>
									<div className="text-muted-foreground flex items-center justify-center gap-4 text-xs">
										<span>🔒 Bank-level encryption</span>
										<span>⚡ Instant confirmation</span>
										<span>🛡️ Fraud protection</span>
									</div>
									<p className="text-muted-foreground text-xs">Questions? Contact our support team at any time</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</SlidingPanel>
		</div>
	)
}
