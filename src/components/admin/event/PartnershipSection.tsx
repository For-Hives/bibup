import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'

import { RadioGroup, RadioGroupItem } from '../../ui/radio-group'
import { EventFormData } from './types'
import { Label } from '../../ui/label'

export interface EventSectionProps {
	errors: FieldErrors<EventFormData>
	formData: EventFormData
	locale?: string
	register: UseFormRegister<EventFormData>
	setValue: UseFormSetValue<EventFormData>
	translations: Translations
}

export default function PartnershipSection({ translations, setValue, formData }: EventSectionProps) {
	return (
		<div className="grid grid-cols-1 gap-12 md:grid-cols-3">
			<div>
				<h2 className="text-foreground text-2xl font-semibold">{translations.event.sections.partnership.title}</h2>
				<p className="text-muted-foreground mt-2 text-base leading-7">
					{translations.event.sections.partnership.description}
				</p>
			</div>
			<div className="sm:max-w-4xl md:col-span-2">
				<fieldset>
					<legend className="text-foreground text-lg font-medium">{translations.event.fields.isPartnered.label}</legend>
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
	)
}
