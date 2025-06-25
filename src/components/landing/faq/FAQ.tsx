import { LocaleParams } from '@/lib/generateStaticParams'

import FAQClient from './FAQClient'

export default async function FAQ({ localeParams }: Readonly<{ localeParams: Promise<LocaleParams> }>) {
	const { locale } = await localeParams

	return <FAQClient locale={locale} />
}
