'use client'

import { useState } from 'react'

import type { EventOption } from '@/models/eventOption.model'
import type { Organizer } from '@/models/organizer.model'

import { CalendarSidebar } from '@/components/calendar/calendarSidebar'
import { CalendarHeader } from '@/components/calendar/calendarHeader'
import { CalendarMain } from '@/components/calendar/calendarMain'
import { EventView } from '@/components/calendar/eventView'
// import { EventView } from '@/components/event-view'

// Your Event interface
export interface Event {
	bibPickupLocation?: string
	bibPickupWindowBeginDate: Date
	bibPickupWindowEndDate: Date
	description: string
	distanceKm?: number
	elevationGainM?: number
	eventDate: Date
	id: string
	location: string
	name: string
	officialStandardPrice?: number
	options: EventOption[] | null
	organizer: Organizer['id']
	parcoursUrl?: string
	participants?: number
	registrationUrl?: string
	transferDeadline?: Date
	typeCourse: 'route' | 'trail' | 'triathlon' | 'ultra'
}

export type ViewMode = 'day' | 'month' | 'week' | 'year'

// Sample events with your Event model
const sampleEvents: Event[] = [
	{
		typeCourse: 'trail',
		transferDeadline: new Date(2025, 6, 20),
		registrationUrl: 'https://example.com/register/trail-marathon',
		participants: 150,
		parcoursUrl: 'https://example.com/gpx/trail-marathon.gpx',
		organizer: 'org_001',
		options: [
			{ values: ['65'], required: false, label: 'Early Bird Registration', key: 'early' },
			{ values: ['100'], required: false, label: 'Race Day Registration', key: 'race' },
		],
		officialStandardPrice: 85,
		name: 'Mountain Trail Marathon',
		location: 'Rocky Mountain National Park, Colorado',
		id: '1',
		eventDate: new Date(2025, 7, 4, 7, 0),
		elevationGainM: 1200,
		distanceKm: 42.2,
		description:
			'A challenging mountain trail marathon through scenic wilderness paths with significant elevation gain. This event takes runners through some of the most beautiful and demanding terrain in the Rocky Mountains, featuring technical single-track trails, river crossings, and breathtaking alpine views.',
		bibPickupWindowEndDate: new Date(2025, 7, 3, 18, 0),
		bibPickupWindowBeginDate: new Date(2025, 7, 2, 10, 0),
		bibPickupLocation: 'Park Visitor Center',
	},
	{
		typeCourse: 'route',
		transferDeadline: new Date(2025, 6, 25),
		registrationUrl: 'https://example.com/register/city-10k',
		participants: 500,
		organizer: 'org_002',
		options: [
			{ values: ['35'], required: false, label: 'Standard Registration', key: 'standard' },
			{ values: ['55'], required: false, label: 'VIP Package', key: 'vip' },
		],
		officialStandardPrice: 35,
		name: 'City Road Race 10K',
		location: 'Downtown Metro Area',
		id: '2',
		eventDate: new Date(2025, 7, 4, 8, 30),
		elevationGainM: 50,
		distanceKm: 10,
		description:
			'Fast and flat 10K road race through downtown streets, perfect for personal records. The course is USATF certified and features excellent crowd support throughout.',
		bibPickupWindowEndDate: new Date(2025, 7, 4, 7, 30),
		bibPickupWindowBeginDate: new Date(2025, 7, 3, 12, 0),
		bibPickupLocation: 'City Sports Center',
	},
	{
		typeCourse: 'triathlon',
		transferDeadline: new Date(2025, 6, 15),
		registrationUrl: 'https://example.com/register/olympic-tri',
		participants: 200,
		parcoursUrl: 'https://example.com/course/olympic-tri-map',
		organizer: 'org_003',
		options: [
			{ values: ['120'], required: false, label: 'Individual Registration', key: 'individual' },
			{ values: ['180'], required: false, label: 'Relay Team (3 people)', key: 'relay' },
		],
		officialStandardPrice: 120,
		name: 'Olympic Distance Triathlon',
		location: 'Lake Paradise Resort',
		id: '3',
		eventDate: new Date(2025, 7, 5, 6, 30),
		elevationGainM: 300,
		distanceKm: 51.5,
		description:
			'Standard Olympic distance triathlon: 1.5km swim, 40km bike, 10km run. Open water swim in pristine lake conditions with a challenging but fair bike course and fast run finish.',
		bibPickupWindowEndDate: new Date(2025, 7, 5, 5, 30),
		bibPickupWindowBeginDate: new Date(2025, 7, 4, 14, 0),
		bibPickupLocation: 'Resort Registration Tent',
	},
	{
		typeCourse: 'ultra',
		transferDeadline: new Date(2025, 6, 10),
		registrationUrl: 'https://example.com/register/desert-ultra',
		participants: 75,
		parcoursUrl: 'https://example.com/gpx/desert-ultra.gpx',
		organizer: 'org_004',
		options: [{ values: ['150'], required: false, label: 'Ultra Registration', key: 'ultra' }],
		officialStandardPrice: 150,
		name: 'Desert Ultra 50K',
		location: 'Mojave Desert, California',
		id: '4',
		eventDate: new Date(2025, 7, 7, 5, 0),
		elevationGainM: 800,
		distanceKm: 50,
		description:
			'Extreme 50K ultra marathon through challenging desert terrain with aid stations every 10K. This is not for beginners - proper desert running experience and heat training required.',
		bibPickupWindowEndDate: new Date(2025, 7, 7, 4, 30),
		bibPickupWindowBeginDate: new Date(2025, 7, 6, 16, 0),
		bibPickupLocation: 'Desert Outpost Base Camp',
	},
]

// Sample organizers data
const sampleOrganizers: Organizer[] = [
	{
		website: 'https://mountaintrailevents.com',
		updated: new Date(),
		name: 'Mountain Trail Events',
		isPartnered: false,
		id: 'org_001',
		email: 'info@mountaintrailevents.com',
		created: new Date(),
	},
	{
		website: 'https://cityrunningclub.org',
		updated: new Date(),
		name: 'City Running Club',
		isPartnered: false,
		id: 'org_002',
		email: 'races@cityrunningclub.org',
		created: new Date(),
	},
	{
		website: 'https://triproevents.com',
		updated: new Date(),
		name: 'Triathlon Pro Events',
		isPartnered: false,
		id: 'org_003',
		email: 'contact@triproevents.com',
		created: new Date(),
	},
	{
		website: 'https://desertultra.com',
		updated: new Date(),
		name: 'Desert Ultra Adventures',
		isPartnered: false,
		id: 'org_004',
		email: 'info@desertultra.com',
		created: new Date(),
	},
]

export default function CalendarPage() {
	const [viewMode, setViewMode] = useState<ViewMode>('month')
	const [selectedDate, setSelectedDate] = useState(() => new Date())
	const [events] = useState<Event[]>(sampleEvents)
	const [organizers] = useState<Organizer[]>(sampleOrganizers)
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

	const getOrganizerById = (id: string): Organizer | undefined => {
		return organizers.find(org => org.id === id)
	}

	const handleDateSelect = (date: Date | undefined) => {
		if (date) setSelectedDate(date)
	}

	return (
		<div className="bg-background flex h-screen">
			<CalendarSidebar events={events} onDateSelect={handleDateSelect} selectedDate={selectedDate} />
			<div className="flex flex-1 flex-col">
				<CalendarHeader
					onDateChange={setSelectedDate}
					onViewModeChange={setViewMode}
					selectedDate={selectedDate}
					viewMode={viewMode}
				/>
				<CalendarMain
					events={events}
					onDateSelect={setSelectedDate}
					onEventSelect={setSelectedEvent}
					selectedDate={selectedDate}
					viewMode={viewMode}
				/>
			</div>

			{selectedEvent && (
				<EventView
					event={selectedEvent}
					onClose={() => setSelectedEvent(null)}
					organizer={getOrganizerById(selectedEvent.organizer)}
				/>
			)}
		</div>
	)
}
