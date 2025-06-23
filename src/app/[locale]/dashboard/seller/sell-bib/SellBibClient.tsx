'use client'

import { UserIcon } from 'lucide-react'
import React, { useState } from 'react'

import type { Organizer } from '@/models/organizer.model'
import type { Event } from '@/models/event.model'
import type { User } from '@/models/user.model'
import type { Bib } from '@/models/bib.model'

import { Separator } from '@/components/ui/separator'
import { createBib } from '@/services/bib.services'

import {
	BibDetailsStep,
	ConfirmationStep,
	EventSelectionStep,
	PricingStep,
	ProgressSteps,
	StepNavigation,
} from '../../../../../components/admin/dashboard/sell-bib'

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
	const [currentStep, setCurrentStep] = useState<Step>('eventSelection')
	const [isSubmitting, setIsSubmitting] = useState(false)
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

	const updateFormData = (data: Partial<FormData>) => {
		setFormData(prev => ({ ...prev, ...data }))
	}

	const renderStepContent = () => {
		switch (currentStep) {
			case 'bibDetails':
				return (
					<BibDetailsStep
						errors={errors}
						formData={formData}
						onChange={updateFormData}
						translations={{
							title: t.steps.bibDetails.title,
							registrationNumberPlaceholder: t.form.bibDetails.registrationNumberPlaceholder,
							registrationNumberHelp: t.form.bibDetails.registrationNumberHelp,
							registrationNumber: t.form.bibDetails.registrationNumber,
							originalPricePlaceholder: t.form.bibDetails.originalPricePlaceholder,
							originalPriceHelp: t.form.bibDetails.originalPriceHelp,
							originalPrice: t.form.bibDetails.originalPrice,
							description: t.steps.bibDetails.description,
							currency: t.form.pricing.currency,
							bibOptions: t.form.bibDetails.bibOptions,
						}}
					/>
				)

			case 'confirmation':
				return (
					<ConfirmationStep
						createdBib={createdBib}
						errors={errors}
						formData={formData}
						onChange={updateFormData}
						translations={{
							termsRequired: t.form.confirmation.termsRequired,
							terms: t.form.confirmation.terms,
							sellingPrice: t.form.confirmation.sellingPrice,
							reviewTitle: t.form.confirmation.reviewTitle,
							public: t.form.confirmation.public,
							privateLinkHelp: t.form.confirmation.privateLinkHelp,
							privateLink: t.form.confirmation.privateLink,
							private: t.form.confirmation.private,
							originalPrice: t.form.confirmation.originalPrice,
							marketplacePreview: t.form.confirmation.marketplacePreview,
							listingType: t.form.confirmation.listingType,
							event: t.form.confirmation.event,
							currency: t.form.pricing.currency,
							copyLink: t.form.confirmation.copyLink,
							bibNumber: t.form.confirmation.bibNumber,
						}}
						user={user}
					/>
				)

			case 'eventSelection':
				return (
					<EventSelectionStep
						availableEvents={availableEvents}
						error={errors.selectedEvent}
						onEventSelect={event => updateFormData({ selectedEvent: event })}
						selectedEvent={formData.selectedEvent}
						translations={{
							searchPlaceholder: t.form.eventSelection.searchPlaceholder,
							noEventsFound: t.form.eventSelection.noEventsFound,
							eventInfo: t.form.eventSelection.eventInfo,
							description: t.steps.eventSelection.description,
						}}
					/>
				)

			case 'pricing':
				return (
					<PricingStep
						errors={errors}
						formData={formData}
						onChange={updateFormData}
						translations={{
							title: t.steps.pricing.title,
							sellingPricePlaceholder: t.form.pricing.sellingPricePlaceholder,
							sellingPriceHelp: t.form.pricing.sellingPriceHelp,
							sellingPrice: t.form.pricing.sellingPrice,
							publicListingHelp: t.form.pricing.publicListingHelp,
							publicListing: t.form.pricing.publicListing,
							privateListingHelp: t.form.pricing.privateListingHelp,
							privateListing: t.form.pricing.privateListing,
							listingType: t.form.pricing.listingType,
							description: t.steps.pricing.description,
							currency: t.form.pricing.currency,
						}}
					/>
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
						<ProgressSteps currentStepIndex={currentStepIndex} steps={STEPS} translations={t.steps} />

						{/* Step Content */}
						<div className="mb-16">{renderStepContent()}</div>

						<Separator className="my-12" />

						{/* Navigation */}
						<StepNavigation
							createdBib={!!createdBib}
							isFirstStep={isFirstStep}
							isLastStep={isLastStep}
							isSubmitting={isSubmitting}
							onNext={handleNext}
							onPrevious={handlePrevious}
							onSubmit={handleSubmit}
							translations={{
								...t.actions,
								loading: t.messages.loading,
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
