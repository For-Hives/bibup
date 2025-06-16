import type { Event } from './event.model'
import type { User } from './user.model'

export interface Waitlist {
	addedAt: Date
	eventId: Event['id']
	id: string
	mailNotification: boolean

	optionPreferences: Record<string, string>
	userId: User['id']
}
