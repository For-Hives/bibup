import { z } from 'zod'

// Schéma Zod pour la validation du formulaire de listing de dossard
export const BibFormSchema = z
	.object({
		registrationNumber: z.string().min(1, "Le numéro d'inscription est requis"),
		gender: z.enum(['female', 'male', 'unisex']).nullable().optional(),
		price: z.number().positive('Le prix doit être supérieur à 0'),
		isNotListedEvent: z.boolean().default(false),
		unlistedEventLocation: z.string().optional(),
		unlistedEventName: z.string().optional(),
		unlistedEventDate: z.string().optional(),
		originalPrice: z.number().optional(),
		eventId: z.string().optional(),
		size: z.string().optional(),
	})
	.refine(
		data => {
			// Si l'événement n'est pas listé, les champs de l'événement sont requis
			if (data.isNotListedEvent) {
				return !!(data.unlistedEventName && data.unlistedEventDate && data.unlistedEventLocation)
			}
			// Si l'événement est listé, eventId est requis
			return !!data.eventId
		},
		{
			message:
				'Pour les événements non listés, le nom, la date et le lieu sont requis. Pour les événements partenaires, veuillez sélectionner un événement.',
			path: ['eventId'],
		}
	)

// Type inféré du schéma pour TypeScript
export type BibFormData = z.infer<typeof BibFormSchema>
