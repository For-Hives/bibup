import { LocaleParams } from '@/lib/generateStaticParams'
import { getTranslations } from '@/lib/getDictionary'

import BibStatsClient from './BibStatsClient'
import translations from './locales.json'

export default async function BibStats({ localeParams }: { localeParams: Promise<LocaleParams> }) {
	const { locale } = await localeParams

	const t = getTranslations(locale, translations)

	return <BibStatsClient translations={t} />
}
