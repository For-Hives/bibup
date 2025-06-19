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
			<div className="from-background via-primary/5 to-background relative min-h-screen bg-gradient-to-br">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
				<div className="relative flex min-h-screen items-center justify-center">
					<div className="border-border/50 bg-card/80 w-full max-w-md rounded-3xl border p-8 text-center shadow-[0_0_0_1px_hsl(var(--border)),inset_0_0_30px_hsl(var(--primary)/0.1),inset_0_0_60px_hsl(var(--accent)/0.05),0_0_50px_hsl(var(--primary)/0.2)] backdrop-blur-md">
						<div className="mb-6 text-6xl text-green-600 dark:text-green-400">✓</div>
						<h1 className="text-foreground mb-4 text-3xl font-bold">Event Created Successfully!</h1>
						<p className="text-muted-foreground mb-6 text-lg">
							"{createdEvent.name}" has been created and is now available on the platform.
						</p>
						<p className="text-muted-foreground/80 text-base">Redirecting to admin dashboard...</p>
					</div>
				</div>
			</div>
		)
	}

	return <EventCreationForm onCancel={handleCancel} onSuccess={handleSuccess} />
}
