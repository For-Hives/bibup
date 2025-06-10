import globalLocalesData from './globalLocales.json'

/**
 * SYSTÈME DE TRADUCTIONS INTERNATIONALES (i18n)
 * ==============================================
 *
 * Ce fichier gère les traductions de l'application dans différentes langues.
 * Il combine deux types de traductions :
 *
 * 1. TRADUCTIONS GLOBALES (fichier globalLocales.json)
 *    - Contient les textes utilisés partout dans l'app (nom de l'app, messages généraux, etc.)
 *    - Structure : { "en": { "GLOBAL": { "appName": "...", "welcomeMessage": "..." } }, "fr": {...} }
 *
 * 2. TRADUCTIONS SPÉCIFIQUES À UNE PAGE (fichiers locales.json dans chaque dossier)
 *    - Contient les textes spécifiques à une page ou composant
 *    - Structure : { "en": { "navbar": { "homeLink": "Home" } }, "fr": { "navbar": { "homeLink": "Accueil" } } }
 *
 * COMMENT ÇA MARCHE :
 * - La fonction getTranslations() prend une langue (ex: "fr") et les traductions de page
 * - Elle récupère automatiquement les traductions globales correspondantes
 * - Elle retourne un objet qui combine les deux : { GLOBAL: {...}, navbar: {...} }
 * - Si une langue n'existe pas, elle utilise l'anglais par défaut
 * - Si le fichier globalLocales.json n'existe pas, elle utilise des valeurs par défaut
 */
import 'server-only'

// DÉFINITION DES TYPES (pour que TypeScript comprenne la structure des données)
// ===============================================================================

// Type qui décrit la structure d'une traduction globale pour une langue
// Ce type s'adapte automatiquement au contenu réel du fichier globalLocales.json
// Exemple : { GLOBAL: { appName: "Mon App", welcomeMessage: "Bienvenue !" } }
type GlobalTranslationFileContent = ImportedGlobalLocales[keyof ImportedGlobalLocales]

// Type qui représente tout le fichier globalLocales.json importé
// TypeScript peut ainsi connaître exactement quelles propriétés existent
type ImportedGlobalLocales = typeof globalLocalesData

// Type qui décrit un ensemble de traductions de page pour toutes les langues
// Le "T" est un type générique - ça veut dire qu'on peut l'adapter selon le contenu réel
// Exemple : { "en": { "navbar": { "homeLink": "Home" } }, "fr": { "navbar": { "homeLink": "Accueil" } } }
type PageLocales<T extends PageTranslationContent> = Record<string, T>

// Type qui décrit le contenu d'une traduction de page pour une langue
// Record<string, unknown> = un objet avec des clés texte et des valeurs de n'importe quel type
// Exemple : { "navbar": { "homeLink": "Home" }, "button": { "submit": "Submit" } }
type PageTranslationContent = Record<string, unknown>

/**
 * FONCTION PRINCIPALE : getTranslations
 * =====================================
 *
 * Cette fonction combine les traductions globales et les traductions spécifiques à une page.
 *
 * PARAMÈTRES :
 * - locale : La langue demandée (ex: "fr", "en", "ko")
 * - pageLocaleJsonData : Les traductions spécifiques à la page (importées depuis un fichier locales.json)
 * - defaultLocale : La langue de secours si la langue demandée n'existe pas (par défaut: "en")
 *
 * RETOURNE :
 * Un objet qui combine les traductions globales et de page.
 * Exemple : { GLOBAL: { appName: "Mon App" }, navbar: { homeLink: "Accueil" } }
 *
 * LOGIQUE :
 * 1. Cherche les traductions de page dans la langue demandée
 * 2. Si introuvable, utilise la langue par défaut
 * 3. Si toujours introuvable, utilise la première langue disponible
 * 4. Fait la même chose pour les traductions globales
 * 5. Combine les deux et retourne le résultat
 */
export function getTranslations<P extends PageTranslationContent, LocaleKey extends string = string>(
	locale: LocaleKey,
	pageLocaleJsonData: PageLocales<P>,
	defaultLocale: LocaleKey = 'en' as LocaleKey
): GlobalTranslationFileContent & P {
	// Le type de retour combine les traductions globales (GlobalTranslationFileContent) et de page (P)

	// ÉTAPE 1 : Récupérer les traductions spécifiques à la page
	// =========================================================
	const finalPageContent: P = getFallbackTranslation(
		locale,
		defaultLocale,
		pageLocaleJsonData,
		{} as P // Valeur de fallback si aucune traduction n'est trouvée
	)

	// ÉTAPE 2 : Récupérer les traductions globales
	// =============================================
	const typedGlobalLocales = globalLocalesData // Les données globales importées du fichier JSON

	// Initialisation dynamique pour la valeur de fallback
	const defaultGlobalContent: GlobalTranslationFileContent =
		Object.keys(typedGlobalLocales).length > 0
			? { ...typedGlobalLocales[Object.keys(typedGlobalLocales)[0] as keyof typeof globalLocalesData] }
			: ({} as GlobalTranslationFileContent)

	const finalGlobalContent: GlobalTranslationFileContent = getFallbackTranslation(
		locale,
		defaultLocale,
		typedGlobalLocales as Record<string, GlobalTranslationFileContent>,
		defaultGlobalContent
	)

	// ÉTAPE 3 : Combiner et retourner le résultat
	// ============================================
	// L'opérateur "..." (spread) combine les deux objets en un seul
	// Si une clé existe dans les deux, celle de droite (finalGlobalContent) prend le dessus
	return { ...finalPageContent, ...finalGlobalContent }
}

/**
 * HELPER FUNCTION: getFallbackTranslation
 * ========================================
 *
 * Cette fonction implémente la logique de sélection de langue avec fallback.
 * Elle est utilisée pour éviter la duplication entre les traductions de page et globales.
 *
 * PARAMÈTRES :
 * - locale : La langue demandée
 * - defaultLocale : La langue de secours
 * - localeData : L'objet contenant toutes les traductions disponibles
 * - fallbackValue : Valeur par défaut si aucune traduction n'est trouvée
 *
 * LOGIQUE :
 * 1. Essaie la langue demandée
 * 2. Si introuvable, essaie la langue par défaut
 * 3. Si toujours introuvable, prend la première langue disponible
 * 4. Si aucune langue disponible, retourne la valeur de fallback
 */
function getFallbackTranslation<T, LocaleKey extends string>(
	locale: LocaleKey,
	defaultLocale: LocaleKey,
	localeData: Record<string, T>,
	fallbackValue: T
): T {
	const availableKeys = Object.keys(localeData)

	// Essaie de trouver les traductions dans la langue demandée
	if (availableKeys.includes(locale)) {
		return localeData[locale]
	}
	// Si pas trouvé, essaie avec la langue par défaut
	else if (availableKeys.includes(defaultLocale)) {
		return localeData[defaultLocale]
	}
	// Si toujours pas trouvé, prend la première langue disponible
	else if (availableKeys.length > 0) {
		return localeData[availableKeys[0]]
	}
	// Si aucune langue disponible, retourne la valeur de fallback
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
 *   const locale = "fr" // Récupéré depuis un système de détection de langue
 *
 *   // Appel de la fonction - elle combine automatiquement les traductions globales et de page
 *   const t = getTranslations(locale, pageTranslations)
 *
 *   // Utilisation :
 *   // t.GLOBAL.appName     -> "Mon App" (depuis globalLocales.json)
 *   // t.navbar.homeLink    -> "Accueil" (depuis le fichier locales.json local)
 *
 *   return (
 *     <nav>
 *       <h1>{t.GLOBAL.appName}</h1>
 *       <a href="/">{t.navbar.homeLink}</a>
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
