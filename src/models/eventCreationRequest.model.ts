import { User } from './user.model'

export interface EventCreationRequest {
	// PocketBase fields
	created: string
	eventDate?: Date
	id: string
	location: string
	message?: string
	name: string
	status: 'accepted' | 'rejected' | 'waiting'

	updated: string
	userId: User['id']
}
