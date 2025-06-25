import type { Metadata } from 'next'

import { faker } from '@faker-js/faker'

import type { BibSale } from '@/components/marketplace/CardMarket'

import { generateLocaleParams, type LocaleParams } from '@/lib/generateStaticParams'
import MarketplaceClient from '@/components/marketplace/MarketplaceClient'
import { getTranslations } from '@/lib/getDictionary'
import { generateFakeBibSales } from '@/lib/utils'

import marketplaceTranslations from './locales.json'

// Metadata for the page (SEO, title, description)
export const metadata: Metadata = {
	title: 'Marketplace | Beswib',
	description: 'Browse and buy race bibs from our marketplace.',
}

// Generate a variable number of fake bibs between 12 and 20 with distributed colors
const mockBibs: BibSale[] = generateFakeBibSales(faker.number.int({ min: 12, max: 20 }))

// Generate static params for all locales
export function generateStaticParams() {
	return generateLocaleParams()
}

// Main server component for the marketplace page
export default async function MarketplacePage({ params }: { params: Promise<LocaleParams> }) {
	// Get the current locale (for translations)
	const { locale } = await params
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
			<MarketplaceClient bibs={mockBibs} locale={locale} />
		</div>
	)
}

// Marketplace page: server component
// Loads translations, mock data, and renders the MarketplaceClient
