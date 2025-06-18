'use server'
import { headers } from 'next/headers'

export async function getLocale() {
	try {
		// Get headers including cookies
		const headersList = await headers()

		// Check for language preference in cookies first
		const cookieHeader = headersList.get('cookie')
		if (cookieHeader !== null && cookieHeader.length > 0) {
			const cookies = cookieHeader.split(';').reduce((acc: Record<string, string>, cookie) => {
				const [key, value] = cookie.trim().split('=')
				if (key && value) {
					acc[key] = value
				}
				return acc
			}, {})

			const cookieLocale = cookies['NEXT_LOCALE']
			if (cookieLocale && ['en', 'fr', 'ko'].includes(cookieLocale)) {
				return cookieLocale
			}
		}

		// Fallback to Accept-Language header
		const acceptLanguage = headersList.get('accept-language') ?? ''

		// Parse the accept-language header to find the preferred language
		const languages =
			acceptLanguage.length > 0
				? acceptLanguage
						.split(',')
						.map(lang => {
							const [code, quality = '1'] = lang.trim().split(';q=')
							return {
								quality: parseFloat(quality),
								code: code.split('-')[0],
							}
						})
						.sort((a, b) => b.quality - a.quality)
				: []

		// Supported locales
		const supportedLocales = ['en', 'fr', 'ko']

		// Find the first supported language
		if (languages.length > 0) {
			for (const lang of languages) {
				if (supportedLocales.includes(lang.code)) {
					return lang.code
				}
			}
		}

		return 'en'
	} catch {
		// During static generation, headers() might not be available
		// Return default locale
		return 'en'
	}
}
