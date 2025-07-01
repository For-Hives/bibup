import type { Event } from '@/models/event.model'
import type { User } from '@/models/user.model'
import type { Bib } from '@/models/bib.model'

export const mockUser: User = {
	updatedAt: '2024-01-01T00:00:00.000Z',
	stripeAccountVerified: false,
	stripeAccountId: null,
	role: 'user',
	postalCode: null,
	phoneNumber: null,
	lastName: 'User',
	isOrganizer: false,
	isAdmin: false,
	id: 'user1',
	firstName: 'Test',
	emergencyContactPhone: null,
	emergencyContactName: null,
	email: 'test@example.com',
	createdAt: '2024-01-01T00:00:00.000Z',
	country: null,
	clerkId: 'clerk_user1',
	city: null,
	birthDate: null,
	address: null,
}

export const mockEvent: Event = {
	typeCourse: 'trail',
	organizer: 'organizer1',
	options: null,
	name: 'Test Event',
	location: 'Test Location',
	id: 'event1',
	eventDate: new Date('2025-12-31T23:59:59Z'),
	description: 'Test Event Description',
	bibPickupWindowEndDate: new Date('2025-12-31'),
	bibPickupWindowBeginDate: new Date('2025-12-30'),
}

export const mockBib: Bib & { expand?: { eventId: Event; sellerUserId: User } } = {
	validated: false,
	status: 'available',
	sellerUserId: 'user1',
	registrationNumber: 'REG123',
	price: 50,
	originalPrice: 40,
	optionValues: {},
	listed: null,
	id: 'bib1',
	expand: {
		sellerUserId: mockUser,
		eventId: mockEvent,
	},
	eventId: 'event1',
}
