/**
 * Utility functions for date handling and localization
 */

import { DateTime } from 'luxon'

import { Locale } from './i18n-config'

/**
 * Converts a datetime-local string to a date string (YYYY-MM-DD)
 * @param datetimeString - The datetime string (YYYY-MM-DDTHH:mm format)
 * @returns Date string in YYYY-MM-DD format
 */
export function datetimeToDate(datetimeString: string): string {
	if (!datetimeString) return ''
	return datetimeString.split('T')[0]
}

/**
 * Formats a date string to be displayed according to the locale
 * @param dateString - The date string (YYYY-MM-DD format)
 * @param locale - The locale ('en', 'fr', 'ko')
 * @returns Formatted date string
 */
export function formatDateForDisplay(dateString: string, locale: string = 'en'): string {
	if (!dateString) return ''

	try {
		const date = new Date(dateString)

		// Handle different locales
		switch (locale) {
			case 'en':
				return date.toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				})
			case 'fr':
				return date.toLocaleDateString('fr-FR', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				})
			case 'ko':
				return date.toLocaleDateString('ko-KR', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				})
			default:
				return date.toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				})
		}
	} catch (error) {
		console.error('Error formatting date:', error)
		return dateString
	}
}

/**
 * Converts a date string to the format expected by HTML date inputs (YYYY-MM-DD)
 * @param dateString - The date string
 * @returns Date string in YYYY-MM-DD format
 */
export function formatDateForInput(dateString: string): string {
	if (!dateString) return ''

	try {
		const date = new Date(dateString)
		return date.toISOString().split('T')[0]
	} catch (error) {
		console.error('Error formatting date for input:', error)
		return ''
	}
}

// Helper function to format date with Luxon safely
export function formatDateWithLocale(date: Date, locale: Locale): string {
	try {
		const dt = DateTime.fromJSDate(date)
		if (!dt.isValid) {
			return new Date(date).toLocaleDateString()
		}

		// Use provided locale, or automatically detect browser locale
		const targetLocaleFromPath = locale ?? (typeof navigator !== 'undefined' ? navigator.language : 'en-US')
		const dateTime = dt.setLocale(targetLocaleFromPath)

		// Check if locale is valid after configuration
		if (!dateTime.isValid) {
			// If locale is not supported, use default locale
			return dt.toLocaleString(DateTime.DATE_MED)
		}

		return dateTime.toLocaleString(DateTime.DATE_MED)
	} catch {
		// Fallback to native JavaScript Date formatting
		return new Date(date).toLocaleDateString()
	}
}

/**
 * Gets the locale-specific date format pattern
 * @param locale - The locale ('en', 'fr', 'ko')
 * @returns Date format pattern
 */
export function getDateFormatPattern(locale: string = 'en'): string {
	switch (locale) {
		case 'en':
			return 'mm/dd/yyyy'
		case 'fr':
			return 'dd/mm/yyyy'
		case 'ko':
			return 'yyyy/mm/dd'
		default:
			return 'dd/mm/yyyy'
	}
}

/**
 * Gets the locale-specific placeholder for date inputs
 * @param locale - The locale ('en', 'fr', 'ko')
 * @returns Placeholder text
 */
export function getDatePlaceholder(locale: string = 'en'): string {
	switch (locale) {
		case 'en':
			return 'mm/dd/yyyy'
		case 'fr':
			return 'jj/mm/aaaa'
		case 'ko':
			return 'yyyy/mm/dd'
		default:
			return 'jj/mm/aaaa'
	}
}
