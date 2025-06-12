import { EventOption } from './eventOption.model'

export interface Event {
	bibPickupWindows?: { end: Date; start: Date }[]
	bibsSold: number
	createdAt: Date
	date: Date
	description?: string
	distanceKm?: number
	elevationGainM?: number
	format?: 'relay' | 'solo'
	id: string
	isPartnered: boolean
	location: string
	logoUrl?: string
	name: string
	officialPrice?: number
	options: EventOption[]
	parcoursUrls?: string[] // GPX files, map links
	participantCount: number

	transferDeadline?: Date // last date for resale

	typeCourse?: 'route' | 'trail' | 'triathlon' | 'ultra'
	updatedAt: Date
}
