'use client'

import React from 'react' // useEffect might be needed for other things later, but not for this simple form

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { handleSubmitEvent } from './actions' // Import the server action

interface SubmitEventFormProps {
	translations: SubmitEventTranslations
}

interface SubmitEventTranslations {
	backToDashboard: string
	createError: string
	errorPrefix: string
	eventDateLabel: string
	eventDescription: string
	eventLocation: string
	eventNameLabel: string
	loginRequired: string
	participantCount: string
	submit: string
	title: string
	unknownError: string
	validationError: string
	// Potentially add GLOBAL types if getTranslations merges them
	// GLOBAL?: { appName: string; welcomeMessage: string; errors: { unexpected: string } }
}

export default function SubmitEventForm({ translations: t }: SubmitEventFormProps) {
	const router = useRouter()

	async function formActionWrapper(formData: FormData) {
		try {
			const result = await handleSubmitEvent(formData)
			// handleSubmitEvent now throws errors, so it only returns on success.
			if (result.success && result.redirectPath != null) {
				// Optionally show a success toast before redirecting
				toast.success('Event submitted successfully!')
				router.push(result.redirectPath)
			}
			// Handle cases where success is true but no redirectPath, if applicable
		} catch (e: unknown) {
			toast.error(e instanceof Error ? e.message : String(e))
		}
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
					name="name" // Ensure name attributes match what server action expects (e.g., 'name' not 'eventName')
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
					name="date" // Ensure name attributes match
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
					name="location" // Ensure name attributes match
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
					name="description" // Ensure name attributes match
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
					name="participantCount" // Ensure name attributes match
					type="number"
				/>
			</div>
			<button className="btn btn-primary w-full" type="submit">
				{t.submit}
			</button>
		</form>
	)
}
