import { User } from './user.model'

export interface EventCreationRequest {
	eventDate?: Date
	id: string
	location: string
	message?: string
	name: string
	status: 'accepted' | 'rejected' | 'waiting'
	userId: User['id']
}
