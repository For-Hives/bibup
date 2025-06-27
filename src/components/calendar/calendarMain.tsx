'use client'

import type { Event } from '@/models/event.model'

import { MonthView } from './monthView'
import { WeekView } from './weekView'
import { YearView } from './yearView'
import { DayView } from './dayView'

interface CalendarMainProps {
	events: Event[]
	onDateSelect: (date: Date) => void
	onEventSelect: (event: Event) => void
	selectedDate: Date
	viewMode: ViewMode
}

// Déclaration locale du type ViewMode (day, month, week, year)
type ViewMode = 'day' | 'month' | 'week' | 'year'

export function CalendarMain(props: Readonly<CalendarMainProps>) {
	const { viewMode, selectedDate, onEventSelect, onDateSelect, events } = props

	const getEventsForDate = (date: Date): Event[] => {
		return events.filter(event => {
			return new Date(event.eventDate).toDateString() === date.toDateString()
		})
	}

	const commonProps = {
		selectedDate,
		onEventSelect,
		onDateSelect,
		getEventsForDate,
		events,
	}

	return (
		<div className="flex-1 overflow-auto">
			{viewMode === 'day' && <DayView {...commonProps} />}
			{viewMode === 'week' && <WeekView {...commonProps} />}
			{viewMode === 'month' && <MonthView {...commonProps} />}
			{viewMode === 'year' && <YearView {...commonProps} />}
		</div>
	)
}
