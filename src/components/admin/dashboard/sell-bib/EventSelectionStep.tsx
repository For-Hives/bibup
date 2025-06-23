import { Calendar, CheckCircle, MapPin, Search, TrendingUp, Users } from 'lucide-react'
import { useState } from 'react'

import type { Organizer } from '@/models/organizer.model'
import type { Event } from '@/models/event.model'

import { Card, CardContent } from '@/components/ui/card'
import { formatDateForDisplay } from '@/lib/dateUtils'
import { Input } from '@/components/ui/inputAlt'

interface EventSelectionStepProps {
	availableEvents: (Event & { expand?: { organizer?: Organizer } })[]
	error?: string
	onEventSelect: (event: Event) => void
	selectedEvent: Event | null
	translations: {
		description: string
		eventInfo: string
		noEventsFound: string
		searchPlaceholder: string
	}
}

export default function EventSelectionStep({
	translations: t,
	selectedEvent,
	onEventSelect,
	error,
	availableEvents,
}: EventSelectionStepProps) {
	const [searchQuery, setSearchQuery] = useState('')

	// Filter events based on search query
	const filteredEvents = availableEvents.filter(
		event =>
			event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			event.location.toLowerCase().includes(searchQuery.toLowerCase())
	)

	return (
		<div className="grid grid-cols-1 gap-12 md:grid-cols-3">
			{/* Section Header */}
			<div>
				<h2 className="text-foreground text-2xl font-semibold">{t.eventInfo}</h2>
				<p className="text-muted-foreground mt-2 text-base leading-7">{t.description}</p>
			</div>

			{/* Event Selection Content */}
			<div className="md:col-span-2">
				{/* Search */}
				<div className="relative mb-6">
					<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
					<Input
						className="pl-10"
						onChange={e => setSearchQuery(e.target.value)}
						placeholder={t.searchPlaceholder}
						type="text"
						value={searchQuery}
					/>
				</div>

				{/* Events List */}
				<div className="max-h-96 space-y-4 overflow-y-auto">
					{filteredEvents.length === 0 ? (
						<div className="text-muted-foreground py-8 text-center">{t.noEventsFound}</div>
					) : (
						filteredEvents.map(event => (
							<Card
								className={`border-border/50 bg-card/80 hover:bg-card/90 cursor-pointer backdrop-blur-sm transition-all duration-200 hover:shadow-lg ${
									selectedEvent?.id === event.id ? 'ring-primary border-primary bg-primary/5 ring-2' : ''
								}`}
								key={event.id}
								onClick={() => onEventSelect(event)}
							>
								<CardContent className="p-4">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<h3 className="mb-2 text-lg font-semibold">{event.name}</h3>
											<div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
												<div className="flex items-center gap-2">
													<Calendar className="h-4 w-4" />
													{(() => {
														const eventDate = event.eventDate
														const dateStr =
															typeof eventDate === 'string'
																? eventDate
																: eventDate instanceof Date
																	? eventDate.toISOString()
																	: new Date(eventDate).toISOString()
														return formatDateForDisplay(dateStr.split('T')[0])
													})()}
												</div>
												<div className="flex items-center gap-2">
													<MapPin className="h-4 w-4" />
													{event.location}
												</div>
												{event.distanceKm && (
													<div className="flex items-center gap-2">
														<TrendingUp className="h-4 w-4" />
														{event.distanceKm} km
													</div>
												)}
												{event.participants && (
													<div className="flex items-center gap-2">
														<Users className="h-4 w-4" />
														{event.participants} participants
													</div>
												)}
											</div>
											{event.expand?.organizer && (
												<p className="text-muted-foreground mt-2 text-xs">by {event.expand.organizer.name}</p>
											)}
										</div>
										{selectedEvent?.id === event.id && (
											<CheckCircle className="text-primary absolute top-0 right-0 m-4 h-6 w-6" />
										)}
									</div>
								</CardContent>
							</Card>
						))
					)}
				</div>

				{error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
			</div>
		</div>
	)
}
