import type { Metadata } from 'next'

import { auth } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import type { Event } from '@/models/event.model'
import type { Bib } from '@/models/bib.model'

import { fetchBibById, fetchPrivateBibByToken } from '@/services/bib.services'
import { generateLocaleParams } from '@/lib/generateStaticParams'
import { Locale } from '@/lib/i18n-config'

type BibDetailPageProps = {
	params: Promise<{
		id: string
		locale: Locale
	}>
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BibDetailPage({ searchParams, params }: BibDetailPageProps) {
	const { locale, id: bibId } = await params
	const resolvedSearchParams = await searchParams
	const { userId: clerkId } = await auth()

	// Check if this is a private listing access via token
	const privateToken = resolvedSearchParams?.tkn as string | undefined

	let bib: (Bib & { expand?: { eventId: Event } }) | null = null

	try {
		if (privateToken !== null && privateToken !== undefined && privateToken !== '') {
			// Access via private token
			bib = await fetchPrivateBibByToken(bibId, privateToken)
		} else {
			// Try to access as public listing
			bib = await fetchBibById(bibId)
			// Check if it's actually a private listing without token
			if (bib && bib.listed === 'private') {
				// This is a private listing accessed without token - deny access
				notFound()
			}
		}
	} catch (error: unknown) {
		console.error('Error fetching bib:', error instanceof Error ? error.message : String(error))
		notFound()
	}

	if (!bib) {
		notFound()
	}

	// Check if bib can be purchased
	const canPurchase = (() => {
		// Must be available status
		if (bib.status !== 'available') return false

		// If it's a public listing, it's purchasable
		if (bib.listed === 'public') return true

		// If it's a private listing, must have valid token
		if (bib.listed === 'private') {
			return privateToken != null && bib.privateListingToken === privateToken
		}

		return false
	})()

	const event = bib.expand?.eventId

	return (
		<div className="mx-auto max-w-4xl p-4 text-[var(--text-dark)] md:p-8">
			{/* Back navigation */}
			<Link
				className="mb-6 inline-flex items-center text-[var(--accent-sporty)] hover:underline"
				href={`/${locale}/marketplace`}
			>
				← Back to Marketplace
			</Link>

			<div className="grid gap-8 md:grid-cols-2">
				{/* Bib Details */}
				<div className="space-y-6">
					<div className="bento-box">
						<h1 className="mb-4 text-3xl font-bold text-[var(--primary-pastel)]">
							{event?.name ?? 'Event Details Loading...'}
						</h1>

						{event && (
							<div className="space-y-2 text-gray-700 dark:text-gray-300">
								<p>
									<strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}
								</p>
								<p>
									<strong>Location:</strong> {event.location}
								</p>
								{event.description !== null && event.description !== undefined && event.description !== '' && (
									<p className="mt-4">{event.description}</p>
								)}
							</div>
						)}
					</div>

					{/* Bib Specifications */}
					<div className="bento-box">
						<h2 className="mb-4 text-xl font-semibold">Bib Details</h2>
						<div className="space-y-3">
							<div className="flex justify-between">
								<span className="font-medium">Registration Number:</span>
								<span>{bib.registrationNumber}</span>
							</div>

							{bib.optionValues.size !== null &&
								bib.optionValues.size !== undefined &&
								bib.optionValues.size !== '' && (
									<div className="flex justify-between">
										<span className="font-medium">Size:</span>
										<span>{bib.optionValues.size}</span>
									</div>
								)}

							{bib.optionValues.gender !== null &&
								bib.optionValues.gender !== undefined &&
								bib.optionValues.gender !== '' && (
									<div className="flex justify-between">
										<span className="font-medium">Gender:</span>
										<span>{bib.optionValues.gender}</span>
									</div>
								)}

							{Object.entries(bib.optionValues).map(([key, value]) => {
								if (key === 'size' || key === 'gender' || value === null || value === undefined || value === '')
									return null
								return (
									<div className="flex justify-between" key={key}>
										<span className="font-medium capitalize">{key}:</span>
										<span>{value}</span>
									</div>
								)
							})}
						</div>
					</div>
				</div>

				{/* Purchase Section */}
				<div className="space-y-6">
					<div className="bento-box">
						<div className="mb-6">
							<div className="text-3xl font-bold text-[var(--accent-sporty)]">${bib.price.toFixed(2)}</div>
							{bib.originalPrice !== null && bib.originalPrice !== undefined && bib.originalPrice !== bib.price && (
								<div className="text-lg text-gray-500 line-through">Original: ${bib.originalPrice.toFixed(2)}</div>
							)}
						</div>

						{/* Status indicators */}
						<div className="mb-6">
							<div className="flex items-start gap-2">
								{bib.listed === 'private' && (
									<div className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800">
										Private Listing
									</div>
								)}

								<div
									className={`inline-block rounded-full px-3 py-1 text-sm ${
										bib.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
									}`}
								>
									{bib.status === 'available' ? 'Available' : bib.status}
								</div>

								{/* Token validation status for private listings */}
								{bib.listed === 'private' && bib.status === 'available' && (
									<div
										className={`inline-block rounded-full px-3 py-1 text-sm ${
											canPurchase ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
										}`}
									>
										{canPurchase ? 'Access Granted' : 'Invalid Token'}
									</div>
								)}
							</div>
						</div>

						{/* Purchase button */}
						{canPurchase ? (
							<div className="space-y-4">
								{clerkId !== null && clerkId !== undefined && clerkId !== '' ? (
									<Link
										className="btn btn-primary w-full text-center"
										href={`/${locale}/purchase/${bib.id}${privateToken !== null && privateToken !== undefined && privateToken !== '' ? `?tkn=${privateToken}` : ''}`}
									>
										Purchase This Bib
									</Link>
								) : (
									<>
										<p className="text-sm text-gray-600">Sign in to purchase this bib</p>
										<Link
											className="btn btn-primary w-full text-center"
											href={`/${locale}/sign-in?redirect_url=/${locale}/marketplace/${bib.id}${privateToken !== null && privateToken !== undefined && privateToken !== '' ? `?tkn=${privateToken}` : ''}`}
										>
											Sign In to Purchase
										</Link>
									</>
								)}
							</div>
						) : (
							<div className="text-center">
								{bib.status !== 'available' ? (
									<>
										<p className="mb-4 text-gray-600">This bib is no longer available for purchase.</p>
										{event && (
											<Link className="btn btn-secondary" href={`/${locale}/events/${event.id}`}>
												View Event & Join Waitlist
											</Link>
										)}
									</>
								) : bib.listed === 'private' &&
								  (privateToken === null ||
										privateToken === undefined ||
										privateToken === '' ||
										bib.privateListingToken !== privateToken) ? (
									<>
										<p className="mb-4 font-medium text-red-600">Access Denied</p>
										<p className="mb-4 text-gray-600">
											This is a private listing. You need a valid access token to purchase this bib.
										</p>
									</>
								) : (
									<>
										<p className="mb-4 text-gray-600">This bib cannot be purchased at the moment.</p>
										{event && (
											<Link className="btn btn-secondary" href={`/${locale}/events/${event.id}`}>
												View Event & Join Waitlist
											</Link>
										)}
									</>
								)}
							</div>
						)}
					</div>

					{/* Security notice for private listings */}
					{bib.listed === 'private' && canPurchase === true && (
						<div className="bento-box border-l-4 border-yellow-500 bg-yellow-50 py-4 pl-4 dark:bg-yellow-900/20">
							<h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Private Listing</h3>
							<p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
								This is a private listing. Only people with the direct link can view and purchase this bib. Do not share
								this link publicly.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export async function generateMetadata({ searchParams, params }: BibDetailPageProps): Promise<Metadata> {
	const { id } = await params
	const resolvedSearchParams = await searchParams
	const privateToken = resolvedSearchParams?.tkn as string | undefined

	try {
		let bib: (Bib & { expand?: { eventId: Event } }) | null = null

		if (privateToken !== null && privateToken !== undefined && privateToken !== '') {
			bib = await fetchPrivateBibByToken(id, privateToken)
		} else {
			bib = await fetchBibById(id)
		}

		if (bib?.expand?.eventId) {
			return {
				title: `${bib.expand.eventId.name} - Bib #${bib.registrationNumber} | Beswib`,
				description: `Purchase bib #${bib.registrationNumber} for ${bib.expand.eventId.name} - $${bib.price.toFixed(2)}`,
			}
		}
	} catch (error: unknown) {
		console.error('Error generating metadata:', error instanceof Error ? error.message : String(error))
	}

	return {
		title: 'Bib Details | Beswib',
		description: 'View bib details and make your purchase',
	}
}

export function generateStaticParams() {
	return generateLocaleParams()
}
