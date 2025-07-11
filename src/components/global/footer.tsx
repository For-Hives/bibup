import Link from 'next/link'

import { LocaleParams } from '@/lib/generateStaticParams'
import { getTranslations } from '@/lib/getDictionary'

import LanguageSelector from './LanguageSelector'
import translations from './locales.json'

export default async function Footer({ localeParams }: { localeParams: Promise<LocaleParams> }) {
	const { locale } = await localeParams

	const t = getTranslations(locale, translations)

	return (
		<footer className="row-start-3 mt-10 flex flex-wrap items-center justify-between gap-4 border-t p-6">
			<p className="flex items-center gap-1">
				{t.footer.madeWith} ❤️ {t.footer.by}{' '}
				<Link className="underline" href="https://forhives.fr/">
					ForHives
				</Link>
			</p>

			<LanguageSelector currentLocale={locale} />
		</footer>
	)
}
