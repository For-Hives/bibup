import { EventOption } from './eventOption.model'
import { Organizer } from './organizer.model'

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

	// Organizer relation 🤝
	organizer: Organizer['id'] // RELATION_RECORD_ID 🔗

	parcoursUrl?: string // GPX files, map links 🗺️

	participants?: number

	registrationUrl?: string // link to registration 🔗

	transferDeadline?: Date // last date for resale 📅

	typeCourse: 'route' | 'trail' | 'triathlon' | 'ultra'
}
