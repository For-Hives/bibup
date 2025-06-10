import globalLocalesData from './globalLocales.json'

import 'server-only'

// Type for the entire globalLocales.json file structure
type AllGlobalLocales = Record<string, GlobalTranslationFileContent>

// Type for the content of a global locale file, e.g., { "GLOBAL": { "appName": "My App" } }
// This is the structure of globalLocalesData['en'], globalLocalesData['fr'], etc.
type GlobalTranslationFileContent = { GLOBAL: Record<string, string> }

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

	// Cast the imported JSON to our detailed type
	const typedGlobalLocales = globalLocalesData as AllGlobalLocales

	let finalGlobalContent: GlobalTranslationFileContent = { GLOBAL: {} } // Default to empty GLOBAL object

	const globalLocaleKeys = Object.keys(typedGlobalLocales)

	if (globalLocaleKeys.includes(locale)) {
		finalGlobalContent = typedGlobalLocales[locale]
	} else if (globalLocaleKeys.includes(defaultLocale)) {
		finalGlobalContent = typedGlobalLocales[defaultLocale]
	} else if (globalLocaleKeys.length > 0) {
		// Similar casting consideration for globalLocaleKeys[0]
		finalGlobalContent = typedGlobalLocales[globalLocaleKeys[0] as LocaleKey]
	}

	// Ensure the GLOBAL property is present, as expected by GlobalTranslationFileContent
	// This double-checks, complementing the initial { GLOBAL: {} }.
	if (typeof finalGlobalContent?.GLOBAL === 'undefined') {
		finalGlobalContent = { GLOBAL: {} }
	}

	return { ...finalPageContent, ...finalGlobalContent }
}
