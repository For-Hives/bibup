'use client'

import type { Event } from '@/models/event.model'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
		<div className="bg-muted/10 flex w-80 flex-col items-center border-r p-4">
			<div className="relative mb-4 flex gap-2">
				<Select onValueChange={val => handleChange(Number(val), month, day)} value={String(year)}>
					<SelectTrigger className="w-[80px]">
						<SelectValue placeholder="Année" />
					</SelectTrigger>
					<SelectContent>
						{years.map(y => (
							<SelectItem
								className="hover:bg-foreground hover:text-background focus:bg-foreground focus:text-background"
								key={y}
								value={String(y)}
							>
								{y}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select onValueChange={val => handleChange(year, Number(val), day)} value={String(month)}>
					<SelectTrigger className="w-[90px]">
						<SelectValue placeholder="Mois" />
					</SelectTrigger>
					<SelectContent>
						{months.map(m => (
							<SelectItem
								className="hover:bg-foreground hover:text-background focus:bg-foreground focus:text-background"
								key={m}
								value={String(m)}
							>
								{new Date(0, m).toLocaleString('default', { month: 'short' })}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select onValueChange={val => handleChange(year, month, Number(val))} value={String(day)}>
					<SelectTrigger className="w-[60px]">
						<SelectValue placeholder="Jour" />
					</SelectTrigger>
					<SelectContent>
						{days.map(d => (
							<SelectItem
								className="hover:bg-foreground hover:text-background focus:bg-foreground focus:text-background"
								key={d}
								value={String(d)}
							>
								{d}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
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
