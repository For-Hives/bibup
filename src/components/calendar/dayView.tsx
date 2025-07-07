'use client'

import type { Event } from '@/models/event.model'

interface DayViewProps {
	getEventsForDate: (date: Date) => Event[]
	onEventSelect: (event: Event) => void
	selectedDate: Date
}

export function DayView(props: Readonly<DayViewProps>) {
	const { selectedDate, onEventSelect, getEventsForDate } = props
	const dayEvents = getEventsForDate(selectedDate)
	const hours = Array.from({ length: 24 }, (_, i) => i)

	function formatHour(hour: number): string {
		if (hour === 0) return '12 AM'
		if (hour < 12) return `${hour} AM`
		if (hour === 12) return '12 PM'
		return `${hour - 12} PM`
	}

	const getEventHour = (event: Event): number => {
		return event.eventDate.getHours()
	}

	return (
		<div className="p-4">
			<div className="rounded-4xl overflow-hidden border">
				<div className="max-h-[80vh] overflow-y-auto grid grid-cols-[60px_1fr] gap-0 calendar-scroll">
					{hours.map(hour => (
						<div className="contents" key={hour}>
							<div className="text-muted-foreground border-r border-b p-2 text-right text-xs">{formatHour(hour)}</div>
							<div className="relative min-h-[60px] border-b p-2">
								{dayEvents
									.filter(event => getEventHour(event) === hour)
									.map(event => (
										<button
											className="mb-1 w-full cursor-pointer rounded bg-blue-500 p-2 text-xs text-white transition-colors hover:bg-blue-600"
											key={event.id}
											onClick={() => onEventSelect(event)}
											type="button"
										>
											<div className="font-medium">{event.name}</div>
											<div className="opacity-90">{event.typeCourse.toUpperCase()}</div>
											<div className="opacity-90">{event.distanceKm}km</div>
											<div className="opacity-90">{event.location}</div>
										</button>
									))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
