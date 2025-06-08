import 'server-only'

// Defines the structure for a locales.json file, mapping locale codes (e.g., "en")
// to their respective PageTranslations.
export type LocaleData = Record<string, PageTranslations>

// Defines the structure for translations of a single page/component.
// Allows for nested objects where values are strings or further PageTranslations objects.
export interface PageTranslations {
	[key: string]: PageTranslations | string | undefined // Allow undefined for optional properties
}

/**
 * Extracts translations for a specific locale from loaded locales.json content.
 *
 * @param locale The desired locale (e.g., 'en', 'fr').
 * @param localeJsonContent The content of the locales.json file (parsed JSON object).
 * @param defaultLocale The default locale to use if the desired locale is not found (defaults to 'en').
 * @returns The translations (PageTranslations) for the given locale.
 *          Returns translations for the defaultLocale if the requested locale is not found.
 *          Returns an empty object if neither the requested nor the default locale is found,
 *          or if localeJsonContent is invalid.
 */
export const getTranslationsFromData = (
	locale: string,
	localeJsonContent: unknown, // Use unknown for safer type checking from JSON import
	defaultLocale: string = 'en'
): PageTranslations => {
	// Validate localeJsonContent is a non-null object and not an array
	if (typeof localeJsonContent !== 'object' || localeJsonContent === null || Array.isArray(localeJsonContent)) {
		return {} // Return an empty PageTranslations-compatible object
	}

	// Type assertion after basic validation
	const data = localeJsonContent as Record<string, unknown>

	// Helper to validate if a value can be considered a candidate for PageTranslations
	// (i.e., it's a non-null, non-array object).
	const isPageTranslationsCandidate = (value: unknown): value is PageTranslations => {
		return typeof value === 'object' && value !== null && !Array.isArray(value)
	}

	// Try to get translations for the current locale
	if (Object.prototype.hasOwnProperty.call(data, locale)) {
		const translations = data[locale]
		if (isPageTranslationsCandidate(translations)) {
			return translations
		}
	}

	// Fallback to default locale
	if (Object.prototype.hasOwnProperty.call(data, defaultLocale)) {
		const translations = data[defaultLocale]
		if (isPageTranslationsCandidate(translations)) {
			return translations
		}
	}

	return {} // Return an empty PageTranslations-compatible object
}

// The `Dictionary` type now refers to the translations for a single component/page.
export type Dictionary = PageTranslations

// The original `dictionaries` constant and `getDictionary` function that loaded
// from `src/dictionaries/*.json` are removed.
