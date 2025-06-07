import type { Event } from '@/models/event.model'
import type { Metadata } from 'next'

import { auth, currentUser } from '@clerk/nextjs/server'
import { getDictionary } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'
import Link from 'next/link'

import { fetchEventsByOrganizer } from '@/services/event.services'

export const metadata: Metadata = {
	title: 'Organizer Dashboard | BibUp',
}

// Helper to get status class string from globals.css
const getEventStatusClass = (status: Event['status']): string => {
	switch (status) {
		case 'approved':
			return 'status-approved'
		case 'cancelled':
			return 'status-expired' // Using 'expired' style for cancelled
		case 'completed':
			return 'status-sold' // Using 'sold' style for completed
		case 'pending_approval':
			return 'status-pending'
		case 'rejected':
			return 'status-rejected'
		default:
			return 'bg-gray-200 text-gray-800' // Default fallback
	}
}

export default async function OrganizerDashboardPage({
	searchParams: searchParamsPromise,
}: {
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const locale = await getLocale()
	const dictionary = await getDictionary(locale)

	const { userId } = await auth()
	const user = await currentUser()
	const searchParams = await searchParamsPromise

	if (userId == null || !user) {
		return (
			<div className="mx-auto max-w-4xl p-4 text-[var(--text-dark)] md:p-8">
				{dictionary.dashboard.organizer.pleaseSignIn}
			</div>
		)
	}

	const organizerName =
		user.firstName ?? user.emailAddresses[0]?.emailAddress ?? 'Organizer'

	let submittedEvents: Event[] = []
	if (userId) {
		submittedEvents = await fetchEventsByOrganizer(userId)
	}

	const successMessage =
		searchParams?.success === 'true'
			? dictionary.dashboard.organizer.eventSubmittedSuccess
			: null

	return (
		<div className="mx-auto max-w-5xl space-y-8 p-4 text-[var(--text-dark)] md:p-8">
			<header className="mb-8 text-center">
				<h1 className="text-3xl font-bold">
					{dictionary.dashboard.organizer.title}
				</h1>
			</header>

			<p className="text-center text-xl">
				{dictionary.dashboard.organizer.welcomeMessage}, {organizerName}!
			</p>

			{successMessage && (
				<div className="mb-6 rounded-lg border border-green-300 bg-[var(--success-bg)] p-4 text-center text-[var(--success-text)]">
					{successMessage}
				</div>
			)}

			{/* Bento Grid Layout */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				{/* Section 1: Manage Your Events */}
				<section className="bento-box md:col-span-2">
					{' '}
					{/* Spans two columns on medium screens */}
					<h2 className="mb-4 text-xl font-semibold">
						{dictionary.dashboard.organizer.manageEvents}
					</h2>
					<p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
						{dictionary.dashboard.organizer.manageEventsDescription}
					</p>
					<Link
						className="btn btn-primary mb-6"
						href="/dashboard/organizer/submit-event"
					>
						{dictionary.dashboard.organizer.submitNewEvent}
					</Link>
					<h3 className="mt-6 mb-3 text-lg font-semibold">
						{dictionary.dashboard.organizer.yourSubmittedEvents}
					</h3>
					{submittedEvents.length > 0 ? (
						<ul className="space-y-4">
							{submittedEvents.map(event => (
								<li
									className="rounded-lg border border-[var(--border-color)] bg-white p-4 shadow dark:bg-neutral-700"
									key={event.id}
								>
									<div className="font-semibold text-[var(--primary-pastel)]">
										{event.name}
									</div>
									<p className="text-sm">
										{dictionary.dashboard.organizer.eventDate}{' '}
										{new Date(event.date).toLocaleDateString()}
									</p>
									<p className="text-sm">
										{dictionary.dashboard.organizer.location} {event.location}
									</p>
									<p className="mt-1 text-sm">
										{dictionary.dashboard.organizer.status}{' '}
										<span
											className={`status-badge ${getEventStatusClass(event.status)}`}
										>
											{event.status.replace(/_/g, ' ').toUpperCase()}
										</span>
									</p>
									{/* Optional: Link to public page if approved */}
									{event.status === 'approved' && (
										<Link
											className="mt-1 inline-block text-xs text-[var(--accent-sporty)] hover:underline"
											href={`/events/${event.id}`}
										>
											{dictionary.dashboard.organizer.viewPublicPage}
										</Link>
									)}
								</li>
							))}
						</ul>
					) : (
						<p>{dictionary.dashboard.organizer.noEventsSubmitted}</p>
					)}
				</section>

				{/* Section 2: Partnership & Support */}
				<section className="bento-box">
					<h2 className="mb-4 text-xl font-semibold">
						{dictionary.dashboard.organizer.partnershipSupport}
					</h2>
					<p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
						{dictionary.dashboard.organizer.partnershipDescription}
					</p>
					<a
						className="btn btn-secondary w-full"
						href="mailto:partners@bibup.com?subject=Partnership Inquiry"
						// style={{backgroundColor: 'var(--secondary-pastel)', color: 'var(--text-dark)'}} // Using btn-secondary now
					>
						{dictionary.dashboard.organizer.scheduleMeeting}
					</a>
					<p className="mt-4 text-center text-xs">
						{dictionary.dashboard.organizer.contactSupport}{' '}
						<a
							className="text-[var(--accent-sporty)] hover:underline"
							href="mailto:support@bibup.com"
						>
							{dictionary.dashboard.organizer.supportEmail}
						</a>
						.
					</p>
				</section>
			</div>
		</div>
	)
}
