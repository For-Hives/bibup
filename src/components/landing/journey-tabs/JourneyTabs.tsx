import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import JourneyTabsClient from './JourneyTabsClient'
import translations from '../locales.json'

export default async function JourneyTabs() {
	const locale = await getLocale()
	const t = getTranslations(locale, translations)

	return <JourneyTabsClient translations={t} />
}
