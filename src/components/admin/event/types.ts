import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'

import { z } from 'zod'

import { getTranslations } from '@/lib/getDictionary'
import { Event } from '@/models/event.model'

import adminTranslations from '../../../app/admin/event/locales.json'

// Validation Schema using Zod
export const EventCreationSchema = z
	.object({
		typeCourse: z.enum(['route', 'trail', 'triathlon', 'ultra']),
		transferDeadline: z.string().optional(),
		registrationUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
		participantCount: z.number().min(1, 'Participant count must be at least 1'),
		parcoursUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
		options: z.array(
			z.object({
				values: z.array(z.string()).min(1, 'At least one value is required'),
				required: z.boolean(),
				label: z.string().min(1, 'Option label is required'),
				key: z.string().min(1, 'Option key is required'),
			})
		),
		officialStandardPrice: z.number().min(0, 'Price must be positive').optional(),
		name: z.string().min(1, 'Event name is required'),
		logoFile: z.instanceof(File).optional(),
		location: z.string().min(1, 'Location is required'),
		isPartnered: z.boolean(),
		eventDate: z.string().min(1, 'Event date is required'),
		elevationGainM: z.number().min(0, 'Elevation gain must be positive').optional(),
		distanceKm: z.number().min(0, 'Distance must be positive').optional(),
		description: z.string().min(1, 'Description is required'),
		bibPickupWindowEndDate: z.string().min(1, 'Bib pickup end date is required'),
		bibPickupWindowBeginDate: z.string().min(1, 'Bib pickup begin date is required'),
		bibPickupLocation: z.string().optional(),
	})
	.refine(
		data => {
			const eventDate = new Date(data.eventDate)
			const beginDate = new Date(data.bibPickupWindowBeginDate)
			const endDate = new Date(data.bibPickupWindowEndDate)

			if (beginDate >= endDate) {
				return false
			}

			if (data.transferDeadline) {
				const transferDate = new Date(data.transferDeadline)
				if (transferDate >= eventDate) {
					return false
				}
			}

			return true
		},
		{
			path: ['form'],
			message:
				'Invalid date relationships: pickup begin must be before end, and transfer deadline must be before event date',
		}
	)

export interface EventCreationFormProps {
	onCancel?: () => void
	onSuccess?: (event: Event) => void
	translations: Translations
}

export type EventFormData = z.infer<typeof EventCreationSchema>

export interface EventSectionProps {
	errors: FieldErrors<EventFormData>
	formData: EventFormData
	register: UseFormRegister<EventFormData>
	setValue: UseFormSetValue<EventFormData>
	translations: Translations
}

export type Translations = ReturnType<typeof getTranslations<(typeof adminTranslations)['en'], 'en'>>
