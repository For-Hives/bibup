/* eslint-disable perfectionist/sort-imports, perfectionist/sort-objects */
import type { Metadata } from 'next'

import React from 'react'

import { BibSale } from '@/components/marketplace/CardMarket'
import PurchaseClient from '@/components/marketplace/purchase/PurchaseClient'
import { StripeProvider } from '@/components/marketplace/purchase/StripeProvider'
import { Locale } from '@/lib/i18n-config'
import { fetchBibById, fetchPrivateBibByToken } from '@/services/bib.services'

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

	// Function to map event types
	const mapEventType = (typeCourse: string): 'cycling' | 'other' | 'running' | 'swimming' | 'trail' | 'triathlon' => {
		switch (typeCourse) {
			case 'route':
				return 'running'
			case 'trail':
				return 'trail'
			case 'triathlon':
				return 'triathlon'
			case 'ultra':
				return 'trail'
			default:
				return 'other'
		}
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
		event: {
			date: bib.expand.eventId.eventDate,
			distance: bib.expand.eventId.distanceKm ?? 0,
			distanceUnit: 'km' as const,
			id: bib.expand.eventId.id,
			image: '/beswib.svg',
			location: bib.expand.eventId.location,
			name: bib.expand.eventId.name,
			participantCount: bib.expand.eventId.participants ?? 0,
			type: mapEventType(bib.expand.eventId.typeCourse),
		},
		id: bib.id,
		originalPrice: bib.originalPrice ?? 0,
		price: bib.price,
		status: mapStatus(bib.status),
		user: {
			firstName: 'Seller',
			id: bib.sellerUserId,
			lastName: '',
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
	return data.clientSecret
}
