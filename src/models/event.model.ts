import { EventOption } from './eventOption.model'

export interface Event {
	bibPickupLocation?: string

	bibPickupWindowBeginDate: Date
	bibPickupWindowEndDate: Date

	description: string

	distanceKm?: number
	elevationGainM?: number

	eventDate: Date
	id: string
	isPartnered: boolean
	location: string
	logo: File
	name: string

	officialStandardPrice?: number

	options: EventOption[]

	parcoursUrl?: string // GPX files, map links

	participantCount: number

	registrationUrl?: string // link to registration

	transferDeadline?: Date // last date for resale

	typeCourse: 'route' | 'trail' | 'triathlon' | 'ultra'
}
