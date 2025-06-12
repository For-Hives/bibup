import type { Event } from '@/models/event.model'

import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import { fetchApprovedPublicEvents } from '@/services/event.services'

import EventListClient from './EventListClient'
import eventsTranslations from './locales.json'

export default async function EventsPage() {
	const locale = await getLocale()
	const t = getTranslations(locale, eventsTranslations)

	let events: Event[] = []
	let error: null | string = null

	try {
		events = await fetchApprovedPublicEvents()
	} catch (e: unknown) {
		error = e instanceof Error ? e.message : String(e)
		console.error('Error fetching events:', error)
	}

	return (
		<div className="p-5">
			<main className="mx-auto max-w-3xl">
				<h1 className="mb-5 text-center text-3xl">{t.events.title}</h1>
				<p className="mb-8 text-center text-gray-500">{t.events.description}</p>
				<EventListClient error={error} prefetchedEvents={events} translations={t} />
			</main>
		</div>
	)
}
