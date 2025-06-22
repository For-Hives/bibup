import type { Metadata } from 'next'

import type { Organizer } from '@/models/organizer.model'
import type { Event } from '@/models/event.model'

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

	// Safely fetch partnered events with error handling
	let partneredEvents: (Event & { expand?: { organizer?: Organizer } })[] = []
	try {
		partneredEvents = await fetchPartneredApprovedEvents()
		// Ensure we always have an array
		if (!Array.isArray(partneredEvents)) {
			partneredEvents = []
		}
	} catch (error) {
		console.error('Failed to fetch partnered events:', error)
		// Fallback to empty array if fetch fails
		partneredEvents = []
	}

	return <ListNewBibClientPage partneredEvents={partneredEvents} translations={t} />
}
