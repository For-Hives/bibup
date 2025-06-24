import type { Metadata } from 'next'

import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

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

export default async function SellerDashboardPage({ params }: { params: Promise<LocaleParams> }) {
	const { locale } = await params
	const t = getTranslations(locale, sellerTranslations) as any

	const { userId } = await auth()
	const clerkUser = await currentUser()

	if (userId === null || userId === undefined || clerkUser === null) {
		redirect('/sign-in')
	}

	// Fetch seller bibs
	const sellerBibs = await fetchBibsBySeller(userId)

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

	return <SellerDashboardClient clerkUser={serializedClerkUser} sellerBibs={sellerBibs} translations={t} />
}
