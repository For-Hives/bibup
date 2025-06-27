'use client'

import type { Event } from '@/models/event.model'

import { Calendar } from '@/components/ui/calendar'

interface CalendarSidebarProps {
	events: Event[]
	onDateSelect: (date: Date | undefined) => void
	selectedDate: Date
}

export function CalendarSidebar(props: Readonly<CalendarSidebarProps>) {
	const { selectedDate, onDateSelect, events } = props

	const currentYear = new Date().getFullYear()
	const year = selectedDate.getFullYear()
	const month = selectedDate.getMonth()
	const day = selectedDate.getDate()

	const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)
	const months = Array.from({ length: 12 }, (_, i) => i)
	const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate()
	const days = Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1)

	const handleChange = (newYear: number, newMonth: number, newDay: number) => {
		const maxDay = getDaysInMonth(newYear, newMonth)
		const safeDay = Math.min(newDay, maxDay)
		const newDate = new Date(newYear, newMonth, safeDay)
		onDateSelect(newDate)
	}

	return (
		<div className="bg-muted/10 flex w-80 flex-col border-r p-4">
			<div className="relative mb-4 flex gap-2">
				<select
					className="rounded border p-1 text-sm"
					onChange={e => handleChange(Number(e.target.value), month, day)}
					value={year}
				>
					{years.map(y => (
						<option key={y} value={y}>
							{y}
						</option>
					))}
				</select>
				<select
					className="rounded border p-1 text-sm"
					onChange={e => handleChange(year, Number(e.target.value), day)}
					value={month}
				>
					{months.map(m => (
						<option key={m} value={m}>
							{new Date(0, m).toLocaleString('default', { month: 'short' })}
						</option>
					))}
				</select>
				<select
					className="rounded border p-1 text-sm"
					onChange={e => handleChange(year, month, Number(e.target.value))}
					value={day}
				>
					{days.map(d => (
						<option key={d} value={d}>
							{d}
						</option>
					))}
				</select>
			</div>

			<Calendar
				classNames={{ root: 'w-full' }}
				events={events}
				mode="single"
				onSelect={onDateSelect}
				selected={selectedDate}
			/>
		</div>
	)
}
