'use client'

import type { Event } from '@/models/event.model'

import { useEffect, useState } from 'react'

import { toast } from 'sonner'

// This client component now primarily just displays the events passed to it.
// It could be used for client-side filtering/sorting in the future if needed.
export default function EventListClient({
	prefetchedEvents,
	translations: t,
	error,
}: {
	error?: null | string
	prefetchedEvents: Event[]
	translations: {
		description: string
		eventCard: {
			bibsAvailable: string
			soldOut: string
			viewDetails: string
		}
		eventListTitleClient: string
		filters: {
			all: string
			category: string
			date: string
			location: string
		}
		loading: string
		noEvents: string // Note: This was the original key for "No events available"
		// Keys specifically used by this component
		noEventsToDisplay: string
		searchPlaceholder: string
		// Properties from src/app/events/locales.json "en.events"
		title: string
	}
}) {
	const [events] = useState<Event[]>(prefetchedEvents ?? [])

	useEffect(() => {
		if (error) {
			toast.error(error)
		}
	}, [error])

	if (events.length === 0 && !error) {
		return <p>{t.noEventsToDisplay}</p>
	}

	// Optionally, display a specific message if there's an error and no events
	if (events.length === 0 && error) {
		return <p>Could not load events. An error occurred.</p> // Or use a translation
	}

	return (
		<div className="mt-8">
			<h2 className="mb-4 text-center text-2xl font-bold sm:text-left">{t.eventListTitleClient}</h2>
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
