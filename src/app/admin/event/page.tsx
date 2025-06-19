'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import EventCreationForm from '@/components/ui/event-creation-form'
import { Event } from '@/models/event.model'

export default function AdminEventPage() {
	const router = useRouter()
	const [isSuccess, setIsSuccess] = useState(false)
	const [createdEvent, setCreatedEvent] = useState<Event | null>(null)

	const handleSuccess = (event: Event) => {
		setCreatedEvent(event)
		setIsSuccess(true)

		// Optionally redirect after a delay
		setTimeout(() => {
			router.push('/admin')
		}, 3000)
	}

	const handleCancel = () => {
		router.push('/admin')
	}

	if (isSuccess && createdEvent) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
				<div className="w-full max-w-md rounded-lg bg-white p-8 text-center dark:bg-gray-800">
					<div className="mb-4 text-6xl text-green-600 dark:text-green-400">✓</div>
					<h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">Event Created Successfully!</h1>
					<p className="mb-4 text-gray-600 dark:text-gray-300">
						"{createdEvent.name}" has been created and is now available on the platform.
					</p>
					<p className="text-sm text-gray-500 dark:text-gray-400">Redirecting to admin dashboard...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen">
			<div className="py-8">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create New Event</h1>
						<p className="mt-2 text-gray-600 dark:text-gray-300">
							Add a new racing event to the Beswib platform. Complete all required fields to make the event available
							for bib resale.
						</p>
					</div>

					<div className="rounded-lg bg-white/10 shadow">
						<EventCreationForm onCancel={handleCancel} onSuccess={handleSuccess} />
					</div>
				</div>
			</div>
		</div>
	)
}
