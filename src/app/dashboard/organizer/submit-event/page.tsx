import type { Metadata } from 'next'

import Link from 'next/link'

import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import submitEventTranslations from './locales.json'
import SubmitEventForm from './SubmitEventForm'

export const metadata: Metadata = {
	title: 'Submit New Event | Organizer Dashboard | Beswib',
}

export default async function SubmitEventPage() {
	const locale = await getLocale()
	const t = getTranslations(locale, submitEventTranslations)

	return (
		<div className="mx-auto max-w-2xl p-4 text-[var(--text-dark)] md:p-8">
			<header className="mb-8 text-center">
				<h1 className="text-3xl font-bold">{t.title}</h1>
			</header>

			<SubmitEventForm translations={t} />
			<Link className="mt-6 block text-center text-[var(--accent-sporty)] hover:underline" href="/dashboard/organizer">
				{t.backToDashboard}
			</Link>
		</div>
	)
}
