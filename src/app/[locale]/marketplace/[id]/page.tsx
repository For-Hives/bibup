import React from 'react'

import type { Metadata } from 'next'
import { StripeProvider } from '@/components/marketplace/purchase/StripeProvider'
import PurchaseClient from '@/components/marketplace/purchase/PurchaseClient'
import { fetchBibById, fetchPrivateBibByToken } from '@/services/bib.services'
import { Locale } from '@/lib/i18n-config'

export const metadata: Metadata = {
	title: 'Purchase Bib',
	description: 'Complete your purchase.',
}

interface MarketplaceItemPageProps {
	params: {
		id: string
		locale: Locale
	}
	searchParams: {
		tkn?: string
	}
}

async function getClientSecret(bibId: string) {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/payment-intent`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ bibId }),
	})
	const { clientSecret } = await response.json()
	return clientSecret
}

export default async function MarketplaceItemPage({ params: { id, locale }, searchParams }: MarketplaceItemPageProps) {
	const { tkn } = searchParams
	let bib

	if (tkn) {
		bib = await fetchPrivateBibByToken(id, tkn)
	} else {
		bib = await fetchBibById(id)
	}

	if (!bib || !bib.expand?.eventId) {
		return <div>Bib not found or event data missing</div>
	}

	const bibSale = {
		...bib,
		event: {
			date: bib.expand.eventId.eventDate,
			distance: bib.expand.eventId.distanceKm || 0, // Assuming distanceKm is the correct field
			distanceUnit: 'km', // Placeholder, adjust if you have this data
			id: bib.expand.eventId.id,
			image: '/beswib.svg', // Placeholder, replace with actual image logic
			location: bib.expand.eventId.location,
			name: bib.expand.eventId.name,
			participantCount: bib.expand.eventId.participants || 0,
			type: bib.expand.eventId.typeCourse, // Corrected mapping
		},
		user: { firstName: 'Seller', lastName: '', id: bib.sellerUserId }, // Placeholder for user data
	}

	const clientSecret = await getClientSecret(id)

	return (
		<div className="container mx-auto px-4 py-8">
			<StripeProvider clientSecret={clientSecret}>
				<PurchaseClient bib={bibSale} locale={locale} clientSecret={clientSecret} />
			</StripeProvider>
		</div>
	)
}
