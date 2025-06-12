import * as v from 'valibot'

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
		if (data.isNotListedEvent) {
			// If it's an unlisted event, unlisted fields are required, and eventId should be blank.
			const unlistedFieldsPresent =
				data.unlistedEventName != null &&
				data.unlistedEventName !== '' &&
				data.unlistedEventDate != null &&
				data.unlistedEventDate !== '' &&
				data.unlistedEventLocation != null &&
				data.unlistedEventLocation !== ''
			const eventIdAbsent = data.eventId == null || data.eventId === ''
			return unlistedFieldsPresent && eventIdAbsent
		} else {
			// If it's a listed event, eventId is required, and unlisted fields should be blank.
			const eventIdPresent = data.eventId != null && data.eventId !== ''
			const unlistedFieldsAbsent =
				(data.unlistedEventName == null || data.unlistedEventName === '') &&
				(data.unlistedEventDate == null || data.unlistedEventDate === '') &&
				(data.unlistedEventLocation == null || data.unlistedEventLocation === '')
			return eventIdPresent && unlistedFieldsAbsent
		}
	}, 'For unlisted events, provide its details and ensure no listed event is selected. For listed events, select one and ensure no unlisted event details are provided.')
)

export type BibFormData = v.InferOutput<typeof BibFormSchema>
