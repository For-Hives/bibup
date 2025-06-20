import { requireAdminAccess } from '@/guard/adminGuard'

import AdminEventPageClient from '@/components/admin/event/AdminEventPageClient'
import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import translations from './locales.json'

export default async function AdminEventPage() {
	// Verify admin access before rendering the page
	// This will automatically redirect if user is not authenticated or not admin
	const adminUser = await requireAdminAccess()

	const locale = await getLocale()
	const t = getTranslations(locale, translations)

	return <AdminEventPageClient currentUser={adminUser} translations={t} />
}
