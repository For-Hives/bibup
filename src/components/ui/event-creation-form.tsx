'use client'

import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import * as React from 'react'

import { EventOption } from '@/models/eventOption.model'
import { createEvent } from '@/services/event.services'
import { Event } from '@/models/event.model'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { RadioGroup, RadioGroupItem } from './radio-group'
import { Textarea } from './textareaAlt'
import { Separator } from './separator'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'

interface EventCreationFormProps {
	onCancel?: () => void
	onSuccess?: (event: Event) => void
}

export default function EventCreationForm({ onSuccess, onCancel }: EventCreationFormProps) {
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
		<div className="flex items-center justify-center p-10">
			<form className="w-full max-w-4xl" onSubmit={handleSubmit}>
				<div className="grid grid-cols-1 gap-10 md:grid-cols-3">
					<div>
						<h2 className="text-foreground dark:text-foreground font-semibold">Event Information</h2>
						<p className="text-muted-foreground dark:text-muted-foreground mt-1 text-sm leading-6">
							Basic information about the event including name, date, and location.
						</p>
					</div>
					<div className="sm:max-w-3xl md:col-span-2">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
							<div className="col-span-full sm:col-span-3">
								<Label className="text-foreground dark:text-foreground text-sm font-medium" htmlFor="name">
									Event Name *
								</Label>
								<Input
									className="mt-2"
									id="name"
									name="name"
									onChange={e => handleInputChange('name', e.target.value)}
									placeholder="Marathon de Paris"
									required
									type="text"
									value={formData.name}
								/>
							</div>
							<div className="col-span-full sm:col-span-3">
								<Label className="text-foreground dark:text-foreground text-sm font-medium" htmlFor="location">
									Location *
								</Label>
								<Input
									className="mt-2"
									id="location"
									name="location"
									onChange={e => handleInputChange('location', e.target.value)}
									placeholder="Paris, France"
									required
									type="text"
									value={formData.location}
								/>
							</div>
							<div className="col-span-full sm:col-span-3">
								<Label className="text-foreground dark:text-foreground text-sm font-medium" htmlFor="eventDate">
									Event Date *
								</Label>
								<Input
									className="mt-2"
									id="eventDate"
									name="eventDate"
									onChange={e => handleInputChange('eventDate', e.target.value)}
									required
									type="datetime-local"
									value={formData.eventDate}
								/>
							</div>
							<div className="col-span-full sm:col-span-3">
								<Label className="text-foreground dark:text-foreground text-sm font-medium" htmlFor="typeCourse">
									Event Type *
								</Label>
								<Select
									name="typeCourse"
									onValueChange={value => handleInputChange('typeCourse', value)}
									value={formData.typeCourse}
								>
									<SelectTrigger className="mt-2" id="typeCourse">
										<SelectValue placeholder="Select event type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="route">Route</SelectItem>
										<SelectItem value="trail">Trail</SelectItem>
										<SelectItem value="triathlon">Triathlon</SelectItem>
										<SelectItem value="ultra">Ultra</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="col-span-full">
								<Label className="text-foreground dark:text-foreground text-sm font-medium" htmlFor="description">
									Description *
								</Label>
								<Textarea
									className="mt-2"
									id="description"
									name="description"
									onChange={e => handleInputChange('description', e.target.value)}
									placeholder="Describe the event..."
									required
									rows={4}
									value={formData.description}
								/>
							</div>
						</div>
					</div>
				</div>

				<Separator className="my-8" />

				<div className="grid grid-cols-1 gap-10 md:grid-cols-3">
					<div>
						<h2 className="text-foreground dark:text-foreground font-semibold">Event Details</h2>
						<p className="text-muted-foreground dark:text-muted-foreground mt-1 text-sm leading-6">
							Additional details about distance, elevation, pricing, and logistics.
						</p>
					</div>
					<div className="sm:max-w-3xl md:col-span-2">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
							<div className="col-span-full sm:col-span-3">
								<Label className="text-foreground dark:text-foreground text-sm font-medium" htmlFor="distanceKm">
									Distance (km)
								</Label>
								<Input
									className="mt-2"
									id="distanceKm"
									name="distanceKm"
									onChange={e => handleInputChange('distanceKm', e.target.value)}
									placeholder="42.195"
									step="0.001"
									type="number"
									value={formData.distanceKm}
								/>
							</div>
							<div className="col-span-full sm:col-span-3">
								<Label className="text-foreground dark:text-foreground text-sm font-medium" htmlFor="elevationGainM">
									Elevation Gain (m)
								</Label>
								<Input
									className="mt-2"
									id="elevationGainM"
									name="elevationGainM"
									onChange={e => handleInputChange('elevationGainM', e.target.value)}
									placeholder="500"
									type="number"
									value={formData.elevationGainM}
								/>
							</div>
							<div className="col-span-full sm:col-span-3">
								<Label
									className="text-foreground dark:text-foreground text-sm font-medium"
									htmlFor="officialStandardPrice"
								>
									Official Price (€)
								</Label>
								<Input
									className="mt-2"
									id="officialStandardPrice"
									name="officialStandardPrice"
									onChange={e => handleInputChange('officialStandardPrice', e.target.value)}
									placeholder="120"
									step="0.01"
									type="number"
									value={formData.officialStandardPrice}
								/>
							</div>
							<div className="col-span-full sm:col-span-3">
								<Label className="text-foreground dark:text-foreground text-sm font-medium" htmlFor="participantCount">
									Participant Count
								</Label>
								<Input
									className="mt-2"
									id="participantCount"
									name="participantCount"
									onChange={e => handleInputChange('participantCount', e.target.value)}
									placeholder="30000"
									type="number"
									value={formData.participantCount}
								/>
							</div>
							<div className="col-span-full sm:col-span-3">
								<Label className="text-foreground dark:text-foreground text-sm font-medium" htmlFor="transferDeadline">
									Transfer Deadline
								</Label>
								<Input
									className="mt-2"
									id="transferDeadline"
									name="transferDeadline"
									onChange={e => handleInputChange('transferDeadline', e.target.value)}
									type="datetime-local"
									value={formData.transferDeadline}
								/>
							</div>
							<div className="col-span-full sm:col-span-3">
								<Label className="text-foreground dark:text-foreground text-sm font-medium" htmlFor="logoUrl">
									Logo URL
								</Label>
								<Input
									className="mt-2"
									id="logoUrl"
									name="logoUrl"
									onChange={e => handleInputChange('logoUrl', e.target.value)}
									placeholder="https://example.com/logo.png"
									type="url"
									value={formData.logoUrl}
								/>
							</div>
							<div className="col-span-full">
								<Label className="text-foreground dark:text-foreground text-sm font-medium" htmlFor="parcoursUrl">
									Parcours URL
								</Label>
								<Input
									className="mt-2"
									id="parcoursUrl"
									name="parcoursUrl"
									onChange={e => handleInputChange('parcoursUrl', e.target.value)}
									placeholder="https://example.com/route.gpx"
									type="url"
									value={formData.parcoursUrl}
								/>
							</div>
						</div>
					</div>
				</div>

				<Separator className="my-8" />

				<div className="grid grid-cols-1 gap-10 md:grid-cols-3">
					<div>
						<h2 className="text-foreground dark:text-foreground font-semibold">Bib Pickup Information</h2>
						<p className="text-muted-foreground dark:text-muted-foreground mt-1 text-sm leading-6">
							Details about when and where participants can pick up their bibs.
						</p>
					</div>
					<div className="sm:max-w-3xl md:col-span-2">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
							<div className="col-span-full">
								<Label className="text-foreground dark:text-foreground text-sm font-medium" htmlFor="bibPickupLocation">
									Bib Pickup Location
								</Label>
								<Input
									className="mt-2"
									id="bibPickupLocation"
									name="bibPickupLocation"
									onChange={e => handleInputChange('bibPickupLocation', e.target.value)}
									placeholder="Expo Hall, Porte de Versailles"
									type="text"
									value={formData.bibPickupLocation}
								/>
							</div>
							<div className="col-span-full sm:col-span-3">
								<Label
									className="text-foreground dark:text-foreground text-sm font-medium"
									htmlFor="bibPickupWindowBeginDate"
								>
									Pickup Window Start
								</Label>
								<Input
									className="mt-2"
									id="bibPickupWindowBeginDate"
									name="bibPickupWindowBeginDate"
									onChange={e => handleInputChange('bibPickupWindowBeginDate', e.target.value)}
									type="datetime-local"
									value={formData.bibPickupWindowBeginDate}
								/>
							</div>
							<div className="col-span-full sm:col-span-3">
								<Label
									className="text-foreground dark:text-foreground text-sm font-medium"
									htmlFor="bibPickupWindowEndDate"
								>
									Pickup Window End
								</Label>
								<Input
									className="mt-2"
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

				<Separator className="my-8" />

				<div className="grid grid-cols-1 gap-10 md:grid-cols-3">
					<div>
						<h2 className="text-foreground dark:text-foreground font-semibold">Partnership Settings</h2>
						<p className="text-muted-foreground dark:text-muted-foreground mt-1 text-sm leading-6">
							Configure whether this event is partnered with Beswib for bib resale.
						</p>
					</div>
					<div className="sm:max-w-3xl md:col-span-2">
						<fieldset>
							<legend className="text-foreground dark:text-foreground text-sm font-medium">Partnership Status</legend>
							<p className="text-muted-foreground dark:text-muted-foreground mt-2 text-sm leading-6">
								Choose whether this event allows bib resale through Beswib.
							</p>
							<RadioGroup
								className="mt-6"
								onValueChange={value => handleInputChange('isPartnered', value === 'partnered')}
								value={formData.isPartnered ? 'partnered' : 'not-partnered'}
							>
								<div className="flex items-center gap-x-3">
									<RadioGroupItem id="partnered" value="partnered" />
									<Label className="text-foreground dark:text-foreground text-sm font-medium" htmlFor="partnered">
										Partnered Event (allows bib resale)
									</Label>
								</div>
								<div className="flex items-center gap-x-3">
									<RadioGroupItem id="not-partnered" value="not-partnered" />
									<Label className="text-foreground dark:text-foreground text-sm font-medium" htmlFor="not-partnered">
										Not Partnered (display only)
									</Label>
								</div>
							</RadioGroup>
						</fieldset>
					</div>
				</div>

				<Separator className="my-8" />

				<div className="grid grid-cols-1 gap-10 md:grid-cols-3">
					<div>
						<h2 className="text-foreground dark:text-foreground font-semibold">Event Options</h2>
						<p className="text-muted-foreground dark:text-muted-foreground mt-1 text-sm leading-6">
							Configure registration options like size, meal preferences, etc.
						</p>
					</div>
					<div className="sm:max-w-3xl md:col-span-2">
						<div className="space-y-6">
							{eventOptions.map((option, optionIndex) => (
								<div className="rounded-lg border p-4" key={optionIndex}>
									<div className="mb-4 flex items-center justify-between">
										<h3 className="text-sm font-medium">Option {optionIndex + 1}</h3>
										<Button onClick={() => removeEventOption(optionIndex)} size="sm" type="button" variant="outline">
											<Trash2 className="size-4" />
										</Button>
									</div>

									<div className="mb-4 grid grid-cols-2 gap-4">
										<div>
											<Label htmlFor={`option-key-${optionIndex}`}>Key</Label>
											<Input
												className="mt-1"
												id={`option-key-${optionIndex}`}
												onChange={e => updateEventOption(optionIndex, 'key', e.target.value)}
												placeholder="size"
												type="text"
												value={option.key}
											/>
										</div>
										<div>
											<Label htmlFor={`option-label-${optionIndex}`}>Label</Label>
											<Input
												className="mt-1"
												id={`option-label-${optionIndex}`}
												onChange={e => updateEventOption(optionIndex, 'label', e.target.value)}
												placeholder="Taille"
												type="text"
												value={option.label}
											/>
										</div>
									</div>

									<div className="mb-4">
										<div className="flex items-center gap-2">
											<input
												checked={option.required}
												id={`option-required-${optionIndex}`}
												onChange={e => updateEventOption(optionIndex, 'required', e.target.checked)}
												type="checkbox"
											/>
											<Label htmlFor={`option-required-${optionIndex}`}>Required field</Label>
										</div>
									</div>

									<div>
										<div className="mb-2 flex items-center justify-between">
											<Label>Values</Label>
											<Button onClick={() => addOptionValue(optionIndex)} size="sm" type="button" variant="outline">
												<Plus className="size-4" />
											</Button>
										</div>
										{option.values.map((value, valueIndex) => (
											<div className="mb-2 flex items-center gap-2" key={valueIndex}>
												<Input
													onChange={e => updateOptionValue(optionIndex, valueIndex, e.target.value)}
													placeholder="XS"
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
								Add Event Option
							</Button>
						</div>
					</div>
				</div>

				<Separator className="my-8" />

				<div className="flex items-center justify-end space-x-4">
					{onCancel && (
						<Button disabled={isLoading} onClick={onCancel} type="button" variant="outline">
							Cancel
						</Button>
					)}
					<Button disabled={isLoading} type="submit">
						{isLoading ? 'Creating...' : 'Create Event'}
					</Button>
				</div>
			</form>
		</div>
	)
}
