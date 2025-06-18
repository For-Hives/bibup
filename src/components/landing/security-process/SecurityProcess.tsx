import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import SecurityProcessClient from './SecurityProcessClient'
import translations from '../locales.json'

export default async function SecurityProcess() {
	const locale = await getLocale()
	const t = getTranslations(locale, translations)

	return <SecurityProcessClient translations={t} />
}
