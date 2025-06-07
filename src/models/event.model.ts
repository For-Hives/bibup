import { User } from './user.model'

export interface Event {
	bibsSold: number // For KPI
	date: Date // Should be DateTime
	description?: string
	id: string
	isPartnered: boolean // Defaults to false
	location: string
	name: string
	organizerId: User['id'] // References a User ID
	participantCount: number
	status:
		| 'approved'
		| 'cancelled'
		| 'completed'
		| 'pending_approval'
		| 'rejected'
	// Add other relevant event details here
}
