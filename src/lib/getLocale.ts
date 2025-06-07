'use server'
import { headers } from 'next/headers'

export async function getLocale() {
	try {
		// Get the Accept-Language header from the request
		const headersList = await headers()
		const acceptLanguage = headersList.get('accept-language') ?? ''

		// Parse the accept-language header to find the preferred language
		const languages = acceptLanguage
			.split(',')
			.map(lang => {
				const [code, quality = '1'] = lang.trim().split(';q=')
				return {
					quality: parseFloat(quality),
					code: code.split('-')[0],
				}
			})
			.sort((a, b) => b.quality - a.quality)

		// Supported locales
		const supportedLocales = ['en', 'fr', 'ko']

		// Find the first supported language
		for (const lang of languages) {
			if (supportedLocales.includes(lang.code)) {
				return lang.code
			}
		}

		return 'en'
	} catch (error) {
		// During static generation, headers() might not be available
		// Return default locale

		console.error('Error getting locale:', error)
		return 'en'
	}
}
