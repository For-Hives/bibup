import { EventOption } from './eventOption.model'

export interface Event {
	bibPickupDate: Date
	bibPickupLocation?: string

	description?: string

	distanceKm?: number
	elevationGainM?: number

	eventDate: Date
	id: string
	isPartnered: boolean
	location: string
	logoUrl?: string
	name: string

	officialStandardPrice?: number

	options: EventOption[]

	parcoursUrl?: string // GPX files, map links

	participantCount: number

	transferDeadline?: Date // last date for resale

	typeCourse: 'route' | 'trail' | 'triathlon' | 'ultra'
}
