import type { Event } from '@/models/event.model'
import type { Bib } from '@/models/bib.model'
import type { Metadata } from 'next'

import { notFound, redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'

import { fetchPubliclyListedBibsForEvent } from '@/services/bib.services'
import { addToWaitlist } from '@/services/waitlist.services'
import { fetchEventById } from '@/services/event.services'

type EventDetailPageProps = {
	params: Promise<{
		id: string
	}>
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function EventDetailPage({ searchParams, params }: EventDetailPageProps) {
	const { id: eventId } = await params
	const resolvedSearchParams = await searchParams
	const { userId } = await auth()

	const event: Event | null = await fetchEventById(eventId)

	if (!event) {
		notFound()
	}

	const publiclyListedBibs: Bib[] = await fetchPubliclyListedBibsForEvent(eventId)

	async function handleJoinWaitlist(formData: FormData) {
		'use server'
		if (!userId) {
			redirect(`/sign-in?redirect_url=/events/${eventId}`)
			return
		}

		const eventIdFromForm = formData.get('eventId') as string
		const result = await addToWaitlist(eventIdFromForm, userId)

		if (result && result.error === 'already_on_waitlist') {
			redirect(`/events/${eventIdFromForm}?waitlist_error=already_added`)
		} else if (result) {
			redirect(`/events/${eventIdFromForm}?waitlist_success=true`)
		} else {
			redirect(`/events/${eventIdFromForm}?waitlist_error=failed`)
		}
	}

	const waitlistSuccess = resolvedSearchParams?.waitlist_success === 'true'
	const waitlistError = resolvedSearchParams?.waitlist_error

	return (
		<div className="mx-auto max-w-3xl p-4 text-[var(--text-dark)] md:p-8">
			<header className="mb-6 border-b border-[var(--border-color)] pb-6">
				<h1 className="mb-2 text-3xl font-bold text-[var(--primary-pastel)] md:text-4xl">{event.name}</h1>
				<p className="text-md text-gray-600 dark:text-gray-400">
					<strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
				</p>
				<p className="text-md text-gray-600 dark:text-gray-400">
					<strong>Location:</strong> {event.location}
				</p>
				{event.description && <p className="mt-4 text-gray-700 dark:text-gray-300">{event.description}</p>}
			</header>

			{waitlistSuccess && (
				<div className="mb-4 rounded-md border border-green-300 bg-[var(--success-bg)] p-3 text-center text-sm text-[var(--success-text)]">
					You've been successfully added to the waitlist for {event.name}! We'll notify you if a bib becomes available.
				</div>
			)}
			{waitlistError && (
				<div className="mb-4 rounded-md border border-red-300 bg-[var(--error-bg)] p-3 text-center text-sm text-[var(--error-text)]">
					{waitlistError === 'already_added'
						? `You are already on the waitlist for ${event.name}.`
						: 'Failed to add you to the waitlist. Please try again.'}
				</div>
			)}

			<section className="mt-8">
				<h2 className="mb-4 text-2xl font-semibold text-[var(--text-dark)]">Bibs Available for this Event</h2>
				{publiclyListedBibs.length > 0 ? (
					<ul className="space-y-4">
						{publiclyListedBibs.map(bib => (
							<li className="bento-box flex flex-col justify-between sm:flex-row sm:items-center" key={bib.id}>
								<div>
									<div className="text-xl font-bold text-[var(--accent-sporty)]">Price: ${bib.price.toFixed(2)}</div>
									{bib.originalPrice && (
										<p className="text-xs text-gray-500 dark:text-gray-400">
											Original Price: ${bib.originalPrice.toFixed(2)}
										</p>
									)}
									{bib.size && <p className="text-sm text-gray-600 dark:text-gray-300">Size: {bib.size}</p>}
									{bib.gender && <p className="text-sm text-gray-600 dark:text-gray-300">Gender: {bib.gender}</p>}
								</div>
								<Link className="btn btn-primary mt-3 sm:mt-0" href={`/purchase/${bib.id}`}>
									Buy Bib
								</Link>
							</li>
						))}
					</ul>
				) : (
					<div className="bento-box text-center">
						<p className="mb-4 text-gray-700 dark:text-gray-300">No bibs currently listed for resale for this event.</p>
						<form action={handleJoinWaitlist} className="inline-block">
							<input name="eventId" type="hidden" value={eventId} />
							<button className="btn btn-waitlist" type="submit">
								Join Waitlist
							</button>
						</form>
						<p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Be notified if a bib becomes available.</p>
					</div>
				)}
			</section>

			<Link className="mt-8 block text-center text-[var(--accent-sporty)] hover:underline" href="/events">
				Back to events list
			</Link>
		</div>
	)
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
	const { id } = await params
	const event = await fetchEventById(id)
	return {
		title: event ? `${event.name} | Event Details` : 'Event Not Found',
		description: event?.description ?? 'Details for the event.',
	}
}
