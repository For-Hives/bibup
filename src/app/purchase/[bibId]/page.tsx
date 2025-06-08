import type { Event } from '@/models/event.model'
import type { Bib } from '@/models/bib.model'
import type { Metadata } from 'next'

import { notFound, redirect } from 'next/navigation'
import { getDictionary } from '@/lib/getDictionary'
import { auth } from '@clerk/nextjs/server'
import { getLocale } from '@/lib/getLocale'
import Link from 'next/link'

import { fetchBibById } from '@/services/bib.services'

export type BibPurchasePageProps = {
	params: Promise<{ bibId: string }>
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BibPurchasePage({
	searchParams: searchParamsPromise,
	params: paramsPromise,
}: BibPurchasePageProps) {
	const locale = await getLocale()
	const dictionary = await getDictionary(locale)

	const { userId: currentUserId } = await auth()
	const params = await paramsPromise
	const searchParams = await searchParamsPromise
	const { bibId } = params

	if (currentUserId == null) {
		redirect(`/sign-in?redirect_url=/purchase/${bibId}`)
	}

	const bib = (await fetchBibById(bibId)) as (Bib & { expand?: { eventId: Event } }) | null

	if (!bib) {
		notFound()
	}

	const errorParam = searchParams?.error
	const errorMessage =
		errorParam != null && typeof errorParam === 'string' && errorParam !== '' ? decodeURIComponent(errorParam) : null

	if (bib.status !== 'listed_public') {
		return (
			<div className="mx-auto max-w-lg p-4 text-center text-[var(--text-dark)] md:p-8">
				<p className="mb-6 rounded-lg border border-red-300 bg-[var(--error-bg)] p-4 text-[var(--error-text)]">
					{dictionary.purchase.errors.bibNotAvailable.replace('{status}', bib.status)}
				</p>
				<Link className="text-[var(--accent-sporty)] hover:underline" href="/events">
					{dictionary.purchase.browseOtherEvents}
				</Link>
			</div>
		)
	}

	if (bib.sellerUserId === currentUserId) {
		return (
			<div className="mx-auto max-w-lg p-4 text-center text-[var(--text-dark)] md:p-8">
				<p className="mb-6 rounded-lg border border-red-300 bg-[var(--error-bg)] p-4 text-[var(--error-text)]">
					{dictionary.purchase.errors.cannotPurchaseOwnBib}
				</p>
				<Link className="text-[var(--accent-sporty)] hover:underline" href={`/events/${bib.eventId}`}>
					{dictionary.purchase.backToEventPage}
				</Link>
			</div>
		)
	}

	const eventName = bib.expand?.eventId?.name ?? `Event ID: ${bib.eventId}`
	const eventDate = bib.expand?.eventId ? new Date(bib.expand.eventId.date).toLocaleDateString() : 'N/A'

	async function handleConfirmPurchase() {
		'use server'
		const locale = await getLocale()
		const dictionary = await getDictionary(locale)

		if (currentUserId == null) {
			redirect(`/purchase/${bibId}?error=${encodeURIComponent(dictionary.purchase.errors.authFailed)}`)
			return
		}
		const { processBibSale } = await import('@/services/bib.services')
		try {
			const result = await processBibSale(bibId, currentUserId)
			if (result.success && result.transaction) {
				redirect(
					`/dashboard/buyer?purchase_success=true&bib_id=${bibId}&event_name=${encodeURIComponent(eventName)}&transaction_id=${result.transaction.id}`
				)
			} else {
				redirect(
					`/purchase/${bibId}?error=${encodeURIComponent(result.error ?? dictionary.purchase.errors.purchaseFailed)}`
				)
			}
		} catch (error) {
			console.error('Error in handleConfirmPurchase Server Action:', error)
			let message = dictionary.purchase.errors.unexpectedError
			if (error instanceof Error) message = error.message
			redirect(`/purchase/${bibId}?error=${encodeURIComponent(message)}`)
		}
	}

	return (
		<div className="mx-auto max-w-lg p-4 text-[var(--text-dark)] md:p-8">
			<header className="mb-8 text-center">
				<h1 className="text-3xl font-bold">{dictionary.purchase.title}</h1>
			</header>

			{}
			{errorMessage != null && (
				<div className="mb-6 rounded-md border border-red-300 bg-[var(--error-bg)] p-3 text-center text-sm text-[var(--error-text)]">
					{dictionary.purchase.errors.errorPrefix} {errorMessage}
				</div>
			)}

			<div className="bento-box space-y-4">
				<h2 className="mb-4 border-b border-[var(--border-color)] pb-3 text-xl font-semibold">
					{dictionary.purchase.details.title}
				</h2>
				<p>
					<span className="font-semibold">{dictionary.purchase.details.event}:</span> {eventName}
				</p>
				<p>
					<span className="font-semibold">{dictionary.purchase.details.eventDate}:</span> {eventDate}
				</p>
				<p>
					<span className="font-semibold">{dictionary.purchase.details.registrationNumber}:</span>{' '}
					{dictionary.purchase.details.registrationNumberNote}
				</p>
				{bib.size != null && bib.size !== '' && (
					<p>
						<span className="font-semibold">{dictionary.purchase.details.size}:</span> {bib.size}
					</p>
				)}
				{bib.gender != null && (
					<p>
						<span className="font-semibold">{dictionary.purchase.details.gender}:</span> {bib.gender}
					</p>
				)}

				<div className="my-4 text-center text-2xl font-bold text-[var(--accent-sporty)]">
					{dictionary.purchase.details.price}: ${bib.price.toFixed(2)}
				</div>
			</div>

			<form action={handleConfirmPurchase} className="mt-6">
				<button className="btn btn-primary w-full py-3 text-lg" type="submit">
					{dictionary.purchase.confirmButton}
				</button>
			</form>

			<p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">{dictionary.purchase.agreementText}</p>
			<Link
				className="mt-6 block text-center text-[var(--accent-sporty)] hover:underline"
				href={`/events/${bib.eventId}`}
			>
				{dictionary.purchase.cancelLink}
			</Link>
		</div>
	)
}

export async function generateMetadata({ params: paramsPromise }: BibPurchasePageProps): Promise<Metadata> {
	const locale = await getLocale()
	const dictionary = await getDictionary(locale)

	const params = await paramsPromise
	const bib = await fetchBibById(params.bibId)
	if (bib == null) {
		return { title: dictionary.purchase.metadata.notFoundTitle }
	}
	const eventName = (bib as Bib & { expand?: { eventId: Event } }).expand?.eventId?.name ?? 'Event'
	return {
		description: dictionary.purchase.metadata.descriptionTemplate
			.replace('{eventName}', eventName)
			.replace('{price}', bib.price.toFixed(2)),
		title: dictionary.purchase.metadata.titleTemplate.replace('{eventName}', eventName),
	}
}
