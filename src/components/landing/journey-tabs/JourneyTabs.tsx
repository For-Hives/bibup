import { LocaleParams } from '@/lib/generateStaticParams'
import { getTranslations } from '@/lib/getDictionary'

import JourneyTabsClient from './JourneyTabsClient'
import translations from './locales.json'

export default async function JourneyTabs({ localeParams }: { localeParams: Promise<LocaleParams> }) {
	const { locale } = await localeParams

	const t = getTranslations(locale, translations)

	return <JourneyTabsClient translations={t} />
}
