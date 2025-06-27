import { describe, expect, it } from 'vitest'

import {
	BIB_COLORS,
	cn,
	EVENT_TYPES,
	generateFakeBibSale,
	generateFakeBibSales,
	generatePricing,
	getBibColorsDistributed,
	getRandomBibColor,
	getRandomEventType,
	getRandomFirstName,
	getRandomFutureDate,
	getRandomLastName,
	getRandomParticipantCount,
} from '@/lib/utils'

describe('cn', () => {
	it('should merge class names correctly', () => {
		expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white')
		expect(cn('p-4', 'm-2', 'p-2')).toBe('m-2 p-2') // tailwind-merge handles conflicts
		expect(cn('text-lg', false && 'text-xl', 'font-bold')).toBe('text-lg font-bold')
	})
})

describe('Faker Utilities', () => {
	describe('getRandomBibColor', () => {
		it('should return a valid bib color', () => {
			const color = getRandomBibColor()
			expect(BIB_COLORS).toContain(color)
		})
	})

	describe('getBibColorsDistributed', () => {
		it('should return the requested number of colors', () => {
			const colors = getBibColorsDistributed(3)
			expect(colors).toHaveLength(3)
		})

		it('should return unique colors if count is less than or equal to available colors', () => {
			const colors = getBibColorsDistributed(BIB_COLORS.length)
			expect(new Set(colors).size).toBe(BIB_COLORS.length)
			colors.forEach(color => expect(BIB_COLORS).toContain(color))
		})

		it('should recycle colors if count is greater than available colors, ensuring distribution', () => {
			const count = BIB_COLORS.length + 2
			const colors = getBibColorsDistributed(count)
			expect(colors).toHaveLength(count)
			colors.forEach(color => expect(BIB_COLORS).toContain(color))
			// Check that the first few colors are unique
			expect(new Set(colors.slice(0, BIB_COLORS.length)).size).toBe(BIB_COLORS.length)
		})

		it('should return an empty array if count is 0', () => {
			const colors = getBibColorsDistributed(0)
			expect(colors).toHaveLength(0)
		})
	})

	describe('getRandomFutureDate', () => {
		it('should return a date object', () => {
			expect(getRandomFutureDate()).toBeInstanceOf(Date)
		})

		it('should return a date in the future', () => {
			const futureDate = getRandomFutureDate()
			expect(futureDate.getTime()).toBeGreaterThan(new Date().getTime())
		})

		it('should return a date within the next 6 months (approximately)', () => {
			const now = new Date()
			const sixMonthsFromNow = new Date(
				now.getTime() + 6 * 30 * 24 * 60 * 60 * 1000 + 24 * 60 * 60 * 1000 /* add a day buffer */
			)
			const futureDate = getRandomFutureDate()
			expect(futureDate.getTime()).toBeLessThanOrEqual(sixMonthsFromNow.getTime())
		})
	})

	describe('generatePricing', () => {
		it('should return originalPrice and a discounted price', () => {
			const originalPrice = 100
			const pricing = generatePricing(originalPrice)
			expect(pricing.originalPrice).toBe(originalPrice)
			expect(pricing.price).toBeLessThanOrEqual(originalPrice)
			expect(pricing.price).toBeGreaterThanOrEqual(originalPrice * (1 - 0.3)) // Min discount 5% (so price is max 95%), max discount 30% (so price is min 70%)
			expect(pricing.price).toBeLessThanOrEqual(originalPrice * (1 - 0.05))
		})

		it('should handle zero original price', () => {
			const pricing = generatePricing(0)
			expect(pricing.originalPrice).toBe(0)
			expect(pricing.price).toBe(0)
		})

		it('should handle decimal prices and round discounted price to 2 decimal places', () => {
			const originalPrice = 99.99
			const pricing = generatePricing(originalPrice)
			expect(pricing.originalPrice).toBe(originalPrice)
			expect(pricing.price).toBeLessThanOrEqual(originalPrice)
			// Check if price has at most 2 decimal places
			// A more robust check for two decimal places:
			// Compare the number to itself when rounded to 2 decimal places.
			// Allow for small floating point differences.
			expect(Number(pricing.price.toFixed(2))).toBeCloseTo(pricing.price, 5)
		})
	})

	describe('getRandomFirstName', () => {
		it('should return a string', () => {
			expect(typeof getRandomFirstName()).toBe('string')
		})
		it('should return a non-empty string', () => {
			expect(getRandomFirstName().length).toBeGreaterThan(0)
		})
	})

	describe('getRandomLastName', () => {
		it('should return a string', () => {
			expect(typeof getRandomLastName()).toBe('string')
		})
		it('should return a non-empty string', () => {
			expect(getRandomLastName().length).toBeGreaterThan(0)
		})
	})

	describe('getRandomEventType', () => {
		it('should return a valid event type', () => {
			const eventType = getRandomEventType()
			expect(EVENT_TYPES).toContain(eventType)
		})
	})

	describe('getRandomParticipantCount', () => {
		it('should return a number', () => {
			expect(typeof getRandomParticipantCount('running', 20)).toBe('number')
		})
		it('should return at least 100', () => {
			expect(getRandomParticipantCount('trail', 10)).toBeGreaterThanOrEqual(100)
			expect(getRandomParticipantCount('cycling', 200)).toBeGreaterThanOrEqual(100)
		})
	})

	describe('generateFakeBibSale', () => {
		it('should generate a bib sale object with the correct structure', () => {
			const fakeBibSale = generateFakeBibSale('test-id-1')

			expect(fakeBibSale).toHaveProperty('id', 'test-id-1')
			expect(fakeBibSale).toHaveProperty('user')
			expect(fakeBibSale.user).toHaveProperty('id', 'user-test-id-1')
			expect(fakeBibSale.user).toHaveProperty('firstName')
			expect(fakeBibSale.user).toHaveProperty('lastName')
			expect(fakeBibSale).toHaveProperty('status', 'available')
			expect(fakeBibSale).toHaveProperty('originalPrice')
			expect(fakeBibSale).toHaveProperty('price')
			expect(fakeBibSale).toHaveProperty('event')
			expect(fakeBibSale.event).toHaveProperty('id', 'event-test-id-1')
			expect(fakeBibSale.event).toHaveProperty('name')
			expect(fakeBibSale.event).toHaveProperty('type')
			expect(EVENT_TYPES).toContain(fakeBibSale.event.type)
			expect(fakeBibSale.event).toHaveProperty('location')
			expect(fakeBibSale.event).toHaveProperty('image')
			expect(BIB_COLORS).toContain(fakeBibSale.event.image)
			expect(fakeBibSale.event).toHaveProperty('distance')
			expect(fakeBibSale.event).toHaveProperty('distanceUnit', 'km')
			expect(fakeBibSale.event).toHaveProperty('date')
			expect(fakeBibSale.event.date).toBeInstanceOf(Date)
			expect(fakeBibSale.event).toHaveProperty('participantCount')
			expect(typeof fakeBibSale.event.participantCount).toBe('number')
		})
	})

	describe('generateFakeBibSales', () => {
		it('should generate the specified number of bib sales', () => {
			const sales = generateFakeBibSales(5)
			expect(sales).toHaveLength(5)
		})

		it('should use distributed colors for generated bib sales', () => {
			const count = 3
			const sales = generateFakeBibSales(count)
			const eventImages = sales.map(sale => sale.event.image)
			// With a small count, colors should be unique
			if (count <= BIB_COLORS.length) {
				expect(new Set(eventImages).size).toBe(count)
			}
			eventImages.forEach(image => expect(BIB_COLORS).toContain(image))
		})

		it('should generate unique IDs for bib sales and events', () => {
			const sales = generateFakeBibSales(3)
			const bibSaleIds = sales.map(s => s.id)
			const eventIds = sales.map(s => s.event.id)
			const userIds = sales.map(s => s.user.id)

			expect(new Set(bibSaleIds).size).toBe(3)
			expect(new Set(eventIds).size).toBe(3)
			expect(new Set(userIds).size).toBe(3)

			sales.forEach((sale, index) => {
				expect(sale.id).toBe((index + 1).toString())
				expect(sale.event.id).toBe(`event-${index + 1}`)
				expect(sale.user.id).toBe(`user-${index + 1}`)
			})
		})
	})
})
