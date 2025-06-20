import Link from 'next/link'

import type { Event } from '@/models/event.model' // Adjust path as necessary

import { generateLocaleParams, LocaleParams } from '@/lib/generateStaticParams'
import { fetchApprovedPublicEvents } from '@/services/event.services' // Adjust path as necessary
import { getTranslations } from '@/lib/getDictionary'

import calendarTranslations from './locales.json'

interface GroupedEvents {
	[yearMonth: string]: Event[]
}

export default async function CalendarPage({ params }: { params: Promise<LocaleParams> }) {
	const { locale } = await params
	const t = getTranslations(locale, calendarTranslations)

	const events: Event[] = await fetchApprovedPublicEvents()

	const groupedEvents = events.reduce((acc, event) => {
		const date = new Date(event.eventDate)
		const yearMonth = date.toLocaleString('default', {
			year: 'numeric',
			month: 'long',
		})
		acc[yearMonth] ??= []
		acc[yearMonth].push(event)
		return acc
	}, {} as GroupedEvents)

	// Sort month keys chronologically if necessary (object keys might not preserve order)
	const sortedMonthKeys = Object.keys(groupedEvents).sort((a, b) => {
		const dateA = new Date(`01 ${a}`) // e.g., "01 January 2024"
		const dateB = new Date(`01 ${b}`)
		return dateA.getTime() - dateB.getTime()
	})

	return (
		<div className="p-5 font-sans">
			<header className="mb-8 text-center">
				<h1>{t.calendar.title}</h1>
				<p>{t.calendar.description}</p>
			</header>

			<main className="mx-auto max-w-4xl">
				{sortedMonthKeys.length > 0 ? (
					sortedMonthKeys.map(monthKey => (
						<section className="mb-8" key={monthKey}>
							<h2 className="mb-5 border-b-2 border-gray-200 pb-2.5 text-2xl">{monthKey}</h2>
							<ul className="list-none p-0">
								{groupedEvents[monthKey].map(event => (
									<li className="mb-4 rounded-md border border-gray-300 bg-gray-100 p-2.5" key={event.id}>
										<Link className="text-lg font-bold text-blue-700 no-underline" href={`/events/${event.id}`}>
											{event.name}
										</Link>
										<p className="mt-1">
											<strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}
										</p>
										<p className="mt-1">
											<strong>Location:</strong> {event.location}
										</p>
										{event.description != null && event.description !== '' && (
											<p className="mt-1 text-sm text-gray-600">
												{event.description.substring(0, 100)}
												{event.description.length > 100 ? '...' : ''}
											</p>
										)}
									</li>
								))}
							</ul>
						</section>
					))
				) : (
					<p className="text-center text-lg">{t.calendar.noEvents}</p>
				)}
			</main>
		</div>
	)
}

// Generate static params for all locales
export function generateStaticParams() {
	return generateLocaleParams()
}
