import { requireAdminAccess } from '@/guard/adminGuard'

import { generateLocaleParams, LocaleParams } from '@/lib/generateStaticParams'
import { getTranslations } from '@/lib/getDictionary'

import AdminEventPageClient from '../../../components/admin/event/AdminEventPageClient'
import translations from './locales.json'

export const dynamic = 'force-dynamic'

export default async function AdminEventPage({ params }: { params: Promise<LocaleParams> }) {
	// Verify admin access before rendering the page
	// This will automatically redirect if user is not authenticated or not admin
	const adminUser = await requireAdminAccess()

	const { locale } = await params
	const t = getTranslations(locale, translations)

	return <AdminEventPageClient currentUser={adminUser} translations={t} />
}

// Generate static params for all locales
export function generateStaticParams() {
	return generateLocaleParams()
}
