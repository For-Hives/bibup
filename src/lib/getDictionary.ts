import 'server-only'

// Structure for all global translations, e.g., { en: { GLOBAL: { appName: "..." } }, fr: { GLOBAL: { appName: "..." } } }
type GlobalLocales<T extends GlobalTranslationFileContent> = Record<string, T>

// Content of a global locale file, e.g., { "GLOBAL": { "appName": "My App" } }
type GlobalTranslationFileContent = { GLOBAL: Record<string, string> }

// Structure for all page-specific translations, e.g., { en: { pageTitle: "..." }, fr: { pageTitle: "..." } }
type PageLocales<T extends PageTranslationContent> = Record<string, T>

// Content of a standard locale, e.g., { "pageTitle": "My Page" }
type PageTranslationContent = Record<string, unknown>

export function getTranslations<
	P extends PageTranslationContent,
	G extends GlobalTranslationFileContent,
	LocaleKey extends string = string, // Represents keys like 'en', 'fr'
>(
	locale: LocaleKey,
	pageLocaleJsonData: PageLocales<P>,
	globalLocaleJsonData?: GlobalLocales<G>,
	defaultLocale: LocaleKey = 'en' as LocaleKey
): G & P {
	// The return type is the combination of page content and global content for the resolved locale

	let finalPageContent: P = {} as P // P is Record<string, unknown>, so {} is a valid P.
	const pageKeys = Object.keys(pageLocaleJsonData)

	if (pageKeys.includes(locale)) {
		finalPageContent = pageLocaleJsonData[locale]
	} else if (pageKeys.includes(defaultLocale)) {
		finalPageContent = pageLocaleJsonData[defaultLocale]
	} else if (pageKeys.length > 0) {
		finalPageContent = pageLocaleJsonData[pageKeys[0] as LocaleKey]
	}
	// If pageKeys is empty, finalPageContent remains {}.

	// Initialize finalGlobalContent to ensure it conforms to G, especially the GLOBAL key.
	// G is { GLOBAL: Record<string, string> }.
	let finalGlobalContent: G = { GLOBAL: {} } as G

	if (globalLocaleJsonData) {
		const globalKeys = Object.keys(globalLocaleJsonData)
		let resolvedGlobalKey: LocaleKey | undefined = undefined

		if (globalKeys.includes(locale)) {
			resolvedGlobalKey = locale
		} else if (globalKeys.includes(defaultLocale)) {
			resolvedGlobalKey = defaultLocale
		} else if (globalKeys.length > 0) {
			resolvedGlobalKey = globalKeys[0] as LocaleKey
		}

		// Explicitly check if resolvedGlobalKey is not undefined and is a property of globalLocaleJsonData
		if (resolvedGlobalKey !== undefined && globalLocaleJsonData.hasOwnProperty(resolvedGlobalKey)) {
			finalGlobalContent = globalLocaleJsonData[resolvedGlobalKey]
		}
		// If no suitable global locale is found within globalLocaleJsonData,
		// finalGlobalContent retains its initial { GLOBAL: {} } as G shape.
	}
	// If globalLocaleJsonData is not provided at all,
	// finalGlobalContent also retains its initial { GLOBAL: {} } as G shape.

	return { ...finalPageContent, ...finalGlobalContent }
}
