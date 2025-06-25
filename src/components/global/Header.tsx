import { LocaleParams } from '@/lib/generateStaticParams'

import HeaderClient from './HeaderClient'

export default async function Header({ localeParams }: Readonly<{ localeParams: Promise<LocaleParams> }>) {
	const { locale } = await localeParams

	return <HeaderClient locale={locale} />
}
