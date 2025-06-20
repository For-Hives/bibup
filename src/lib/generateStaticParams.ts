import { i18n, type Locale } from './i18n-config'

/**
 * Type for locale params
 */
export type LocaleParams = {
	locale: Locale
}

/**
 * Generate static params for all locales
 * This function is used to generate static pages for each locale at build time
 * Used by pages and layouts that need to be statically generated
 */
export function generateLocaleParams() {
	return i18n.locales.map(locale => ({
		locale: locale,
	}))
}
