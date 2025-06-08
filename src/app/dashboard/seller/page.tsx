import type { Event } from '@/models/event.model'
import type { User } from '@/models/user.model'
import type { Bib } from '@/models/bib.model'
import type { Metadata } from 'next'

import { auth, currentUser } from '@clerk/nextjs/server'
import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'
import Link from 'next/link'

import { fetchUserByClerkId } from '@/services/user.services'
import { fetchBibsBySeller } from '@/services/bib.services'

import sellerTranslations from './locales.json'

export const metadata: Metadata = {
	title: 'Seller Dashboard | BibUp',
}

// Helper to get status class string from globals.css
const getBibStatusClass = (status: Bib['status']): string => {
	switch (status) {
		case 'expired':
			return 'status-expired'
		case 'listed_private':
			return 'status-approved' // Using approved for listed_private but could be different
		case 'listed_public':
			return 'status-approved' // Using approved for listed_public
		case 'pending_validation':
			return 'status-pending'
		case 'sold':
			return 'status-sold'
		case 'validation_failed':
			return 'status-rejected' // Using rejected for validation_failed
		case 'withdrawn':
			return 'status-withdrawn'
		default:
			return 'bg-gray-200 text-gray-800' // Default fallback
	}
}

export default async function SellerDashboardPage({
	searchParams: searchParamsPromise,
}: {
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const locale = await getLocale()
	const t = getTranslations(locale, sellerTranslations)

	const { userId: clerkUserId } = await auth()
	const clerkUser = await currentUser()
	const searchParams = await searchParamsPromise

	if (clerkUserId == null || !clerkUser) {
		return <div className="mx-auto max-w-4xl p-4 md:p-8">{dictionary.dashboard.seller.pleaseSignIn}</div>
	}

	const sellerName = clerkUser.firstName ?? clerkUser.emailAddresses[0]?.emailAddress ?? 'Seller'

	let bibUpUser: null | User = null
	let listedBibs: (Bib & { expand?: { eventId: Event } })[] = []

	if (clerkUserId) {
		bibUpUser = await fetchUserByClerkId(clerkUserId)
		listedBibs = (await fetchBibsBySeller(clerkUserId)) as (Bib & {
			expand?: { eventId: Event }
		})[]
	}

	const bibUpBalance = bibUpUser?.bibUpBalance ?? 0

	const bibStatusFromQuery = searchParams?.bibStatus as string
	const successMessage =
		searchParams?.success === 'true'
			? `Bib listed successfully! Current status: ${bibStatusFromQuery ? bibStatusFromQuery.replace(/_/g, ' ').toUpperCase() : 'PENDING VALIDATION'}.`
			: null
	const errorMessage =
		searchParams?.error != null && typeof searchParams.error === 'string'
			? decodeURIComponent(searchParams.error)
			: null

	return (
		<div className="mx-auto max-w-5xl space-y-8 p-4 md:p-8">
			<header className="mb-8 text-center">
				<h1 className="text-3xl font-bold text-[var(--text-dark)]">{dictionary.dashboard.seller.title}</h1>
			</header>

			<p className="text-center text-xl text-[var(--text-dark)]">
				{dictionary.dashboard.seller.welcomeMessage}, {sellerName}!
			</p>

			{/* Messages */}
			{successMessage != null && (
				<div className="mb-6 rounded-lg border border-green-300 bg-[var(--success-bg)] p-4 text-center text-[var(--success-text)]">
					{successMessage}
				</div>
			)}
			{errorMessage != null && (
				<div className="mb-6 rounded-lg border border-red-300 bg-[var(--error-bg)] p-4 text-center text-[var(--error-text)]">
					Error: {errorMessage}
				</div>
			)}

			{/* Bento Grid Layout */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
				{/* Balance Box */}
				<div className="bento-box flex flex-col items-center justify-center md:col-span-1">
					<h2 className="mb-2 text-xl font-semibold text-[var(--text-dark)]">
						{dictionary.dashboard.seller.yourBibUpBalance}
					</h2>
					<p className="text-3xl font-bold text-[var(--accent-sporty)]">${bibUpBalance.toFixed(2)}</p>
				</div>

				{/* Manage Bib Listings Box (takes more space) */}
				<div className="bento-box md:col-span-2">
					<h2 className="mb-4 text-xl font-semibold text-[var(--text-dark)]">
						{dictionary.dashboard.seller.manageBibListings}
					</h2>
					<Link className="btn btn-primary mb-6 w-full md:w-auto" href="/dashboard/seller/list-bib">
						{dictionary.dashboard.seller.listNewBib}
					</Link>

					<h3 className="mt-6 mb-3 text-lg font-semibold text-[var(--text-dark)]">
						{dictionary.dashboard.seller.yourListedBibs}
					</h3>
					{listedBibs.length > 0 ? (
						<ul className="space-y-4">
							{listedBibs.map(bib => {
								const eventName = bib.expand?.eventId?.name
								const eventIdDisplay = bib.eventId != null && bib.eventId !== '' ? bib.eventId : 'N/A'
								const displayBibName = eventName ?? `Event ID: ${eventIdDisplay}`
								return (
									<li className="rounded-lg border border-[var(--border-color)] bg-white p-4 shadow" key={bib.id}>
										<div className="font-semibold text-[var(--primary-pastel)]">
											{' '}
											{/* Using primary-pastel for bib name, adjust if needed */}
											{dictionary.dashboard.seller.yourBibUpBalance} {displayBibName}
										</div>
										<p className="text-sm text-[var(--text-dark)]">
											{dictionary.dashboard.seller.myBibs} {bib.registrationNumber}
										</p>
										<p className="text-sm text-[var(--text-dark)]">
											{dictionary.dashboard.seller.welcome} ${bib.price.toFixed(2)}
										</p>
										{bib.originalPrice != null && bib.originalPrice !== 0 && !isNaN(bib.originalPrice) && (
											<p className="text-xs text-gray-500">
												{dictionary.dashboard.seller.welcome} ${bib.originalPrice.toFixed(2)}
											</p>
										)}
										{bib.size != null && bib.size !== '' && (
											<p className="text-xs text-gray-500">
												{dictionary.dashboard.seller.title} {bib.size}
											</p>
										)}
										{bib.gender != null && (
											<p className="text-xs text-gray-500">
												{dictionary.dashboard.seller.description} {bib.gender}
											</p>
										)}
										<p className="mt-1 text-sm">
											{dictionary.dashboard.seller.listNewBib}{' '}
											<span className={`status-badge ${getBibStatusClass(bib.status)}`}>
												{bib.status.replace(/_/g, ' ').toUpperCase()}
											</span>
										</p>
										{(bib.status === 'pending_validation' ||
											bib.status === 'listed_public' ||
											bib.status === 'listed_private' ||
											bib.status === 'withdrawn' ||
											bib.status === 'validation_failed') && (
											<Link
												className="btn btn-secondary mt-2 inline-block px-3 py-1 text-xs"
												href={`/dashboard/seller/edit-bib/${bib.id}`}
											>
												{dictionary.dashboard.seller.manageBibListings}
											</Link>
										)}
									</li>
								) // Added semicolon and ensured parenthesis is closed
							})}
						</ul>
					) : (
						<p className="text-[var(--text-dark)]">{dictionary.dashboard.seller.noBibsListed}</p>
					)}
				</div>
			</div>
		</div>
	)
}
