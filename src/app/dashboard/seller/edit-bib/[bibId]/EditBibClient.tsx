'use client'

import type { Bib } from '@/models/bib.model'
import type { Event } from '@/models/event.model' // Assuming Event model is needed for expanded bib

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'

import {
	handleToggleListingStatus,
	handleUpdateBibDetails,
	handleWithdrawBib,
} from './actions'

// Define a more specific type for translations
interface EditBibTranslations {
	title: string
	backToDashboard: string
	bibNotFound: string
	errorFetchingBib: string
	// Add other translation keys from your `editBibTranslations` JSON
	// Example from original page:
	currentStatus: string
	eventDetails: string
	eventName: string
	eventDate: string
	eventLocation: string
	bibDetails: string
	registrationNumber: string
	price: string
	originalPrice: string
	size: string
	gender: string
	genderOptions: {
		male: string
		female: string
		unisex: string
		placeholder: string
	}
	updateDetails: string
	listingStatus: string
	privateListingToken: string
	makePrivate: string
	makePublic: string
	withdrawListing: string
	confirmWithdraw: string
	actions: string
	// ... any other keys used by the forms
}

interface EditBibClientProps {
	initialBibWithEvent: (Bib & { expand?: { eventId?: Event } }) | null
	initialError?: string | null
	translations: EditBibTranslations
	bibId: string // Pass bibId for actions
}

export default function EditBibClient({
	initialBibWithEvent,
	initialError,
	translations: t,
	bibId,
}: EditBibClientProps) {
	const router = useRouter()
	const [bib, setBib] = useState<(Bib & { expand?: { eventId?: Event } }) | null>(
		initialBibWithEvent
	)
	const [isLoading, setIsLoading] = useState(false) // For disabling forms during action

	useEffect(() => {
		if (initialError) {
			toast.error(initialError)
		}
	}, [initialError])

	async function handleUpdateDetailsAction(formData: FormData) {
		if (!bib) return
		setIsLoading(true)
		const result = await handleUpdateBibDetails(bib.id, formData)
		setIsLoading(false)

		if (result.error) {
			toast.error(result.error)
		} else if (result.success) {
			toast.success(result.message || 'Details updated successfully!')
			if (result.updatedBib) {
				// Preserve expand if it exists
				setBib(prev => ({ ...prev, ...result.updatedBib, expand: prev?.expand }))
			}
		}
	}

	async function handleToggleListingStatusAction(
		newStatus: 'listed_private' | 'listed_public',
		formData: FormData
	) {
		if (!bib) return
		setIsLoading(true)
		// The server action now takes formData for the privateListingToken
		const result = await handleToggleListingStatus(bib.id, newStatus, formData)
		setIsLoading(false)

		if (result.error) {
			toast.error(result.error)
		} else if (result.success) {
			toast.success(result.message || 'Listing status updated!')
			if (result.updatedBib) {
				setBib(prev => ({ ...prev, ...result.updatedBib, expand: prev?.expand }))
			}
		}
	}

	async function handleWithdrawAction() {
		if (!bib) return
		// Optional: Add a confirmation dialog here
		// if (!confirm(t.confirmWithdraw)) {
		// 	return;
		// }
		setIsLoading(true)
		const result = await handleWithdrawBib(bib.id)
		setIsLoading(false)

		if (result.error) {
			toast.error(result.error)
		} else if (result.success && result.redirectPath) {
			toast.success('Bib withdrawn successfully!') // Message from redirectPath can be used too
			router.push(result.redirectPath)
		}
	}

	if (!bib && !initialError) {
		// This case should ideally be handled by the server component sending an initialError
		return <p>{t.bibNotFound || 'Bib not found.'}</p>
	}

	if (initialError && !bib) {
		// Error occurred during initial fetch, message already toasted via useEffect
		// We can show a general error message here or rely on the toast.
		return (
			<div className="container mx-auto p-4 text-center">
				<p className="text-red-500">{initialError}</p>
				<Link href="/dashboard/seller" className="mt-4 inline-block text-blue-500 hover:underline">
					{t.backToDashboard || 'Back to Dashboard'}
				</Link>
			</div>
		)
	}

	if (!bib) {
		// Fallback if bib is null for any other reason after initial checks
		return <p>Loading bib details or an unexpected error occurred.</p>;
	}


	// Determine if event details are available
	const eventName = bib.expand?.eventId?.name ?? 'N/A'
	const eventDate = bib.expand?.eventId?.date ? new Date(bib.expand.eventId.date).toLocaleDateString() : 'N/A'
	const eventLocation = bib.expand?.eventId?.location ?? 'N/A'


	return (
		<div className="container mx-auto max-w-3xl p-4">
			<header className="mb-8 text-center">
				<h1 className="text-3xl font-bold">{t.title}</h1>
				<p className="text-sm text-gray-600">
					{t.currentStatus}: <span className="font-semibold">{bib.status?.replace('_', ' ')}</span>
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
						<label htmlFor="registrationNumber" className="block text-sm font-medium">
							{t.registrationNumber}
						</label>
						<input
							type="text"
							name="registrationNumber"
							id="registrationNumber"
							defaultValue={bib.registrationNumber}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-700 sm:text-sm"
							required
							disabled={isLoading}
						/>
					</div>
					<div>
						<label htmlFor="price" className="block text-sm font-medium">
							{t.price}
						</label>
						<input
							type="number"
							name="price"
							id="price"
							defaultValue={bib.price}
							min="0.01"
							step="0.01"
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-700 sm:text-sm"
							required
							disabled={isLoading}
						/>
					</div>
					<div>
						<label htmlFor="originalPrice" className="block text-sm font-medium">
							{t.originalPrice}
						</label>
						<input
							type="number"
							name="originalPrice"
							id="originalPrice"
							defaultValue={bib.originalPrice ?? ''}
							min="0"
							step="0.01"
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-700 sm:text-sm"
							disabled={isLoading}
						/>
					</div>
					<div>
						<label htmlFor="size" className="block text-sm font-medium">
							{t.size}
						</label>
						<input
							type="text"
							name="size"
							id="size"
							defaultValue={bib.size ?? ''}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-700 sm:text-sm"
							disabled={isLoading}
						/>
					</div>
					<div>
						<label htmlFor="gender" className="block text-sm font-medium">
							{t.gender}
						</label>
						<select
							name="gender"
							id="gender"
							defaultValue={bib.gender ?? ''}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-700 sm:text-sm"
							disabled={isLoading}
						>
							<option value="">{t.genderOptions?.placeholder || 'Select gender'}</option>
							<option value="male">{t.genderOptions?.male || 'Male'}</option>
							<option value="female">{t.genderOptions?.female || 'Female'}</option>
							<option value="unisex">{t.genderOptions?.unisex || 'Unisex'}</option>
						</select>
					</div>
					<button
						type="submit"
						className="btn btn-primary w-full sm:w-auto"
						disabled={isLoading || bib.status === 'sold' || bib.status === 'expired' || bib.status === 'withdrawn'}
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
									<label htmlFor="privateListingToken" className="block text-sm font-medium">
										{t.privateListingToken} (Required for private listing)
									</label>
									<input
										type="text"
										name="privateListingToken"
										id="privateListingToken"
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-700 sm:text-sm"
										disabled={isLoading}
									/>
								</div>
							)}
							<button type="submit" className="btn btn-secondary" disabled={isLoading}>
								{bib.status === 'listed_public' ? t.makePrivate : t.makePublic}
							</button>
						</form>
					) : (
						<div className="space-y-4">
							<form action={formData => handleToggleListingStatusAction('listed_public', formData)}>
								<button type="submit" className="btn btn-primary mr-2" disabled={isLoading}>
									{t.makePublic}
								</button>
							</form>
							<form action={formData => handleToggleListingStatusAction('listed_private', formData)}>
								<div>
									<label htmlFor="privateListingTokenToggle" className="block text-sm font-medium">
										{t.privateListingToken} (Required for private listing)
									</label>
									<input
										type="text"
										name="privateListingToken"
										id="privateListingTokenToggle"
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-700 sm:text-sm"
										disabled={isLoading}
										required
									/>
								</div>
								<button type="submit" className="btn btn-secondary mt-2" disabled={isLoading}>
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
						onClick={handleWithdrawAction} // Changed to onClick to potentially add confirmation
						className="btn btn-danger"
						disabled={isLoading}
					>
						{t.confirmWithdraw}
					</button>
				</section>
			)}

			<div className="mt-8 text-center">
				<Link href="/dashboard/seller" className="text-blue-500 hover:underline">
					{t.backToDashboard}
				</Link>
			</div>
		</div>
	)
}
