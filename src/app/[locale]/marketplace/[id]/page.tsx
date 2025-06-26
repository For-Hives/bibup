import type { Metadata } from 'next'

import React from 'react'

import { StripeProvider } from '@/components/marketplace/purchase/StripeProvider'
import { fetchBibById, fetchPrivateBibByToken } from '@/services/bib.services'
import PurchaseClient from '@/components/marketplace/purchase/PurchaseClient'
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

export default async function MarketplaceItemPage({ searchParams, params: { locale, id } }: MarketplaceItemPageProps) {
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
		user: { lastName: '', id: bib.sellerUserId, firstName: 'Seller' }, // Placeholder for user data
		event: {
			type: bib.expand.eventId.typeCourse, // Corrected mapping
			participantCount: bib.expand.eventId.participants || 0,
			name: bib.expand.eventId.name,
			location: bib.expand.eventId.location,
			image: '/beswib.svg', // Placeholder, replace with actual image logic
			id: bib.expand.eventId.id,
			distanceUnit: 'km', // Placeholder, adjust if you have this data
			distance: bib.expand.eventId.distanceKm || 0, // Assuming distanceKm is the correct field
			date: bib.expand.eventId.eventDate,
		},
	}

	const clientSecret = await getClientSecret(id)

	return (
		<div className="container mx-auto px-4 py-8">
			<StripeProvider clientSecret={clientSecret}>
				<PurchaseClient bib={bibSale} clientSecret={clientSecret} locale={locale} />
			</StripeProvider>
		</div>
	)
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
