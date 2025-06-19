import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import AdminEventPageClient from './AdminEventPageClient'
import translations from './locales.json'

export default async function AdminEventPage() {
	const locale = await getLocale()
	const t = getTranslations(locale, translations)

	return <AdminEventPageClient translations={t} />
}
