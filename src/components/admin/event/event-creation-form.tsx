'use client'

import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import * as React from 'react'

import { EventOption } from '@/models/eventOption.model'
import { createEvent } from '@/services/event.services'
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

interface EventCreationFormProps {
	onCancel?: () => void
	onSuccess?: (event: Event) => void
	translations: Translations
}

type Translations = ReturnType<typeof getTranslations<(typeof adminTranslations)['en'], 'en'>>

export default function EventCreationForm({ translations, onSuccess, onCancel }: EventCreationFormProps) {
	const [isLoading, setIsLoading] = useState(false)
	const [eventOptions, setEventOptions] = useState<EventOption[]>([])

	// Form state
	const [formData, setFormData] = useState({
		typeCourse: 'route' as Event['typeCourse'],
		transferDeadline: '',
		participantCount: '',
		parcoursUrl: '',
		officialStandardPrice: '',
		name: '',
		logoUrl: '',
		location: '',
		isPartnered: false,
		eventDate: '',
		elevationGainM: '',
		distanceKm: '',
		description: '',
		bibPickupWindowEndDate: '',
		bibPickupWindowBeginDate: '',
		bibPickupLocation: '',
	})

	const handleInputChange = (field: string, value: boolean | number | string) => {
		setFormData(prev => ({
			...prev,
			[field]: value,
		}))
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
		setEventOptions(prev => prev.map((option, i) => (i === index ? { ...option, [field]: value } : option)))
	}

	const removeEventOption = (index: number) => {
		setEventOptions(prev => prev.filter((_, i) => i !== index))
	}

	const addOptionValue = (optionIndex: number) => {
		setEventOptions(prev =>
			prev.map((option, i) => (i === optionIndex ? { ...option, values: [...option.values, ''] } : option))
		)
	}

	const updateOptionValue = (optionIndex: number, valueIndex: number, value: string) => {
		setEventOptions(prev =>
			prev.map((option, i) =>
				i === optionIndex
					? {
							...option,
							values: option.values.map((v, j) => (j === valueIndex ? value : v)),
						}
					: option
			)
		)
	}

	const removeOptionValue = (optionIndex: number, valueIndex: number) => {
		setEventOptions(prev =>
			prev.map((option, i) =>
				i === optionIndex ? { ...option, values: option.values.filter((_, j) => j !== valueIndex) } : option
			)
		)
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		// Use setTimeout to ensure the function is properly async
		void (async () => {
			try {
				const eventData: Omit<Event, 'id'> = {
					typeCourse: formData.typeCourse,
					transferDeadline: formData.transferDeadline ? new Date(formData.transferDeadline) : undefined,
					participantCount: formData.participantCount ? Number(formData.participantCount) : 0,
					parcoursUrl: formData.parcoursUrl || undefined,
					options: eventOptions,
					officialStandardPrice: formData.officialStandardPrice ? Number(formData.officialStandardPrice) : undefined,
					name: formData.name,
					logoUrl: formData.logoUrl || undefined,
					location: formData.location,
					isPartnered: formData.isPartnered,
					eventDate: new Date(formData.eventDate),
					elevationGainM: formData.elevationGainM ? Number(formData.elevationGainM) : undefined,
					distanceKm: formData.distanceKm ? Number(formData.distanceKm) : undefined,
					description: formData.description,
					bibPickupWindowEndDate: new Date(formData.bibPickupWindowEndDate || formData.eventDate),
					bibPickupWindowBeginDate: new Date(formData.bibPickupWindowBeginDate || formData.eventDate),
					bibPickupLocation: formData.bibPickupLocation || undefined,
				}

				const createdEvent = await createEvent(eventData as Event)
				if (createdEvent) {
					onSuccess?.(createdEvent)
				}
			} catch (error) {
				console.error('Error creating event:', error)
				// Handle error (show toast, etc.)
			} finally {
				setIsLoading(false)
			}
		})()
	}

	return (
		<div className="from-background via-primary/5 to-background relative min-h-screen bg-gradient-to-br">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
			<div className="relative flex items-center justify-center p-6 md:p-10">
				<form
					className="border-border/50 bg-card/80 w-full max-w-7xl rounded-3xl border p-8 shadow-[0_0_0_1px_hsl(var(--border)),inset_0_0_30px_hsl(var(--primary)/0.1),inset_0_0_60px_hsl(var(--accent)/0.05),0_0_50px_hsl(var(--primary)/0.2)] backdrop-blur-md md:p-12"
					onSubmit={handleSubmit}
				>
					<div className="mb-12 text-left">
						<h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl">
							{translations.event.title}
						</h1>
						<p className="text-muted-foreground mt-4 text-lg">{translations.event.subtitle}</p>
					</div>

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
										name="name"
										onChange={e => handleInputChange('name', e.target.value)}
										placeholder={translations.event.fields.eventName.placeholder}
										required
										type="text"
										value={formData.name}
									/>
								</div>
								<div className="col-span-full sm:col-span-3">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="location">
										{translations.event.fields.location.label} *
									</Label>
									<Input
										id="location"
										name="location"
										onChange={e => handleInputChange('location', e.target.value)}
										placeholder={translations.event.fields.location.placeholder}
										required
										type="text"
										value={formData.location}
									/>
								</div>
								<div className="col-span-full sm:col-span-3">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="eventDate">
										{translations.event.fields.eventDate.label} *
									</Label>
									<Input
										id="eventDate"
										name="eventDate"
										onChange={e => handleInputChange('eventDate', e.target.value)}
										required
										type="datetime-local"
										value={formData.eventDate}
									/>
								</div>
								<div className="col-span-full sm:col-span-3">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="typeCourse">
										{translations.event.fields.eventType.label} *
									</Label>
									<Select
										name="typeCourse"
										onValueChange={value => handleInputChange('typeCourse', value)}
										value={formData.typeCourse}
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
								</div>
								<div className="col-span-full">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="description">
										{translations.event.fields.description.label} *
									</Label>
									<Textarea
										id="description"
										name="description"
										onChange={e => handleInputChange('description', e.target.value)}
										placeholder={translations.event.fields.description.placeholder}
										required
										rows={4}
										value={formData.description}
									/>
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
										name="distanceKm"
										onChange={e => handleInputChange('distanceKm', e.target.value)}
										placeholder={translations.event.fields.distance.placeholder}
										step="0.001"
										type="number"
										value={formData.distanceKm}
									/>
								</div>
								<div className="col-span-full sm:col-span-3">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="elevationGainM">
										{translations.event.fields.elevationGain.label}
									</Label>
									<Input
										id="elevationGainM"
										name="elevationGainM"
										onChange={e => handleInputChange('elevationGainM', e.target.value)}
										placeholder={translations.event.fields.elevationGain.placeholder}
										type="number"
										value={formData.elevationGainM}
									/>
								</div>
								<div className="col-span-full sm:col-span-3">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="officialStandardPrice">
										{translations.event.fields.officialPrice.label}
									</Label>
									<Input
										id="officialStandardPrice"
										name="officialStandardPrice"
										onChange={e => handleInputChange('officialStandardPrice', e.target.value)}
										placeholder={translations.event.fields.officialPrice.placeholder}
										step="0.01"
										type="number"
										value={formData.officialStandardPrice}
									/>
								</div>
								<div className="col-span-full sm:col-span-3">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="participantCount">
										{translations.event.fields.participantCount.label}
									</Label>
									<Input
										id="participantCount"
										name="participantCount"
										onChange={e => handleInputChange('participantCount', e.target.value)}
										placeholder={translations.event.fields.participantCount.placeholder}
										type="number"
										value={formData.participantCount}
									/>
								</div>
								<div className="col-span-full sm:col-span-3">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="transferDeadline">
										{translations.event.fields.transferDeadline.label}
									</Label>
									<Input
										id="transferDeadline"
										name="transferDeadline"
										onChange={e => handleInputChange('transferDeadline', e.target.value)}
										type="datetime-local"
										value={formData.transferDeadline}
									/>
								</div>
								<div className="col-span-full sm:col-span-3">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="parcoursUrl">
										{translations.event.fields.parcoursUrl.label}
									</Label>
									<Input
										id="parcoursUrl"
										name="parcoursUrl"
										onChange={e => handleInputChange('parcoursUrl', e.target.value)}
										placeholder={translations.event.fields.parcoursUrl.placeholder}
										type="url"
										value={formData.parcoursUrl}
									/>
								</div>
								<div className="col-span-full">
									<Label className="text-foreground mb-2 block text-base font-medium">
										{translations.event.fields.logoUpload.label}
									</Label>
									<p className="text-muted-foreground mb-4 text-sm">
										{translations.event.fields.logoUpload.description}
									</p>
									<div className="bg-card/50 border-border/30 rounded-xl border backdrop-blur-sm">
										<FileUpload
											onChange={files => {
												if (files.length > 0) {
													// Handle logo file upload
													console.info('Logo uploaded:', files[0].name)
													// You can store the file in form state or upload it immediately
												}
											}}
											translations={translations.event.fields.logoUpload}
										/>
									</div>
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
										name="bibPickupLocation"
										onChange={e => handleInputChange('bibPickupLocation', e.target.value)}
										placeholder={translations.event.fields.bibPickupLocation.placeholder}
										type="text"
										value={formData.bibPickupLocation}
									/>
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
										name="bibPickupWindowBeginDate"
										onChange={e => handleInputChange('bibPickupWindowBeginDate', e.target.value)}
										type="datetime-local"
										value={formData.bibPickupWindowBeginDate}
									/>
								</div>
								<div className="col-span-full sm:col-span-3">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="bibPickupWindowEndDate">
										{translations.event.fields.bibPickupEnd.label} *
									</Label>
									<Input
										id="bibPickupWindowEndDate"
										name="bibPickupWindowEndDate"
										onChange={e => handleInputChange('bibPickupWindowEndDate', e.target.value)}
										type="datetime-local"
										value={formData.bibPickupWindowEndDate}
									/>
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
									onValueChange={value => handleInputChange('isPartnered', value === 'partnered')}
									value={formData.isPartnered ? 'partnered' : 'not-partnered'}
								>
									<div className="flex items-center gap-x-3">
										<RadioGroupItem id="partnered" value="partnered" />
										<Label className="text-foreground text-base font-medium" htmlFor="partnered">
											Partnered Event (allows bib resale)
										</Label>
									</div>
									<div className="flex items-center gap-x-3">
										<RadioGroupItem id="not-partnered" value="not-partnered" />
										<Label className="text-foreground text-base font-medium" htmlFor="not-partnered">
											Not Partnered (display only)
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
													Key
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
												<Label className="text-foreground text-base font-medium">Values</Label>
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
