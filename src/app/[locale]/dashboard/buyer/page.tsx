import type { Metadata } from 'next'

import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

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
	searchParams,
	params,
}: {
	params: Promise<LocaleParams>
	searchParams: Promise<{ purchase_success?: string }>
}) {
	const { locale } = await params
	const { purchase_success } = await searchParams
	const t = getTranslations(locale, buyerTranslations) as any

	const { userId } = await auth()
	const clerkUser = await currentUser()

	if (!userId || !clerkUser) {
		redirect('/sign-in')
	}

	// Fetch all required data
	const [purchasedBibs, userWaitlists] = await Promise.all([fetchBibsByBuyer(userId), fetchUserWaitlists(userId)])

	// Extract only serializable properties from clerkUser
	const serializedClerkUser = {
		username: clerkUser.username,
		lastName: clerkUser.lastName,
		imageUrl: clerkUser.imageUrl,
		id: clerkUser.id,
		firstName: clerkUser.firstName,
		emailAddresses: clerkUser.emailAddresses.map(email => ({
			id: email.id,
			emailAddress: email.emailAddress,
		})),
	}

	// Handle purchase success
	const purchaseSuccess = purchase_success === 'true'
	const successEventName =
		purchaseSuccess && purchasedBibs.length > 0 ? (purchasedBibs[0]?.expand?.eventId?.name ?? 'Event') : ''

	return (
		<BuyerDashboardClient
			clerkUser={serializedClerkUser}
			purchasedBibs={purchasedBibs}
			purchaseSuccess={purchaseSuccess}
			successEventName={successEventName}
			translations={t}
			userWaitlists={userWaitlists}
		/>
	)
}
