import * as v from 'valibot'

// Valibot schema for validating the bib listing form
export const BibFormSchema = v.pipe(
	v.object({
		registrationNumber: v.pipe(v.string(), v.minLength(1, 'The registration number is required')), // TODO: use localized error message
		price: v.pipe(v.number(), v.minValue(0.01, 'The price must be greater than 0')),
		gender: v.optional(v.nullable(v.picklist(['female', 'male', 'unisex']))),
		isNotListedEvent: v.optional(v.boolean(), false),
		unlistedEventLocation: v.optional(v.string()),
		unlistedEventName: v.optional(v.string()),
		unlistedEventDate: v.optional(v.string()),
		originalPrice: v.optional(v.number()),
		eventId: v.optional(v.string()),
		size: v.optional(v.string()),
	}),
	v.check(data => {
		// If the event is not listed, event fields are required
		if (data.isNotListedEvent) {
			return (
				data.unlistedEventName != null &&
				data.unlistedEventName !== '' &&
				data.unlistedEventDate != null &&
				data.unlistedEventDate !== '' &&
				data.unlistedEventLocation != null &&
				data.unlistedEventLocation !== ''
			)
		}
		// If the event is listed, eventId is required
		return data.eventId != null && data.eventId !== ''
	}, 'For unlisted events, name, date, and location are required. For partner events, please select an event.')
)

// Inferred type from the schema for TypeScript
export type BibFormData = v.InferOutput<typeof BibFormSchema>
