import type { Event } from '@/models/event.model'
import type { Bib } from '@/models/bib.model'
import type { Metadata } from 'next'

import { getTranslations } from '@/lib/getDictionary'
import { auth } from '@clerk/nextjs/server'
import { getLocale } from '@/lib/getLocale'
import { redirect } from 'next/navigation'

import { fetchBibByIdForSeller } from '@/services/bib.services'
import { fetchUserByClerkId } from '@/services/user.services'

import editBibTranslations from './locales.json'
import EditBibClient from './EditBibClient'

export type EditBibPageProps = {
	params: Promise<{ bibId: string }>
}

export default async function EditBibPage({ params }: EditBibPageProps) {
	const { userId: clerkId } = await auth()
	const { bibId } = await params
	let initialBibWithEvent: (Bib & { expand?: { eventId?: Event } }) | null = null
	let errorMessage: null | string = null

	const locale = await getLocale()
	const t = getTranslations(locale, editBibTranslations)

	if (clerkId == null || clerkId === '') {
		redirect(`/sign-in?redirect_url=/dashboard/seller/edit-bib/${bibId}`)
	}

	try {
		const sellerUser = await fetchUserByClerkId(clerkId)
		if (!sellerUser) {
			errorMessage = t.userNotFound ?? 'User not found.'
		} else {
			initialBibWithEvent = await fetchBibByIdForSeller(bibId, sellerUser.id)
			if (!initialBibWithEvent) {
				errorMessage = t.bibNotFoundOrNoPermission ?? 'Bib not found or you do not have permission to edit it.'
			}
		}
	} catch (error: unknown) {
		errorMessage =
			error instanceof Error ? error.message : (t.errorFetchingBib ?? 'An error occurred while fetching bib details.')
		initialBibWithEvent = null
	}

	return (
		<EditBibClient
			bibId={bibId}
			initialBibWithEvent={initialBibWithEvent}
			initialError={errorMessage}
			translations={t}
		/>
	)
}

export async function generateMetadata({ params }: EditBibPageProps): Promise<Metadata> {
	const { bibId } = await params
	return {
		title: `Edit Bib ${bibId} | Seller Dashboard | Beswib`,
	}
}
