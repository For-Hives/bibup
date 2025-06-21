import { Event } from './event.model'
import { User } from './user.model'

export interface Bib {
	buyerUserId?: User['id']

	// PocketBase fields
	created: string
	eventId: Event['id']

	id: string
	listed: 'private' | 'public' | null
	// values for options defined on the Event
	optionValues: Record<string, string>
	originalPrice?: number

	price: number
	privateListingToken?: string
	registrationNumber: string

	sellerUserId: User['id']

	status: 'available' | 'expired' | 'sold' | 'validation_failed' | 'withdrawn'

	updated: string
	validated: boolean
}
