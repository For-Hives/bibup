import { requireAdminAccess } from '@/guard/adminGuard'

import AdminEventPageClient from '@/components/admin/event/AdminEventPageClient'
import { getLocale } from '@/lib/getLocale'

export default async function AdminEventPage() {
	// Verify admin access before rendering the page
	// This will automatically redirect if user is not authenticated or not admin
	const adminUser = await requireAdminAccess()

	const locale = await getLocale()

	return <AdminEventPageClient currentUser={adminUser} locale={locale} />
}
