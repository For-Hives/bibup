import type { Metadata } from 'next'

import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import type { Waitlist } from '@/models/waitlist.model'
import type { Event } from '@/models/event.model'
import type { Bib } from '@/models/bib.model'

import { fetchUserWaitlists } from '@/services/waitlist.services'
import { fetchBibsByBuyer } from '@/services/bib.services'
import { LocaleParams } from '@/lib/generateStaticParams'
import { getTranslations } from '@/lib/getDictionary'

import BuyerDashboardClient from './BuyerDashboardClient'
import buyerTranslations from './locales.json'

// Force dynamic rendering for dashboard routes
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
	title: 'Buyer Dashboard | Beswib',
}

export default async function BuyerDashboardPage({
	searchParams: searchParamsPromise,
	params,
}: {
	params: Promise<LocaleParams>
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const { locale } = await params
	const t = getTranslations(locale, buyerTranslations)

	const { userId: clerkUserId } = await auth()
	const clerkUser = await currentUser()
	const searchParams = await searchParamsPromise

	if (!clerkUserId || !clerkUser) {
		redirect('/sign-in')
	}

	let purchasedBibs: (Bib & { expand?: { eventId: Event } })[] = []
	let userWaitlists: (Waitlist & { expand?: { eventId: Event } })[] = []

	if (clerkUserId) {
		purchasedBibs = await fetchBibsByBuyer(clerkUserId)
		userWaitlists = await fetchUserWaitlists(clerkUserId)
	}

	const purchaseSuccess = searchParams?.purchase_success === 'true'
	const eventNameForSuccessMsg =
		typeof searchParams?.event_name === 'string' ? decodeURIComponent(searchParams.event_name) : ''

	return (
		<BuyerDashboardClient
			clerkUser={clerkUser}
			purchasedBibs={purchasedBibs}
			purchaseSuccess={purchaseSuccess}
			successEventName={eventNameForSuccessMsg}
			translations={t}
			userWaitlists={userWaitlists}
		/>
	)
}
