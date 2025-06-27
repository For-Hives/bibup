import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
	createEvent,
	fetchApprovedPublicEvents,
	fetchEventById,
	fetchEventsByOrganizer,
	fetchPartneredApprovedEvents,
	getAllEvents,
} from '@/services/event.services'
import { pb as actualPb } from '@/lib/pocketbaseClient'
import { type Organizer } from '@/models/organizer.model'
import { type Event, EventOption } from '@/models/event.model' // EventOption is now exported
import type { MockPocketBaseRecord } from '@/lib/__mocks__/pocketbaseClient'

vi.mock('@/lib/pocketbaseClient')

const mockedPb = actualPb as unknown as typeof actualPb & {
	collection: ReturnType<typeof vi.fn> &
		ReturnType<(typeof import('@/lib/__mocks__/pocketbaseClient'))['pb']['collection']>
	authStore: { clear: ReturnType<typeof vi.fn> }
	autoCancellation: ReturnType<typeof vi.fn>
}

const MOCK_TEST_DATA_STORE: Record<string, MockPocketBaseRecord[]> = {
	users: [],
	organizers: [],
	events: [],
}

const resetMockTestDataStore = () => {
	for (const key in MOCK_TEST_DATA_STORE) {
		MOCK_TEST_DATA_STORE[key] = []
	}
	if (mockedPb && typeof mockedPb.collection === 'function' && (mockedPb.collection as any).mockClear) {
		;(mockedPb.collection as any).mockClear()
		const collectionsToReset = ['events', 'users', 'organizers']
		collectionsToReset.forEach(colName => {
			const collectionMock = mockedPb.collection(colName)
			if (collectionMock) {
				if (typeof (collectionMock.create as any)?.mockClear === 'function') (collectionMock.create as any).mockClear()
				if (typeof (collectionMock.getFullList as any)?.mockClear === 'function')
					(collectionMock.getFullList as any).mockClear()
				if (typeof (collectionMock.getOne as any)?.mockClear === 'function') (collectionMock.getOne as any).mockClear()
				if (typeof (collectionMock.update as any)?.mockClear === 'function') (collectionMock.update as any).mockClear()
				if (typeof (collectionMock.delete as any)?.mockClear === 'function') (collectionMock.delete as any).mockClear()
			}
		})
		if (typeof mockedPb.authStore?.clear?.mockClear === 'function') mockedPb.authStore.clear.mockClear()
		if (typeof (mockedPb.autoCancellation as any)?.mockClear === 'function')
			(mockedPb.autoCancellation as any).mockClear()
	}
}

const seedMockTestData = (collectionName: string, data: MockPocketBaseRecord[]) => {
	MOCK_TEST_DATA_STORE[collectionName] = [...data]
}

// Aligned with Organizer model (removed description, collectionId, collectionName; ensured Date types)
const sampleOrganizer: Organizer = {
	website: 'https://test.org',
	updated: new Date(),
	name: 'Test Organizer',
	logo: 'logo.png',
	id: 'org1',
	email: 'org@test.com',
	created: new Date(),
	isPartnered: false,
}

// Aligned with Event model
const sampleEventData: Omit<Event, 'id'> = {
	// Omit only 'id' as per model for creation
	typeCourse: 'route',
	transferDeadline: new Date('2024-12-15T10:00:00.000Z'),
	registrationUrl: 'https://register.test',
	participants: 100,
	parcoursUrl: 'https://parcours.test',
	organizer: 'org1',
	options: [{ key: 't-shirt', label: 'T-Shirt', required: false, values: ['S', 'M', 'L'] }] as EventOption[],
	officialStandardPrice: 50,
	name: 'Test Event',
	location: 'Test Location',
	eventDate: new Date('2024-12-31T10:00:00.000Z'),
	elevationGainM: 100,
	distanceKm: 10,
	description: 'A fun test event.',
	bibPickupWindowEndDate: new Date('2024-12-30T18:00:00.000Z'),
	bibPickupWindowBeginDate: new Date('2024-12-30T10:00:00.000Z'),
	bibPickupLocation: 'Test Bib Pickup',
}

const fullEventRecord: Event = {
	...sampleEventData,
	id: 'event1',
	// created & updated are not part of Event interface from event.model.ts
}

describe('Event Services', () => {
	beforeEach(() => {
		resetMockTestDataStore()
		seedMockTestData('organizers', [sampleOrganizer as unknown as MockPocketBaseRecord])
		seedMockTestData('events', [fullEventRecord as unknown as MockPocketBaseRecord])
	})

	describe('createEvent', () => {
		it('should create an event successfully with valid data', async () => {
			const newEventData = { ...sampleEventData, name: 'New Unique Event For Create Test' }
			const result = await createEvent(newEventData)

			expect(result).toBeDefined()
			expect(result?.name).toBe('New Unique Event For Create Test')
			expect(mockedPb.collection('events').create).toHaveBeenCalledTimes(1)
			expect(result?.organizer).toBe('org1')
			expect(result?.id).toEqual(expect.stringContaining('record_'))

			const expectedDataToCreate = {
				typeCourse: newEventData.typeCourse,
				transferDeadline: newEventData.transferDeadline,
				registrationUrl: newEventData.registrationUrl,
				participants: newEventData.participants,
				parcoursUrl: newEventData.parcoursUrl,
				organizer: newEventData.organizer,
				options: JSON.stringify(newEventData.options),
				officialStandardPrice: newEventData.officialStandardPrice,
				name: newEventData.name,
				location: newEventData.location,
				eventDate: newEventData.eventDate,
				elevationGainM: newEventData.elevationGainM,
				distanceKm: newEventData.distanceKm,
				description: newEventData.description,
				bibPickupWindowEndDate: newEventData.bibPickupWindowEndDate,
				bibPickupWindowBeginDate: newEventData.bibPickupWindowBeginDate,
				bibPickupLocation: newEventData.bibPickupLocation,
			}
			expect(mockedPb.collection('events').create).toHaveBeenCalledWith(expect.objectContaining(expectedDataToCreate))
		})

		it('should throw an error if PocketBase create fails', async () => {
			;(mockedPb.collection('events').create as any).mockRejectedValueOnce(new Error('PocketBase unavailable'))
			await expect(createEvent(sampleEventData)).rejects.toThrow('Error creating event: PocketBase unavailable')
		})
	})

	describe('fetchApprovedPublicEvents', () => {
		it('should fetch all events sorted by eventDate', async () => {
			// Ensure seeded data aligns with MockPocketBaseRecord structure if needed, or cast
			const eventsSeed: MockPocketBaseRecord[] = [
				{
					...fullEventRecord,
					name: 'Event A',
					id: 'ev1',
					eventDate: new Date('2025-01-01'),
				} as unknown as MockPocketBaseRecord,
				{
					...fullEventRecord,
					name: 'Event B',
					id: 'ev2',
					eventDate: new Date('2024-12-01'),
				} as unknown as MockPocketBaseRecord,
			]
			seedMockTestData('events', eventsSeed)

			const result = await fetchApprovedPublicEvents()

			expect(mockedPb.collection('events').getFullList).toHaveBeenCalledWith({ sort: 'eventDate', expand: undefined })
			expect(result.length).toBe(2)
			const sortedResult = [...result].sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
			expect(sortedResult[0].name).toBe('Event B')
			expect(sortedResult[1].name).toBe('Event A')
		})

		it('should expand organizer data if requested', async () => {
			await fetchApprovedPublicEvents(true)
			expect(mockedPb.collection('events').getFullList).toHaveBeenCalledWith({ sort: 'eventDate', expand: 'organizer' })
		})
	})

	describe('fetchEventById', () => {
		it('should fetch a single event by its ID', async () => {
			const result = await fetchEventById('event1')

			expect(mockedPb.collection('events').getOne).toHaveBeenCalledWith('event1', { expand: undefined })
			expect(result).toBeDefined()
			expect(result?.id).toBe('event1')
			expect(result?.name).toBe(sampleEventData.name)
		})

		it('should expand organizer data if requested', async () => {
			await fetchEventById('event1', true)
			expect(mockedPb.collection('events').getOne).toHaveBeenCalledWith('event1', { expand: 'organizer' })
		})

		it('should return null if event is not found', async () => {
			const result = await fetchEventById('nonexistent-id')
			expect(mockedPb.collection('events').getOne).toHaveBeenCalledWith('nonexistent-id', { expand: undefined })
			expect(result).toBeNull()
		})
	})

	describe('fetchEventsByOrganizer', () => {
		it('should fetch events for a specific organizer, sorted by -created', async () => {
			const date1 = new Date('2023-01-01T00:00:00.000Z')
			const date2 = new Date('2023-01-02T00:00:00.000Z')
			const date3 = new Date('2023-01-03T00:00:00.000Z')

			const orgEventsSeed: MockPocketBaseRecord[] = [
				{
					...fullEventRecord,
					organizer: 'org1',
					id: 'orgEvent1',
					created: date1.toISOString(),
				} as unknown as MockPocketBaseRecord,
				{
					...fullEventRecord,
					organizer: 'org1',
					name: 'Another Org Event',
					id: 'orgEvent2',
					created: date2.toISOString(),
				} as unknown as MockPocketBaseRecord,
				{
					...fullEventRecord,
					organizer: 'org2',
					id: 'otherEvent',
					created: date3.toISOString(),
				} as unknown as MockPocketBaseRecord,
			]
			seedMockTestData('events', orgEventsSeed)

			const result = await fetchEventsByOrganizer('org1')

			expect(mockedPb.collection('events').getFullList).toHaveBeenCalledWith({
				sort: '-created',
				filter: 'organizer = "org1"',
				expand: undefined,
			})
			expect(result.length).toBe(2)
			expect(result[0].id).toBe('orgEvent2')
			expect(result[1].id).toBe('orgEvent1')
			expect(result.every(event => event.organizer === 'org1')).toBe(true)
		})

		it('should expand organizer data if requested', async () => {
			await fetchEventsByOrganizer('org1', true)
			expect(mockedPb.collection('events').getFullList).toHaveBeenCalledWith(
				expect.objectContaining({ expand: 'organizer' })
			)
		})

		it('should return an empty array if organizerId is empty', async () => {
			const result = await fetchEventsByOrganizer('')
			expect(result).toEqual([])
			expect(mockedPb.collection('events').getFullList).not.toHaveBeenCalled()
		})
	})

	describe('fetchPartneredApprovedEvents', () => {
		it('should fetch all events (current behavior reflects no isPartnered filter yet)', async () => {
			await fetchPartneredApprovedEvents()
			expect(mockedPb.collection('events').getFullList).toHaveBeenCalledWith({ sort: 'eventDate', expand: undefined })
		})

		it('should expand organizer data if requested', async () => {
			await fetchPartneredApprovedEvents(true)
			expect(mockedPb.collection('events').getFullList).toHaveBeenCalledWith(
				expect.objectContaining({ expand: 'organizer' })
			)
		})

		it('should return empty array on error', async () => {
			;(mockedPb.collection('events').getFullList as any).mockRejectedValueOnce(new Error('DB down'))
			const result = await fetchPartneredApprovedEvents()
			expect(result).toEqual([])
		})
	})

	describe('getAllEvents (admin)', () => {
		it('should fetch all events sorted by -created', async () => {
			await getAllEvents()
			expect(mockedPb.collection('events').getFullList).toHaveBeenCalledWith({ sort: '-created', expand: undefined })
		})
		it('should expand organizer data if requested', async () => {
			await getAllEvents(true)
			expect(mockedPb.collection('events').getFullList).toHaveBeenCalledWith(
				expect.objectContaining({ expand: 'organizer' })
			)
		})
	})
})
