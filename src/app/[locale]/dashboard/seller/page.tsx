import type { Metadata } from 'next'

import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import type { Event } from '@/models/event.model'
import type { User } from '@/models/user.model'
import type { Bib } from '@/models/bib.model'

import { fetchUserByClerkId } from '@/services/user.services'
import { fetchBibsBySeller } from '@/services/bib.services'
import { LocaleParams } from '@/lib/generateStaticParams'
import { getTranslations } from '@/lib/getDictionary'

import SellerDashboardClient from './SellerDashboardClient'
import sellerTranslations from './locales.json'

// Force dynamic rendering for dashboard routes
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
	title: 'Seller Dashboard | Beswib',
}

export default async function SellerDashboardPage({
	searchParams: searchParamsPromise,
	params,
}: {
	params: Promise<LocaleParams>
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const { locale } = await params
	const t = getTranslations(locale, sellerTranslations)

	const { userId: clerkUserId } = await auth()
	const clerkUser = await currentUser()
	const searchParams = await searchParamsPromise

	if (!clerkUserId || !clerkUser) {
		redirect('/sign-in')
	}

	let beswibUser: null | User = null
	let listedBibs: (Bib & { expand?: { eventId: Event } })[] = []

	if (clerkUserId) {
		beswibUser = await fetchUserByClerkId(clerkUserId)
		if (!beswibUser) {
			redirect('/sign-in')
		}
		// Fetch bibs listed by this seller
		listedBibs = (await fetchBibsBySeller(beswibUser.id)) as (Bib & {
			expand?: { eventId: Event }
		})[]
	}

	const bibStatusFromQuery = searchParams?.bibStatus as string
	const successMessage =
		searchParams?.success === 'true'
			? `Bib listed successfully! Current status: ${bibStatusFromQuery ? bibStatusFromQuery.replace(/_/g, ' ').toUpperCase() : 'PENDING VALIDATION'}.`
			: null
	const errorMessage =
		searchParams?.error && typeof searchParams.error === 'string' ? decodeURIComponent(searchParams.error) : null

	return (
		<SellerDashboardClient
			clerkUser={clerkUser}
			errorMessage={errorMessage}
			listedBibs={listedBibs}
			successMessage={successMessage}
			translations={t}
			user={beswibUser}
		/>
	)
}
