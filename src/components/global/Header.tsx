import { LocaleParams } from '@/lib/generateStaticParams'
import { getTranslations } from '@/lib/getDictionary'

import pageTranslationsData from './locales.json'
import HeaderClient from './HeaderClient'

export default async function Header({ localeParams }: { localeParams: Promise<LocaleParams> }) {
	const { locale } = await localeParams
	const t = getTranslations(locale, pageTranslationsData)

	return <HeaderClient translations={t} />
}
