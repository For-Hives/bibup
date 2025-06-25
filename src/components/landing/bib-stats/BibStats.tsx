import { LocaleParams } from '@/lib/generateStaticParams'

import BibStatsClient from './BibStatsClient'

export default async function BibStats({ localeParams }: Readonly<{ localeParams: Promise<LocaleParams> }>) {
	const { locale } = await localeParams

	return <BibStatsClient locale={locale} />
}
