import type { Event } from '@/models/event.model'
import type { User } from '@/models/user.model'
import type { Bib } from '@/models/bib.model'

export const mockUser: User = {
	verified: false,
	username: 'testuser',
	updated: '',
	name: 'Test User',
	lastName: 'User',
	id: 'user1',
	firstName: 'Test',
	emailVisibility: false,
	email: 'test@example.com',
	created: '',
	collectionName: '',
	collectionId: '',
	avatar: '',
}

export const mockEvent: Event = {
	updated: '',
	typeCourse: 'trail',
	participants: 100,
	name: 'Test Event',
	location: 'Test Location',
	id: 'event1',
	eventDate: '2025-12-31T23:59:59Z',
	distanceKm: 42,
	created: '',
	collectionName: '',
	collectionId: '',
}

export const mockBib: Bib & { expand?: { eventId: Event; sellerUserId: User } } = {
	updated: '',
	status: 'available',
	sellerUserId: 'user1',
	price: 50,
	originalPrice: 40,
	id: 'bib1',
	expand: {
		sellerUserId: mockUser,
		eventId: mockEvent,
	},
	eventId: 'event1',
	created: '',
	collectionName: '',
	collectionId: '',
}
