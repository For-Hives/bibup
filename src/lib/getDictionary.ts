import 'server-only'

const dictionaries = {
	en: () => import('../dictionaries/en.json').then(module => module.default),
	fr: () => import('../dictionaries/fr.json').then(module => module.default),
	ko: () => import('../dictionaries/ko.json').then(module => module.default),
}

export const getDictionary = async (locale: string) => {
	// Default to 'en' if locale is not supported
	const supportedLocale = Object.keys(dictionaries).includes(locale) ? locale : 'en'
	return dictionaries[supportedLocale as keyof typeof dictionaries]()
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
