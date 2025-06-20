import { requireAdminAccess } from '@/guard/adminGuard'

import AdminEventsPageClient from '@/components/admin/event/AdminEventsPageClient'
import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import translations from './locales.json'

export default async function AdminEventsPage() {
	// Verify admin access before rendering the page
	// This will automatically redirect if user is not authenticated or not admin
	const adminUser = await requireAdminAccess()

	const locale = await getLocale()
	const t = getTranslations(locale, translations)

	return <AdminEventsPageClient currentUser={adminUser} translations={t} />
}
