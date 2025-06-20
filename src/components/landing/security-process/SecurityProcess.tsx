import { LocaleParams } from '@/lib/generateStaticParams'
import { getTranslations } from '@/lib/getDictionary'

import SecurityProcessClient from './SecurityProcessClient'
import translations from './locales.json'

export default async function SecurityProcess({ localeParams }: { localeParams: Promise<LocaleParams> }) {
	const { locale } = await localeParams

	const t = getTranslations(locale, translations)

	return <SecurityProcessClient translations={t} />
}
