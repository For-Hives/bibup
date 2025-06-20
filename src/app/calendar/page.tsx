import type { Event } from '@/models/event.model'

import CalendarEventList from '@/components/calendar/CalendarEventList'
import { fetchApprovedPublicEvents } from '@/services/event.services'
import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import calendarTranslations from './locales.json'

interface GroupedEvents {
	[yearMonth: string]: Event[]
}

export default async function CalendarPage() {
	const locale = await getLocale()
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
				<h1 className="text-3xl font-bold">{t.calendar.title}</h1>
				<p className="text-lg text-gray-600">{t.calendar.description}</p>
			</header>

			<CalendarEventList groupedEvents={groupedEvents} sortedMonthKeys={sortedMonthKeys} t={t} />
		</div>
	)
}

// Optional: Metadata for the page
// import type { Metadata } from 'next'
// export const metadata: Metadata = {
//   title: 'Events Calendar | Beswib',
//   description: 'Browse upcoming race events by month.',
// }
