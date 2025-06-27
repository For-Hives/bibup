import type { Metadata } from 'next'

import React from 'react'

import { StripeProvider } from '@/components/marketplace/purchase/StripeProvider'
import { fetchBibById, fetchPrivateBibByToken } from '@/services/bib.services'
import PurchaseClient from '@/components/marketplace/purchase/PurchaseClient'
import { mapEventTypeToBibSaleType } from '@/lib/bibTransformers'
import { createPaymentIntent } from '@/services/stripe.services'
import { BibSale } from '@/components/marketplace/CardMarket'
import { Event as EventModel } from '@/models/event.model'
import { Locale } from '@/lib/i18n-config'
import { User } from '@/models/user.model'
import { Bib } from '@/models/bib.model'

export const metadata: Metadata = {
	title: 'Purchase Bib',
	description: 'Complete your purchase.',
}

interface MarketplaceItemPageProps {
	params: Promise<{
		id: string
		locale: Locale
	}>
	searchParams: Promise<{
		tkn?: string
	}>
}

export default async function MarketplaceItemPage({ searchParams, params }: MarketplaceItemPageProps) {
	const { locale, id } = await params
	const { tkn } = await searchParams
	let bib: (Bib & { expand?: { eventId: EventModel; sellerId: User } }) | null

	if (tkn != null) {
		bib = await fetchPrivateBibByToken(id, tkn)
	} else {
		bib = await fetchBibById(id)
	}

	if (!bib || !bib.expand?.eventId) {
		return <div>Bib not found or event data missing</div>
	}

	// Function to map status
	const mapStatus = (status: string): 'available' | 'sold' => {
		switch (status) {
			case 'available':
				return 'available'
			case 'sold':
				return 'sold'
			default:
				return 'available' // default to available for other statuses
		}
	}

	const bibSale: BibSale = {
		user: {
			lastName: bib.expand.sellerId.lastName ?? 'Unknown',
			id: bib.sellerUserId,
			firstName: bib.expand.sellerId.firstName ?? 'Unknown',
		},
		status: mapStatus(bib.status),
		price: bib.price,
		originalPrice: bib.originalPrice ?? 0,
		id: bib.id,
		event: {
			type: mapEventTypeToBibSaleType(bib.expand.eventId.typeCourse),
			participantCount: bib.expand.eventId.participants ?? 0,
			name: bib.expand.eventId.name,
			location: bib.expand.eventId.location,
			image: '/beswib.svg',
			id: bib.expand.eventId.id,
			distanceUnit: 'km' as const,
			distance: bib.expand.eventId.distanceKm ?? 0,
			date: bib.expand.eventId.eventDate,
		},
	} satisfies BibSale

	const paymentIntent = await createPaymentIntent(id)

	return (
		<div className="container mx-auto px-4 py-8">
			<StripeProvider clientSecret={paymentIntent}>
				<PurchaseClient bib={bibSale} locale={locale} paymentIntent={paymentIntent} />
			</StripeProvider>
		</div>
	)
}
