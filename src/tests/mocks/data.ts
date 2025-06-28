import type { Event } from '@/models/event.model'
import type { User } from '@/models/user.model'
import type { Bib } from '@/models/bib.model'

export const mockUser: User = {
	clerkId: 'clerk_user1',
	createdAt: new Date('2024-01-01'),
	email: 'test@example.com',
	firstName: 'Test',
	id: 'user1',
	lastName: 'User',
	role: 'user',
}

export const mockEvent: Event = {
	bibPickupWindowBeginDate: new Date('2025-12-30'),
	bibPickupWindowEndDate: new Date('2025-12-31'),
	description: 'Test Event Description',
	eventDate: new Date('2025-12-31T23:59:59Z'),
	id: 'event1',
	location: 'Test Location',
	name: 'Test Event',
	options: null,
	organizer: 'organizer1',
	typeCourse: 'trail',
}

export const mockBib: Bib & { expand?: { eventId: Event; sellerUserId: User } } = {
	eventId: 'event1',
	id: 'bib1',
	listed: null,
	optionValues: {},
	originalPrice: 40,
	price: 50,
	registrationNumber: 'REG123',
	sellerUserId: 'user1',
	status: 'available',
	validated: false,
	expand: {
		sellerUserId: mockUser,
		eventId: mockEvent,
	},
}
