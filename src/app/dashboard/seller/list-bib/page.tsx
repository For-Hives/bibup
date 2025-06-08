import type { Metadata } from 'next'

import { getTranslations } from '@/lib/getDictionary'
import { auth } from '@clerk/nextjs/server'
import { getLocale } from '@/lib/getLocale'

import { fetchPartneredApprovedEvents } from '@/services/event.services'
import translations from './locales.json'

import ListNewBibClientPage from './client' // Assuming the client component is in client.tsx

// Metadata can be defined in the Server Component
export async function generateMetadata(): Promise<Metadata> {
	const locale = await getLocale()
	const t = getTranslations(locale, translations)

	return {
		description: t.metadataDescription,
		title: t.metadataTitle,
	}
}

// This is the Server Component that wraps the Client Component.
// It fetches data and passes it to the client component.
export default async function ListNewBibServerWrapper({
	searchParams: searchParamsPromise,
}: {
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const { userId } = await auth() // Get the authenticated user's ID (Clerk ID)
	const locale = await getLocale()
	const t = getTranslations(locale, translations)
	const searchParams = await searchParamsPromise

	// Fetch partnered events that can be selected in the dropdown
	const partneredEvents = await fetchPartneredApprovedEvents()

	// Render the client component, passing the fetched data as props
	return (
		<ListNewBibClientPage
			translations={t}
			initialAuthUserId={userId}
			partneredEvents={partneredEvents}
			searchParams={searchParams}
		/>
	)
}
