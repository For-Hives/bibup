import type { Metadata } from 'next'

import { auth, currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'

import type { Waitlist } from '@/models/waitlist.model'
import type { Event } from '@/models/event.model'
import type { Bib } from '@/models/bib.model'

import { fetchUserWaitlists } from '@/services/waitlist.services'
import { fetchBibsByBuyer } from '@/services/bib.services'
import { LocaleParams } from '@/lib/generateStaticParams'
import { getTranslations } from '@/lib/getDictionary'

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

	if (clerkUserId == null || !clerkUser) {
		return <p className="mx-auto max-w-4xl p-5 font-sans">{t.pleaseSignIn}</p>
	}

	const buyerName = clerkUser.firstName ?? clerkUser.emailAddresses[0]?.emailAddress ?? 'Buyer'

	let purchasedBibs: (Bib & { expand?: { eventId: Event } })[] = []
	let userWaitlists: (Waitlist & { expand?: { eventId: Event } })[] = []

	if (clerkUserId) {
		purchasedBibs = await fetchBibsByBuyer(clerkUserId)
		userWaitlists = await fetchUserWaitlists(clerkUserId)
	}

	const purchaseSuccess = searchParams?.purchase_success === 'true'
	const eventNameForSuccessMsg =
		typeof searchParams?.event_name === 'string' ? decodeURIComponent(searchParams.event_name) : ''

	const showSuccessMessage = purchaseSuccess && Boolean(eventNameForSuccessMsg)
	const successDisplay = showSuccessMessage ? (
		<div className="mb-5 rounded-md border border-green-300 bg-green-100 p-4 text-lg text-green-800">
			{t.purchaseSuccess} <strong>{eventNameForSuccessMsg}</strong>. {t.purchaseSuccessDetails}
		</div>
	) : null

	return (
		<div className="mx-auto max-w-4xl p-5 font-sans">
			<header className="mb-8 text-center">
				<h1>{t.title}</h1>
			</header>
			<p className="mb-5 text-2xl">
				{t.welcome}, {buyerName}!
			</p>

			{successDisplay}

			<section className="mb-8 rounded-lg border border-gray-200 bg-gray-100 p-5">
				<h2 className="mb-4 text-xl text-gray-800">{t.myPurchases}</h2>
				{purchasedBibs.length > 0 ? (
					<ul className="list-none p-0">
						{purchasedBibs.map(bib => (
							<li className="mb-2.5 rounded-md border border-gray-300 bg-white p-4" key={bib.id}>
								<div className="text-lg font-bold text-blue-700">
									{t.bibForLabel} {bib.expand?.eventId?.name ?? `Event ID: ${bib.eventId}`}
								</div>
								<p className="my-1 text-sm text-gray-600">
									{t.dateOfEvent}{' '}
									{bib.expand?.eventId ? new Date(bib.expand.eventId.eventDate).toLocaleDateString() : 'N/A'}
								</p>
								<p className="my-1 text-sm text-gray-600">
									{t.pricePaid} ${bib.price.toFixed(2)}
								</p>
								<p className="my-1 text-sm text-gray-600">
									{t.registrationNumber} {bib.registrationNumber} {t.keepRecords}
								</p>
							</li>
						))}
					</ul>
				) : (
					<p>
						{t.noPurchases}{' '}
						<Link className="text-blue-600 underline" href="/events">
							{t.browseEvents}
						</Link>{' '}
						to find bibs for sale!
					</p>
				)}
			</section>

			<section className="mb-8 rounded-lg border border-gray-200 bg-gray-100 p-5">
				<h2 className="mb-4 text-xl text-gray-800">{t.waitlistEntries}</h2>
				{userWaitlists.length > 0 ? (
					<ul className="list-none p-0">
						{userWaitlists.map(waitlistEntry => (
							<li className="mb-2.5 rounded-md border border-gray-300 bg-white p-4" key={waitlistEntry.id}>
								<div className="text-lg font-bold text-blue-700">
									{t.eventLabel}{' '}
									<Link className="text-blue-600 underline" href={`/events/${waitlistEntry.eventId}`}>
										{waitlistEntry.expand?.eventId?.name ?? `Event ID: ${waitlistEntry.eventId}`}
									</Link>
								</div>
								<p className="my-1 text-sm text-gray-600">
									{t.dateAddedToWaitlist} {new Date(waitlistEntry.addedAt).toLocaleDateString()}
								</p>
							</li>
						))}
					</ul>
				) : (
					<p>
						{t.noWaitlistEntries}{' '}
						<Link className="text-blue-600 underline" href="/events">
							{t.browseEventsWaitlist}
						</Link>{' '}
						{t.waitlistJoinText}
					</p>
				)}
			</section>
		</div>
	)
}
