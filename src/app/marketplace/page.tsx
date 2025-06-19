import type { Metadata } from 'next'

import type { BibSale } from '@/components/marketplace/card-market'

import MarketplaceClient from '@/components/marketplace/MarketplaceClient'
import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import marketplaceTranslations from './locales.json'

// Metadata for the page (SEO, title, description)
export const metadata: Metadata = {
	title: 'Marketplace | Beswib',
	description: 'Browse and buy race bibs from our marketplace.',
}

// Mock data for race bibs (matches BibSale interface)
const mockBibs: BibSale[] = [
	{
		user: {
			lastName: 'Martin',
			id: 'u1',
			firstName: 'Alice',
		},
		status: 'available',
		price: 80,
		originalPrice: 120,
		id: '1',
		event: {
			type: 'running',
			participantCount: 50000,
			name: 'Paris Marathon',
			location: 'Paris',
			id: 'e1',
			distanceUnit: 'km',
			distance: 42.195,
			date: new Date('2024-04-07'),
		},
	},
	{
		user: {
			lastName: 'Dupont',
			id: 'u2',
			firstName: 'Bob',
		},
		status: 'available',
		price: 250,
		originalPrice: 150,
		id: '2',
		event: {
			type: 'triathlon',
			participantCount: 2000,
			name: 'Nice Triathlon',
			location: 'Nice',
			id: 'e2',
			distanceUnit: 'km',
			distance: 51.5,
			date: new Date('2024-06-15'),
		},
	},
	{
		user: {
			lastName: 'Durand',
			id: 'u3',
			firstName: 'Claire',
		},
		status: 'sold',
		price: 140,
		originalPrice: 180,
		id: '3',
		event: {
			type: 'trail',
			participantCount: 1500,
			name: 'Mont Blanc Trail',
			location: 'Chamonix',
			id: 'e3',
			distanceUnit: 'km',
			distance: 80,
			date: new Date('2024-08-20'),
		},
	},
]

// Main server component for the marketplace page
export default async function MarketplacePage() {
	// Get the current locale (for translations)
	const locale = await getLocale()
	// Get translation function for the current locale
	const t = getTranslations(locale, marketplaceTranslations)

	return (
		<div className="mx-auto max-w-7xl p-5 font-sans">
			{/* Page header with title and description */}
			<header className="mb-8 text-center">
				<h1 className="text-3xl font-bold">{t.title}</h1>
				<p className="text-lg text-gray-600">{t.description}</p>
			</header>

			{/* Client component that handles filtering, sorting, and displaying bibs */}
			<MarketplaceClient bibs={mockBibs} />
		</div>
	)
}

// Marketplace page: server component
// Loads translations, mock data, and renders the MarketplaceClient
