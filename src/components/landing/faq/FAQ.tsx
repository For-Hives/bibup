import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import translations from './locales.json'
import FAQClient from './FAQClient'

export default async function FAQ() {
	const locale = await getLocale()
	const t = getTranslations(locale, translations)

	return <FAQClient translations={t} />
}
