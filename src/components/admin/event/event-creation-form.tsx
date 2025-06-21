'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import * as React from 'react'

import { valibotResolver } from '@hookform/resolvers/valibot'
import { toast } from 'sonner'

import Translations from '@/app/[locale]/event/locales.json'
import { EventOption } from '@/models/eventOption.model'
import { getTranslations } from '@/lib/getDictionary'
import { Event } from '@/models/event.model'
import { Locale } from '@/lib/i18n-config'

import EventInformationSection from './EventInformationSection'
import { EventCreationSchema, EventFormData } from './types'
import EventDetailsSection from './EventDetailsSection'
import EventOptionsSection from './EventOptionsSection'
import PartnershipSection from './PartnershipSection'
import BibPickupSection from './BibPickupSection'
import OrganizerSection from './OrganizerSection'
import { Separator } from '../../ui/separator'
import { Button } from '../../ui/button'
import FakerButton from './FakerButton'

export interface EventCreationFormProps {
	locale: Locale
	onCancel?: () => void
	onSuccess?: (event: Event) => void
}

export default function EventCreationForm({ onSuccess, onCancel, locale }: EventCreationFormProps) {
	const translations = getTranslations(locale, Translations)

	const [isLoading, setIsLoading] = useState(false)
	const [eventOptions, setEventOptions] = useState<EventOption[]>([])

	const {
		watch,
		setValue,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<EventFormData>({
		resolver: valibotResolver(EventCreationSchema),
		defaultValues: {
			typeCourse: 'route',
			participantCount: 1,
			options: [],
			isPartnered: false,
		},
	})

	const formData = watch()

	const onSubmit = (data: EventFormData) => {
		setIsLoading(true)

		const submitData = async () => {
			try {
				// Create FormData for multipart/form-data submission
				const formDataToSend = new FormData()

				// Add all form fields
				formDataToSend.append('name', data.name)
				formDataToSend.append('location', data.location)
				formDataToSend.append('eventDate', new Date(data.eventDate).toISOString())
				formDataToSend.append('description', data.description)
				formDataToSend.append('typeCourse', data.typeCourse)
				formDataToSend.append('organizer', data.organizer)
				formDataToSend.append('isPartnered', data.isPartnered.toString())
				formDataToSend.append('options', JSON.stringify(data.options))

				// Add participant count if provided
				if (data.participantCount !== undefined) {
					formDataToSend.append('participantCount', data.participantCount.toString())
				}

				formDataToSend.append('bibPickupWindowBeginDate', new Date(data.bibPickupWindowBeginDate).toISOString())
				formDataToSend.append('bibPickupWindowEndDate', new Date(data.bibPickupWindowEndDate).toISOString())

				// Add optional fields
				if (data.distanceKm !== undefined) {
					formDataToSend.append('distanceKm', data.distanceKm.toString())
				}
				if (data.elevationGainM !== undefined) {
					formDataToSend.append('elevationGainM', data.elevationGainM.toString())
				}
				if (data.officialStandardPrice !== undefined) {
					formDataToSend.append('officialStandardPrice', data.officialStandardPrice.toString())
				}
				if (data.transferDeadline !== undefined && data.transferDeadline !== null && data.transferDeadline !== '') {
					formDataToSend.append('transferDeadline', new Date(data.transferDeadline).toISOString())
				}
				if (data.parcoursUrl !== undefined && data.parcoursUrl !== null && data.parcoursUrl !== '') {
					formDataToSend.append('parcoursUrl', data.parcoursUrl)
				}
				if (data.registrationUrl !== undefined && data.registrationUrl !== null && data.registrationUrl !== '') {
					formDataToSend.append('registrationUrl', data.registrationUrl)
				}
				if (data.bibPickupLocation !== undefined && data.bibPickupLocation !== null && data.bibPickupLocation !== '') {
					formDataToSend.append('bibPickupLocation', data.bibPickupLocation)
				}
				if (data.logoFile) {
					formDataToSend.append('logo', data.logoFile)
				}

				// Call the server action to create the event
				const response = await fetch('/api/admin/events', {
					method: 'POST',
					body: formDataToSend,
				})

				if (!response.ok) {
					const errorData = await response.json()
					throw new Error(errorData.message ?? 'Failed to create event')
				}

				const createdEvent = await response.json()
				toast.success('Event created successfully!')
				onSuccess?.(createdEvent)
			} catch (error) {
				console.error('Error creating event:', error)
				toast.error(error instanceof Error ? error.message : 'Failed to create event')
			} finally {
				setIsLoading(false)
			}
		}

		void submitData()
	}

	return (
		<div className="from-background via-primary/5 to-background relative min-h-screen bg-gradient-to-br pt-24">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
			<div className="relative flex items-center justify-center p-6 md:p-10">
				<form
					className="border-border/50 bg-card/80 relative w-full max-w-7xl rounded-3xl border p-8 shadow-[0_0_0_1px_hsl(var(--border)),inset_0_0_30px_hsl(var(--primary)/0.1),inset_0_0_60px_hsl(var(--accent)/0.05),0_0_50px_hsl(var(--primary)/0.2)] backdrop-blur-md md:p-12"
					// eslint-disable-next-line @typescript-eslint/no-misused-promises
					onSubmit={handleSubmit(onSubmit)}
				>
					{/* Faker Button - Development only */}
					<FakerButton setEventOptions={setEventOptions} setValue={setValue} translations={translations} />

					<div className="mb-12 text-left">
						<h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl">
							{translations.event.title}
						</h1>
						<p className="text-muted-foreground mt-4 text-lg">{translations.event.subtitle}</p>
					</div>

					{/* Global form error */}
					{errors.root && (
						<div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
							{errors.root.message}
						</div>
					)}

					{/* Event Information Section */}
					<EventInformationSection
						errors={errors}
						formData={formData}
						locale={locale}
						register={register}
						setValue={setValue}
						translations={translations}
					/>

					<Separator className="my-12" />

					{/* Organizer Section */}
					<OrganizerSection
						errors={errors}
						formData={formData}
						locale={locale}
						register={register}
						setValue={setValue}
						translations={translations}
					/>

					<Separator className="my-12" />

					{/* Event Details Section */}
					<EventDetailsSection
						errors={errors}
						formData={formData}
						locale={locale}
						register={register}
						setValue={setValue}
						translations={translations}
					/>

					<Separator className="my-12" />

					{/* Bib Pickup Information Section */}
					<BibPickupSection
						errors={errors}
						formData={formData}
						locale={locale}
						register={register}
						setValue={setValue}
						translations={translations}
					/>

					<Separator className="my-12" />

					{/* Partnership Settings Section */}
					<PartnershipSection
						errors={errors}
						formData={formData}
						register={register}
						setValue={setValue}
						translations={translations}
					/>

					<Separator className="my-12" />

					{/* Event Options Section */}
					<EventOptionsSection
						errors={errors}
						eventOptions={eventOptions}
						formData={formData}
						register={register}
						setEventOptions={setEventOptions}
						setValue={setValue}
						translations={translations}
					/>

					<Separator className="my-12" />

					{/* Form Actions */}
					<div className="flex items-center justify-end space-x-6 pt-8">
						{onCancel && (
							<Button disabled={isLoading} onClick={onCancel} size="lg" type="button" variant="outline">
								{translations.event.buttons.cancel}
							</Button>
						)}
						<Button disabled={isLoading} size="lg" type="submit">
							{isLoading ? translations.event.buttons.creating : translations.event.buttons.createEvent}
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}
