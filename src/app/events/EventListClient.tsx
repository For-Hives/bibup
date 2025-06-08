'use client'

import type { Event } from '@/models/event.model' // Updated model import

import { useState } from 'react'

// This client component now primarily just displays the events passed to it.
// It could be used for client-side filtering/sorting in the future if needed.
export default function EventListClient({ prefetchedEvents }: { prefetchedEvents: Event[] }) {
	const [events] = useState<Event[]>(prefetchedEvents ?? [])

	// The form for adding new events has been removed as it's more of an admin/organizer feature.
	// The useEffect for fetching has also been removed as data is primarily passed from server component.

	if (events.length === 0) {
		return <p>No events to display.</p>
	}

	return (
		<div className="mt-8">
			<h2 className="mb-4 text-center text-2xl font-bold sm:text-left">Event List (Client Component):</h2>
			<ul>
				{events.map(event => (
					<li
						className="mb-2 text-center font-[family-name:var(--font-geist-mono)] text-sm/6 font-semibold sm:text-left"
						key={event.id}
					>
						{/* Linking to the event detail page */}
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
