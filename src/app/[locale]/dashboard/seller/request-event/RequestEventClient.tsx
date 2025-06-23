'use client'

import { ArrowLeft, Calendar, MapPin, MessageSquare, Send, User } from 'lucide-react'
import { useState } from 'react'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

import type { Locale } from '@/lib/i18n-config'

import { createEventCreationRequest } from '@/services/eventCreationRequest.services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textareaAlt'
import { Input } from '@/components/ui/inputAlt'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface FormData {
	eventDate: string
	location: string
	message: string
	name: string
}

interface FormErrors {
	eventDate?: string
	location?: string
	name?: string
}

interface RequestEventClientProps {
	locale: Locale
	translations: {
		actions: {
			cancel: string
			goBack: string
			submit: string
		}
		form: {
			eventDate: string
			eventDateHelp: string
			eventName: string
			eventNameHelp: string
			eventNamePlaceholder: string
			location: string
			locationHelp: string
			locationPlaceholder: string
			message: string
			messageHelp: string
			messagePlaceholder: string
		}
		messages: {
			error: string
			loading: string
			success: string
		}
		subtitle: string
		title: string
		validation: {
			eventDateInPast: string
			eventDateRequired: string
			eventNameRequired: string
			locationRequired: string
		}
	}
	userId: string
}

export default function RequestEventClient({ userId, translations: t, locale }: RequestEventClientProps) {
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [showSuccess, setShowSuccess] = useState(false)
	const [errors, setErrors] = useState<FormErrors>({})
	const [formData, setFormData] = useState<FormData>({
		name: '',
		message: '',
		location: '',
		eventDate: '',
	})

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {}

		if (!formData.name.trim()) {
			newErrors.name = t.validation.eventNameRequired
		}

		if (!formData.location.trim()) {
			newErrors.location = t.validation.locationRequired
		}

		if (!formData.eventDate) {
			newErrors.eventDate = t.validation.eventDateRequired
		} else {
			const selectedDate = new Date(formData.eventDate)
			const today = new Date()
			today.setHours(0, 0, 0, 0)

			if (selectedDate < today) {
				newErrors.eventDate = t.validation.eventDateInPast
			}
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleInputChange = (field: keyof FormData, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }))
		// Clear error for this field when user starts typing
		if (errors[field as keyof FormErrors]) {
			setErrors(prev => ({ ...prev, [field]: undefined }))
		}
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateForm()) {
			return
		}

		setIsSubmitting(true)

		void createEventCreationRequest({
			userId,
			name: formData.name.trim(),
			message: formData.message.trim() || undefined,
			location: formData.location.trim(),
			eventDate: new Date(formData.eventDate),
		})
			.then(() => {
				setShowSuccess(true)
				setTimeout(() => {
					router.push(`/${locale}/dashboard/seller/sell-bib`)
				}, 3000)
			})
			.catch(error => {
				console.error('Error submitting event request:', error)
				alert(t.messages.error)
			})
			.finally(() => {
				setIsSubmitting(false)
			})
	}

	if (showSuccess) {
		return (
			<div className="mx-auto max-w-2xl p-4">
				<Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
					<CardContent className="p-8 text-center">
						<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
							<Send className="h-8 w-8 text-green-600 dark:text-green-300" />
						</div>
						<h2 className="mb-2 text-xl font-semibold text-green-800 dark:text-green-200">{t.title}</h2>
						<p className="text-green-700 dark:text-green-300">{t.messages.success}</p>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="mx-auto max-w-2xl p-4">
			{/* Header */}
			<div className="mb-6">
				<Link
					className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
					href={`/${locale}/dashboard/seller/sell-bib`}
				>
					<ArrowLeft className="h-4 w-4" />
					{t.actions.goBack}
				</Link>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t.title}</h1>
				<p className="mt-2 text-gray-600 dark:text-gray-400">{t.subtitle}</p>
			</div>

			{/* Form */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<User className="h-5 w-5" />
						{t.title}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form className="space-y-6" onSubmit={handleSubmit}>
						{/* Event Name */}
						<div className="space-y-2">
							<Label htmlFor="eventName">{t.form.eventName}</Label>
							<Input
								id="eventName"
								onChange={e => handleInputChange('name', e.target.value)}
								placeholder={t.form.eventNamePlaceholder}
								type="text"
								value={formData.name}
							/>
							<p className="text-xs text-gray-500">{t.form.eventNameHelp}</p>
							{errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
						</div>

						{/* Location */}
						<div className="space-y-2">
							<Label htmlFor="location">{t.form.location}</Label>
							<div className="relative">
								<MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
								<Input
									className="pl-10"
									id="location"
									onChange={e => handleInputChange('location', e.target.value)}
									placeholder={t.form.locationPlaceholder}
									type="text"
									value={formData.location}
								/>
							</div>
							<p className="text-xs text-gray-500">{t.form.locationHelp}</p>
							{errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
						</div>

						{/* Event Date */}
						<div className="space-y-2">
							<Label htmlFor="eventDate">{t.form.eventDate}</Label>
							<div className="relative">
								<Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
								<Input
									className="pl-10"
									id="eventDate"
									min={new Date().toISOString().split('T')[0]}
									onChange={e => handleInputChange('eventDate', e.target.value)}
									type="date"
									value={formData.eventDate}
								/>
							</div>
							<p className="text-xs text-gray-500">{t.form.eventDateHelp}</p>
							{errors.eventDate && <p className="text-sm text-red-600">{errors.eventDate}</p>}
						</div>

						{/* Additional Message */}
						<div className="space-y-2">
							<Label htmlFor="message">{t.form.message}</Label>
							<div className="relative">
								<MessageSquare className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
								<Textarea
									className="min-h-[100px] pl-10"
									id="message"
									onChange={e => handleInputChange('message', e.target.value)}
									placeholder={t.form.messagePlaceholder}
									value={formData.message}
								/>
							</div>
							<p className="text-xs text-gray-500">{t.form.messageHelp}</p>
						</div>

						{/* Actions */}
						<div className="flex gap-4 pt-4">
							<Button className="flex-1" disabled={isSubmitting} type="submit">
								{isSubmitting ? t.messages.loading : t.actions.submit}
							</Button>
							<Link href={`/${locale}/dashboard/seller/sell-bib`}>
								<Button type="button" variant="outline">
									{t.actions.cancel}
								</Button>
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
