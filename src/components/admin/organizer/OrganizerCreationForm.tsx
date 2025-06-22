'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'

import { valibotResolver } from '@hookform/resolvers/valibot'
import { toast } from 'sonner'
import * as v from 'valibot'

import { createOrganizer } from '@/services/organizer.services'
import { Separator } from '@/components/ui/separator'
import { Organizer } from '@/models/organizer.model'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/inputAlt'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

// Validation Schema using Valibot
const OrganizerCreationSchema = v.object({
	website: v.optional(v.union([v.pipe(v.string(), v.url('Must be a valid URL')), v.literal('')])),
	name: v.pipe(v.string(), v.minLength(1, 'Organizer name is required')),
	isPartnered: v.boolean(),
	email: v.pipe(v.string(), v.email('Please enter a valid email address')),
})

export interface OrganizerCreationFormProps {
	onCancel?: () => void
	onSuccess?: (organizer: Organizer) => void
	translations: {
		organizers: {
			create: {
				errors: {
					createFailed: string
					emailInvalid: string
					nameRequired: string
					websiteInvalid: string
				}
				form: {
					cancelButton: string
					emailLabel: string
					emailPlaceholder: string
					nameLabel: string
					namePlaceholder: string
					partnerDescription: string
					partnerLabel: string
					submitButton: string
					websiteLabel: string
					websitePlaceholder: string
				}
				subtitle: string
				title: string
			}
		}
	}
}

type OrganizerFormData = v.InferOutput<typeof OrganizerCreationSchema>

export default function OrganizerCreationForm({ translations, onSuccess, onCancel }: OrganizerCreationFormProps) {
	const [isLoading, setIsLoading] = useState(false)

	const {
		watch,
		setValue,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<OrganizerFormData>({
		resolver: valibotResolver(OrganizerCreationSchema),
		defaultValues: {
			isPartnered: false,
		},
	})

	const formData = watch()

	const onSubmit = async (data: OrganizerFormData) => {
		setIsLoading(true)

		try {
			const organizerData = {
				website: data.website ?? undefined,
				name: data.name,
				isPartnered: data.isPartnered,
				email: data.email,
			}

			const result = await createOrganizer(organizerData)

			if (result) {
				toast.success('Organizer created successfully!')
				onSuccess?.(result)
			} else {
				throw new Error('Failed to create organizer')
			}
		} catch (error) {
			console.error('Error creating organizer:', error)
			toast.error(error instanceof Error ? error.message : translations.organizers.create.errors.createFailed)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="from-background via-primary/5 to-background relative min-h-screen bg-gradient-to-br pt-24">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
			<div className="relative flex items-center justify-center p-6 md:p-10">
				<form
					className="border-border/50 bg-card/80 relative w-full max-w-4xl rounded-3xl border p-8 shadow-[0_0_0_1px_hsl(var(--border)),inset_0_0_30px_hsl(var(--primary)/0.1),inset_0_0_60px_hsl(var(--accent)/0.05),0_0_50px_hsl(var(--primary)/0.2)] backdrop-blur-md md:p-12"
					// eslint-disable-next-line @typescript-eslint/no-misused-promises
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className="mb-12 text-left">
						<h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl">
							{translations.organizers.create.title}
						</h1>
						<p className="text-muted-foreground mt-4 text-lg">{translations.organizers.create.subtitle}</p>
					</div>

					{/* Global form error */}
					{errors.root && (
						<div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
							{errors.root.message}
						</div>
					)}

					{/* Basic Information Section */}
					<div className="space-y-8">
						<div>
							<h3 className="text-foreground mb-6 text-2xl font-semibold">Basic Information</h3>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								{/* Organizer Name */}
								<div>
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="name">
										{translations.organizers.create.form.nameLabel} *
									</Label>
									<Input
										id="name"
										{...register('name')}
										placeholder={translations.organizers.create.form.namePlaceholder}
										type="text"
									/>
									{errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>}
								</div>

								{/* Email */}
								<div>
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="email">
										{translations.organizers.create.form.emailLabel} *
									</Label>
									<Input
										id="email"
										{...register('email')}
										placeholder={translations.organizers.create.form.emailPlaceholder}
										type="email"
									/>
									{errors.email && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
									)}
								</div>
							</div>
						</div>

						<Separator className="my-8" />

						{/* Contact Information Section */}
						<div>
							<h3 className="text-foreground mb-6 text-2xl font-semibold">Contact Information</h3>
							<div className="grid grid-cols-1 gap-6">
								{/* Website */}
								<div>
									<Label className="text-foreground mb-2 block text-base font-medium" htmlFor="website">
										{translations.organizers.create.form.websiteLabel} (Optional)
									</Label>
									<Input
										id="website"
										{...register('website')}
										placeholder={translations.organizers.create.form.websitePlaceholder}
										type="url"
									/>
									{errors.website && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.website.message}</p>
									)}
								</div>
							</div>
						</div>

						<Separator className="my-8" />

						{/* Partnership Section */}
						<div>
							<h3 className="text-foreground mb-6 text-2xl font-semibold">Partnership Status</h3>
							<div className="space-y-4">
								<div className="flex items-center space-x-3">
									<Checkbox
										checked={formData.isPartnered}
										id="isPartnered"
										onCheckedChange={checked => setValue('isPartnered', !!checked)}
									/>
									<Label className="text-foreground text-base font-medium" htmlFor="isPartnered">
										{translations.organizers.create.form.partnerLabel}
									</Label>
								</div>
								<p className="text-muted-foreground text-sm">
									{translations.organizers.create.form.partnerDescription}
								</p>
							</div>
						</div>
					</div>

					{/* Form Actions */}
					<div className="flex items-center justify-end space-x-6 pt-12">
						<Button disabled={isLoading} onClick={onCancel} size="lg" type="button" variant="outline">
							{translations.organizers.create.form.cancelButton}
						</Button>
						<Button disabled={isLoading} size="lg" type="submit">
							{isLoading ? 'Creating Organizer...' : translations.organizers.create.form.submitButton}
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}
