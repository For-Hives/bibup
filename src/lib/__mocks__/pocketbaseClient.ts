// src/lib/__mocks__/pocketbaseClient.ts
import { vi } from 'vitest'

export interface MockPocketBaseRecord {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any
	collectionId?: string
	collectionName?: string
	created?: string
	id?: string
	status?: number
	updated?: string
}

export const __MOCK_DATA_STORE__: Record<string, MockPocketBaseRecord[]> = {
	users: [],
	organizers: [],
	events: [],
}

interface GetListOptions {
	expand?: string
	filter?: string
	sort?: string
}

const createCollectionMock = (collectionName: string) => ({
	update: vi.fn().mockImplementation((id: string, data: Partial<MockPocketBaseRecord>): MockPocketBaseRecord => {
		const collection = __MOCK_DATA_STORE__[collectionName]
		if (collection === undefined) {
			const e = new Error(`Collection ${collectionName} not found`)
			;(e as any).status = 404
			throw e
		}
		const index = collection.findIndex(record => record.id === id)
		if (index === -1) {
			const e = new Error(`Record ${id} not found in ${collectionName}`)
			;(e as any).status = 404
			throw e
		}
		collection[index] = { ...collection[index], ...data, updated: new Date().toISOString() } as MockPocketBaseRecord
		return collection[index]
	}),
	getOne: vi.fn().mockImplementation((id: string, options?: GetListOptions): MockPocketBaseRecord => {
		const item = (__MOCK_DATA_STORE__[collectionName] ?? []).find(record => record.id === id)
		if (item === undefined) {
			const error = new Error(`Record with ID ${id} not found in ${collectionName}`)
			;(error as any).status = 404
			throw error
		}
		if (
			typeof options?.expand === 'string' &&
			options.expand === 'organizer' &&
			collectionName === 'events' &&
			typeof item.organizer === 'string' &&
			item.organizer.length > 0 &&
			__MOCK_DATA_STORE__.organizers !== undefined &&
			__MOCK_DATA_STORE__.organizers.length > 0
		) {
			const org = __MOCK_DATA_STORE__.organizers.find(o => o.id === (item.organizer as string))
			return {
				...item,
				expand: { organizer: org ?? null },
			}
		}
		return item
	}),
	getFullList: vi.fn().mockImplementation((options?: GetListOptions): MockPocketBaseRecord[] => {
		let items: MockPocketBaseRecord[] = [...(__MOCK_DATA_STORE__[collectionName] ?? [])]
		if (typeof options?.filter === 'string' && options.filter.includes(' = ')) {
			const [field, valueWithQuotes] = options.filter.split(' = ')
			const value = valueWithQuotes.replace(/"/g, '')
			if (field && value !== undefined) {
				items = items.filter(item => item[field] === value)
			}
		}
		if (typeof options?.sort === 'string' && options.sort.length > 0) {
			const sortField = options.sort.startsWith('-') ? options.sort.substring(1) : options.sort
			const descending = options.sort.startsWith('-')
			items.sort((a, b) => {
				const valA = a[sortField]
				const valB = b[sortField]
				if (valA < valB) return descending ? 1 : -1
				if (valA > valB) return descending ? -1 : 1
				return 0
			})
		}
		if (
			typeof options?.expand === 'string' &&
			options.expand === 'organizer' &&
			collectionName === 'events' &&
			__MOCK_DATA_STORE__.organizers !== undefined &&
			__MOCK_DATA_STORE__.organizers.length > 0
		) {
			return items.map(item => {
				const org =
					typeof item.organizer === 'string' ? __MOCK_DATA_STORE__.organizers.find(o => o.id === item.organizer) : null
				return {
					...item,
					expand: { organizer: org ?? null },
				}
			})
		}
		return items
	}),
	delete: vi.fn().mockImplementation((id: string): boolean => {
		const collection = __MOCK_DATA_STORE__[collectionName]
		if (collection === undefined) {
			const e = new Error(`Collection ${collectionName} not found`)
			;(e as any).status = 404
			throw e
		}
		const index = collection.findIndex(record => record.id === id)
		if (index === -1) {
			const e = new Error(`Record ${id} not found in ${collectionName}`)
			;(e as any).status = 404
			throw e
		}
		collection.splice(index, 1)
		return true
	}),
	create: vi
		.fn()
		.mockImplementation((data: Omit<MockPocketBaseRecord, 'created' | 'id' | 'updated'>): MockPocketBaseRecord => {
			const newRecord: MockPocketBaseRecord = {
				...data,
				id: `record_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`,
				created: new Date().toISOString(),
				updated: new Date().toISOString(),
				collectionName: collectionName,
				collectionId: `coll_id_${collectionName}`,
			}
			__MOCK_DATA_STORE__[collectionName] ??= []
			__MOCK_DATA_STORE__[collectionName].push(newRecord)
			return newRecord
		}),
})

type CollectionMock = ReturnType<typeof createCollectionMock>
const collectionMocksCache: Record<string, CollectionMock> = {}

export const pb = {
	collection: vi.fn((collectionName: string): CollectionMock => {
		collectionMocksCache[collectionName] ??= createCollectionMock(collectionName)
		return collectionMocksCache[collectionName]
	}),
	autoCancellation: vi.fn(),
	authStore: {
		token: '',
		model: null,
		isValid: false,
		clear: vi.fn(() => {
			pb.authStore.isValid = false
			pb.authStore.token = ''
			pb.authStore.model = null
		}),
	},
}

export const __resetAllMocks = () => {
	for (const key in __MOCK_DATA_STORE__) {
		__MOCK_DATA_STORE__[key] = []
	}
	pb.collection.mockClear()
	for (const colName in collectionMocksCache) {
		const collectionMock = collectionMocksCache[colName]
		collectionMock.create.mockClear()
		collectionMock.getFullList.mockClear()
		collectionMock.getOne.mockClear()
		collectionMock.update.mockClear()
		;(collectionMock.delete as ReturnType<typeof vi.fn>).mockClear() // Cast to spy type
	}
	pb.authStore.clear.mockClear()
	pb.autoCancellation.mockClear()
}
