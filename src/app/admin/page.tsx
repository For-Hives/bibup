import AdminDashboardClient from '@/components/admin/dashboard/AdminDashboardClient'
import { getTranslations } from '@/lib/getDictionary'
import { requireAdminAccess } from '@/lib/adminGuard'
import { getLocale } from '@/lib/getLocale'

import translations from './locales.json'

export default async function AdminDashboardPage() {
	// Verify admin access before rendering the page
	// This will automatically redirect if user is not authenticated or not admin
	const adminUser = await requireAdminAccess()

	const locale = await getLocale()
	const t = getTranslations(locale, translations)

	return <AdminDashboardClient currentUser={adminUser} translations={t} />
}
