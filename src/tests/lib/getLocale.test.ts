import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest' // Removed SpyInstance type import

import { type Locale } from '@/lib/i18n-config'
import { getLocale } from '@/lib/getLocale'

vi.mock('@/lib/i18n-config', async importOriginal => {
	const originalConfig = await importOriginal<typeof import('@/lib/i18n-config')>()
	return {
		...originalConfig,
		i18n: {
			...originalConfig.i18n,
			locales: ['en', 'fr', 'es'] as Locale[],
			defaultLocale: 'en' as Locale,
		},
	}
})

describe('getLocale', () => {
	let consoleWarnSpy: ReturnType<typeof vi.spyOn> // Let type be inferred

	beforeEach(() => {
		consoleWarnSpy = vi.spyOn<Console, 'warn'>(console, 'warn').mockImplementation((): void => {})
	})

	afterEach(() => {
		if (consoleWarnSpy !== undefined) {
			consoleWarnSpy.mockRestore()
		}
	})

	it('should return the defaultLocale from i18n config', async () => {
		const locale = await getLocale()
		expect(locale).toBe('en')
	})

	it('should call console.warn with the deprecation message', async () => {
		await getLocale()
		expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			'getLocale() is deprecated. Use getLocaleFromParams() with route params instead.'
		)
	})

	it('should return a different default locale if i18n config is mocked differently', async () => {
		const locale = await getLocale()
		expect(locale).toBe('en')
	})
})
