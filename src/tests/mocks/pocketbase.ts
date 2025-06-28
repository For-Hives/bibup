import { vi } from 'vitest'

export const mockPocketbase = {
	getOne: vi.fn(),
	getFullList: vi.fn(),
	getFirstListItem: vi.fn(),
	create: vi.fn(),
	collection: vi.fn().mockReturnThis(),
}
