'use client'

import { useEffect, useState } from 'react'

import { toast } from 'sonner'
import Link from 'next/link'

import type { Event } from '@/models/event.model'

import { getTranslations } from '@/lib/getDictionary'
import { type Locale } from '@/lib/i18n-config'

import eventsTranslations from './locales.json'

export default function EventListClient({
	prefetchedEvents,
	locale,
	error,
}: {
	error?: null | string
	locale: Locale
	prefetchedEvents: Event[]
}) {
	const [events] = useState<Event[]>(prefetchedEvents ?? [])

	const t = getTranslations(locale, eventsTranslations)

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
						<Link className="cursor-pointer underline hover:text-blue-600" href={`/events/${event.id}`}>
							{event.name}
						</Link>
						<p className="text-xs text-gray-600">
							{event.location} - {new Date(event.eventDate).toLocaleDateString()}
						</p>
					</li>
				))}
			</ul>
		</div>
	)
}
