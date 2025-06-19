import type { Metadata } from 'next'

import type { BibSale } from '@/components/marketplace/card-market'
import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'
import MarketplaceClient from '@/components/marketplace/MarketplaceClient'

import marketplaceTranslations from './locales.json'

// Metadata for the page (SEO, title, description)
export const metadata: Metadata = {
	title: 'Marketplace | Beswib',
	description: 'Browse and buy race bibs from our marketplace.',
}

// Mock data for race bibs (matches BibSale interface)
const mockBibs: BibSale[] = [
	{
		id: '1',
		event: {
			id: 'e1',
			name: 'Paris Marathon',
			date: new Date('2024-04-07'),
			distance: 42.195,
			distanceUnit: 'km',
			location: 'Paris',
			participantCount: 50000,
			type: 'running',
		},
		originalPrice: 120,
		price: 80,
		status: 'available',
		user: {
			id: 'u1',
			firstName: 'Alice',
			lastName: 'Martin',
		},
	},
	{
		id: '2',
		event: {
			id: 'e2',
			name: 'Nice Triathlon',
			date: new Date('2024-06-15'),
			distance: 51.5,
			distanceUnit: 'km',
			location: 'Nice',
			participantCount: 2000,
			type: 'triathlon',
		},
		originalPrice: 150,
		price: 250,
		status: 'available',
		user: {
			id: 'u2',
			firstName: 'Bob',
			lastName: 'Dupont',
		},
	},
	{
		id: '3',
		event: {
			id: 'e3',
			name: 'Mont Blanc Trail',
			date: new Date('2024-08-20'),
			distance: 80,
			distanceUnit: 'km',
			location: 'Chamonix',
			participantCount: 1500,
			type: 'trail',
		},
		originalPrice: 180,
		price: 140,
		status: 'sold',
		user: {
			id: 'u3',
			firstName: 'Claire',
			lastName: 'Durand',
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
