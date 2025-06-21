import { requireAdminAccess } from '@/guard/adminGuard'

import AdminDashboardClient from '@/components/admin/dashboard/AdminDashboardClient'
import { generateLocaleParams, LocaleParams } from '@/lib/generateStaticParams'
import { getTranslations } from '@/lib/getDictionary'

import translations from './locales.json'

// Generate static params for all locales
export function generateStaticParams() {
	return generateLocaleParams()
}

// Force dynamic rendering for admin routes
export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage({ params }: { params: Promise<LocaleParams> }) {
	// Verify admin access before rendering the page
	// This will automatically redirect if user is not authenticated or not admin
	const adminUser = await requireAdminAccess()

	const { locale } = await params
	const t = getTranslations(locale, translations)

	return <AdminDashboardClient currentUser={adminUser} translations={t} />
}
