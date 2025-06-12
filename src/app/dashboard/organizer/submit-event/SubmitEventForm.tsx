'use client'

import React from 'react'

import { getTranslations } from '@/lib/getDictionary'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import submitEventTranslations from './locales.json'
import { handleSubmitEvent } from './actions'

interface SubmitEventFormProps {
	translations: Translations
}

type Translations = ReturnType<typeof getTranslations<(typeof submitEventTranslations)['en'], 'en'>>

export default function SubmitEventForm({ translations: t }: SubmitEventFormProps) {
	const router = useRouter()

	function formActionWrapper(formData: FormData) {
		handleSubmitEvent(formData)
			.then(() => {
				toast.success('Event submitted successfully!')
				router.push('/dashboard/organizer?success=true')
			})
			.catch((error: unknown) => {
				toast.error(error instanceof Error ? error.message : String(error))
			})
	}

	return (
		<form
			action={formActionWrapper}
			className="space-y-6 rounded-xl border border-[var(--border-color)] bg-white p-6 shadow-lg md:p-8 dark:bg-neutral-800"
		>
			<div>
				<label className="mb-1 block text-sm font-medium" htmlFor="name">
					{t.eventNameLabel}
				</label>
				<input
					className="w-full rounded-md border border-[var(--border-color)] p-2 shadow-sm focus:border-[var(--accent-sporty)] focus:ring-[var(--accent-sporty)] dark:border-neutral-600 dark:bg-neutral-700"
					id="name"
					name="name"
					required
					type="text"
				/>
			</div>
			<div>
				<label className="mb-1 block text-sm font-medium" htmlFor="date">
					{t.eventDateLabel}
				</label>
				<input
					className="w-full rounded-md border border-[var(--border-color)] p-2 shadow-sm focus:border-[var(--accent-sporty)] focus:ring-[var(--accent-sporty)] dark:border-neutral-600 dark:bg-neutral-700"
					id="date"
					name="date"
					required
					type="date"
				/>
			</div>
			<div>
				<label className="mb-1 block text-sm font-medium" htmlFor="location">
					{t.eventLocation}
				</label>
				<input
					className="w-full rounded-md border border-[var(--border-color)] p-2 shadow-sm focus:border-[var(--accent-sporty)] focus:ring-[var(--accent-sporty)] dark:border-neutral-600 dark:bg-neutral-700"
					id="location"
					name="location"
					required
					type="text"
				/>
			</div>
			<div>
				<label className="mb-1 block text-sm font-medium" htmlFor="description">
					{t.eventDescription}
				</label>
				<textarea
					className="w-full rounded-md border border-[var(--border-color)] p-2 shadow-sm focus:border-[var(--accent-sporty)] focus:ring-[var(--accent-sporty)] dark:border-neutral-600 dark:bg-neutral-700"
					id="description"
					name="description"
					rows={4}
				></textarea>
			</div>
			<div>
				<label className="mb-1 block text-sm font-medium" htmlFor="participantCount">
					{t.participantCount}
				</label>
				<input
					className="w-full rounded-md border border-[var(--border-color)] p-2 shadow-sm focus:border-[var(--accent-sporty)] focus:ring-[var(--accent-sporty)] dark:border-neutral-600 dark:bg-neutral-700"
					id="participantCount"
					min="0"
					name="participantCount"
					type="number"
				/>
			</div>

			{/* New Fields Start Here */}
			<div>
				<label className="mb-1 block text-sm font-medium" htmlFor="raceType">
					{t.raceTypeLabel}
				</label>
				<select
					className="w-full rounded-md border border-[var(--border-color)] p-2 shadow-sm focus:border-[var(--accent-sporty)] focus:ring-[var(--accent-sporty)] dark:border-neutral-600 dark:bg-neutral-700"
					id="raceType"
					name="raceType"
				>
					<option value="">{t.selectOptionDefault}</option>
					<option value="trail">Trail</option>
					<option value="road">Road</option>
					<option value="triathlon">Triathlon</option>
					<option value="other">Other</option>
				</select>
			</div>

			<div>
				<label className="mb-1 block text-sm font-medium" htmlFor="distance">
					{t.distanceLabel}
				</label>
				<input
					className="w-full rounded-md border border-[var(--border-color)] p-2 shadow-sm focus:border-[var(--accent-sporty)] focus:ring-[var(--accent-sporty)] dark:border-neutral-600 dark:bg-neutral-700"
					id="distance"
					name="distance"
					type="number"
					min="0"
					step="0.1"
				/>
			</div>

			<div>
				<label className="mb-1 block text-sm font-medium" htmlFor="elevationGain">
					{t.elevationGainLabel}
				</label>
				<input
					className="w-full rounded-md border border-[var(--border-color)] p-2 shadow-sm focus:border-[var(--accent-sporty)] focus:ring-[var(--accent-sporty)] dark:border-neutral-600 dark:bg-neutral-700"
					id="elevationGain"
					name="elevationGain"
					type="number"
					min="0"
				/>
			</div>

			<div>
				<label className="mb-1 block text-sm font-medium" htmlFor="raceFormat">
					{t.raceFormatLabel}
				</label>
				<select
					className="w-full rounded-md border border-[var(--border-color)] p-2 shadow-sm focus:border-[var(--accent-sporty)] focus:ring-[var(--accent-sporty)] dark:border-neutral-600 dark:bg-neutral-700"
					id="raceFormat"
					name="raceFormat"
				>
					<option value="">{t.selectOptionDefault}</option>
					<option value="solo">Solo</option>
					<option value="team">Team</option>
					<option value="relay">Relay</option>
					<option value="other">Other</option>
				</select>
			</div>

			<div>
				<label className="mb-1 block text-sm font-medium" htmlFor="logoUrl">
					{t.logoUrlLabel}
				</label>
				<input
					className="w-full rounded-md border border-[var(--border-color)] p-2 shadow-sm focus:border-[var(--accent-sporty)] focus:ring-[var(--accent-sporty)] dark:border-neutral-600 dark:bg-neutral-700"
					id="logoUrl"
					name="logoUrl"
					type="url"
				/>
			</div>

			<div>
				<label className="mb-1 block text-sm font-medium" htmlFor="bibPickupDetails">
					{t.bibPickupDetailsLabel}
				</label>
				<textarea
					className="w-full rounded-md border border-[var(--border-color)] p-2 shadow-sm focus:border-[var(--accent-sporty)] focus:ring-[var(--accent-sporty)] dark:border-neutral-600 dark:bg-neutral-700"
					id="bibPickupDetails"
					name="bibPickupDetails"
					rows={3}
				></textarea>
			</div>

			<div>
				<label className="mb-1 block text-sm font-medium" htmlFor="registrationOpenDate">
					{t.registrationOpenDateLabel}
				</label>
				<input
					className="w-full rounded-md border border-[var(--border-color)] p-2 shadow-sm focus:border-[var(--accent-sporty)] focus:ring-[var(--accent-sporty)] dark:border-neutral-600 dark:bg-neutral-700"
					id="registrationOpenDate"
					name="registrationOpenDate"
					type="date"
				/>
			</div>

			<div>
				<label className="mb-1 block text-sm font-medium" htmlFor="referencePrice">
					{t.referencePriceLabel}
				</label>
				<input
					className="w-full rounded-md border border-[var(--border-color)] p-2 shadow-sm focus:border-[var(--accent-sporty)] focus:ring-[var(--accent-sporty)] dark:border-neutral-600 dark:bg-neutral-700"
					id="referencePrice"
					name="referencePrice"
					type="number"
					min="0"
					step="0.01"
				/>
			</div>
			{/* New Fields End Here */}

			<button className="btn btn-primary w-full" type="submit">
				{t.submit}
			</button>
		</form>
	)
}
