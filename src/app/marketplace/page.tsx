import type { Metadata } from 'next'

import Searchbar from '@/components/marketplace/searchbar'
import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import marketplaceTranslations from './locales.json'

export const metadata: Metadata = {
	title: 'Marketplace | Beswib',
	description: 'Browse and buy race bibs from our marketplace.',
}

export default async function MarketplacePage() {
	const locale = await getLocale()
	const t = getTranslations(locale, marketplaceTranslations)

	return (
		<div className="mx-auto max-w-7xl p-5 font-sans">
			<header className="mb-8 text-center">
				<h1 className="text-3xl font-bold">{t.title}</h1>
				<p className="text-lg text-gray-600">{t.description}</p>
			</header>

			<main>
				<p className="text-center text-lg">{t.comingSoon}</p>
			</main>

			<Searchbar />
		</div>
	)
}
