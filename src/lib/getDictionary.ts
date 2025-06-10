import globalLocalesData from './globalLocales.json'

import 'server-only'

type GlobalTranslationFileContent = ImportedGlobalLocales[keyof ImportedGlobalLocales]
// Infer the actual type from the imported JSON data
type ImportedGlobalLocales = typeof globalLocalesData

// Structure for all page-specific translations, e.g., { en: { pageTitle: "..." }, fr: { pageTitle: "..." } }
type PageLocales<T extends PageTranslationContent> = Record<string, T>

// Type for the content of a standard locale, e.g., { "pageTitle": "My Page" }
type PageTranslationContent = Record<string, unknown>

export function getTranslations<P extends PageTranslationContent, LocaleKey extends string = string>(
	locale: LocaleKey,
	pageLocaleJsonData: PageLocales<P>,
	defaultLocale: LocaleKey = 'en' as LocaleKey
): GlobalTranslationFileContent & P {
	// Return type combines page content with the global structure

	let finalPageContent: P = {} as P
	const pageKeys = Object.keys(pageLocaleJsonData)

	if (pageKeys.includes(locale)) {
		finalPageContent = pageLocaleJsonData[locale]
	} else if (pageKeys.includes(defaultLocale)) {
		finalPageContent = pageLocaleJsonData[defaultLocale]
	} else if (pageKeys.length > 0) {
		// Ensure the key is treated as LocaleKey for type safety if pageKeys[0] might not be.
		// However, Object.keys returns string[], so this cast is for conceptual alignment.
		finalPageContent = pageLocaleJsonData[pageKeys[0] as LocaleKey]
	}

	// Use the imported JSON data directly with proper typing
	const typedGlobalLocales = globalLocalesData

	let finalGlobalContent: GlobalTranslationFileContent = { GLOBAL: { welcomeMessage: '', appName: '' } } // Default with proper structure

	const globalLocaleKeys = Object.keys(typedGlobalLocales)

	if (globalLocaleKeys.includes(locale)) {
		finalGlobalContent = typedGlobalLocales[locale as keyof typeof globalLocalesData]
	} else if (globalLocaleKeys.includes(defaultLocale)) {
		finalGlobalContent = typedGlobalLocales[defaultLocale as keyof typeof globalLocalesData]
	} else if (globalLocaleKeys.length > 0) {
		// Use the first available locale
		const firstLocale = globalLocaleKeys[0] as keyof typeof globalLocalesData
		finalGlobalContent = typedGlobalLocales[firstLocale]
	}

	// Ensure the GLOBAL property is present, as expected by GlobalTranslationFileContent
	if (typeof finalGlobalContent?.GLOBAL === 'undefined') {
		finalGlobalContent = { GLOBAL: { welcomeMessage: '', appName: '' } }
	}

	return { ...finalPageContent, ...finalGlobalContent }
}
