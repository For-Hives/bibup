import { afterEach, describe, expect, it, vi } from 'vitest'

import { type LocaleParams } from '@/lib/generateStaticParams'
import { type Locale } from '@/lib/i18n-config'

// Consistent set of locales based on actual Locale type for these tests
const baseTestLocales: Locale[] = ['en', 'fr', 'ko']

describe('generateLocaleParams', () => {
	afterEach(() => {
		vi.resetModules()
	})

	it('should return an array of locale params based on defined i18n.locales', async () => {
		vi.doMock('@/lib/i18n-config', () => ({
			i18n: { locales: baseTestLocales, defaultLocale: 'en' as Locale },
		}))
		const { generateLocaleParams } = await import('@/lib/generateStaticParams')
		const params = generateLocaleParams()
		expect(params).toHaveLength(baseTestLocales.length)
		baseTestLocales.forEach((locale, index) => {
			expect(params[index]).toEqual({ locale: locale })
		})
	})

	it('should return an empty array if i18n.locales is empty', async () => {
		vi.doMock('@/lib/i18n-config', () => ({
			i18n: { locales: [], defaultLocale: 'en' as Locale },
		}))
		const { generateLocaleParams } = await import('@/lib/generateStaticParams')
		const params = generateLocaleParams()
		expect(params).toEqual([])
	})

	it('should ensure returned locale values match the specific mocked i18n.locales for the test', async () => {
		const currentTestLocales: Locale[] = ['en', 'ko'] // Use valid Locale types
		vi.doMock('@/lib/i18n-config', () => ({
			i18n: { locales: currentTestLocales, defaultLocale: 'en' as Locale },
		}))
		const { generateLocaleParams } = await import('@/lib/generateStaticParams')
		const params = generateLocaleParams()
		const returnedLocales = params.map(p => p.locale)
		expect(returnedLocales).toEqual(currentTestLocales)
	})

	it('should ensure each param object is of type LocaleParams and locale is in mocked list', async () => {
		const currentTestLocales: Locale[] = ['fr'] // Use valid Locale types
		vi.doMock('@/lib/i18n-config', () => ({
			i18n: { locales: currentTestLocales, defaultLocale: 'fr' as Locale },
		}))
		const { generateLocaleParams } = await import('@/lib/generateStaticParams')
		const params: LocaleParams[] = generateLocaleParams()
		params.forEach(param => {
			expect(param).toHaveProperty('locale')
			expect(typeof param.locale).toBe('string')
			expect(currentTestLocales).toContain(param.locale)
		})
	})
})
