import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import BibStatsClient from './BibStatsClient'
import translations from './locales.json'

export default async function BibStats() {
	const locale = await getLocale()
	const t = getTranslations(locale, translations)

	return <BibStatsClient translations={t} />
}
