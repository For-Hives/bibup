import 'server-only'

/**
 * Advanced type-safe translation function with automatic type inference.
 * Returns the exact structure of your default locale with full type safety.
 * No manual type assertions needed!
 *
 * @example
 * ```tsx
 * import translations from './locales.json'
 *
 * const t = getTranslations(locale, translations)
 * // t is automatically typed as typeof translations.en (or your default locale)
 * ```
 */
export function getTranslations<const T extends Record<string, Record<string, unknown>>, K extends keyof T = 'en'>(
	locale: string,
	localeJsonData: T,
	defaultLocale: K = 'en' as K
): T[K] {
	// Try to get the specific locale
	if (locale in localeJsonData) {
		return localeJsonData[locale] as T[K]
	}

	// Fallback to default locale
	if (defaultLocale in localeJsonData) {
		return localeJsonData[defaultLocale]
	}

	// Fallback to first available locale
	const availableLocales = Object.keys(localeJsonData) as (keyof T)[]
	if (availableLocales.length > 0) {
		return localeJsonData[availableLocales[0]] as T[K]
	}

	// This should never happen with valid JSON, but satisfies TypeScript
	return {} as T[K]
}

// The Dictionary type can be removed or kept as a general reference to PageTranslations
// if needed elsewhere, but components should rely on the inferred type from getTranslationsFromData.
// For now, we'll remove it to encourage use of the inferred types.
// export type Dictionary = PageTranslations;
