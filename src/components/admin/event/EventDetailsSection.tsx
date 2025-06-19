import { toast } from 'sonner'

import { FileUpload } from '../../ui/file-upload'
import { DateInput } from '../../ui/date-input'
import { EventSectionProps } from './types'
import { Input } from '../../ui/inputAlt'
import { Label } from '../../ui/label'

export default function EventDetailsSection({
	translations,
	setValue,
	register,
	locale = 'fr',
	errors,
}: EventSectionProps) {
	const handleFileUploadWithValidation = (files: File[]) => {
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

	return (
		<div className="grid grid-cols-1 gap-12 md:grid-cols-3">
			<div>
				<h2 className="text-foreground text-2xl font-semibold">{translations.event.sections.eventDetails.title}</h2>
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
							<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.officialStandardPrice.message}</p>
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
						<DateInput id="transferDeadline" locale={locale} {...register('transferDeadline')} />
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
						<p className="text-muted-foreground mb-4 text-sm">{translations.event.fields.logoUpload.description}</p>
						<div className="bg-card/50 border-border/30 rounded-xl border backdrop-blur-sm">
							<FileUpload
								onChange={handleFileUploadWithValidation}
								translations={translations.event.fields.logoUpload}
							/>
						</div>
						{errors.logoFile && (
							<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.logoFile.message}</p>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
