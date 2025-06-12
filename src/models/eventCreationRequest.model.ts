import { User } from './user.model'

export interface EventCreationRequest {
	createdAt: Date
	eventName: string
	id: string
	location: string
	message?: string
	proposedDate: Date
	reviewedAt?: Date
	status: 'accepted' | 'rejected' | 'waiting'
	userId: User['id']
}
