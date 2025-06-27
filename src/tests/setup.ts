import { vi } from 'vitest'

// Vitest setup file
// You can add global setup logic here, like mocking, etc.

// Example:
// import '@testing-library/jest-dom'; // if you want to use jest-dom matchers

// Mock IntersectionObserver for tests that might use it (e.g., via Framer Motion or other libraries)
const mockObserverInstance = {
	unobserve: vi.fn(),
	thresholds: [] as readonly number[], // Match IntersectionObserverInit
	takeRecords: vi.fn((): IntersectionObserverEntry[] => []), // Ensure it returns an array of entries
	rootMargin: '',
	root: null,
	observe: vi.fn(),
	disconnect: vi.fn(),
}

const mockIntersectionObserverConstructor = vi.fn(() => mockObserverInstance)

global.IntersectionObserver = mockIntersectionObserverConstructor as unknown as typeof IntersectionObserver

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation(
		(query: string): MediaQueryList => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(), // Deprecated
			removeListener: vi.fn(), // Deprecated
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})
	),
})
