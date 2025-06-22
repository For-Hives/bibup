'use client'

import {
	ArrowLeft,
	ArrowRight,
	Calendar,
	CheckCircle,
	FileText,
	MapPin,
	Search,
	TrendingUp,
	UserIcon,
	Users,
} from 'lucide-react'
import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import type { Organizer } from '@/models/organizer.model'
import type { Event } from '@/models/event.model'
import type { User } from '@/models/user.model'
import type { Bib } from '@/models/bib.model'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { formatDateForDisplay } from '@/lib/dateUtils'
import { Checkbox } from '@/components/ui/checkbox'
import { createBib } from '@/services/bib.services'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FormData {
	acceptedTerms: boolean
	listingType: 'private' | 'public'
	optionValues: Record<string, string>
	originalPrice: string
	registrationNumber: string
	selectedEvent: Event | null
	sellingPrice: string
}

interface SellBibClientProps {
	availableEvents: (Event & { expand?: { organizer?: Organizer } })[]
	translations: SellBibTranslations
	user: User
}

interface SellBibTranslations {
	actions: {
		cancel: string
		finish: string
		next: string
		previous: string
	}
	form: {
		bibDetails: {
			bibOptions: string
			originalPrice: string
			originalPriceHelp: string
			originalPricePlaceholder: string
			registrationNumber: string
			registrationNumberHelp: string
			registrationNumberPlaceholder: string
		}
		confirmation: {
			bibNumber: string
			event: string
			listingType: string
			originalPrice: string
			private: string
			public: string
			reviewTitle: string
			sellingPrice: string
			terms: string
			termsRequired: string
		}
		eventSelection: {
			date: string
			distance: string
			elevation: string
			eventInfo: string
			eventSelected: string
			location: string
			noEventsFound: string
			participants: string
			searchPlaceholder: string
			selectEvent: string
		}
		pricing: {
			currency: string
			listingType: string
			privateListing: string
			privateListingHelp: string
			publicListing: string
			publicListingHelp: string
			sellingPrice: string
			sellingPriceHelp: string
			sellingPricePlaceholder: string
		}
	}
	messages: {
		error: string
		loading: string
		success: string
	}
	steps: {
		bibDetails: { description: string; title: string }
		confirmation: { description: string; title: string }
		eventSelection: { description: string; title: string }
		pricing: { description: string; title: string }
	}
	subtitle: string
	title: string
	validation: {
		eventRequired: string
		priceFormat: string
		priceMinimum: string
		priceRequired: string
		registrationNumberRequired: string
	}
}

const STEPS = ['eventSelection', 'bibDetails', 'pricing', 'confirmation'] as const
type Step = (typeof STEPS)[number]

export default function SellBibClient({ user, translations: t, availableEvents }: SellBibClientProps) {
	const router = useRouter()
	const [currentStep, setCurrentStep] = useState<Step>('eventSelection')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [errors, setErrors] = useState<Record<string, string>>({})

	const [formData, setFormData] = useState<FormData>({
		sellingPrice: '',
		selectedEvent: null,
		registrationNumber: '',
		originalPrice: '',
		optionValues: {},
		listingType: 'public',
		acceptedTerms: false,
	})

	const currentStepIndex = STEPS.indexOf(currentStep)
	const isFirstStep = currentStepIndex === 0
	const isLastStep = currentStepIndex === STEPS.length - 1

	// Filter events based on search query
	const filteredEvents = availableEvents.filter(
		event =>
			event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			event.location.toLowerCase().includes(searchQuery.toLowerCase())
	)

	const validateStep = (step: Step): boolean => {
		const newErrors: Record<string, string> = {}

		switch (step) {
			case 'bibDetails':
				if (!formData.registrationNumber.trim()) {
					newErrors.registrationNumber = t.validation.registrationNumberRequired
				}
				break

			case 'confirmation':
				if (!formData.acceptedTerms) {
					newErrors.acceptedTerms = t.form.confirmation.termsRequired
				}
				break

			case 'eventSelection':
				if (!formData.selectedEvent) {
					newErrors.selectedEvent = t.validation.eventRequired
				}
				break

			case 'pricing':
				if (!formData.sellingPrice.trim()) {
					newErrors.sellingPrice = t.validation.priceRequired
				} else {
					const price = parseFloat(formData.sellingPrice)
					if (isNaN(price) || price <= 0) {
						newErrors.sellingPrice = t.validation.priceMinimum
					}
				}
				break
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleNext = () => {
		if (validateStep(currentStep)) {
			if (!isLastStep) {
				setCurrentStep(STEPS[currentStepIndex + 1])
			}
		}
	}

	const handlePrevious = () => {
		if (!isFirstStep) {
			setCurrentStep(STEPS[currentStepIndex - 1])
		}
	}

	const handleSubmit = async () => {
		if (!validateStep(currentStep) || !formData.selectedEvent) {
			return
		}

		setIsSubmitting(true)

		try {
			const bibData: Omit<Bib, 'id'> = {
				validated: false,
				status: 'available',
				sellerUserId: user.id,
				registrationNumber: formData.registrationNumber,
				price: parseFloat(formData.sellingPrice),
				originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
				optionValues: formData.optionValues,
				listed: formData.listingType === 'public' ? 'public' : 'private',
				eventId: formData.selectedEvent.id,
			}

			const result = await createBib(bibData)

			if (result) {
				router.push(`/dashboard/seller?success=true&bibStatus=${result.status}`)
			} else {
				setErrors({ submit: t.messages.error })
			}
		} catch (error: unknown) {
			console.error('Error creating bib:', error)
			setErrors({ submit: t.messages.error })
		} finally {
			setIsSubmitting(false)
		}
	}

	const renderStepContent = () => {
		switch (currentStep) {
			case 'bibDetails':
				return (
					<div className="space-y-6">
						{/* Selected Event Info */}
						{formData.selectedEvent && (
							<Card className="border-primary/20 bg-primary/5 border-border/50 backdrop-blur-sm">
								<CardContent className="p-4">
									<div className="flex items-center gap-3">
										<div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
											<CheckCircle className="h-5 w-5" />
										</div>
										<div>
											<h3 className="mb-1 font-semibold">{formData.selectedEvent.name}</h3>
											<p className="text-muted-foreground text-sm">{formData.selectedEvent.location}</p>
										</div>
									</div>
								</CardContent>
							</Card>
						)}

						{/* Registration Number */}
						<div className="space-y-2">
							<Label htmlFor="registrationNumber">{t.form.bibDetails.registrationNumber}</Label>
							<Input
								className={errors.registrationNumber ? 'border-red-500' : ''}
								id="registrationNumber"
								onChange={e => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
								placeholder={t.form.bibDetails.registrationNumberPlaceholder}
								type="text"
								value={formData.registrationNumber}
							/>
							<p className="text-xs text-gray-500">{t.form.bibDetails.registrationNumberHelp}</p>
							{errors.registrationNumber && <p className="text-sm text-red-500">{errors.registrationNumber}</p>}
						</div>

						{/* Original Price */}
						<div className="space-y-2">
							<Label htmlFor="originalPrice">{t.form.bibDetails.originalPrice}</Label>
							<Input
								id="originalPrice"
								min="0"
								onChange={e => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
								placeholder={t.form.bibDetails.originalPricePlaceholder}
								step="0.01"
								type="number"
								value={formData.originalPrice}
							/>
							<p className="text-xs text-gray-500">{t.form.bibDetails.originalPriceHelp}</p>
						</div>

						{/* Event Options */}
						{formData.selectedEvent?.options && formData.selectedEvent.options.length > 0 && (
							<div className="space-y-4">
								<Label>{t.form.bibDetails.bibOptions}</Label>
								{formData.selectedEvent.options.map(option => (
									<div className="space-y-2" key={option.key}>
										<Label htmlFor={option.key}>{option.label}</Label>
										<select
											className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
											id={option.key}
											onChange={e =>
												setFormData(prev => ({
													...prev,
													optionValues: { ...prev.optionValues, [option.key]: e.target.value },
												}))
											}
											value={formData.optionValues[option.key] || ''}
										>
											<option value="">Select {option.label}</option>
											{option.values.map(value => (
												<option key={value} value={value}>
													{value}
												</option>
											))}
										</select>
									</div>
								))}
							</div>
						)}
					</div>
				)

			case 'confirmation':
				return (
					<div className="space-y-6">
						<h3 className="text-lg font-semibold">{t.form.confirmation.reviewTitle}</h3>

						<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
							<CardContent className="space-y-4 p-6">
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div>
										<Label className="text-sm font-medium text-gray-500">{t.form.confirmation.event}</Label>
										<p className="font-semibold">{formData.selectedEvent?.name}</p>
									</div>
									<div>
										<Label className="text-sm font-medium text-gray-500">{t.form.confirmation.bibNumber}</Label>
										<p className="font-semibold">{formData.registrationNumber}</p>
									</div>
									{formData.originalPrice && (
										<div>
											<Label className="text-sm font-medium text-gray-500">{t.form.confirmation.originalPrice}</Label>
											<p className="font-semibold">
												{t.form.pricing.currency}
												{parseFloat(formData.originalPrice).toFixed(2)}
											</p>
										</div>
									)}
									<div>
										<Label className="text-sm font-medium text-gray-500">{t.form.confirmation.sellingPrice}</Label>
										<p className="text-primary font-semibold">
											{t.form.pricing.currency}
											{parseFloat(formData.sellingPrice).toFixed(2)}
										</p>
									</div>
									<div>
										<Label className="text-sm font-medium text-gray-500">{t.form.confirmation.listingType}</Label>
										<p className="font-semibold">
											{formData.listingType === 'public' ? t.form.confirmation.public : t.form.confirmation.private}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Terms */}
						<div className="flex items-start space-x-2">
							<Checkbox
								checked={formData.acceptedTerms}
								id="terms"
								onCheckedChange={checked => setFormData(prev => ({ ...prev, acceptedTerms: !!checked }))}
							/>
							<Label className="text-sm leading-relaxed" htmlFor="terms">
								{t.form.confirmation.terms}
							</Label>
						</div>
						{errors.acceptedTerms && <p className="text-sm text-red-500">{errors.acceptedTerms}</p>}

						{errors.submit && (
							<div className="rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
								<p className="text-sm font-medium text-red-700 dark:text-red-400">{errors.submit}</p>
							</div>
						)}
					</div>
				)

			case 'eventSelection':
				return (
					<div className="space-y-6">
						{/* Search */}
						<div className="relative">
							<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
							<Input
								className="pl-10"
								onChange={e => setSearchQuery(e.target.value)}
								placeholder={t.form.eventSelection.searchPlaceholder}
								type="text"
								value={searchQuery}
							/>
						</div>

						{/* Events List */}
						<div className="max-h-96 space-y-4 overflow-y-auto">
							{filteredEvents.length === 0 ? (
								<p className="py-8 text-center text-gray-500">{t.form.eventSelection.noEventsFound}</p>
							) : (
								filteredEvents.map(event => (
									<Card
										className={`border-border/50 bg-card/80 hover:bg-card/90 cursor-pointer backdrop-blur-sm transition-all duration-200 hover:shadow-lg ${
											formData.selectedEvent?.id === event.id ? 'ring-primary border-primary bg-primary/5 ring-2' : ''
										}`}
										key={event.id}
										onClick={() => setFormData(prev => ({ ...prev, selectedEvent: event }))}
									>
										<CardContent className="p-4">
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<h3 className="mb-2 text-lg font-semibold">{event.name}</h3>
													<div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
														<div className="flex items-center gap-2">
															<Calendar className="h-4 w-4" />
															{(() => {
																const eventDate = event.eventDate
																const dateStr =
																	typeof eventDate === 'string'
																		? eventDate
																		: eventDate instanceof Date
																			? eventDate.toISOString()
																			: new Date(eventDate).toISOString()
																return formatDateForDisplay(dateStr.split('T')[0])
															})()}
														</div>
														<div className="flex items-center gap-2">
															<MapPin className="h-4 w-4" />
															{event.location}
														</div>
														{event.distanceKm && (
															<div className="flex items-center gap-2">
																<TrendingUp className="h-4 w-4" />
																{event.distanceKm} km
															</div>
														)}
														{event.participants && (
															<div className="flex items-center gap-2">
																<Users className="h-4 w-4" />
																{event.participants} participants
															</div>
														)}
													</div>
													{event.expand?.organizer && (
														<p className="mt-2 text-xs text-gray-500">by {event.expand.organizer.name}</p>
													)}
												</div>
												{formData.selectedEvent?.id === event.id && (
													<CheckCircle className="text-primary mt-1 h-6 w-6" />
												)}
											</div>
										</CardContent>
									</Card>
								))
							)}
						</div>

						{errors.selectedEvent && <p className="text-sm text-red-500">{errors.selectedEvent}</p>}
					</div>
				)

			case 'pricing':
				return (
					<div className="space-y-6">
						{/* Selling Price */}
						<div className="space-y-2">
							<Label htmlFor="sellingPrice">{t.form.pricing.sellingPrice}</Label>
							<div className="relative">
								<span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
									{t.form.pricing.currency}
								</span>
								<Input
									className={`pl-8 ${errors.sellingPrice ? 'border-red-500' : ''}`}
									id="sellingPrice"
									min="0"
									onChange={e => setFormData(prev => ({ ...prev, sellingPrice: e.target.value }))}
									placeholder={t.form.pricing.sellingPricePlaceholder}
									step="0.01"
									type="number"
									value={formData.sellingPrice}
								/>
							</div>
							<p className="text-xs text-gray-500">{t.form.pricing.sellingPriceHelp}</p>
							{errors.sellingPrice && <p className="text-sm text-red-500">{errors.sellingPrice}</p>}
						</div>

						{/* Listing Type */}
						<div className="space-y-4">
							<Label>{t.form.pricing.listingType}</Label>
							<RadioGroup
								onValueChange={(value: 'private' | 'public') => setFormData(prev => ({ ...prev, listingType: value }))}
								value={formData.listingType}
							>
								<div className="flex items-center space-x-2">
									<RadioGroupItem id="public" value="public" />
									<Label className="font-normal" htmlFor="public">
										{t.form.pricing.publicListing}
									</Label>
								</div>
								<p className="ml-6 text-xs text-gray-500">{t.form.pricing.publicListingHelp}</p>

								<div className="flex items-center space-x-2">
									<RadioGroupItem id="private" value="private" />
									<Label className="font-normal" htmlFor="private">
										{t.form.pricing.privateListing}
									</Label>
								</div>
								<p className="ml-6 text-xs text-gray-500">{t.form.pricing.privateListingHelp}</p>
							</RadioGroup>
						</div>
					</div>
				)
		}
	}

	// Loading state
	if (isSubmitting) {
		return (
			<div className="from-background via-primary/5 to-background relative min-h-screen bg-gradient-to-br">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
				<div className="relative pt-32 pb-12">
					<div className="container mx-auto max-w-4xl p-6">
						<div className="space-y-8">
							<div className="space-y-2 text-center">
								<div className="mx-auto h-12 w-96 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
								<div className="mx-auto h-6 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
							</div>
							<div className="h-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
							<div className="flex justify-between">
								<div className="h-10 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
								<div className="h-10 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="from-background via-primary/5 to-background relative min-h-screen bg-gradient-to-br">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

			{/* User header */}
			<div className="bg-card/25 border-border/30 absolute top-0 right-0 left-0 z-20 mx-4 mt-12 mb-6 rounded-2xl border p-4 backdrop-blur-sm">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-muted-foreground text-sm">Selling as</p>
						<p className="text-foreground flex items-center gap-2 font-medium">
							<UserIcon className="h-4 w-4" />
							{user.firstName} {user.lastName}
							{user.email && <span className="text-muted-foreground text-sm">({user.email})</span>}
						</p>
					</div>
					<div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">SELLER</div>
				</div>
			</div>

			<div className="relative pt-32 pb-12">
				<div className="container mx-auto max-w-4xl p-6">
					{/* Header */}
					<div className="mb-12 space-y-2 text-center">
						<h1 className="text-foreground text-4xl font-bold tracking-tight">{t.title}</h1>
						<p className="text-muted-foreground mx-auto max-w-2xl text-lg">{t.subtitle}</p>
					</div>

					{/* Progress Steps */}
					<div className="mb-12">
						<div className="mx-auto flex max-w-2xl items-center justify-between">
							{STEPS.map((step, index) => {
								const isActive = index === currentStepIndex
								const isCompleted = index < currentStepIndex
								const stepData = t.steps[step]

								return (
									<div className="flex items-center" key={step}>
										<div className="flex flex-col items-center">
											<div
												className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium ${
													isCompleted
														? 'bg-primary text-primary-foreground'
														: isActive
															? 'bg-primary/20 text-primary border-primary border-2'
															: 'bg-muted text-muted-foreground'
												} `}
											>
												{isCompleted ? <CheckCircle className="h-5 w-5" /> : index + 1}
											</div>
											<div className="mt-2 text-center">
												<p className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
													{stepData.title}
												</p>
											</div>
										</div>
										{index < STEPS.length - 1 && (
											<div className={`mx-4 h-px w-24 ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />
										)}
									</div>
								)
							})}
						</div>
					</div>

					{/* Step Content */}
					<Card className="border-border/50 bg-card/80 shadow-[0_0_0_1px_hsl(var(--border)),inset_0_0_30px_hsl(var(--primary)/0.1),inset_0_0_60px_hsl(var(--accent)/0.05),0_0_50px_hsl(var(--primary)/0.2)] backdrop-blur-md">
						<CardHeader className="pb-6 text-center">
							<div className="bg-primary/10 text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
								{currentStep === 'eventSelection' && <Calendar className="h-8 w-8" />}
								{currentStep === 'bibDetails' && <FileText className="h-8 w-8" />}
								{currentStep === 'pricing' && <TrendingUp className="h-8 w-8" />}
								{currentStep === 'confirmation' && <CheckCircle className="h-8 w-8" />}
							</div>
							<CardTitle className="text-2xl">{t.steps[currentStep].title}</CardTitle>
							<CardDescription className="text-base">{t.steps[currentStep].description}</CardDescription>
						</CardHeader>
						<CardContent className="px-8 pb-8">{renderStepContent()}</CardContent>
					</Card>

					{/* Navigation */}
					<div className="mt-8 flex items-center justify-between">
						<Button disabled={isSubmitting} onClick={() => router.push('/dashboard/seller')} variant="outline">
							{t.actions.cancel}
						</Button>

						<div className="flex gap-4">
							{!isFirstStep && (
								<Button disabled={isSubmitting} onClick={handlePrevious} variant="outline">
									<ArrowLeft className="mr-2 h-4 w-4" />
									{t.actions.previous}
								</Button>
							)}

							{!isLastStep ? (
								<Button disabled={isSubmitting} onClick={handleNext}>
									{t.actions.next}
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							) : (
								<Button className="min-w-32" disabled={isSubmitting} onClick={() => void handleSubmit()}>
									{isSubmitting ? t.messages.loading : t.actions.finish}
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
