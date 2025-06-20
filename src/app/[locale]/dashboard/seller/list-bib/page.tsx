import type { Metadata } from 'next'

import { generateLocaleParams, LocaleParams } from '@/lib/generateStaticParams'
import { fetchPartneredApprovedEvents } from '@/services/event.services'
import { getTranslations } from '@/lib/getDictionary'

import ListNewBibClientPage from './client'
import translations from './locales.json'

export async function generateMetadata({ params }: { params: Promise<LocaleParams> }): Promise<Metadata> {
	const { locale } = await params
	const t = getTranslations(locale, translations)

	return {
		title: t.metadataTitle,
		description: t.metadataDescription,
	}
}

// Generate static params for all locales
export function generateStaticParams() {
	return generateLocaleParams()
}

export default async function ListNewBibServerWrapper({ params }: { params: Promise<LocaleParams> }) {
	const { locale } = await params
	const t = getTranslations(locale, translations)

	const partneredEvents = await fetchPartneredApprovedEvents()

	return <ListNewBibClientPage partneredEvents={partneredEvents} translations={t} />
}
