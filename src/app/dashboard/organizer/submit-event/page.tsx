import type { Metadata } from 'next'

import { getTranslations } from '@/lib/getDictionary'
// import { auth } from '@clerk/nextjs/server' // No longer needed here
import { getLocale } from '@/lib/getLocale'
// import { redirect } from 'next/navigation' // No longer needed here
import Link from 'next/link' // Import Link

import submitEventTranslations from './locales.json'
// import { createEvent } from '@/services/event.services' // No longer needed here
import SubmitEventForm from './SubmitEventForm' // Import the new client component

export const metadata: Metadata = {
	title: 'Submit New Event | Organizer Dashboard | Beswib',
}

// Using Tailwind classes directly for styling this form page
// No more `styles` object

export default async function SubmitEventPage() {
	// Removed searchParams logic
	// }: {
	// 	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
	// }) {
	const locale = await getLocale()
	const t = getTranslations(locale, submitEventTranslations)
	// const searchParams = await searchParamsPromise // Removed
	// Removed handleSubmitEvent server action from here

	// const errorParam = searchParams?.error // Removed
	// const errorMessage = typeof errorParam === 'string' && errorParam.length > 0 ? decodeURIComponent(errorParam) : null // Removed
	// Success message is typically displayed on the redirect target page (Organizer Dashboard)

	return (
		<div className="mx-auto max-w-2xl p-4 text-[var(--text-dark)] md:p-8">
			<header className="mb-8 text-center">
				<h1 className="text-3xl font-bold">{t.title}</h1>
			</header>

			{/* Removed direct error message display from here */}
			{/* {errorMessage != null ? (
				<div className="mb-6 rounded-lg border border-red-300 bg-[var(--error-bg)] p-4 text-center text-[var(--error-text)]">
					{t.errorPrefix} {errorMessage}
				</div>
			) : null} */}

			<SubmitEventForm translations={t} />
			<Link className="mt-6 block text-center text-[var(--accent-sporty)] hover:underline" href="/dashboard/organizer">
				{t.backToDashboard}
			</Link>
		</div>
	)
}
