import { LocaleParams } from '@/lib/generateStaticParams'
import { getTranslations } from '@/lib/getDictionary'

import translations from './locales.json'
import FAQClient from './FAQClient'

export default async function FAQ({ localeParams }: { localeParams: Promise<LocaleParams> }) {
	const { locale } = await localeParams
	const t = getTranslations(locale, translations)

	return <FAQClient translations={t} />
}
