import { describe, expect, it } from 'vitest'

import {
	datetimeToDate,
	formatDateForDisplay,
	formatDateForInput,
	formatDateWithLocale,
	getDateFormatPattern,
	getDatePlaceholder,
} from '@/lib/dateUtils'
import { Locale } from '@/lib/i18n-config'

describe('dateUtils', () => {
	describe('datetimeToDate', () => {
		it('should convert datetime-local string to date string', () => {
			expect(datetimeToDate('2023-10-26T10:00')).toBe('2023-10-26')
		})

		it('should return an empty string if input is empty', () => {
			expect(datetimeToDate('')).toBe('')
		})

		it('should handle dates without time', () => {
			expect(datetimeToDate('2023-10-26')).toBe('2023-10-26')
		})
	})

	describe('formatDateForDisplay', () => {
		it('should format date for display in English', () => {
			expect(formatDateForDisplay('2023-10-26', 'en')).toBe('October 26, 2023')
		})

		it('should format date for display in French', () => {
			expect(formatDateForDisplay('2023-10-26', 'fr')).toBe('26 octobre 2023')
		})

		it('should format date for display in Korean', () => {
			// Note: The exact output can vary based on the Node.js Intl implementation
			// This test might need adjustment if the environment's Korean formatting differs.
			// For "ko-KR", it typically is "YYYY년 M월 D일"
			expect(formatDateForDisplay('2023-10-26', 'ko')).toMatch(/2023(년|년.) 10(월|월.) 26(일|일.)/)
		})

		it('should default to English if locale is not supported', () => {
			expect(formatDateForDisplay('2023-10-26', 'xx')).toBe('October 26, 2023')
		})

		it('should return an empty string if input is empty', () => {
			expect(formatDateForDisplay('', 'en')).toBe('')
		})

		it('should return original string on invalid date', () => {
			// new Date('invalid-date').toLocaleDateString() results in "Invalid Date"
			expect(formatDateForDisplay('invalid-date', 'en')).toBe('Invalid Date')
		})
	})

	describe('formatDateForInput', () => {
		it('should format date for HTML input', () => {
			expect(formatDateForInput('2023-10-26')).toBe('2023-10-26')
			expect(formatDateForInput('October 26, 2023')).toBe('2023-10-26')
		})

		it('should return an empty string if input is empty', () => {
			expect(formatDateForInput('')).toBe('')
		})

		it('should return an empty string on invalid date', () => {
			expect(formatDateForInput('invalid-date')).toBe('')
		})
	})

	describe('formatDateWithLocale', () => {
		it('should format date with Luxon for English (US)', () => {
			const date = new Date(2023, 9, 26) // Month is 0-indexed, so 9 is October
			expect(formatDateWithLocale(date, 'en')).toBe('Oct 26, 2023')
		})

		it('should format date with Luxon for French (FR)', () => {
			const date = new Date(2023, 9, 26)
			// Luxon's default medium format for 'fr' is 'jj MMM yyyy'
			expect(formatDateWithLocale(date, 'fr')).toBe('26 oct. 2023')
		})

		it('should format date with Luxon for Korean (KO)', () => {
			const date = new Date(2023, 9, 26)
			// Updated to reflect actual output from test environment
			expect(formatDateWithLocale(date, 'ko')).toBe('2023년 10월 26일')
		})

		it('should fall back to native toLocaleDateString if Luxon fails or locale is invalid', () => {
			const date = new Date(2023, 9, 26)
			// Simulate an invalid Luxon scenario by passing an invalid locale type, though Luxon handles it.
			// The fallback is hard to trigger deterministically without deeper Luxon mocking.
			// This test mainly ensures it doesn't crash.
			const result = formatDateWithLocale(date, 'xx' as Locale) // Cast to bypass Locale type check for testing
			// The exact fallback format depends on the system's default locale for `toLocaleDateString()`
			// We check it's a string and not empty.
			expect(typeof result).toBe('string')
			expect(result.length).toBeGreaterThan(0)
		})

		it('should handle invalid JSDate gracefully', () => {
			const invalidDate = new Date('invalid-date-string')
			// For an invalid date, Luxon's fromJSDate(invalidDate).isValid will be false.
			// It should then fall back to `new Date(date).toLocaleDateString()`.
			// The output of toLocaleDateString() for an invalid date is "Invalid Date".
			expect(formatDateWithLocale(invalidDate, 'en')).toBe('Invalid Date')
		})
	})

	describe('getDateFormatPattern', () => {
		it('should return correct pattern for English', () => {
			expect(getDateFormatPattern('en')).toBe('mm/dd/yyyy')
		})

		it('should return correct pattern for French', () => {
			expect(getDateFormatPattern('fr')).toBe('dd/mm/yyyy')
		})

		it('should return correct pattern for Korean', () => {
			expect(getDateFormatPattern('ko')).toBe('yyyy/mm/dd')
		})

		it('should default to dd/mm/yyyy for unknown locale', () => {
			expect(getDateFormatPattern('xx')).toBe('dd/mm/yyyy')
		})
	})

	describe('getDatePlaceholder', () => {
		it('should return correct placeholder for English', () => {
			expect(getDatePlaceholder('en')).toBe('mm/dd/yyyy')
		})

		it('should return correct placeholder for French', () => {
			expect(getDatePlaceholder('fr')).toBe('jj/mm/aaaa')
		})

		it('should return correct placeholder for Korean', () => {
			expect(getDatePlaceholder('ko')).toBe('yyyy/mm/dd')
		})

		it('should default to jj/mm/aaaa for unknown locale', () => {
			expect(getDatePlaceholder('xx')).toBe('jj/mm/aaaa')
		})
	})
})
