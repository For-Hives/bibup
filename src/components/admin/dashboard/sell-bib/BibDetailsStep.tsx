import { CheckCircle, DollarSign, Euro } from 'lucide-react'

import type { Organizer } from '@/models/organizer.model'
import type { Event } from '@/models/event.model'

import { SelectAlt, SelectContentAlt, SelectItemAlt, SelectTriggerAlt, SelectValueAlt } from '@/components/ui/selectAlt'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/inputAlt'
import { Label } from '@/components/ui/label'

interface BibDetailsStepProps {
	errors: Record<string, string>
	formData: {
		optionValues: Record<string, string>
		originalPrice: string
		registrationNumber: string
		selectedEvent: (Event & { expand?: { organizer?: Organizer } }) | null
	}
	locale: Locale
	onChange: (data: Partial<BibDetailsStepProps['formData']>) => void
}

import sellBibTranslations from '@/app/[locale]/dashboard/seller/sell-bib/locales.json'
import { getTranslations } from '@/lib/getDictionary'
import { Locale } from '@/lib/i18n-config'

export default function BibDetailsStep({ onChange, locale, formData, errors }: Readonly<BibDetailsStepProps>) {
	const t = getTranslations(locale, sellBibTranslations)
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
							onChange={e => onChange({ registrationNumber: e.target.value })}
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
								{t.form.pricing.currency === '$' ? <DollarSign className="h-4 w-4" /> : <Euro className="h-4 w-4" />}
							</span>
							<Input
								className="pl-10"
								id="originalPrice"
								min="0"
								onChange={e => onChange({ originalPrice: e.target.value })}
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
							<Label className="text-foreground mb-4 block text-base font-medium">{t.form.bibDetails.bibOptions}</Label>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								{formData.selectedEvent.options.map(option => (
									<div key={option.key}>
										<Label className="text-foreground mb-2 block text-sm font-medium" htmlFor={option.key}>
											{option.label} {option.required && '*'}
										</Label>
										<SelectAlt
											onValueChange={value =>
												onChange({
													optionValues: { ...formData.optionValues, [option.key]: value },
												})
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
}
