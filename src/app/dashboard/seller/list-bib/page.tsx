import type { Metadata } from 'next'

import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import { fetchPartneredApprovedEvents } from '@/services/event.services'

import ListNewBibClientPage from './client'
import translations from './locales.json'

export async function generateMetadata(): Promise<Metadata> {
	const locale = await getLocale()
	const t = getTranslations(locale, translations)

	return {
		description: t.metadataDescription,
		title: t.metadataTitle,
	}
}

export default async function ListNewBibServerWrapper() {
	const locale = await getLocale()
	const t = getTranslations(locale, translations)

	const partneredEvents = await fetchPartneredApprovedEvents()

	return <ListNewBibClientPage partneredEvents={partneredEvents} translations={t} />
}
