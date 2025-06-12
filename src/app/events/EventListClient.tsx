'use client'

import { useEffect, useState } from 'react'

import { toast } from 'sonner'

import type { Event } from '@/models/event.model'

import { getTranslations } from '@/lib/getDictionary'

import eventsTranslations from './locales.json'

type Translations = ReturnType<typeof getTranslations<(typeof eventsTranslations)['en'], 'en'>>

export default function EventListClient({
	translations: t,
	prefetchedEvents,
	error,
}: {
	error?: null | string
	prefetchedEvents: Event[]
	translations: Translations
}) {
	const [events] = useState<Event[]>(prefetchedEvents ?? [])

	useEffect(() => {
		if (error != null) {
			toast.error(error)
		}
	}, [error])

	if (events.length === 0 && error == null) {
		return <p>{t.events.noEventsToDisplay}</p>
	}

	if (events.length === 0 && error != null) {
		return <p>{t.GLOBAL.errors.unexpected}</p>
	}

	return (
		<div className="mt-8">
			<h2 className="mb-4 text-center text-2xl font-bold sm:text-left">{t.events.eventListTitleClient}</h2>
			<ul>
				{events.map(event => (
					<li
						className="mb-2 text-center font-[family-name:var(--font-geist-mono)] text-sm/6 font-semibold sm:text-left"
						key={event.id}
					>
						<a className="cursor-pointer underline hover:text-blue-600" href={`/events/${event.id}`}>
							{event.name}
						</a>
						<p className="text-xs text-gray-600">
							{event.location} - {new Date(event.date).toLocaleDateString()}
						</p>
					</li>
				))}
			</ul>
		</div>
	)
}
