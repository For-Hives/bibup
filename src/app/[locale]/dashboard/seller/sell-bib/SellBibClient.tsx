'use client'

import {
	ArrowLeft,
	ArrowRight,
	Calendar,
	CheckCircle,
	Copy,
	DollarSign,
	Euro,
	ExternalLink,
	MapPin,
	Search,
	ShoppingCart,
	TrendingUp,
	UserIcon,
	User as UserIcon2,
	Users,
} from 'lucide-react'
import React, { useState } from 'react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import type { Organizer } from '@/models/organizer.model'
import type { Event } from '@/models/event.model'
import type { User } from '@/models/user.model'
import type { Bib } from '@/models/bib.model'

import { SelectAlt, SelectContentAlt, SelectItemAlt, SelectTriggerAlt, SelectValueAlt } from '@/components/ui/selectAlt'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent } from '@/components/ui/card'
import { formatDateForDisplay } from '@/lib/dateUtils'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { createBib } from '@/services/bib.services'
import { Input } from '@/components/ui/inputAlt'
import { Button } from '@/components/ui/button'
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
			copyLink: string
			event: string
			listingType: string
			marketplacePreview: string
			originalPrice: string
			private: string
			privateLink: string
			privateLinkHelp: string
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
		linkCopied: string
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
	const [createdBib, setCreatedBib] = useState<Bib | null>(null)

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
				setCreatedBib(result)
				// Ne pas rediriger immédiatement, rester sur la page de confirmation
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

	const generatePrivateLink = () => {
		if (!createdBib) return ''
		const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
		return `${baseUrl}/marketplace/private/${createdBib.id}`
	}

	const copyPrivateLink = async () => {
		const link = generatePrivateLink()
		try {
			await navigator.clipboard.writeText(link)
			toast.success(t.messages.linkCopied)
		} catch (error) {
			console.error('Failed to copy link:', error)
		}
	}

	const formatDateForCard = (date: Date | string) => {
		const dateObj = typeof date === 'string' ? new Date(date) : date
		return dateObj.toLocaleDateString('fr-FR', {
			year: 'numeric',
			month: 'short',
			day: '2-digit',
		})
	}

	const calculateDiscount = () => {
		if (!formData.originalPrice || !formData.sellingPrice) return 0
		const original = parseFloat(formData.originalPrice)
		const selling = parseFloat(formData.sellingPrice)
		return Math.round(((original - selling) / original) * 100)
	}

	const renderMarketplacePreview = () => {
		if (!formData.selectedEvent) return null

		const discount = calculateDiscount()

		return (
			<div className="bg-card/80 border-border relative flex h-full max-w-xs flex-col overflow-hidden rounded-2xl border shadow-[0_0_0_1px_hsl(var(--border)),inset_0_0_30px_hsl(var(--primary)/0.1),inset_0_0_60px_hsl(var(--accent)/0.05),0_0_50px_hsl(var(--primary)/0.2)] backdrop-blur-md">
				<div className="relative flex justify-center px-4 pt-4">
					<div className="from-primary/20 via-accent/20 to-secondary/20 relative h-32 w-full overflow-hidden rounded-xl bg-gradient-to-br">
						<div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
							<Calendar className="h-12 w-12 text-gray-400" />
						</div>
						{/* Type d'événement */}
						<div className="absolute inset-0 top-0 left-0 z-20 m-2">
							<span className="mb-3 inline-block rounded-full border border-green-500/50 bg-green-500/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
								{formData.selectedEvent.typeCourse}
							</span>
						</div>
						{/* Badge de réduction */}
						{discount > 10 && (
							<div className="absolute top-0 right-0 z-20 m-2 flex justify-center">
								<span className="mb-2 rounded-full border border-red-500/50 bg-red-500/15 px-3 py-1 text-xs font-medium text-white/90 shadow-md shadow-red-500/20 backdrop-blur-md">
									-{discount}%
								</span>
							</div>
						)}
					</div>
				</div>
				<div className="flex w-full items-center justify-center py-2">
					<p className="text-muted-foreground text-xs leading-relaxed italic">
						vendu par {user.firstName} {user.lastName}
					</p>
				</div>
				<div className="via-border h-px w-full bg-gradient-to-r from-transparent to-transparent" />
				<div className="flex flex-1 flex-col gap-2 px-4 py-2">
					<div className="flex w-full justify-between gap-2">
						<h3 className="text-foreground text-lg font-bold">{formData.selectedEvent.name}</h3>
						<div className="relative flex flex-col items-center gap-2">
							<p className="text-2xl font-bold text-white">{formData.sellingPrice}€</p>
							{formData.originalPrice && (
								<p className="absolute top-8 right-0 text-sm italic line-through">{formData.originalPrice}€</p>
							)}
						</div>
					</div>
					<div className="flex items-center gap-3">
						<Calendar className="h-5 w-5" />
						<p className="text-muted-foreground text-xs leading-relaxed">
							{formatDateForCard(formData.selectedEvent.eventDate)}
						</p>
					</div>
					<div className="flex items-center gap-3">
						<MapPin className="h-5 w-5" />
						<div className="flex items-center gap-1">
							<p className="text-muted-foreground text-xs leading-relaxed">{formData.selectedEvent.location}</p>
							{formData.selectedEvent.distanceKm && (
								<>
									<span className="text-muted-foreground text-xs leading-relaxed">•</span>
									<p className="text-muted-foreground text-xs leading-relaxed">
										{formData.selectedEvent.distanceKm}
										<span className="text-muted-foreground text-xs leading-relaxed italic">km</span>
									</p>
								</>
							)}
						</div>
					</div>
					{formData.selectedEvent.participants && (
						<div className="flex items-center gap-2">
							<UserIcon2 className="h-5 w-5" />
							<p className="text-muted-foreground text-xs leading-relaxed">
								{formData.selectedEvent.participants.toLocaleString()} participants
							</p>
						</div>
					)}
					<div className="flex h-full items-end justify-center py-2">
						<div className="border-border bg-accent/20 text-accent-foreground flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium backdrop-blur-md">
							<ShoppingCart className="h-5 w-5" />
							Je veux ce dossard
						</div>
					</div>
				</div>
			</div>
		)
	}

	const renderStepContent = () => {
		switch (currentStep) {
			case 'bibDetails':
				return (
					<div className="grid grid-cols-1 gap-12 md:grid-cols-3">
						{/* Section Header */}
						<div>
							<h2 className="text-foreground text-2xl font-semibold">{t.steps.bibDetails.title}</h2>
							<p className="text-muted-foreground mt-2 text-base leading-7">{t.steps.bibDetails.description}</p>
						</div>

						{/* Bib Details Content */}
						<div className="md:col-span-2">
							{/* Selected Event Info */}
							{formData.selectedEvent && (
								<Card className="border-primary/20 bg-primary/5 mb-8 backdrop-blur-sm">
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

							<div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
								{/* Registration Number */}
								<div className="col-span-full sm:col-span-3">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="registrationNumber">
										{t.form.bibDetails.registrationNumber} *
									</Label>
									<Input
										className={errors.registrationNumber ? 'border-red-500' : ''}
										id="registrationNumber"
										onChange={e => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
										placeholder={t.form.bibDetails.registrationNumberPlaceholder}
										type="text"
										value={formData.registrationNumber}
									/>
									<p className="text-muted-foreground mt-1 text-sm">{t.form.bibDetails.registrationNumberHelp}</p>
									{errors.registrationNumber && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.registrationNumber}</p>
									)}
								</div>

								{/* Original Price */}
								<div className="col-span-full sm:col-span-3">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="originalPrice">
										{t.form.bibDetails.originalPrice}
									</Label>
									<div className="relative">
										<span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
											{t.form.pricing.currency === '$' ? (
												<DollarSign className="h-4 w-4" />
											) : (
												<Euro className="h-4 w-4" />
											)}
										</span>
										<Input
											className="pl-10"
											id="originalPrice"
											min="0"
											onChange={e => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
											placeholder={t.form.bibDetails.originalPricePlaceholder}
											step="0.01"
											type="number"
											value={formData.originalPrice}
										/>
									</div>
									<p className="text-muted-foreground mt-1 text-sm">{t.form.bibDetails.originalPriceHelp}</p>
								</div>

								{/* Event Options */}
								{formData.selectedEvent?.options && formData.selectedEvent.options.length > 0 && (
									<div className="col-span-full">
										<Label className="text-foreground mb-4 block text-base font-medium">
											{t.form.bibDetails.bibOptions}
										</Label>
										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
											{formData.selectedEvent.options.map(option => (
												<div key={option.key}>
													<Label className="text-foreground mb-2 block text-sm font-medium" htmlFor={option.key}>
														{option.label} {option.required && '*'}
													</Label>
													<SelectAlt
														onValueChange={value =>
															setFormData(prev => ({
																...prev,
																optionValues: { ...prev.optionValues, [option.key]: value },
															}))
														}
														value={formData.optionValues[option.key] || ''}
													>
														<SelectTriggerAlt id={option.key}>
															<SelectValueAlt placeholder={`Select ${option.label}`} />
														</SelectTriggerAlt>
														<SelectContentAlt>
															{option.values.map(value => (
																<SelectItemAlt key={value} value={value}>
																	{value}
																</SelectItemAlt>
															))}
														</SelectContentAlt>
													</SelectAlt>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				)

			case 'confirmation':
				return (
					<div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
						{/* Left Column - Summary */}
						<div>
							<h2 className="text-foreground mb-6 text-2xl font-semibold">{t.form.confirmation.reviewTitle}</h2>

							<Card className="border-border/50 bg-card/80 mb-8 backdrop-blur-sm">
								<CardContent className="space-y-6 p-6">
									<div className="grid grid-cols-1 gap-6">
										<div className="space-y-2">
											<Label className="text-muted-foreground text-sm font-medium">{t.form.confirmation.event}</Label>
											<p className="text-foreground font-semibold">{formData.selectedEvent?.name}</p>
										</div>
										<div className="space-y-2">
											<Label className="text-muted-foreground text-sm font-medium">
												{t.form.confirmation.bibNumber}
											</Label>
											<p className="text-foreground font-semibold">{formData.registrationNumber}</p>
										</div>
										{formData.originalPrice && (
											<div className="space-y-2">
												<Label className="text-muted-foreground text-sm font-medium">
													{t.form.confirmation.originalPrice}
												</Label>
												<p className="text-foreground font-semibold">
													{t.form.pricing.currency}
													{parseFloat(formData.originalPrice).toFixed(2)}
												</p>
											</div>
										)}
										<div className="space-y-2">
											<Label className="text-muted-foreground text-sm font-medium">
												{t.form.confirmation.sellingPrice}
											</Label>
											<p className="text-primary text-lg font-semibold">
												{t.form.pricing.currency}
												{parseFloat(formData.sellingPrice).toFixed(2)}
											</p>
										</div>
										<div className="space-y-2">
											<Label className="text-muted-foreground text-sm font-medium">
												{t.form.confirmation.listingType}
											</Label>
											<p className="text-foreground font-semibold">
												{formData.listingType === 'public' ? t.form.confirmation.public : t.form.confirmation.private}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Private Link - Only after creation */}
							{createdBib && formData.listingType === 'private' && (
								<Card className="border-border/50 bg-card/80 mb-8 backdrop-blur-sm">
									<CardContent className="space-y-4 p-6">
										<Label className="text-foreground text-base font-medium">{t.form.confirmation.privateLink}</Label>
										<div className="flex gap-2">
											<Input className="flex-1" readOnly value={generatePrivateLink()} />
											<Button onClick={() => void copyPrivateLink()} size="sm" variant="outline">
												<Copy className="h-4 w-4" />
											</Button>
											<Button asChild size="sm" variant="outline">
												<a href={generatePrivateLink()} rel="noopener noreferrer" target="_blank">
													<ExternalLink className="h-4 w-4" />
												</a>
											</Button>
										</div>
										<p className="text-muted-foreground text-sm">{t.form.confirmation.privateLinkHelp}</p>
									</CardContent>
								</Card>
							)}

							{/* Terms */}
							<div className="bg-card/50 border-border/50 space-y-4 rounded-lg border p-4">
								<div className="flex items-start space-x-3">
									<Checkbox
										checked={formData.acceptedTerms}
										id="terms"
										onCheckedChange={checked => setFormData(prev => ({ ...prev, acceptedTerms: !!checked }))}
									/>
									<Label className="text-foreground text-sm leading-relaxed" htmlFor="terms">
										{t.form.confirmation.terms}
									</Label>
								</div>
								{errors.acceptedTerms && (
									<p className="text-sm text-red-600 dark:text-red-400">{errors.acceptedTerms}</p>
								)}
							</div>

							{errors.submit && (
								<div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
									<p className="text-sm font-medium text-red-700 dark:text-red-400">{errors.submit}</p>
								</div>
							)}
						</div>

						{/* Right Column - Preview */}
						<div>
							<h3 className="text-foreground mb-6 text-xl font-semibold">{t.form.confirmation.marketplacePreview}</h3>
							<div className="flex justify-center">{renderMarketplacePreview()}</div>
						</div>
					</div>
				)

			case 'eventSelection':
				return (
					<div className="grid grid-cols-1 gap-12 md:grid-cols-3">
						{/* Section Header */}
						<div>
							<h2 className="text-foreground text-2xl font-semibold">{t.form.eventSelection.eventInfo}</h2>
							<p className="text-muted-foreground mt-2 text-base leading-7">{t.steps.eventSelection.description}</p>
						</div>

						{/* Event Selection Content */}
						<div className="md:col-span-2">
							{/* Search */}
							<div className="relative mb-6">
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
									<div className="text-muted-foreground py-8 text-center">{t.form.eventSelection.noEventsFound}</div>
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
														<div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
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
															<p className="text-muted-foreground mt-2 text-xs">by {event.expand.organizer.name}</p>
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

							{errors.selectedEvent && (
								<p className="mt-4 text-sm text-red-600 dark:text-red-400">{errors.selectedEvent}</p>
							)}
						</div>
					</div>
				)

			case 'pricing':
				return (
					<div className="grid grid-cols-1 gap-12 md:grid-cols-3">
						{/* Section Header */}
						<div>
							<h2 className="text-foreground text-2xl font-semibold">{t.steps.pricing.title}</h2>
							<p className="text-muted-foreground mt-2 text-base leading-7">{t.steps.pricing.description}</p>
						</div>

						{/* Pricing Content */}
						<div className="md:col-span-2">
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
								{/* Selling Price */}
								<div className="col-span-full sm:col-span-3">
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="sellingPrice">
										{t.form.pricing.sellingPrice} *
									</Label>
									<div className="relative">
										<span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
											{t.form.pricing.currency === '$' ? (
												<DollarSign className="h-4 w-4" />
											) : (
												<Euro className="h-4 w-4" />
											)}
										</span>
										<Input
											className={`pl-10 ${errors.sellingPrice ? 'border-red-500' : ''}`}
											id="sellingPrice"
											min="0"
											onChange={e => setFormData(prev => ({ ...prev, sellingPrice: e.target.value }))}
											placeholder={t.form.pricing.sellingPricePlaceholder}
											step="0.01"
											type="number"
											value={formData.sellingPrice}
										/>
									</div>
									<p className="text-muted-foreground mt-1 text-sm">{t.form.pricing.sellingPriceHelp}</p>
									{errors.sellingPrice && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.sellingPrice}</p>
									)}
								</div>

								{/* Listing Type */}
								<div className="col-span-full">
									<Label className="text-foreground mb-4 block text-base font-medium">
										{t.form.pricing.listingType}
									</Label>
									<RadioGroup
										onValueChange={(value: 'private' | 'public') =>
											setFormData(prev => ({ ...prev, listingType: value }))
										}
										value={formData.listingType}
									>
										<div className="border-border/50 bg-card/50 space-y-2 rounded-lg p-4">
											<div className="flex items-center space-x-3">
												<RadioGroupItem id="public" value="public" />
												<Label className="font-medium" htmlFor="public">
													{t.form.pricing.publicListing}
												</Label>
											</div>
											<p className="text-muted-foreground ml-6 text-sm">{t.form.pricing.publicListingHelp}</p>
										</div>

										<div className="border-border/50 bg-card/50 space-y-2 rounded-lg p-4">
											<div className="flex items-center space-x-3">
												<RadioGroupItem id="private" value="private" />
												<Label className="font-medium" htmlFor="private">
													{t.form.pricing.privateListing}
												</Label>
											</div>
											<p className="text-muted-foreground ml-6 text-sm">{t.form.pricing.privateListingHelp}</p>
										</div>
									</RadioGroup>
								</div>
							</div>
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
				<div className="relative flex min-h-screen items-center justify-center">
					<div className="border-border/50 bg-card/80 w-full max-w-md rounded-3xl border p-8 text-center shadow-[0_0_0_1px_hsl(var(--border)),inset_0_0_30px_hsl(var(--primary)/0.1),inset_0_0_60px_hsl(var(--accent)/0.05),0_0_50px_hsl(var(--primary)/0.2)] backdrop-blur-md">
						<div className="mb-6 text-6xl">⏳</div>
						<h1 className="text-foreground mb-4 text-2xl font-bold">{t.messages.loading}</h1>
						<div className="mx-auto h-1 w-32 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
							<div className="bg-primary h-full w-1/3 animate-pulse rounded-full"></div>
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

			<div className="relative pt-32">
				<div className="flex items-center justify-center p-6 md:p-10">
					<div className="border-border/50 bg-card/80 relative w-full max-w-7xl rounded-3xl border p-8 shadow-[0_0_0_1px_hsl(var(--border)),inset_0_0_30px_hsl(var(--primary)/0.1),inset_0_0_60px_hsl(var(--accent)/0.05),0_0_50px_hsl(var(--primary)/0.2)] backdrop-blur-md md:p-12">
						{/* Header */}
						<div className="mb-12 text-left">
							<h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl">{t.title}</h1>
							<p className="text-muted-foreground mt-4 text-lg">{t.subtitle}</p>
						</div>

						{/* Progress Steps */}
						<div className="mb-16">
							<div className="mx-auto flex max-w-4xl items-center justify-between">
								{STEPS.map((step, index) => {
									const isActive = index === currentStepIndex
									const isCompleted = index < currentStepIndex
									const stepData = t.steps[step]

									return (
										<div className="flex items-center" key={step}>
											<div className="flex flex-col items-center">
												<div
													className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-medium transition-all duration-200 ${
														isCompleted
															? 'bg-primary text-primary-foreground shadow-lg'
															: isActive
																? 'bg-primary/20 text-primary border-primary border-2 shadow-md'
																: 'bg-muted text-muted-foreground'
													} `}
												>
													{isCompleted ? <CheckCircle className="h-6 w-6" /> : index + 1}
												</div>
												<div className="mt-3 text-center">
													<p className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
														{stepData.title}
													</p>
													<p className="text-muted-foreground mt-1 text-xs">{stepData.description}</p>
												</div>
											</div>
											{index < STEPS.length - 1 && (
												<div
													className={`mx-8 h-px w-24 transition-all duration-200 ${isCompleted ? 'bg-primary' : 'bg-muted'}`}
												/>
											)}
										</div>
									)
								})}
							</div>
						</div>

						{/* Step Content */}
						<div className="mb-16">{renderStepContent()}</div>

						<Separator className="my-12" />

						{/* Navigation */}
						<div className="flex items-center justify-between pt-8">
							<Button
								disabled={isSubmitting}
								onClick={() => (createdBib ? router.push('/dashboard/seller') : router.push('/dashboard/seller'))}
								size="lg"
								variant="outline"
							>
								{createdBib ? 'Retour au Dashboard' : t.actions.cancel}
							</Button>

							<div className="flex gap-4">
								{!isFirstStep && !createdBib && (
									<Button disabled={isSubmitting} onClick={handlePrevious} size="lg" variant="outline">
										<ArrowLeft className="mr-2 h-4 w-4" />
										{t.actions.previous}
									</Button>
								)}

								{!isLastStep ? (
									<Button disabled={isSubmitting} onClick={handleNext} size="lg">
										{t.actions.next}
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>
								) : !createdBib ? (
									<Button className="min-w-32" disabled={isSubmitting} onClick={() => void handleSubmit()} size="lg">
										{isSubmitting ? t.messages.loading : t.actions.finish}
									</Button>
								) : (
									<Button onClick={() => router.push('/dashboard/seller')} size="lg">
										Terminer
									</Button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
