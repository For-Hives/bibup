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
	}

	return (
		<div style={{ padding: '20px' }}>
			<main style={{ maxWidth: '800px', margin: '0 auto' }}>
				<h1 style={{ marginBottom: '20px', textAlign: 'center', fontSize: '2em' }}>{t.events.title}</h1>
				<p style={{ marginBottom: '30px', textAlign: 'center', color: '#666' }}>{t.events.description}</p>
				<EventListClient error={error} prefetchedEvents={events} translations={t} />
			</main>
		</div>
	)
}
