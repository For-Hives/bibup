import { requireAdminAccess } from '@/guard/adminGuard'

import AdminEventPageClient from '@/components/admin/event/AdminEventPageClient'
import { generateLocaleParams, LocaleParams } from '@/lib/generateStaticParams'
import translations from '@/app/[locale]/event/locales.json'
import { getTranslations } from '@/lib/getDictionary'

export const dynamic = 'force-dynamic'

export default async function AdminEventPage({ params }: { params: Promise<LocaleParams> }) {
	// Verify admin access before rendering the page
	// This will automatically redirect if user is not authenticated or not admin
	const adminUser = await requireAdminAccess()

	const { locale } = await params
	const t = getTranslations(locale, translations)

	return <AdminEventPageClient currentUser={adminUser} locale={locale} />
}

// Generate static params for all locales
export function generateStaticParams() {
	return generateLocaleParams()
}
