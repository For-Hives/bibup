'use client'

import { Plus, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import * as React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'

import { EventOption } from '@/models/eventOption.model'
import { getTranslations } from '@/lib/getDictionary'
import { Event } from '@/models/event.model'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import adminTranslations from '../../../app/admin/event/locales.json'
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group'
import { FileUpload } from '../../ui/file-upload'
import { Textarea } from '../../ui/textareaAlt'
import { Separator } from '../../ui/separator'
import { Input } from '../../ui/inputAlt'
import { Button } from '../../ui/button'
import { Label } from '../../ui/label'

// Validation Schema using Zod
const EventCreationSchema = z
	.object({
		typeCourse: z.enum(['route', 'trail', 'triathlon', 'ultra']),
		transferDeadline: z.string().optional(),
		registrationUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
		participantCount: z.number().min(1, 'Participant count must be at least 1'),
		parcoursUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
		options: z.array(
			z.object({
				values: z.array(z.string()).min(1, 'At least one value is required'),
				required: z.boolean(),
				label: z.string().min(1, 'Option label is required'),
				key: z.string().min(1, 'Option key is required'),
			})
		),
		officialStandardPrice: z.number().min(0, 'Price must be positive').optional(),
		name: z.string().min(1, 'Event name is required'),
		logoFile: z.instanceof(File).optional(),
		location: z.string().min(1, 'Location is required'),
		isPartnered: z.boolean(),
		eventDate: z.string().min(1, 'Event date is required'),
		elevationGainM: z.number().min(0, 'Elevation gain must be positive').optional(),
		distanceKm: z.number().min(0, 'Distance must be positive').optional(),
		description: z.string().min(1, 'Description is required'),
		bibPickupWindowEndDate: z.string().min(1, 'Bib pickup end date is required'),
		bibPickupWindowBeginDate: z.string().min(1, 'Bib pickup begin date is required'),
		bibPickupLocation: z.string().optional(),
	})
	.refine(
		data => {
			const eventDate = new Date(data.eventDate)
			const beginDate = new Date(data.bibPickupWindowBeginDate)
			const endDate = new Date(data.bibPickupWindowEndDate)

			if (beginDate >= endDate) {
				return false
			}

			if (data.transferDeadline) {
				const transferDate = new Date(data.transferDeadline)
				if (transferDate >= eventDate) {
					return false
				}
			}

			return true
		},
		{
			path: ['form'],
			message:
				'Invalid date relationships: pickup begin must be before end, and transfer deadline must be before event date',
		}
	)

interface EventCreationFormProps {
	onCancel?: () => void
	onSuccess?: (event: Event) => void
	translations: Translations
}

type EventFormData = z.infer<typeof EventCreationSchema>

type Translations = ReturnType<typeof getTranslations<(typeof adminTranslations)['en'], 'en'>>

export default function EventCreationForm({ translations, onSuccess, onCancel }: EventCreationFormProps) {
	const [isLoading, setIsLoading] = useState(false)
	const [eventOptions, setEventOptions] = useState<EventOption[]>([])

	const {
		watch,
		setValue,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<EventFormData>({
		resolver: zodResolver(EventCreationSchema),
		defaultValues: {
			typeCourse: 'route',
			participantCount: 1,
			options: [],
			isPartnered: false,
		},
	})

	const formData = watch()

	const handleFileUpload = (files: File[]) => {
		if (files.length > 0) {
			const file = files[0]
			// Validate file type and size
			const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
			const maxSize = 5 * 1024 * 1024 // 5MB

			if (!allowedTypes.includes(file.type)) {
				toast.error('Invalid file type. Please upload PNG, JPG, or SVG files only.')
				return
			}

			if (file.size > maxSize) {
				toast.error('File size too large. Maximum size is 5MB.')
				return
			}

			setValue('logoFile', file)
		}
	}

	const addEventOption = () => {
		const newOption: EventOption = {
			values: [''],
			required: false,
			label: '',
			key: '',
		}
		setEventOptions(prev => [...prev, newOption])
	}

	const updateEventOption = (index: number, field: keyof EventOption, value: any) => {
		setEventOptions(prev => {
			const updated = prev.map((option, i) => (i === index ? { ...option, [field]: value } : option))
			setValue('options', updated)
			return updated
		})
	}

	const removeEventOption = (index: number) => {
		setEventOptions(prev => {
			const updated = prev.filter((_, i) => i !== index)
			setValue('options', updated)
			return updated
		})
	}

	const addOptionValue = (optionIndex: number) => {
		setEventOptions(prev => {
			const updated = prev.map((option, i) =>
				i === optionIndex ? { ...option, values: [...option.values, ''] } : option
			)
			setValue('options', updated)
			return updated
		})
	}

	const updateOptionValue = (optionIndex: number, valueIndex: number, value: string) => {
		setEventOptions(prev => {
			const updated = prev.map((option, i) =>
				i === optionIndex
					? {
							...option,
							values: option.values.map((v, j) => (j === valueIndex ? value : v)),
						}
					: option
			)
			setValue('options', updated)
			return updated
		})
	}

	const removeOptionValue = (optionIndex: number, valueIndex: number) => {
		setEventOptions(prev => {
			const updated = prev.map((option, i) =>
				i === optionIndex ? { ...option, values: option.values.filter((_, j) => j !== valueIndex) } : option
			)
			setValue('options', updated)
			return updated
		})
	}

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
				formDataToSend.append('participantCount', data.participantCount.toString())
				formDataToSend.append('bibPickupWindowBeginDate', new Date(data.bibPickupWindowBeginDate).toISOString())
				formDataToSend.append('bibPickupWindowEndDate', new Date(data.bibPickupWindowEndDate).toISOString())
				formDataToSend.append('isPartnered', data.isPartnered.toString())
				formDataToSend.append('options', JSON.stringify(data.options))

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
				if (data.transferDeadline) {
					formDataToSend.append('transferDeadline', new Date(data.transferDeadline).toISOString())
				}
				if (data.parcoursUrl) {
					formDataToSend.append('parcoursUrl', data.parcoursUrl)
				}
				if (data.registrationUrl) {
					formDataToSend.append('registrationUrl', data.registrationUrl)
				}
				if (data.bibPickupLocation) {
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
		<div className="from-background via-primary/5 to-background relative min-h-screen bg-gradient-to-br">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
			<div className="relative flex items-center justify-center p-6 md:p-10">
				<form
					className="border-border/50 bg-card/80 w-full max-w-7xl rounded-3xl border p-8 shadow-[0_0_0_1px_hsl(var(--border)),inset_0_0_30px_hsl(var(--primary)/0.1),inset_0_0_60px_hsl(var(--accent)/0.05),0_0_50px_hsl(var(--primary)/0.2)] backdrop-blur-md md:p-12"
					// eslint-disable-next-line @typescript-eslint/no-misused-promises
					onSubmit={handleSubmit(onSubmit)}
				>
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
					<div className="grid grid-cols-1 gap-12 md:grid-cols-3">
						<div>
							<h2 className="text-foreground text-2xl font-semibold">
								{translations.event.sections.eventInformation.title}
							</h2>
							<p className="text-muted-foreground mt-2 text-base leading-7">
								{translations.event.sections.eventInformation.description}
							</p>
						</div>
						<div className="sm:max-w-4xl md:col-span-2">
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
								<div className="col-span-full sm:col-span-3">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="name">
										{translations.event.fields.eventName.label} *
									</Label>
									<Input
										id="name"
										{...register('name')}
										placeholder={translations.event.fields.eventName.placeholder}
										type="text"
									/>
									{errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>}
								</div>
								<div className="col-span-full sm:col-span-3">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="location">
										{translations.event.fields.location.label} *
									</Label>
									<Input
										id="location"
										{...register('location')}
										placeholder={translations.event.fields.location.placeholder}
										type="text"
									/>
									{errors.location && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location.message}</p>
									)}
								</div>
								<div className="col-span-full sm:col-span-3">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="eventDate">
										{translations.event.fields.eventDate.label} *
									</Label>
									<Input id="eventDate" {...register('eventDate')} type="datetime-local" />
									{errors.eventDate && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.eventDate.message}</p>
									)}
								</div>
								<div className="col-span-full sm:col-span-3">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="typeCourse">
										{translations.event.fields.eventType.label} *
									</Label>
									<Select
										onValueChange={value => setValue('typeCourse', value as 'route' | 'trail' | 'triathlon' | 'ultra')}
										value={formData.typeCourse ?? 'route'}
									>
										<SelectTrigger
											className="ring-foreground/40 h-10 bg-gray-50 ring-2 dark:bg-zinc-800 dark:ring-slate-700"
											id="typeCourse"
										>
											<SelectValue placeholder={translations.event.fields.eventType.placeholder} />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="route">{translations.event.fields.eventType.options.route}</SelectItem>
											<SelectItem value="trail">{translations.event.fields.eventType.options.trail}</SelectItem>
											<SelectItem value="triathlon">{translations.event.fields.eventType.options.triathlon}</SelectItem>
											<SelectItem value="ultra">{translations.event.fields.eventType.options.ultra}</SelectItem>
										</SelectContent>
									</Select>
									{errors.typeCourse && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.typeCourse.message}</p>
									)}
								</div>
								<div className="col-span-full">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="description">
										{translations.event.fields.description.label} *
									</Label>
									<Textarea
										id="description"
										{...register('description')}
										placeholder={translations.event.fields.description.placeholder}
										rows={4}
									/>
									{errors.description && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
									)}
								</div>
							</div>
						</div>
					</div>

					<Separator className="my-12" />

					{/* Event Details Section */}
					<div className="grid grid-cols-1 gap-12 md:grid-cols-3">
						<div>
							<h2 className="text-foreground text-2xl font-semibold">
								{translations.event.sections.eventDetails.title}
							</h2>
							<p className="text-muted-foreground mt-2 text-base leading-7">
								{translations.event.sections.eventDetails.description}
							</p>
						</div>
						<div className="sm:max-w-4xl md:col-span-2">
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
								<div className="col-span-full sm:col-span-3">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="distanceKm">
										{translations.event.fields.distance.label}
									</Label>
									<Input
										id="distanceKm"
										{...register('distanceKm', { valueAsNumber: true })}
										placeholder={translations.event.fields.distance.placeholder}
										step="0.001"
										type="number"
									/>
									{errors.distanceKm && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.distanceKm.message}</p>
									)}
								</div>
								<div className="col-span-full sm:col-span-3">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="elevationGainM">
										{translations.event.fields.elevationGain.label}
									</Label>
									<Input
										id="elevationGainM"
										{...register('elevationGainM', { valueAsNumber: true })}
										placeholder={translations.event.fields.elevationGain.placeholder}
										type="number"
									/>
									{errors.elevationGainM && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.elevationGainM.message}</p>
									)}
								</div>
								<div className="col-span-full sm:col-span-3">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="officialStandardPrice">
										{translations.event.fields.officialPrice.label}
									</Label>
									<Input
										id="officialStandardPrice"
										{...register('officialStandardPrice', { valueAsNumber: true })}
										placeholder={translations.event.fields.officialPrice.placeholder}
										step="0.01"
										type="number"
									/>
									{errors.officialStandardPrice && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">
											{errors.officialStandardPrice.message}
										</p>
									)}
								</div>
								<div className="col-span-full sm:col-span-3">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="participantCount">
										{translations.event.fields.participantCount.label} *
									</Label>
									<Input
										id="participantCount"
										{...register('participantCount', { valueAsNumber: true })}
										placeholder={translations.event.fields.participantCount.placeholder}
										type="number"
									/>
									{errors.participantCount && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.participantCount.message}</p>
									)}
								</div>
								<div className="col-span-full sm:col-span-3">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="transferDeadline">
										{translations.event.fields.transferDeadline.label}
									</Label>
									<Input id="transferDeadline" {...register('transferDeadline')} type="datetime-local" />
									{errors.transferDeadline && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.transferDeadline.message}</p>
									)}
								</div>
								<div className="col-span-full sm:col-span-3">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="parcoursUrl">
										{translations.event.fields.parcoursUrl.label}
									</Label>
									<Input
										id="parcoursUrl"
										{...register('parcoursUrl')}
										placeholder={translations.event.fields.parcoursUrl.placeholder}
										type="url"
									/>
									{errors.parcoursUrl && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.parcoursUrl.message}</p>
									)}
								</div>
								<div className="col-span-full">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="registrationUrl">
										{translations.event.fields.registrationUrl.label}
									</Label>
									<Input
										id="registrationUrl"
										{...register('registrationUrl')}
										placeholder={translations.event.fields.registrationUrl.placeholder}
										type="url"
									/>
									{errors.registrationUrl && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.registrationUrl.message}</p>
									)}
								</div>
								<div className="col-span-full">
									<Label className="text-foreground mb-2 block text-base font-medium">
										{translations.event.fields.logoUpload.label}
									</Label>
									<p className="text-muted-foreground mb-4 text-sm">
										{translations.event.fields.logoUpload.description}
									</p>
									<div className="bg-card/50 border-border/30 rounded-xl border backdrop-blur-sm">
										<FileUpload onChange={handleFileUpload} translations={translations.event.fields.logoUpload} />
									</div>
									{errors.logoFile && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.logoFile.message}</p>
									)}
								</div>
							</div>
						</div>
					</div>

					<Separator className="my-12" />

					{/* Bib Pickup Information Section */}
					<div className="grid grid-cols-1 gap-12 md:grid-cols-3">
						<div>
							<h2 className="text-foreground text-2xl font-semibold">{translations.event.sections.bibPickup.title}</h2>
							<p className="text-muted-foreground mt-2 text-base leading-7">
								{translations.event.sections.bibPickup.description}
							</p>
						</div>
						<div className="sm:max-w-4xl md:col-span-2">
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
								<div className="col-span-full">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="bibPickupLocation">
										{translations.event.fields.bibPickupLocation.label}
									</Label>
									<Input
										id="bibPickupLocation"
										{...register('bibPickupLocation')}
										placeholder={translations.event.fields.bibPickupLocation.placeholder}
										type="text"
									/>
									{errors.bibPickupLocation && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bibPickupLocation.message}</p>
									)}
								</div>
								<div className="col-span-full sm:col-span-3">
									<Label
										className="text-foreground mb-2 block text-base font-medium"
										htmlFor="bibPickupWindowBeginDate"
									>
										{translations.event.fields.bibPickupBegin.label} *
									</Label>
									<Input
										id="bibPickupWindowBeginDate"
										{...register('bibPickupWindowBeginDate')}
										type="datetime-local"
									/>
									{errors.bibPickupWindowBeginDate && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">
											{errors.bibPickupWindowBeginDate.message}
										</p>
									)}
								</div>
								<div className="col-span-full sm:col-span-3">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="bibPickupWindowEndDate">
										{translations.event.fields.bibPickupEnd.label} *
									</Label>
									<Input id="bibPickupWindowEndDate" {...register('bibPickupWindowEndDate')} type="datetime-local" />
									{errors.bibPickupWindowEndDate && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">
											{errors.bibPickupWindowEndDate.message}
										</p>
									)}
								</div>
							</div>
						</div>
					</div>

					<Separator className="my-12" />

					{/* Partnership Settings Section */}
					<div className="grid grid-cols-1 gap-12 md:grid-cols-3">
						<div>
							<h2 className="text-foreground text-2xl font-semibold">
								{translations.event.sections.partnership.title}
							</h2>
							<p className="text-muted-foreground mt-2 text-base leading-7">
								{translations.event.sections.partnership.description}
							</p>
						</div>
						<div className="sm:max-w-4xl md:col-span-2">
							<fieldset>
								<legend className="text-foreground text-lg font-medium">
									{translations.event.fields.isPartnered.label}
								</legend>
								<p className="text-muted-foreground mt-3 text-base leading-7">
									{translations.event.fields.isPartnered.description}
								</p>
								<RadioGroup
									className="mt-6"
									onValueChange={value => setValue('isPartnered', value === 'partnered')}
									value={formData.isPartnered ? 'partnered' : 'not-partnered'}
								>
									<div className="flex items-center gap-x-3">
										<RadioGroupItem id="partnered" value="partnered" />
										<Label className="text-foreground text-base font-medium" htmlFor="partnered">
											{translations.event.partnership.partnered}
										</Label>
									</div>
									<div className="flex items-center gap-x-3">
										<RadioGroupItem id="not-partnered" value="not-partnered" />
										<Label className="text-foreground text-base font-medium" htmlFor="not-partnered">
											{translations.event.partnership.notPartnered}
										</Label>
									</div>
								</RadioGroup>
							</fieldset>
						</div>
					</div>

					<Separator className="my-12" />

					{/* Event Options Section */}
					<div className="grid grid-cols-1 gap-12 md:grid-cols-3">
						<div>
							<h2 className="text-foreground text-2xl font-semibold">
								{translations.event.sections.eventOptions.title}
							</h2>
							<p className="text-muted-foreground mt-2 text-base leading-7">
								{translations.event.sections.eventOptions.description}
							</p>
						</div>
						<div className="sm:max-w-4xl md:col-span-2">
							<div className="space-y-8">
								{eventOptions.map((option, optionIndex) => (
									<div
										className="border-border/50 bg-card/50 rounded-2xl border p-6 shadow-md backdrop-blur-sm"
										key={optionIndex}
									>
										<div className="mb-6 flex items-center justify-between">
											<h3 className="text-foreground text-lg font-medium">Option {optionIndex + 1}</h3>
											<Button onClick={() => removeEventOption(optionIndex)} size="sm" type="button" variant="outline">
												<Trash2 className="size-4" />
											</Button>
										</div>

										<div className="mb-6 grid grid-cols-2 gap-6">
											<div>
												<Label
													className="text-foreground mb-2 block text-base font-medium"
													htmlFor={`option-key-${optionIndex}`}
												>
													{translations.event.eventOptions.optionKey}
												</Label>
												<Input
													id={`option-key-${optionIndex}`}
													onChange={e => updateEventOption(optionIndex, 'key', e.target.value)}
													placeholder="size"
													type="text"
													value={option.key}
												/>
											</div>
											<div>
												<Label
													className="text-foreground mb-2 block text-base font-medium"
													htmlFor={`option-label-${optionIndex}`}
												>
													{translations.event.eventOptions.optionName}
												</Label>
												<Input
													id={`option-label-${optionIndex}`}
													onChange={e => updateEventOption(optionIndex, 'label', e.target.value)}
													placeholder="Taille"
													type="text"
													value={option.label}
												/>
											</div>
										</div>

										<div className="mb-6">
											<div className="flex items-center gap-3">
												<input
													checked={option.required}
													className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
													id={`option-required-${optionIndex}`}
													onChange={e => updateEventOption(optionIndex, 'required', e.target.checked)}
													type="checkbox"
												/>
												<Label
													className="text-foreground text-base font-medium"
													htmlFor={`option-required-${optionIndex}`}
												>
													{translations.event.eventOptions.optionRequired}
												</Label>
											</div>
										</div>

										<div>
											<div className="mb-4 flex items-center justify-between">
												<Label className="text-foreground text-base font-medium">
													{translations.event.eventOptions.values.label}
												</Label>
												<Button onClick={() => addOptionValue(optionIndex)} size="sm" type="button" variant="outline">
													<Plus className="size-4" />
												</Button>
											</div>
											{option.values.map((value, valueIndex) => (
												<div className="mb-3 flex items-center gap-3" key={valueIndex}>
													<Input
														onChange={e => updateOptionValue(optionIndex, valueIndex, e.target.value)}
														placeholder={translations.event.eventOptions.values.placeholder}
														type="text"
														value={value}
													/>
													{option.values.length > 1 && (
														<Button
															onClick={() => removeOptionValue(optionIndex, valueIndex)}
															size="sm"
															type="button"
															variant="outline"
														>
															<Trash2 className="size-4" />
														</Button>
													)}
												</div>
											))}
										</div>
									</div>
								))}

								<Button className="w-full" onClick={addEventOption} type="button" variant="outline">
									<Plus className="mr-2 size-4" />
									{translations.event.eventOptions.addOption}
								</Button>
							</div>
						</div>
					</div>

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
