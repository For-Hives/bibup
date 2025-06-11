import type { Bib } from '@/models/bib.model'
import type { Metadata } from 'next'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

import { fetchBibByIdForSeller } from '@/services/bib.services'
import { fetchUserByClerkId } from '@/services/user.services'
// import { handleToggleListingStatus, handleUpdateBibDetails, handleWithdrawBib } from './actions' // No longer needed here
import EditBibClient from './EditBibClient' // Import the new client component
import editBibTranslations from './locales.json' // Assuming you have a translations file
import { getLocale } from '@/lib/getLocale' // For translations
import { getTranslations } from '@/lib/getDictionary' // For translations

export type EditBibPageProps = {
	params: { bibId: string } // params is not a promise here, Next.js resolves it
	// searchParams?: Promise<{ [key: string]: string | string[] | undefined }> // Removed searchParams
}

// Helper to get status class string from globals.css - this can be moved to client or remain if needed by server elements
// const getBibStatusClass = (status: Bib['status']): string => {
// 	switch (status) {
// 		case 'expired':
// 			return 'status-expired'
// 		case 'listed_private':
// 			return 'status-approved'
// 		case 'listed_public':
// 			return 'status-approved'
// 		case 'pending_validation':
// 			return 'status-pending'
// 		case 'sold':
// 			return 'status-sold'
// 		case 'validation_failed':
// 			return 'status-rejected'
// 		case 'withdrawn':
// 			return 'status-withdrawn'
// 		default:
// 			return 'bg-gray-200 text-gray-800'
// 	}
// }

export default async function EditBibPage({ params }: EditBibPageProps) {
	const { userId: clerkId } = await auth()
	const { bibId } = params
	let initialBibWithEvent: (Bib & { expand?: { eventId?: Event } }) | null = null // Event type from models
	let errorMessage: string | null = null

	const locale = await getLocale() // For translations
	// TODO: Define actual translations structure and import it
	const t = getTranslations(locale, editBibTranslations) as any // Cast as any for now

	if (clerkId == null || clerkId === '') {
		// This redirect should ideally happen in middleware or at the very top
		redirect(`/sign-in?redirect_url=/dashboard/seller/edit-bib/${bibId}`)
		// return null; // Or throw error, redirect makes function non-render
	}

	try {
		const sellerUser = await fetchUserByClerkId(clerkId)
		if (!sellerUser) {
			errorMessage = t.userNotFound || 'User not found.' // Use translation
		} else {
			initialBibWithEvent = await fetchBibByIdForSeller(bibId, sellerUser.id)
			if (!initialBibWithEvent) {
				errorMessage = t.bibNotFoundOrNoPermission || 'Bib not found or you do not have permission to edit it.' // Use translation
			}
		}
	} catch (error: unknown) {
		errorMessage = error instanceof Error ? error.message : t.errorFetchingBib || 'An error occurred while fetching bib details.' // Use translation
		initialBibWithEvent = null // Ensure bib is null on error
	}

	// Removed searchParams logic for success/error messages
	// const successMessage = ...
	// const errorMessageFromSearch = ...

	// Removed logic for canMakePublic, canMakePrivate, canWithdraw as this will be handled in client

	// The main JSX is now simply rendering the client component
	return (
		<EditBibClient
			initialBibWithEvent={initialBibWithEvent}
			initialError={errorMessage}
			translations={t} // Pass all translations
			bibId={bibId}
		/>
	)
}

export async function generateMetadata({ params }: EditBibPageProps): Promise<Metadata> {
	// const params = await paramsPromise // params is directly available
	return {
		title: `Edit Bib ${params.bibId} | Seller Dashboard | Beswib`,
	}
}
