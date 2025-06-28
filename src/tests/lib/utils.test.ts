import { describe, expect, it } from 'vitest'

import { BIB_COLORS, cn, getBibColorsDistributed } from '@/lib/utils'

describe('utils', () => {
	describe('cn', () => {
		it('should merge tailwind classes correctly', () => {
			expect(cn('text-red-500', 'bg-blue-200')).toBe('text-red-500 bg-blue-200')
		})

		it('should handle conditional classes', () => {
			expect(cn('text-red-500', true && 'bg-blue-200')).toBe('text-red-500 bg-blue-200')
			expect(cn('text-red-500', false && 'bg-blue-200')).toBe('text-red-500')
		})

		it('should override conflicting classes', () => {
			expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
		})

		it('should handle multiple arguments', () => {
			expect(cn('p-4', 'm-2', 'flex')).toBe('p-4 m-2 flex')
		})
	})

	describe('getBibColorsDistributed', () => {
		it('should return an array of the specified count', () => {
			const colors = getBibColorsDistributed(5)
			expect(colors.length).toBe(5)
		})

		it('should return colors without duplicates until all colors are used', () => {
			const allColors = [...BIB_COLORS]
			const colors = getBibColorsDistributed(allColors.length)
			const uniqueColors = new Set(colors)
			expect(uniqueColors.size).toBe(allColors.length)
		})

		it('should reset available colors if count exceeds initial colors', () => {
			const colors = getBibColorsDistributed(BIB_COLORS.length * 2 + 1)
			expect(colors.length).toBe(BIB_COLORS.length * 2 + 1)
			// Check if colors are distributed, not just random
			const colorCounts: Record<string, number> = {}
			colors.forEach(color => {
				colorCounts[color] = (colorCounts[color] || 0) + 1
			})
			// Each color should appear at least twice, and one color three times
			BIB_COLORS.forEach(color => {
				expect(colorCounts[color]).toBeGreaterThanOrEqual(2)
			})
		})

		it('should handle count of 0', () => {
			const colors = getBibColorsDistributed(0)
			expect(colors).toEqual([])
		})
	})
})
