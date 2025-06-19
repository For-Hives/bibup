import type { Metadata } from 'next'

import { faker } from '@faker-js/faker'

import type { BibSale } from '@/components/marketplace/CardMarket'

import MarketplaceClient from '@/components/marketplace/MarketplaceClient'
import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import marketplaceTranslations from './locales.json'

// Metadata for the page (SEO, title, description)
export const metadata: Metadata = {
	title: 'Marketplace | Beswib',
	description: 'Browse and buy race bibs from our marketplace.',
}

// Génère un BibSale aléatoire
function generateRandomBibSale(): BibSale {
	const sports = ['running', 'trail', 'triathlon', 'cycling', 'swimming', 'other'] as const
	const type = faker.helpers.arrayElement(sports)
	const distance = faker.helpers.arrayElement([5, 10, 21, 42, 80, 51.5, 180])
	const distanceUnit = 'km'
	const price = faker.number.int({ min: 20, max: 300 })
	const originalPrice = price + faker.number.int({ min: 10, max: 100 })
	return {
		user: {
			lastName: faker.person.lastName(),
			id: faker.string.uuid(),
			firstName: faker.person.firstName(),
		},
		status: faker.helpers.arrayElement(['available', 'sold']),
		price,
		originalPrice,
		id: faker.string.uuid(),
		event: {
			type,
			participantCount: faker.number.int({ min: 100, max: 50000 }),
			name: faker.company.name() + ' ' + faker.word.noun(),
			location: faker.location.city(),
			image: faker.image.url(),
			id: faker.string.uuid(),
			distanceUnit,
			distance,
			date: faker.date.soon({ days: 365 }),
		},
	}
}

// Génère un lot de 10 à 15 dossards
const mockBibs: BibSale[] = Array.from({ length: faker.number.int({ min: 10, max: 15 }) }, generateRandomBibSale)

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
