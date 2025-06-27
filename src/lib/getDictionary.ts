import globalLocalesData from './globalLocales.json'

/**
 * INTERNATIONAL TRANSLATIONS SYSTEM (i18n)
 * =========================================
 *
 * This file manages application translations in different languages.
 * It combines two types of translations:
 *
 * 1. GLOBAL TRANSLATIONS (globalLocales.json file)
 *    - Contains texts used throughout the app (app name, general messages, etc.)
 *    - Structure: { "en": { "GLOBAL": { "appName": "...", "welcomeMessage": "..." } }, "fr": {...} }
 *
 * 2. PAGE-SPECIFIC TRANSLATIONS (locales.json files in each folder)
 *    - Contains texts specific to a page or component
 *    - Structure: { "en": { "navbar": { "homeLink": "Home" } }, "fr": { "navbar": { "homeLink": "Accueil" } } }
 *
 * HOW IT WORKS:
 * - The getTranslations() function takes a language (ex: "en") and page translations
 * - It automatically retrieves corresponding global translations
 * - It returns an object that combines both: { GLOBAL: {...}, navbar: {...} }
 * - If a language doesn't exist, it uses English as default
 * - If the globalLocales.json file doesn't exist, it uses default values
 */

// TYPE DEFINITIONS (so TypeScript understands the data structure)
// ================================================================

// Type that describes the structure of a global translation for a language
// This type automatically adapts to the actual content of the globalLocales.json file
// Example: { GLOBAL: { appName: "My App", welcomeMessage: "Welcome!" } }
type GlobalTranslationFileContent = ImportedGlobalLocales[keyof ImportedGlobalLocales]

// Type that represents the entire imported globalLocales.json file
// TypeScript can thus know exactly which properties exist
type ImportedGlobalLocales = typeof globalLocalesData

// Type that describes a set of page translations for all languages
// The "T" is a generic type - it means we can adapt it according to the actual content
// Example: { "en": { "navbar": { "homeLink": "Home" } }, "fr": { "navbar": { "homeLink": "Accueil" } } }
type PageLocales<T extends PageTranslationContent> = Record<string, T>

// Type that describes the content of a page translation for a language
// Record<string, unknown> = an object with text keys and values of any type
// Example: { "navbar": { "homeLink": "Home" }, "button": { "submit": "Submit" } }
type PageTranslationContent = Record<string, unknown>

/**
 * MAIN FUNCTION: getTranslations
 * ===============================
 *
 * This function combines global translations and page-specific translations.
 *
 * PARAMETERS:
 * - locale: The requested language (ex: "en", "fr", "ko")
 * - pageLocaleJsonData: Page-specific translations (imported from a locales.json file)
 * - defaultLocale: The fallback language if the requested language doesn't exist (default: "en")
 *
 * RETURNS:
 * An object that combines global and page translations.
 * Example: { GLOBAL: { appName: "My App" }, navbar: { homeLink: "Home" } }
 *
 * LOGIC:
 * 1. Looks for page translations in the requested language
 * 2. If not found, uses the default language
 * 3. If still not found, uses the first available language
 * 4. Does the same for global translations
 * 5. Combines both and returns the result
 */
export function getTranslations<P extends PageTranslationContent, LocaleKey extends string = string>(
	locale: LocaleKey,
	pageLocaleJsonData: PageLocales<P>,
	defaultLocale: LocaleKey = 'en' as LocaleKey
): GlobalTranslationFileContent & P {
	// The return type combines global (GlobalTranslationFileContent) and page (P) translations

	// STEP 1: Get page-specific translations
	// ======================================
	const finalPageContent: P = getFallbackTranslation(
		locale,
		defaultLocale,
		pageLocaleJsonData,
		{} as P // Fallback value if no translation is found
	)

	// STEP 2: Get global translations
	// ===============================
	const typedGlobalLocales = globalLocalesData // Global data imported from JSON file

	// Dynamic initialization for fallback value
	const defaultGlobalContent: GlobalTranslationFileContent =
		Object.keys(typedGlobalLocales).length > 0
			? { ...typedGlobalLocales[Object.keys(typedGlobalLocales)[0] as keyof typeof globalLocalesData] }
			: ({ GLOBAL: {} } as GlobalTranslationFileContent) // Ensure GLOBAL key for empty source

	const finalGlobalContent: GlobalTranslationFileContent = getFallbackTranslation(
		locale,
		defaultLocale,
		typedGlobalLocales as Record<string, GlobalTranslationFileContent>,
		defaultGlobalContent
	)

	// STEP 3: Combine and return the result
	// =====================================
	// The "..." (spread) operator combines the two objects into one
	// If a key exists in both, the right one (finalGlobalContent) takes precedence
	return { ...finalPageContent, ...finalGlobalContent } as GlobalTranslationFileContent & P
}

/**
 * HELPER FUNCTION: getFallbackTranslation
 * ========================================
 *
 * This function implements the language selection logic with fallback.
 * It is used to avoid duplication between page and global translations.
 *
 * PARAMETERS:
 * - locale: The requested language
 * - defaultLocale: The fallback language
 * - localeData: The object containing all available translations
 * - fallbackValue: Default value if no translation is found
 *
 * LOGIC:
 * 1. Tries the requested language
 * 2. If not found, tries the default language
 * 3. If still not found, takes the first available language
 * 4. If no language available, returns the fallback value
 */
function getFallbackTranslation<T, LocaleKey extends string>(
	locale: LocaleKey,
	defaultLocale: LocaleKey,
	localeData: Record<string, T>,
	fallbackValue: T
): T {
	const availableKeys = Object.keys(localeData)

	if (availableKeys.includes(locale)) {
		return localeData[locale]
	} else if (availableKeys.includes(defaultLocale)) {
		return localeData[defaultLocale]
	} else if (availableKeys.length > 0) {
		return localeData[availableKeys[0]]
	}
	return fallbackValue
}

/**
 * EXEMPLE D'UTILISATION
 * =====================
 *
 * // Dans un composant React (ex: Navbar.tsx)
 * import { getTranslations } from './lib/getDictionary'
 * import pageTranslations from './locales.json'
 *
 * // Le fichier ./locales.json contient :
 * // {
 * //   "en": { "navbar": { "homeLink": "Home" } },
 * //   "fr": { "navbar": { "homeLink": "Accueil" } }
 * // }
 *
 * export default function Navbar() {
 *   const locale = "en" // Retrieved from a language detection system
 *
 *   // Function call - automatically combines global and page translations
 *   const t = getTranslations(locale, pageTranslations)
 *
 *   // Utilisation :
 *   // t.GLOBAL.appName     -> "Mon App" (depuis globalLocales.json)
 *   // t.navbar.homeLink    -> "Accueil" (depuis le fichier locales.json local)
 *
 *   return (
 *     <nav>
 *       <h1>{t.GLOBAL.appName}</h1>
 *       <Link href="/">{t.navbar.homeLink}</Link>
 *     </nav>
 *   )
 * }
 *
 * AVANTAGES DE CETTE APPROCHE :
 * - Un seul appel de fonction pour récupérer toutes les traductions nécessaires
 * - TypeScript connaît exactement quelles propriétés existent (autocomplétion)
 * - Gestion automatique des langues de secours
 * - Séparation claire entre traductions globales et spécifiques
 */
