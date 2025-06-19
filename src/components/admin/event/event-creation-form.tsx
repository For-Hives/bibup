'use client'

import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FileUpload } from '@/components/ui/file-upload'
import { createEvent } from '@/services/event.services'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Event } from '@/models/event.model'

// Zod schema for form validation
const eventSchema = z.object({
	typeCourse: z.enum(['route', 'trail', 'triathlon', 'ultra'], {
		required_error: 'Le type de course est requis',
	}),
	transferDeadline: z.string().optional().or(z.literal('')),
	registrationUrl: z.string().url('URL invalide').optional().or(z.literal('')),
	participantCount: z.number().min(1, 'Le nombre de participants doit être supérieur à 0'),
	parcoursUrl: z.string().url('URL invalide').optional().or(z.literal('')),
	// Event options matching EventOption model
	options: z
		.array(
			z.object({
				values: z.array(z.string()).min(1, 'Au moins une valeur est requise'),
				required: z.boolean(),
				label: z.string().min(1, 'Le libellé est requis'),
				key: z.string().min(1, 'La clé est requise'),
			})
		)
		.optional(),
	officialStandardPrice: z.number().min(0, 'Le prix doit être positif').optional().or(z.literal('')),

	name: z.string().min(1, "Le nom de l'événement est requis").max(100, 'Le nom ne peut pas dépasser 100 caractères'),
	logo: z.instanceof(File).optional(),
	location: z.string().min(1, 'Le lieu est requis').max(100, 'Le lieu ne peut pas dépasser 100 caractères'),
	isPartnered: z.boolean(),
	eventDate: z.string().min(1, "La date de l'événement est requise"),
	elevationGainM: z.number().min(0, 'Le dénivelé doit être positif').optional().or(z.literal('')),
	// Optional fields
	distanceKm: z.number().min(0, 'La distance doit être positive').optional().or(z.literal('')),
	description: z
		.string()
		.min(1, 'La description est requise')
		.max(1000, 'La description ne peut pas dépasser 1000 caractères'),
	bibPickupWindowEndDate: z.string().optional().or(z.literal('')),
	bibPickupWindowBeginDate: z.string().optional().or(z.literal('')),

	bibPickupLocation: z
		.string()
		.max(200, 'Le lieu de retrait ne peut pas dépasser 200 caractères')
		.optional()
		.or(z.literal('')),
})

type EventCreateData = Omit<Event, 'id'>
type EventFormData = z.infer<typeof eventSchema>

export default function EventCreationForm() {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const router = useRouter()

	const {
		setValue,
		register,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<EventFormData>({
		resolver: zodResolver(eventSchema),
		defaultValues: {
			options: [],
			isPartnered: false,
		},
	})

	const { remove, fields, append } = useFieldArray({
		name: 'options',
		control,
	})

	const onSubmit = async (data: EventFormData) => {
		setIsSubmitting(true)
		try {
			const eventData: EventCreateData = {
				typeCourse: data.typeCourse,
				transferDeadline: data.transferDeadline ? new Date(data.transferDeadline) : undefined,
				registrationUrl: data.registrationUrl === '' ? undefined : data.registrationUrl,
				participantCount: data.participantCount,
				parcoursUrl: data.parcoursUrl === '' ? undefined : data.parcoursUrl,
				options: data.options ?? [],
				officialStandardPrice: data.officialStandardPrice === '' ? undefined : Number(data.officialStandardPrice),
				name: data.name,
				logo: data.logo ?? new File([], ''),
				location: data.location,
				isPartnered: data.isPartnered,
				eventDate: new Date(data.eventDate),
				elevationGainM: data.elevationGainM === '' ? undefined : Number(data.elevationGainM),
				distanceKm: data.distanceKm === '' ? undefined : Number(data.distanceKm),
				description: data.description,
				bibPickupWindowEndDate: data.bibPickupWindowEndDate ? new Date(data.bibPickupWindowEndDate) : new Date(),
				bibPickupWindowBeginDate: data.bibPickupWindowBeginDate ? new Date(data.bibPickupWindowBeginDate) : new Date(),
				bibPickupLocation: data.bibPickupLocation === '' ? undefined : data.bibPickupLocation,
			}

			await createEvent(eventData as unknown as Event)
			toast.success('Événement créé avec succès!')
			void router.push('/admin/events')
		} catch (error) {
			console.error("Erreur lors de la création de l'événement:", error)
			toast.error("Erreur lors de la création de l'événement")
		} finally {
			setIsSubmitting(false)
		}
	}

	const addOption = () => {
		append({ values: [''], required: false, label: '', key: '' })
	}

	const handleFileChange = (files: File[]) => {
		if (files.length > 0) {
			setValue('logo', files[0])
		}
	}

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		void handleSubmit(onSubmit)(e)
	}

	return (
		<div className="container mx-auto py-8">
			<Card className="mx-auto max-w-4xl">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">Créer un nouvel événement</CardTitle>
				</CardHeader>
				<CardContent>
					<form className="space-y-8" onSubmit={handleFormSubmit}>
						{/* Informations principales */}
						<div className="space-y-6">
							<h3 className="text-lg font-semibold">Informations principales</h3>

							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="name">Nom de l'événement *</Label>
									<Input id="name" {...register('name')} className={errors.name ? 'border-red-500' : ''} />
									{errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
								</div>

								<div className="space-y-2">
									<Label htmlFor="location">Lieu *</Label>
									<Input id="location" {...register('location')} className={errors.location ? 'border-red-500' : ''} />
									{errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
								</div>

								<div className="space-y-2">
									<Label htmlFor="eventDate">Date de l'événement *</Label>
									<Input
										id="eventDate"
										type="datetime-local"
										{...register('eventDate')}
										className={errors.eventDate ? 'border-red-500' : ''}
									/>
									{errors.eventDate && <p className="text-sm text-red-500">{errors.eventDate.message}</p>}
								</div>

								<div className="space-y-2">
									<Label htmlFor="typeCourse">Type de course *</Label>
									<Controller
										control={control}
										name="typeCourse"
										render={({ field }) => (
											<Select onValueChange={field.onChange} value={field.value}>
												<SelectTrigger className={errors.typeCourse ? 'border-red-500' : ''}>
													<SelectValue placeholder="Sélectionner un type" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="route">Route</SelectItem>
													<SelectItem value="trail">Trail</SelectItem>
													<SelectItem value="triathlon">Triathlon</SelectItem>
													<SelectItem value="ultra">Ultra</SelectItem>
												</SelectContent>
											</Select>
										)}
									/>
									{errors.typeCourse && <p className="text-sm text-red-500">{errors.typeCourse.message}</p>}
								</div>

								<div className="space-y-2">
									<Label htmlFor="participantCount">Nombre de participants *</Label>
									<Input
										id="participantCount"
										type="number"
										{...register('participantCount', { valueAsNumber: true })}
										className={errors.participantCount ? 'border-red-500' : ''}
									/>
									{errors.participantCount && <p className="text-sm text-red-500">{errors.participantCount.message}</p>}
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="description">Description *</Label>
								<Textarea
									id="description"
									{...register('description')}
									className={errors.description ? 'border-red-500' : ''}
									rows={4}
								/>
								{errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
							</div>
						</div>

						<Separator />

						{/* Détails de l'événement */}
						<div className="space-y-6">
							<h3 className="text-lg font-semibold">Détails de l'événement</h3>

							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="distanceKm">Distance (km)</Label>
									<Input
										id="distanceKm"
										step="0.1"
										type="number"
										{...register('distanceKm', { valueAsNumber: true })}
										className={errors.distanceKm ? 'border-red-500' : ''}
									/>
									{errors.distanceKm && <p className="text-sm text-red-500">{errors.distanceKm.message}</p>}
								</div>

								<div className="space-y-2">
									<Label htmlFor="elevationGainM">Dénivelé positif (m)</Label>
									<Input
										id="elevationGainM"
										type="number"
										{...register('elevationGainM', { valueAsNumber: true })}
										className={errors.elevationGainM ? 'border-red-500' : ''}
									/>
									{errors.elevationGainM && <p className="text-sm text-red-500">{errors.elevationGainM.message}</p>}
								</div>

								<div className="space-y-2">
									<Label htmlFor="officialStandardPrice">Prix officiel (€)</Label>
									<Input
										id="officialStandardPrice"
										step="0.01"
										type="number"
										{...register('officialStandardPrice', { valueAsNumber: true })}
										className={errors.officialStandardPrice ? 'border-red-500' : ''}
									/>
									{errors.officialStandardPrice && (
										<p className="text-sm text-red-500">{errors.officialStandardPrice.message}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="transferDeadline">Date limite de transfert</Label>
									<Input
										id="transferDeadline"
										type="datetime-local"
										{...register('transferDeadline')}
										className={errors.transferDeadline ? 'border-red-500' : ''}
									/>
									{errors.transferDeadline && <p className="text-sm text-red-500">{errors.transferDeadline.message}</p>}
								</div>

								<div className="space-y-2">
									<Label htmlFor="parcoursUrl">URL du parcours</Label>
									<Input
										id="parcoursUrl"
										placeholder="https://..."
										type="url"
										{...register('parcoursUrl')}
										className={errors.parcoursUrl ? 'border-red-500' : ''}
									/>
									{errors.parcoursUrl && <p className="text-sm text-red-500">{errors.parcoursUrl.message}</p>}
								</div>

								<div className="space-y-2">
									<Label htmlFor="registrationUrl">Lien d'inscription</Label>
									<Input
										id="registrationUrl"
										placeholder="https://..."
										type="url"
										{...register('registrationUrl')}
										className={errors.registrationUrl ? 'border-red-500' : ''}
									/>
									{errors.registrationUrl && <p className="text-sm text-red-500">{errors.registrationUrl.message}</p>}
								</div>
							</div>
						</div>

						<Separator />

						{/* Retrait des dossards */}
						<div className="space-y-6">
							<h3 className="text-lg font-semibold">Retrait des dossards</h3>

							<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
								<div className="space-y-2">
									<Label htmlFor="bibPickupLocation">Lieu de retrait</Label>
									<Input
										id="bibPickupLocation"
										{...register('bibPickupLocation')}
										className={errors.bibPickupLocation ? 'border-red-500' : ''}
									/>
									{errors.bibPickupLocation && (
										<p className="text-sm text-red-500">{errors.bibPickupLocation.message}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="bibPickupWindowBeginDate">Début du retrait</Label>
									<Input
										id="bibPickupWindowBeginDate"
										type="datetime-local"
										{...register('bibPickupWindowBeginDate')}
										className={errors.bibPickupWindowBeginDate ? 'border-red-500' : ''}
									/>
									{errors.bibPickupWindowBeginDate && (
										<p className="text-sm text-red-500">{errors.bibPickupWindowBeginDate.message}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="bibPickupWindowEndDate">Fin du retrait</Label>
									<Input
										id="bibPickupWindowEndDate"
										type="datetime-local"
										{...register('bibPickupWindowEndDate')}
										className={errors.bibPickupWindowEndDate ? 'border-red-500' : ''}
									/>
									{errors.bibPickupWindowEndDate && (
										<p className="text-sm text-red-500">{errors.bibPickupWindowEndDate.message}</p>
									)}
								</div>
							</div>
						</div>

						<Separator />

						{/* Partenariat */}
						<div className="space-y-6">
							<h3 className="text-lg font-semibold">Paramètres de partenariat</h3>

							<div className="space-y-2">
								<Label>Événement en partenariat</Label>
								<Controller
									control={control}
									name="isPartnered"
									render={({ field }) => (
										<RadioGroup
											className="flex gap-6"
											onValueChange={value => field.onChange(value === 'true')}
											value={field.value ? 'true' : 'false'}
										>
											<div className="flex items-center space-x-2">
												<RadioGroupItem id="partnered-yes" value="true" />
												<Label htmlFor="partnered-yes">Oui</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem id="partnered-no" value="false" />
												<Label htmlFor="partnered-no">Non</Label>
											</div>
										</RadioGroup>
									)}
								/>
								{errors.isPartnered && <p className="text-sm text-red-500">{errors.isPartnered.message}</p>}
							</div>
						</div>

						<Separator />

						{/* Logo */}
						<div className="space-y-6">
							<h3 className="text-lg font-semibold">Logo de l'événement</h3>

							<div className="space-y-2">
								<Label>Logo (optionnel)</Label>
								<FileUpload onChange={handleFileChange} />
								{errors.logo && <p className="text-sm text-red-500">{errors.logo.message}</p>}
							</div>
						</div>

						<Separator />

						{/* Options de l'événement */}
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold">Options de l'événement</h3>
								<Button onClick={addOption} type="button" variant="outline">
									Ajouter une option
								</Button>
							</div>

							<div className="space-y-4">
								{fields.map((field, index) => (
									<Card className="p-4" key={field.id}>
										<div className="grid grid-cols-1 gap-4">
											<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
												<div className="space-y-2">
													<Label htmlFor={`options.${index}.key`}>Clé</Label>
													<Input
														{...register(`options.${index}.key` as const)}
														className={errors.options?.[index]?.key ? 'border-red-500' : ''}
														placeholder="size, gender, meal"
													/>
													{errors.options?.[index]?.key && (
														<p className="text-sm text-red-500">{errors.options[index]?.key?.message}</p>
													)}
												</div>

												<div className="space-y-2">
													<Label htmlFor={`options.${index}.label`}>Libellé</Label>
													<Input
														{...register(`options.${index}.label` as const)}
														className={errors.options?.[index]?.label ? 'border-red-500' : ''}
														placeholder="Taille, Genre, Repas"
													/>
													{errors.options?.[index]?.label && (
														<p className="text-sm text-red-500">{errors.options[index]?.label?.message}</p>
													)}
												</div>

												<div className="space-y-2">
													<Label htmlFor={`options.${index}.values`}>Valeurs (séparées par des virgules)</Label>
													<Controller
														control={control}
														name={`options.${index}.values` as const}
														render={({ field }) => (
															<Input
																className={errors.options?.[index]?.values ? 'border-red-500' : ''}
																onChange={e => {
																	const values = e.target.value
																		.split(',')
																		.map(v => v.trim())
																		.filter(v => v)
																	field.onChange(values)
																}}
																placeholder="XS, S, M, L, XL"
																value={field.value?.join(', ') || ''}
															/>
														)}
													/>
													{errors.options?.[index]?.values && (
														<p className="text-sm text-red-500">{errors.options[index]?.values?.message}</p>
													)}
												</div>
											</div>

											<div className="flex items-center justify-between">
												<Controller
													control={control}
													name={`options.${index}.required` as const}
													render={({ field }) => (
														<div className="flex items-center space-x-2">
															<input
																checked={field.value}
																className="rounded border-gray-300"
																id={`options.${index}.required`}
																onChange={field.onChange}
																type="checkbox"
															/>
															<Label htmlFor={`options.${index}.required`}>Option requise</Label>
														</div>
													)}
												/>
												<Button onClick={() => remove(index)} size="sm" type="button" variant="destructive">
													Supprimer cette option
												</Button>
											</div>
										</div>
									</Card>
								))}
							</div>
						</div>

						<Separator />

						{/* Boutons de soumission */}
						<div className="flex justify-end gap-4">
							<Button disabled={isSubmitting} onClick={() => router.back()} type="button" variant="outline">
								Annuler
							</Button>
							<Button disabled={isSubmitting} type="submit">
								{isSubmitting ? 'Création en cours...' : "Créer l'événement"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
