import { useEffect, useState } from 'react'

import { fetchAllOrganizers } from '@/services/organizer.services'
import { Organizer } from '@/models/organizer.model'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { EventSectionProps } from './types'
import { Label } from '../../ui/label'

export default function OrganizerSection({ translations, setValue, formData, errors }: EventSectionProps) {
	const [organizers, setOrganizers] = useState<Organizer[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const loadOrganizers = async () => {
			try {
				setIsLoading(true)
				const organizersList = await fetchAllOrganizers()
				setOrganizers(organizersList)
			} catch (error) {
				console.error('Error loading organizers:', error)
			} finally {
				setIsLoading(false)
			}
		}

		void loadOrganizers()
	}, [])

	return (
		<div className="grid grid-cols-1 gap-12 md:grid-cols-3">
			<div>
				<h2 className="text-foreground text-2xl font-semibold">{translations.event.sections.organizer.title}</h2>
				<p className="text-muted-foreground mt-2 text-base leading-7">
					{translations.event.sections.organizer.description}
				</p>
			</div>
			<div className="sm:max-w-4xl md:col-span-2">
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
					<div className="col-span-full">
						<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="organizer">
							{translations.event.fields.organizer.label} *
						</Label>
						<Select
							disabled={isLoading}
							onValueChange={(value: string) => setValue('organizer', value)}
							value={formData.organizer ?? ''}
						>
							<SelectTrigger
								className="ring-foreground/40 h-10 bg-gray-50 ring-2 dark:bg-zinc-800 dark:ring-slate-700"
								id="organizer"
							>
								<SelectValue
									placeholder={
										isLoading
											? translations.event.fields.organizer.loading
											: translations.event.fields.organizer.placeholder
									}
								/>
							</SelectTrigger>
							<SelectContent>
								{organizers.map(organizer => (
									<SelectItem key={organizer.id} value={organizer.id}>
										<div className="flex items-center gap-2">
											<span>{organizer.name}</span>
											{organizer.isPartnered && (
												<span className="bg-primary/10 text-primary rounded px-2 py-1 text-xs font-medium">
													{translations.event.fields.organizer.partnered}
												</span>
											)}
										</div>
									</SelectItem>
								))}
								{organizers.length === 0 && !isLoading && (
									<SelectItem disabled value="">
										{translations.event.fields.organizer.noOrganizers}
									</SelectItem>
								)}
							</SelectContent>
						</Select>
						{errors.organizer && (
							<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.organizer.message}</p>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
