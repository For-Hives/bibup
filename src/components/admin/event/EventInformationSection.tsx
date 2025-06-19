import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Textarea } from '../../ui/textareaAlt'
import { EventSectionProps } from './types'
import { Input } from '../../ui/inputAlt'
import { Label } from '../../ui/label'

export default function EventInformationSection({
	translations,
	setValue,
	register,
	formData,
	errors,
}: EventSectionProps) {
	return (
		<div className="grid grid-cols-1 gap-12 md:grid-cols-3">
			<div>
				<h2 className="text-foreground text-2xl font-semibold">{translations.event.sections.eventInformation.title}</h2>
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
						{errors.name && (
							<p className="mt-1 text-sm text-red-600 dark:text-red-400">{String(errors.name.message)}</p>
						)}
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
							<p className="mt-1 text-sm text-red-600 dark:text-red-400">{String(errors.location.message)}</p>
						)}
					</div>
					<div className="col-span-full sm:col-span-3">
						<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="eventDate">
							{translations.event.fields.eventDate.label} *
						</Label>
						<Input id="eventDate" {...register('eventDate')} type="datetime-local" />
						{errors.eventDate && (
							<p className="mt-1 text-sm text-red-600 dark:text-red-400">{String(errors.eventDate.message)}</p>
						)}
					</div>
					<div className="col-span-full sm:col-span-3">
						<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="typeCourse">
							{translations.event.fields.eventType.label} *
						</Label>
						<Select
							onValueChange={(value: string) =>
								setValue('typeCourse', value as 'route' | 'trail' | 'triathlon' | 'ultra')
							}
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
							<p className="mt-1 text-sm text-red-600 dark:text-red-400">{String(errors.typeCourse.message)}</p>
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
							<p className="mt-1 text-sm text-red-600 dark:text-red-400">{String(errors.description.message)}</p>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
