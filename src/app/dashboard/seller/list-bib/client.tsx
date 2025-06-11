'use client'

import type { Event } from '@/models/event.model'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import * as v from 'valibot'
import Link from 'next/link'

import { type BibFormData, BibFormSchema } from './schemas'
import { handleListBibServerAction } from './actions'

type Translations = {
	backToDashboard: string
	form: {
		eventSelect: string
		eventSelectPlaceholder: string
		gender: string
		genderPlaceholder: string
		notes: string
		notesPlaceholder: string
		notListedEvent: string
		originalPrice: string
		price: string
		pricePlaceholder: string
		registrationNumber: string
		registrationNumberPlaceholder: string
		size: string
		sizePlaceholder: string
		submit: string
		unlistedEventDate: string
		unlistedEventLocation: string
		unlistedEventName: string
		unlistedEventNamePlaceholder: string
	}
	genderOptions: {
		female: string
		male: string
		unisex: string
	}
	legalNotice: string
	loginRequired: string
	metadataDescription: string
	metadataTitle: string
	noBibsListedError: string
	partneredEventsEmpty: string
	title: string
	unlistedEventInfo: string
}

export default function ListNewBibClientPage({
	partneredEvents,
	translations: t,
}: {
	partneredEvents: Event[]
	translations: Translations
}) {
	const router = useRouter()
	const [isNotListedEvent, setIsNotListedEvent] = useState(false)
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
	const [formData, setFormData] = useState<Partial<BibFormData>>({
		isNotListedEvent: false,
		price: 0,
	})

	const validateField = (name: string, value: unknown) => {
		const testData = { ...formData, [name]: value }
		const result = v.safeParse(BibFormSchema, testData)

		if (!result.success) {
			const flatErrors = v.flatten(result.issues)
			const fieldIssues = flatErrors.nested?.[name]
			if (fieldIssues && fieldIssues.length > 0) {
				setFieldErrors(prev => ({ ...prev, [name]: fieldIssues[0] }))
			} else if (flatErrors.root && flatErrors.root.length > 0) {
				setFieldErrors(prev => ({ ...prev, [name]: flatErrors.root?.[0] ?? 'Validation error' }))
			} else {
				setFieldErrors(prev => {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { [name]: _, ...rest } = prev
					return rest
				})
			}
		} else {
			setFieldErrors(prev => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { [name]: _, ...rest } = prev
				return rest
			})
		}
	}

	function handleFieldChange(name: string, value: unknown) {
		setFormData(prev => ({ ...prev, [name]: value }))
		validateField(name, value)

		if (name === 'isNotListedEvent' && typeof value === 'boolean') {
			setIsNotListedEvent(value)
		}
	}

	async function formActionWrapper(formData: FormData) {
		setFieldErrors({})
		try {
			const result = await handleListBibServerAction(formData)
			if (result.success && result.redirectPath) {
				router.push(result.redirectPath)
			}
		} catch (e: unknown) {
			toast.error(e instanceof Error ? e.message : String(e))
		}
	}

	return (
		<div className="container mx-auto max-w-2xl p-6">
			<header className="mb-8 text-center">
				<h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
			</header>

			<form action={formActionWrapper} className="space-y-6">
				<div>
					<label
						className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300"
						htmlFor="isNotListedEvent"
					>
						<input
							checked={isNotListedEvent}
							className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							id="isNotListedEvent"
							name="isNotListedEvent"
							onChange={e => handleFieldChange('isNotListedEvent', e.target.checked)}
							type="checkbox"
						/>
						<span>{t.form.notListedEvent}</span>
					</label>
				</div>

				{!isNotListedEvent ? (
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="eventId">
							{t.form.eventSelect}:
						</label>
						<select
							className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
							disabled={isNotListedEvent}
							id="eventId"
							name="eventId"
							onChange={e => handleFieldChange('eventId', e.target.value)}
							required={!isNotListedEvent}
						>
							<option value="">{t.form.eventSelectPlaceholder}</option>
							{partneredEvents.map(event => (
								<option key={event.id} value={event.id}>
									{event.name} ({new Date(event.date).toLocaleDateString()})
								</option>
							))}
						</select>
						{fieldErrors.eventId && (
							<p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.eventId}</p>
						)}
						{partneredEvents.length === 0 && (
							<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t.partneredEventsEmpty}</p>
						)}
					</div>
				) : (
					<div className="space-y-4">
						<p className="text-sm text-gray-500 dark:text-gray-400">{t.unlistedEventInfo}</p>
						<div>
							<label
								className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
								htmlFor="unlistedEventName"
							>
								{t.form.unlistedEventName}:
							</label>
							<input
								className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
								id="unlistedEventName"
								name="unlistedEventName"
								onChange={e => handleFieldChange('unlistedEventName', e.target.value)}
								placeholder={t.form.unlistedEventNamePlaceholder}
								required={isNotListedEvent}
								type="text"
							/>
							{fieldErrors.unlistedEventName && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.unlistedEventName}</p>
							)}
						</div>
						<div>
							<label
								className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
								htmlFor="unlistedEventDate"
							>
								{t.form.unlistedEventDate}:
							</label>
							<input
								className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
								id="unlistedEventDate"
								name="unlistedEventDate"
								onChange={e => handleFieldChange('unlistedEventDate', e.target.value)}
								required={isNotListedEvent}
								type="date"
							/>
							{fieldErrors.unlistedEventDate && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.unlistedEventDate}</p>
							)}
						</div>
						<div>
							<label
								className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
								htmlFor="unlistedEventLocation"
							>
								{t.form.unlistedEventLocation}:
							</label>
							<input
								className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
								id="unlistedEventLocation"
								name="unlistedEventLocation"
								onChange={e => handleFieldChange('unlistedEventLocation', e.target.value)}
								required={isNotListedEvent}
								type="text"
							/>
							{fieldErrors.unlistedEventLocation && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.unlistedEventLocation}</p>
							)}
						</div>
					</div>
				)}

				<div>
					<label
						className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
						htmlFor="registrationNumber"
					>
						{t.form.registrationNumber}:
					</label>
					<input
						className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						id="registrationNumber"
						name="registrationNumber"
						onChange={e => handleFieldChange('registrationNumber', e.target.value)}
						placeholder={t.form.registrationNumberPlaceholder}
						required
						type="text"
					/>
					{fieldErrors.registrationNumber && (
						<p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.registrationNumber}</p>
					)}
				</div>

				<div>
					<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="price">
						{t.form.price}:
					</label>
					<input
						className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						id="price"
						min="0.01"
						name="price"
						onChange={e => handleFieldChange('price', parseFloat(e.target.value) || 0)}
						placeholder={t.form.pricePlaceholder}
						required
						step="0.01"
						type="number"
					/>
					{fieldErrors.price && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.price}</p>}
				</div>

				<div>
					<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="originalPrice">
						{t.form.originalPrice}:
					</label>
					<input
						className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						id="originalPrice"
						min="0.00"
						name="originalPrice"
						onChange={e => handleFieldChange('originalPrice', parseFloat(e.target.value) || undefined)}
						step="0.01"
						type="number"
					/>
					{fieldErrors.originalPrice && (
						<p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.originalPrice}</p>
					)}
				</div>

				<div>
					<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="size">
						{t.form.size}:
					</label>
					<input
						className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						id="size"
						name="size"
						onChange={e => handleFieldChange('size', e.target.value)}
						placeholder={t.form.sizePlaceholder}
						type="text"
					/>
					{fieldErrors.size && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.size}</p>}
				</div>

				<div>
					<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="gender">
						{t.form.gender}:
					</label>
					<select
						className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						id="gender"
						name="gender"
						onChange={e => handleFieldChange('gender', e.target.value as 'female' | 'male' | 'unisex' | undefined)}
					>
						<option value="">{t.form.genderPlaceholder}</option>
						<option value="male">{t.genderOptions.male}</option>
						<option value="female">{t.genderOptions.female}</option>
						<option value="unisex">{t.genderOptions.unisex}</option>
					</select>
					{fieldErrors.gender && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.gender}</p>}
				</div>

				<div>
					<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="notes">
						{t.form.notes}:
					</label>
					<textarea
						className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						id="notes"
						name="notes"
						placeholder={t.form.notesPlaceholder}
						rows={3}
					/>
				</div>

				<p className="text-sm text-gray-500 dark:text-gray-400">{t.legalNotice}</p>

				<button
					className="w-full rounded-md bg-blue-600 px-4 py-2 text-white ring-2 transition-colors hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:bg-blue-500 dark:hover:bg-blue-600"
					type="submit"
				>
					{t.form.submit}
				</button>
			</form>
			<Link
				className="mt-4 inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
				href="/dashboard/seller"
			>
				{t.backToDashboard}
			</Link>
		</div>
	)
}
