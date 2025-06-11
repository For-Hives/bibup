'use client'

import type { Event } from '@/models/event.model'

import { useEffect, useState } from 'react'

import { toast } from 'sonner'

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
		noEvents: string
		noEventsToDisplay: string
		searchPlaceholder: string
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

	if (events.length === 0 && error) {
		return <p>Could not load events. An error occurred.</p>
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
