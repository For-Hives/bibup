import { DollarSign, Euro } from 'lucide-react'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/inputAlt'
import { Label } from '@/components/ui/label'

interface PricingStepProps {
	errors: Record<string, string>
	formData: {
		listingType: 'private' | 'public'
		sellingPrice: string
	}
	onChange: (data: Partial<PricingStepProps['formData']>) => void
	translations: {
		currency: string
		description: string
		listingType: string
		privateListing: string
		privateListingHelp: string
		publicListing: string
		publicListingHelp: string
		sellingPrice: string
		sellingPriceHelp: string
		sellingPricePlaceholder: string
		title: string
	}
}

export default function PricingStep({ translations: t, onChange, formData, errors }: PricingStepProps) {
	return (
		<div className="grid grid-cols-1 gap-12 md:grid-cols-3">
			{/* Section Header */}
			<div>
				<h2 className="text-foreground text-2xl font-semibold">{t.title}</h2>
				<p className="text-muted-foreground mt-2 text-base leading-7">{t.description}</p>
			</div>

			{/* Pricing Content */}
			<div className="md:col-span-2">
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
					{/* Selling Price */}
					<div className="col-span-full sm:col-span-3">
						<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="sellingPrice">
							{t.sellingPrice} *
						</Label>
						<div className="relative">
							<span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
								{t.currency === '$' ? <DollarSign className="h-4 w-4" /> : <Euro className="h-4 w-4" />}
							</span>
							<Input
								className={`pl-10 ${errors.sellingPrice ? 'border-red-500' : ''}`}
								id="sellingPrice"
								min="0"
								onChange={e => onChange({ sellingPrice: e.target.value })}
								placeholder={t.sellingPricePlaceholder}
								step="0.01"
								type="number"
								value={formData.sellingPrice}
							/>
						</div>
						<p className="text-muted-foreground mt-1 text-sm">{t.sellingPriceHelp}</p>
						{errors.sellingPrice && (
							<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.sellingPrice}</p>
						)}
					</div>

					{/* Listing Type */}
					<div className="col-span-full">
						<Label className="text-foreground mb-4 block text-base font-medium">{t.listingType}</Label>
						<RadioGroup
							onValueChange={(value: 'private' | 'public') => onChange({ listingType: value })}
							value={formData.listingType}
						>
							<div className="border-border/50 bg-card/50 space-y-2 rounded-lg p-4">
								<div className="flex items-center space-x-3">
									<RadioGroupItem id="public" value="public" />
									<Label className="font-medium" htmlFor="public">
										{t.publicListing}
									</Label>
								</div>
								<p className="text-muted-foreground ml-6 text-sm">{t.publicListingHelp}</p>
							</div>

							<div className="border-border/50 bg-card/50 space-y-2 rounded-lg p-4">
								<div className="flex items-center space-x-3">
									<RadioGroupItem id="private" value="private" />
									<Label className="font-medium" htmlFor="private">
										{t.privateListing}
									</Label>
								</div>
								<p className="text-muted-foreground ml-6 text-sm">{t.privateListingHelp}</p>
							</div>
						</RadioGroup>
					</div>
				</div>
			</div>
		</div>
	)
}
