import type { Bib } from '@/models/bib.model'
import type { Metadata } from 'next'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

import { fetchBibByIdForSeller, updateBibBySeller } from '@/services/bib.services'

export type EditBibPageProps = {
	params: Promise<{ bibId: string }>
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

// Helper to get status class string from globals.css
const getBibStatusClass = (status: Bib['status']): string => {
	switch (status) {
		case 'expired':
			return 'status-expired'
		case 'listed_private':
			return 'status-approved'
		case 'listed_public':
			return 'status-approved'
		case 'pending_validation':
			return 'status-pending'
		case 'sold':
			return 'status-sold'
		case 'validation_failed':
			return 'status-rejected'
		case 'withdrawn':
			return 'status-withdrawn'
		default:
			return 'bg-gray-200 text-gray-800'
	}
}

export default async function EditBibPage({
	searchParams: searchParamsPromise,
	params: paramsPromise,
}: EditBibPageProps) {
	const { userId: sellerUserId } = await auth()
	const params = await paramsPromise
	const searchParams = await searchParamsPromise
	const { bibId } = params

	if (sellerUserId == null || sellerUserId === '') {
		redirect(`/sign-in?redirect_url=/dashboard/seller/edit-bib/${bibId}`)
	}

	const bibWithEvent = await fetchBibByIdForSeller(bibId, sellerUserId)

	if (!bibWithEvent) {
		return (
			<div className="mx-auto max-w-lg p-4 text-center text-[var(--text-dark)] md:p-8">
				<p className="mb-6 rounded-lg border border-red-300 bg-[var(--error-bg)] p-4 text-[var(--error-text)]">
					Bib not found or you do not have permission to edit it.
				</p>
				<Link className="text-[var(--accent-sporty)] hover:underline" href="/dashboard/seller">
					Back to Seller Dashboard
				</Link>
			</div>
		)
	}

	const eventName = bibWithEvent.expand?.eventId?.name ?? `Event ID: ${bibWithEvent.eventId ?? 'N/A'}`

	const successMessage =
		searchParams && typeof searchParams.success === 'string' ? decodeURIComponent(searchParams.success) : ''
	const errorMessage =
		searchParams && typeof searchParams.error === 'string' ? decodeURIComponent(searchParams.error) : ''

	// Server action to update bib details
	async function handleUpdateBibDetails(formData: FormData) {
		'use server'

		if (sellerUserId == null || sellerUserId === '') {
			redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('Authentication required.')}`)
			return
		}

		const priceValue = formData.get('price') as string

		const price = parseFloat(priceValue)

		if (isNaN(price) || price <= 0) {
			redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('Valid price is required.')}`)
			return
		}

		const dataToUpdate: { price: number; status: Bib['status'] } = {
			status: 'withdrawn',
			price: price,
		}

		try {
			const updatedBib = await updateBibBySeller(bibId, dataToUpdate, sellerUserId)

			if (updatedBib) {
				redirect(
					`/dashboard/seller/edit-bib/${bibId}?success=${encodeURIComponent('Bib details updated successfully!')}`
				)
			} else {
				redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('Failed to update bib details.')}`)
			}
		} catch {
			redirect(
				`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('An error occurred while updating the bib.')}`
			)
		}
	}

	// Server action to withdraw bib
	async function handleWithdrawBib() {
		'use server'

		if (sellerUserId == null || sellerUserId === '') {
			redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('Authentication required.')}`)
			return
		}

		try {
			const updatedBib = await updateBibBySeller(bibId, { status: 'withdrawn' }, sellerUserId)

			if (updatedBib) {
				redirect(`/dashboard/seller?success=${encodeURIComponent('Bib listing withdrawn.')}&bibStatus=withdrawn`)
			} else {
				redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('Failed to withdraw bib.')}`)
			}
		} catch {
			redirect(
				`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('An error occurred while withdrawing the bib.')}`
			)
		}
	}

	// Server action to toggle listing status
	async function handleToggleListingStatus(newStatus: 'listed_private' | 'listed_public') {
		'use server'

		if (sellerUserId == null || sellerUserId === '') {
			redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('Authentication required.')}`)
			return
		}

		if (!bibWithEvent) {
			redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('Bib not found.')}`)
			return
		}

		// Validation for status transitions
		if (bibWithEvent.status === 'validation_failed' && newStatus === 'listed_public') {
			redirect(
				`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('Cannot make public until event details are verified by admin.')}`
			)
			return
		}

		if (bibWithEvent.status === 'sold' || bibWithEvent.status === 'expired') {
			redirect(
				`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent(`Cannot change listing status from ${bibWithEvent.status}.`)}`
			)
			return
		}

		try {
			const updatedBib = await updateBibBySeller(bibId, { status: newStatus }, sellerUserId)

			if (updatedBib) {
				redirect(
					`/dashboard/seller/edit-bib/${bibId}?success=${encodeURIComponent(`Bib status changed to ${newStatus.replace('_', ' ')}.`)}`
				)
			} else {
				redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('Failed to change bib status.')}`)
			}
		} catch {
			redirect(
				`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent('An error occurred while changing the bib status.')}`
			)
		}
	}

	const canMakePublic = ['listed_private', 'pending_validation', 'withdrawn'].includes(bibWithEvent.status)

	const canMakePrivate = bibWithEvent.status === 'listed_public'

	const canWithdraw = !['expired', 'sold', 'withdrawn'].includes(bibWithEvent.status)

	return (
		<div className="mx-auto max-w-2xl p-4 text-[var(--text-dark)] md:p-8">
			<header className="mb-6 text-center">
				<h1 className="text-3xl font-bold">Edit Bib Listing</h1>
				<p className="text-md mt-1">
					<strong>Event:</strong> {eventName}
				</p>
				<p className="text-sm text-gray-600 dark:text-gray-400">
					<strong>Reg #:</strong> {bibWithEvent.registrationNumber}
				</p>
			</header>

			{successMessage.length > 0 && (
				<div className="mb-4 rounded-md border border-green-300 bg-[var(--success-bg)] p-3 text-center text-sm text-[var(--success-text)]">
					{successMessage}
				</div>
			)}

			{errorMessage.length > 0 && (
				<div className="mb-4 rounded-md border border-red-300 bg-[var(--error-bg)] p-3 text-center text-sm text-[var(--error-text)]">
					Error: {errorMessage}
				</div>
			)}

			{/* Bib Details Form */}
			<div className="bento-box mb-8">
				<form action={handleUpdateBibDetails} className="space-y-4">
					<div>
						<label className="mb-1 block text-sm font-medium" htmlFor="price">
							Selling Price ($):
						</label>
						<input
							className="w-full rounded-md border border-[var(--border-color)] p-2 shadow-sm dark:border-neutral-600 dark:bg-neutral-700"
							defaultValue={bibWithEvent.price}
							id="price"
							min="0.01"
							name="price"
							required
							step="0.01"
							type="number"
						/>
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium" htmlFor="originalPrice">
							Original Price ($) (Optional):
						</label>
						<input
							className="w-full rounded-md border border-[var(--border-color)] p-2 shadow-sm dark:border-neutral-600 dark:bg-neutral-700"
							defaultValue={bibWithEvent.originalPrice ?? ''}
							id="originalPrice"
							min="0.00"
							name="originalPrice"
							step="0.01"
							type="number"
						/>
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium" htmlFor="size">
							Size (Optional):
						</label>
						<input
							className="w-full rounded-md border border-[var(--border-color)] p-2 shadow-sm dark:border-neutral-600 dark:bg-neutral-700"
							defaultValue={bibWithEvent.size ?? ''}
							id="size"
							name="size"
							type="text"
						/>
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium" htmlFor="gender">
							Gender (Optional):
						</label>
						<select
							className="w-full rounded-md border border-[var(--border-color)] p-2 shadow-sm dark:border-neutral-600 dark:bg-neutral-700"
							defaultValue={bibWithEvent.gender ?? ''}
							id="gender"
							name="gender"
						>
							<option value="">Select Gender</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
							<option value="unisex">Unisex</option>
						</select>
					</div>

					<button className="btn btn-primary w-full" type="submit">
						Save Changes
					</button>
				</form>
			</div>

			{/* Listing Status Management */}
			<div className="bento-box">
				<h2 className="mb-3 text-lg font-semibold">Manage Listing Status</h2>
				<p className="mb-3 text-sm">
					Current Status:
					<span className={`status-badge ${getBibStatusClass(bibWithEvent.status)} ml-2`}>
						{bibWithEvent.status.replace(/_/g, ' ').toUpperCase()}
					</span>
				</p>

				<div className="flex flex-wrap gap-3">
					{canWithdraw && (
						<form action={handleWithdrawBib}>
							<button className="btn btn-withdraw" type="submit">
								Withdraw Listing
							</button>
						</form>
					)}

					{canMakePublic && (
						<form action={() => handleToggleListingStatus('listed_public')}>
							<button className="btn btn-secondary bg-green-500 text-white hover:bg-green-600" type="submit">
								Make Public
							</button>
						</form>
					)}

					{canMakePrivate && (
						<form action={() => handleToggleListingStatus('listed_private')}>
							<button className="btn btn-secondary bg-purple-500 text-white hover:bg-purple-600" type="submit">
								Make Private
							</button>
						</form>
					)}
				</div>

				{bibWithEvent.status === 'validation_failed' && (
					<p className="mt-2 text-xs text-orange-600">
						This bib cannot be made public until event details are verified by an admin.
					</p>
				)}
			</div>

			<Link className="mt-8 block text-center text-[var(--accent-sporty)] hover:underline" href="/dashboard/seller">
				Back to Seller Dashboard
			</Link>
		</div>
	)
}

export async function generateMetadata({ params: paramsPromise }: EditBibPageProps): Promise<Metadata> {
	const params = await paramsPromise
	return {
		title: `Edit Bib ${params.bibId} | Seller Dashboard | Beswib`,
	}
}
