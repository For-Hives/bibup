import { useEffect, useState } from 'react'

import { getAllOrganizersAction } from '@/app/[locale]/admin/actions'
import { Organizer } from '@/models/organizer.model'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { EventSectionProps } from './types'
import { Label } from '../../ui/label'

export default function OrganizerSection({ translations, setValue, formData, errors }: EventSectionProps) {
	const [organizers, setOrganizers] = useState<Organizer[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<null | string>(null)

	useEffect(() => {
		const loadOrganizers = async () => {
			try {
				setIsLoading(true)
				setError(null)
				const result = await getAllOrganizersAction()

				if (result.success && result.data) {
					setOrganizers(result.data)
				} else {
					setError(result.error ?? 'Failed to load organizers')
					setOrganizers([])
				}
			} catch (error) {
				console.error('Error loading organizers:', error)
				setError('Failed to load organizers')
				setOrganizers([])
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

						{error !== null && error !== '' && (
							<div className="mb-4 rounded-lg bg-red-50 p-3 text-red-700 dark:bg-red-900/20 dark:text-red-400">
								{error}
							</div>
						)}

						{organizers.length > 0 && (
							<Select
								disabled={isLoading}
								onValueChange={(value: string) => setValue('organizer', value)}
								value={formData.organizer ?? ''}
							>
								<SelectTrigger
									className="shadow-input dark:placeholder-text-neutral-600 h-10 border-none bg-gray-50 transition duration-400 focus-visible:ring-[2px] focus-visible:ring-neutral-400 focus-visible:outline-none dark:bg-zinc-800 dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-neutral-600"
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
									{!isLoading &&
										organizers.length > 0 &&
										organizers.map(organizer => (
											<SelectItem key={organizer.id} value={organizer.id}>
												<div className="flex items-center gap-2">
													<span>{organizer.name ?? 'Unnamed Organizer'}</span>
													{organizer.isPartnered && (
														<span className="bg-primary/10 text-primary rounded px-2 py-1 text-xs font-medium">
															{translations.event.fields.organizer.partnered}
														</span>
													)}
												</div>
											</SelectItem>
										))}
									{!isLoading && organizers.length === 0 && !error && (
										<SelectItem disabled value="">
											{translations.event.fields.organizer.noOrganizers}
										</SelectItem>
									)}
									{isLoading && (
										<SelectItem disabled value="">
											{translations.event.fields.organizer.loading}
										</SelectItem>
									)}
								</SelectContent>
							</Select>
						)}
						{errors.organizer && (
							<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.organizer.message}</p>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
