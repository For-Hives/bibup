'use client'

import type { Event } from '@/models/event.model' // Assuming Event model is needed for expanded bib
import type { Bib } from '@/models/bib.model'

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'

import { handleToggleListingStatus, handleUpdateBibDetails, handleWithdrawBib } from './actions'

interface EditBibClientProps {
	bibId: string // Re-adding bibId prop - this was already re-added and confirmed correct.
	initialBibWithEvent: (Bib & { expand?: { eventId?: Event } }) | null
	initialError?: null | string
	translations: EditBibTranslations // Use the specific type
}

// Define a more specific type for translations
interface EditBibTranslations {
	actions: string
	backToDashboard: string
	bibDetails: string
	bibNotFound: string
	bibNotFoundOrNoPermission: string // Added from usage in page.tsx
	confirmWithdraw: string
	currentStatus: string
	errorFetchingBib: string
	eventDate: string
	eventDetails: string
	eventLocation: string
	eventName: string
	gender: string
	genderOptions: {
		female: string
		male: string
		placeholder: string
		unisex: string
	}
	listingStatus: string
	makePrivate: string
	makePublic: string
	originalPrice: string
	price: string
	privateListingToken: string
	registrationNumber: string
	size: string
	title: string
	updateDetails: string
	userNotFound: string // Added from usage in page.tsx
	withdrawListing: string
	// Potentially add GLOBAL types if getTranslations merges them
	// GLOBAL?: { appName: string; welcomeMessage: string; errors: { unexpected: string } }
}

export default function EditBibClient({
	initialBibWithEvent,
	translations: t,
	initialError,
	bibId, // Destructure bibId
}: EditBibClientProps) {
	const router = useRouter()
	const [bib, setBib] = useState<(Bib & { expand?: { eventId?: Event } }) | null>(initialBibWithEvent)
	const [isLoading, setIsLoading] = useState(false) // For disabling forms during action

	useEffect(() => {
		if (initialError != null) {
			// More explicit check
			toast.error(initialError)
		}
	}, [initialError])

	async function handleUpdateDetailsAction(formData: FormData) {
		// Use bibId prop for consistency, especially if bib state could be null when action is triggered
		setIsLoading(true)
		const result = await handleUpdateBibDetails(bibId, formData)
		setIsLoading(false)

		if (result.error != null) {
			// More explicit check
			toast.error(result.error)
		} else if (result.success) {
			toast.success(result.message ?? 'Details updated successfully!') // nullish coalescing handles message string or undefined
			if (result.updatedBib) {
				const newEventId = result.updatedBib.eventId
				if (typeof newEventId !== 'string') {
					toast.error('Data integrity issue: eventId is missing or not a string in updated bib data.')
					return
				}
				const nextState: Bib & { expand?: { eventId?: Event } } = {
					...result.updatedBib,
					eventId: newEventId,
					expand: bib?.expand, // Preserve existing expand
				}
				setBib(nextState)
			}
		}
	}

	async function handleToggleListingStatusAction(newStatus: 'listed_private' | 'listed_public', formData: FormData) {
		// Use bibId prop
		setIsLoading(true)
		// The server action now takes formData for the privateListingToken
		const result = await handleToggleListingStatus(bibId, newStatus, formData)
		setIsLoading(false)

		if (result.error != null) {
			// More explicit check
			toast.error(result.error)
		} else if (result.success) {
			toast.success(result.message ?? 'Listing status updated!') // nullish coalescing handles message string or undefined
			if (result.updatedBib) {
				const newEventId = result.updatedBib.eventId
				if (typeof newEventId !== 'string') {
					toast.error('Data integrity issue: eventId is missing or not a string in updated bib data.')
					return
				}
				const nextState: Bib & { expand?: { eventId?: Event } } = {
					...result.updatedBib,
					eventId: newEventId,
					expand: bib?.expand, // Preserve existing expand
				}
				setBib(nextState)
			}
		}
	}

	async function handleWithdrawAction() {
		// Use bibId prop
		setIsLoading(true)
		const result = await handleWithdrawBib(bibId)
		setIsLoading(false)

		if (result.error != null) {
			// More explicit check
			toast.error(result.error)
		} else if (result.success && result.redirectPath != null) {
			// More explicit check
			toast.success('Bib withdrawn successfully!') // Message from redirectPath can be used too
			router.push(result.redirectPath)
		}
	}

	if (bib == null && initialError == null) {
		// Explicit checks
		// This case should ideally be handled by the server component sending an initialError
		return <p>{t.bibNotFound ?? 'Bib not found.'}</p>
	}

	if (initialError != null && bib == null) {
		// Explicit checks
		// Error occurred during initial fetch, message already toasted via useEffect
		// We can show a general error message here or rely on the toast.
		return (
			<div className="container mx-auto p-4 text-center">
				<p className="text-red-500">{initialError}</p>
				<Link className="mt-4 inline-block text-blue-500 hover:underline" href="/dashboard/seller">
					{t.backToDashboard ?? 'Back to Dashboard'}
				</Link>
			</div>
		)
	}

	if (bib == null) {
		// Explicit check
		// Fallback if bib is null for any other reason after initial checks
		return <p>Loading bib details or an unexpected error occurred.</p>
	}

	// Determine if event details are available
	// For bib.status, it's non-nullable in model, but defensive check is okay.
	const currentStatusDisplay = typeof bib.status === 'string' ? bib.status.replace('_', ' ') : 'N/A'
	const eventName = bib.expand?.eventId?.name ?? 'N/A'
	const eventDate = bib.expand?.eventId?.date != null ? new Date(bib.expand.eventId.date).toLocaleDateString() : 'N/A'
	const eventLocation = bib.expand?.eventId?.location ?? 'N/A'

	return (
		<div className="container mx-auto max-w-3xl p-4">
			<header className="mb-8 text-center">
				<h1 className="text-3xl font-bold">{t.title}</h1>
				<p className="text-sm text-gray-600">
					{t.currentStatus}: <span className="font-semibold">{currentStatusDisplay}</span>
				</p>
			</header>

			{/* Event Details Section */}
			<section className="mb-8 rounded-lg border bg-white p-6 shadow-md dark:border-neutral-700 dark:bg-neutral-800">
				<h2 className="mb-4 text-xl font-semibold">{t.eventDetails}</h2>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<p>
						<strong>{t.eventName}:</strong> {eventName}
					</p>
					<p>
						<strong>{t.eventDate}:</strong> {eventDate}
					</p>
					<p>
						<strong>{t.eventLocation}:</strong> {eventLocation}
					</p>
				</div>
			</section>

			{/* Bib Details Update Form */}
			<section className="mb-8 rounded-lg border bg-white p-6 shadow-md dark:border-neutral-700 dark:bg-neutral-800">
				<h2 className="mb-4 text-xl font-semibold">{t.bibDetails}</h2>
				<form action={handleUpdateDetailsAction} className="space-y-4">
					<div>
						<label className="block text-sm font-medium" htmlFor="registrationNumber">
							{t.registrationNumber}
						</label>
						<input
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-neutral-600 dark:bg-neutral-700"
							defaultValue={bib.registrationNumber}
							disabled={isLoading}
							id="registrationNumber"
							name="registrationNumber"
							required
							type="text"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium" htmlFor="price">
							{t.price}
						</label>
						<input
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-neutral-600 dark:bg-neutral-700"
							defaultValue={bib.price}
							disabled={isLoading}
							id="price"
							min="0.01"
							name="price"
							required
							step="0.01"
							type="number"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium" htmlFor="originalPrice">
							{t.originalPrice}
						</label>
						<input
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-neutral-600 dark:bg-neutral-700"
							defaultValue={bib.originalPrice ?? ''}
							disabled={isLoading}
							id="originalPrice"
							min="0"
							name="originalPrice"
							step="0.01"
							type="number"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium" htmlFor="size">
							{t.size}
						</label>
						<input
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-neutral-600 dark:bg-neutral-700"
							defaultValue={bib.size ?? ''}
							disabled={isLoading}
							id="size"
							name="size"
							type="text"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium" htmlFor="gender">
							{t.gender}
						</label>
						<select
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-neutral-600 dark:bg-neutral-700"
							defaultValue={bib.gender ?? ''}
							disabled={isLoading}
							id="gender"
							name="gender"
						>
							<option value="">{t.genderOptions?.placeholder ?? 'Select gender'}</option>
							<option value="male">{t.genderOptions?.male ?? 'Male'}</option>
							<option value="female">{t.genderOptions?.female ?? 'Female'}</option>
							<option value="unisex">{t.genderOptions?.unisex ?? 'Unisex'}</option>
						</select>
					</div>
					<button
						className="btn btn-primary w-full sm:w-auto"
						disabled={isLoading || bib.status === 'sold' || bib.status === 'expired' || bib.status === 'withdrawn'}
						type="submit"
					>
						{t.updateDetails}
					</button>
				</form>
			</section>

			{/* Listing Status Management */}
			{bib.status !== 'sold' && bib.status !== 'expired' && bib.status !== 'withdrawn' && (
				<section className="mb-8 rounded-lg border bg-white p-6 shadow-md dark:border-neutral-700 dark:bg-neutral-800">
					<h2 className="mb-4 text-xl font-semibold">{t.listingStatus}</h2>
					{bib.status === 'listed_public' || bib.status === 'listed_private' ? (
						<form
							action={formData =>
								handleToggleListingStatusAction(
									bib.status === 'listed_public' ? 'listed_private' : 'listed_public',
									formData
								)
							}
							className="space-y-4"
						>
							{bib.status === 'listed_public' && (
								<div>
									<label className="block text-sm font-medium" htmlFor="privateListingToken">
										{t.privateListingToken} (Required for private listing)
									</label>
									<input
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-neutral-600 dark:bg-neutral-700"
										disabled={isLoading}
										id="privateListingToken"
										name="privateListingToken"
										type="text"
									/>
								</div>
							)}
							<button className="btn btn-secondary" disabled={isLoading} type="submit">
								{bib.status === 'listed_public' ? t.makePrivate : t.makePublic}
							</button>
						</form>
					) : (
						<div className="space-y-4">
							<form action={formData => handleToggleListingStatusAction('listed_public', formData)}>
								<button className="btn btn-primary mr-2" disabled={isLoading} type="submit">
									{t.makePublic}
								</button>
							</form>
							<form action={formData => handleToggleListingStatusAction('listed_private', formData)}>
								<div>
									<label className="block text-sm font-medium" htmlFor="privateListingTokenToggle">
										{t.privateListingToken} (Required for private listing)
									</label>
									<input
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-neutral-600 dark:bg-neutral-700"
										disabled={isLoading}
										id="privateListingTokenToggle"
										name="privateListingToken"
										required
										type="text"
									/>
								</div>
								<button className="btn btn-secondary mt-2" disabled={isLoading} type="submit">
									{t.makePrivate}
								</button>
							</form>
						</div>
					)}
				</section>
			)}

			{/* Withdraw Listing Section */}
			{bib.status !== 'sold' && bib.status !== 'expired' && bib.status !== 'withdrawn' && (
				<section className="mb-8 rounded-lg border bg-white p-6 shadow-md dark:border-neutral-700 dark:bg-neutral-800">
					<h2 className="mb-4 text-xl font-semibold">{t.withdrawListing}</h2>
					<button
						className="btn btn-danger"
						disabled={isLoading}
						onClick={() => {
							// Voiding the promise to satisfy lint rule, error handling is inside handleWithdrawAction
							void handleWithdrawAction()
						}}
					>
						{t.confirmWithdraw}
					</button>
				</section>
			)}

			<div className="mt-8 text-center">
				<Link className="text-blue-500 hover:underline" href="/dashboard/seller">
					{t.backToDashboard}
				</Link>
			</div>
		</div>
	)
}
