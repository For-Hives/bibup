import type { Metadata } from 'next'

import { fetchPartneredApprovedEvents } from '@/services/event.services'
import { LocaleParams } from '@/lib/generateStaticParams'
import { getTranslations } from '@/lib/getDictionary'

import ListNewBibClientPage from './client'
import translations from './locales.json'

// Force dynamic rendering for dashboard routes
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<LocaleParams> }): Promise<Metadata> {
	const { locale } = await params
	const t = getTranslations(locale, translations)

	return {
		title: t.metadataTitle,
		description: t.metadataDescription,
	}
}

export default async function ListNewBibServerWrapper({ params }: { params: Promise<LocaleParams> }) {
	const { locale } = await params
	const t = getTranslations(locale, translations)

	const partneredEvents = await fetchPartneredApprovedEvents()

	return <ListNewBibClientPage partneredEvents={partneredEvents} translations={t} />
}
