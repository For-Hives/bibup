import type { Metadata } from 'next'

import React from 'react'

import { StripeProvider } from '@/components/marketplace/purchase/StripeProvider'
import { fetchBibById, fetchPrivateBibByToken } from '@/services/bib.services'
import PurchaseClient from '@/components/marketplace/purchase/PurchaseClient'
import { mapEventTypeToBibSaleType } from '@/lib/bibTransformers'
import { BibSale } from '@/components/marketplace/CardMarket'
import { Locale } from '@/lib/i18n-config'

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

	let bib

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
			lastName: '',
			id: bib.sellerUserId,
			firstName: 'Seller',
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

	const clientSecret = await getClientSecret(id)

	return (
		<div className="container mx-auto px-4 py-8">
			<StripeProvider clientSecret={clientSecret}>
				<PurchaseClient bib={bibSale} clientSecret={clientSecret} locale={locale} />
			</StripeProvider>
		</div>
	)
}

async function getClientSecret(bibId: string): Promise<string> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/payment-intent`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ bibId }),
	})

	if (!response.ok) {
		throw new Error('Failed to create payment intent')
	}

	const data = (await response.json()) as { clientSecret: string }

	console.info('Payment intent created successfully:', data.clientSecret)
	return data.clientSecret
}
