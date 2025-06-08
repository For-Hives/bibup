import type { Event } from '@/models/event.model' // Updated model import
import type { Metadata } from 'next'

import { getTranslations } from '@/lib/getDictionary'
import { auth } from '@clerk/nextjs/server'
import { getLocale } from '@/lib/getLocale'
import { redirect } from 'next/navigation'
import Link from 'next/link' // Import Link

import { createEvent } from '@/services/event.services'

import submitEventTranslations from './locales.json'

export const metadata: Metadata = {
	title: 'Submit New Event | Organizer Dashboard | BibUp',
}

// Using Tailwind classes directly for styling this form page
// No more `styles` object

export default async function SubmitEventPage({
	// Added searchParams for error display
	searchParams: searchParamsPromise,
}: {
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const locale = await getLocale()
	const t = getTranslations(locale, submitEventTranslations)
	const searchParams = await searchParamsPromise
	async function handleSubmitEvent(formData: FormData) {
		'use server'

		const { userId } = await auth()
		if (userId == null) {
			throw new Error('You must be logged in to submit an event.')
		}

		const name = formData.get('eventName') as string
		const dateString = formData.get('eventDate') as string
		const location = formData.get('eventLocation') as string
		const participantCountStr = formData.get('eventParticipantCount') as string

		// Basic server-side validation
		if (name == null || name === '' || dateString == null || dateString === '' || location == null || location === '') {
			redirect(
				`/dashboard/organizer/submit-event?error=${encodeURIComponent('Event Name, Date, and Location are required.')}`
			)
			return
		}

		const eventData: Event = {
			participantCount: participantCountStr ? parseInt(participantCountStr, 10) : 0,
			description: (formData.get('eventDescription') as string) ?? '',
			date: new Date(dateString),
			status: 'pending_approval',
			organizerId: userId,
			isPartnered: false,
			bibsSold: 0,
			location,
			id: '',
			name,
		}

		try {
			const newEvent = await createEvent(eventData)

			if (newEvent) {
				redirect('/dashboard/organizer?success=true')
			} else {
				redirect(
					`/dashboard/organizer/submit-event?error=${encodeURIComponent('Failed to create event. Please check details.')}`
				)
			}
		} catch (error) {
			console.error('Error submitting event:', error)
			const message = error instanceof Error ? error.message : 'An unknown error occurred.'
			redirect(`/dashboard/organizer/submit-event?error=${encodeURIComponent(message)}`)
		}
	}

	const errorParam = searchParams?.error
	const errorMessage = typeof errorParam === 'string' && errorParam.length > 0 ? decodeURIComponent(errorParam) : null
	// Success message is typically displayed on the redirect target page (Organizer Dashboard)

	return (
		<div className="mx-auto max-w-2xl p-4 text-[var(--text-dark)] md:p-8">
			<header className="mb-8 text-center">
				<h1 className="text-3xl font-bold">{t.title}</h1>
			</header>

			{}
			{errorMessage != null ? (
				<div className="mb-6 rounded-lg border border-red-300 bg-[var(--error-bg)] p-4 text-center text-[var(--error-text)]">
					{t.errorPrefix} {errorMessage}
				</div>
			) : null}

			<form
				action={handleSubmitEvent}
				className="space-y-6 rounded-xl border border-[var(--border-color)] bg-white p-6 shadow-lg md:p-8 dark:bg-neutral-800"
			>
				<div>
					<label className="mb-1 block text-sm font-medium" htmlFor="eventName">
						{t.eventNameLabel}
					</label>
					<input
						className="w-full rounded-md border border-[var(--border-color)] p-2 shadow-sm focus:border-[var(--accent-sporty)] focus:ring-[var(--accent-sporty)] dark:border-neutral-600 dark:bg-neutral-700"
						id="eventName"
						name="eventName"
						required
						type="text"
					/>
				</div>
				<div>
					<label className="mb-1 block text-sm font-medium" htmlFor="eventDate">
						{t.eventDateLabel}
					</label>
					<input
						className="w-full rounded-md border border-[var(--border-color)] p-2 shadow-sm focus:border-[var(--accent-sporty)] focus:ring-[var(--accent-sporty)] dark:border-neutral-600 dark:bg-neutral-700"
						id="eventDate"
						name="eventDate"
						required
						type="date"
					/>
				</div>
				<div>
					<label className="mb-1 block text-sm font-medium" htmlFor="eventLocation">
						{t.eventLocation}
					</label>
					<input
						className="w-full rounded-md border border-[var(--border-color)] p-2 shadow-sm focus:border-[var(--accent-sporty)] focus:ring-[var(--accent-sporty)] dark:border-neutral-600 dark:bg-neutral-700"
						id="eventLocation"
						name="eventLocation"
						required
						type="text"
					/>
				</div>
				<div>
					<label className="mb-1 block text-sm font-medium" htmlFor="eventDescription">
						{t.eventDescription}
					</label>
					<textarea
						className="w-full rounded-md border border-[var(--border-color)] p-2 shadow-sm focus:border-[var(--accent-sporty)] focus:ring-[var(--accent-sporty)] dark:border-neutral-600 dark:bg-neutral-700"
						id="eventDescription"
						name="eventDescription"
						rows={4}
					></textarea>
				</div>
				<div>
					<label className="mb-1 block text-sm font-medium" htmlFor="eventParticipantCount">
						{t.participantCount}
					</label>
					<input
						className="w-full rounded-md border border-[var(--border-color)] p-2 shadow-sm focus:border-[var(--accent-sporty)] focus:ring-[var(--accent-sporty)] dark:border-neutral-600 dark:bg-neutral-700"
						id="eventParticipantCount"
						min="0"
						name="eventParticipantCount"
						type="number"
					/>
				</div>
				<button className="btn btn-primary w-full" type="submit">
					{t.submit}
				</button>
			</form>
			<Link className="mt-6 block text-center text-[var(--accent-sporty)] hover:underline" href="/dashboard/organizer">
				{t.backToDashboard}
			</Link>
		</div>
	)
}
