import { afterEach, describe, expect, it, vi } from 'vitest'

// Mock data content is imported to be used within vi.doMock factories
import mockGlobalLocalesFileContent from '@/lib/__mocks__/globalLocales.json'

// Sample PageLocales data for testing
const samplePageLocales = {
	fr: {
		page: { title: 'Titre de Page FR', greeting: 'Bonjour FR' },
		common: { submit: 'Soumettre FR' },
	},
	en: {
		page: { title: 'Page Title EN', greeting: 'Hello EN' },
		common: { submit: 'Submit EN' },
	},
}
type PageLocales<P> = Record<string, P> // Kept for typing {} as PageLocales<never>

describe('getTranslations', () => {
	afterEach(() => {
		vi.resetModules()
	})

	const setupStandardGlobalMock = () => {
		vi.doMock('@/lib/globalLocales.json', () => ({ default: mockGlobalLocalesFileContent }))
	}

	const setupEmptyGlobalMock = () => {
		vi.doMock('@/lib/globalLocales.json', () => ({ default: {} }))
	}

	it('should return combined translations when locale exists in both page and global', async () => {
		setupStandardGlobalMock()
		const { getTranslations } = await import('@/lib/getDictionary')
		const translations = getTranslations('en', samplePageLocales) // Let generics be inferred
		expect((translations as any).GLOBAL.appName).toBe('Test App EN Mocked')
		expect((translations as any).page.title).toBe('Page Title EN')
		expect((translations as any).common.submit).toBe('Submit EN')
	})

	it('should use default locale (en) for page if requested locale (es) for page does not exist', async () => {
		setupStandardGlobalMock()
		const { getTranslations } = await import('@/lib/getDictionary')
		const translations = getTranslations('es', samplePageLocales, 'en') // Infer generics
		expect((translations as any).GLOBAL.appName).toBe('Test App ES Mocked')
		expect((translations as any).page.title).toBe('Page Title EN')
		expect((translations as any).common.submit).toBe('Submit EN')
	})

	it('should use default locale (en) for global if requested locale for global does not exist', async () => {
		setupStandardGlobalMock()
		const { getTranslations } = await import('@/lib/getDictionary')
		const translations = getTranslations('ko', samplePageLocales, 'en') // Infer generics
		expect((translations as any).GLOBAL.appName).toBe('Test App EN Mocked')
		expect((translations as any).page.title).toBe('Page Title EN')
	})

	it('should handle requested locale not present in page or global, falling back to default for both', async () => {
		setupStandardGlobalMock()
		const { getTranslations } = await import('@/lib/getDictionary')
		const translations = getTranslations('de', samplePageLocales, 'fr') // Infer generics
		expect((translations as any).GLOBAL.appName).toBe('Test App FR Mocked')
		expect((translations as any).page.title).toBe('Titre de Page FR')
	})

	it('should correctly use a specified defaultLocale when requested locale is missing', async () => {
		setupStandardGlobalMock()
		const { getTranslations } = await import('@/lib/getDictionary')
		const translations = getTranslations('it', samplePageLocales, 'fr') // Infer generics
		expect((translations as any).GLOBAL.appName).toBe('Test App FR Mocked')
		expect((translations as any).page.title).toBe('Titre de Page FR')
	})

	it('should return empty global content if globalLocales.json was empty and page content for default', async () => {
		setupEmptyGlobalMock()
		const { getTranslations } = await import('@/lib/getDictionary')
		const emptyGlobalPageLocales = { en: { page: { title: 'Page EN' } } }
		// Let P be inferred
		const translations = getTranslations('en', emptyGlobalPageLocales, 'en')
		expect((translations as any).GLOBAL).toEqual({})
		expect((translations as any).page.title).toBe('Page EN')
	})

	it('should handle pageLocaleJsonData being empty, returning only global translations', async () => {
		setupStandardGlobalMock()
		const { getTranslations } = await import('@/lib/getDictionary')
		// Let P be inferred as Record<string, never> from {}
		const translations = getTranslations('en', {} as PageLocales<never>, 'en')
		expect((translations as any).GLOBAL.appName).toBe('Test App EN Mocked')
		expect(Object.keys(translations).filter(k => k !== 'GLOBAL')).toEqual([])
	})

	it('should correctly merge global and page translations, with global taking precedence on conflict', async () => {
		setupStandardGlobalMock()
		const { getTranslations } = await import('@/lib/getDictionary')
		const conflictingPageLocales = {
			en: {
				page: { title: 'Page Title EN' },
				GLOBAL: { appName: 'Page Specific AppName EN' },
			},
		}
		// Let P be inferred
		const translations = getTranslations('en', conflictingPageLocales)
		expect((translations as any).GLOBAL.appName).toBe('Test App EN Mocked')
		expect((translations as any).page.title).toBe('Page Title EN')
	})
})
