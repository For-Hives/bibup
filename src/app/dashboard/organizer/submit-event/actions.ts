'use server'

import type { Event } from '@/models/event.model'

import { auth } from '@clerk/nextjs/server'
import * as v from 'valibot'

import { fetchUserByClerkId } from '@/services/user.services'
import { createEvent } from '@/services/event.services'

const EventFormSchema = v.object({
    // Existing fields
    name: v.pipe(v.string(), v.minLength(1, 'Event name is required.')),
    date: v.pipe(
        v.string(),
        v.minLength(1, 'Event date is required.'),
        // v.transform(value => new Date(value)) // Transformation to Date object happens before calling service
    ), // Keep as string for date input, service layer handles Date conversion
    location: v.pipe(v.string(), v.minLength(1, 'Event location is required.')),
    description: v.optional(v.string(), ''),

    // New fields (add these)
    raceType: v.optional(v.string()),
    distance: v.optional(v.pipe(v.string(), v.transform(val => val ? Number(val) : undefined))), // Transform to number, or undefined if empty
    elevationGain: v.optional(v.pipe(v.string(), v.transform(val => val ? Number(val) : undefined))), // Transform to number, or undefined if empty
    raceFormat: v.optional(v.string()),
    logoUrl: v.optional(v.pipe(v.string(), v.check(val => val === '' || v.isUrl(val), 'Logo URL must be a valid URL or empty.'))), // Validate as URL if not empty
    bibPickupDetails: v.optional(v.string()),
    registrationOpenDate: v.optional(v.string()), // Expects 'YYYY-MM-DD' string
    referencePrice: v.optional(v.pipe(v.string(), v.transform(val => val ? Number(val) : undefined))), // Transform to number, or undefined if empty
    participantCount: v.optional(v.pipe(v.string(), v.transform(val => val ? Number(val) : 0))), // Defaults to 0 if empty/not provided
});

export async function handleSubmitEvent(formData: FormData): Promise<void> {
	const { userId: clerkId } = await auth()

	if (clerkId == null) {
		throw new Error('You must be logged in to submit an event.')
	}

	const user = await fetchUserByClerkId(clerkId)
	if (user == null) {
		// Also updated this check for consistency, as fetchUserByClerkId can return null
		throw new Error('Organizer user record not found.')
	}

	const dataToValidate = {
        // Existing fields
        name: formData.get('name') as string,
        date: formData.get('date') as string, // Keep as string
        location: formData.get('location') as string,
        description: formData.get('description') as string,
        participantCount: formData.get('participantCount') as string, // Add participantCount

        // New fields (add these)
        raceType: formData.get('raceType') as string,
        distance: formData.get('distance') as string,
        elevationGain: formData.get('elevationGain') as string,
        raceFormat: formData.get('raceFormat') as string,
        logoUrl: formData.get('logoUrl') as string,
        bibPickupDetails: formData.get('bibPickupDetails') as string,
        registrationOpenDate: formData.get('registrationOpenDate') as string,
        referencePrice: formData.get('referencePrice') as string,
    };

	const validationResult = v.safeParse(EventFormSchema, dataToValidate)

	if (!validationResult.success) {
		const flatErrors = v.flatten(validationResult.issues)
		const errorMessages =
			flatErrors.root?.join(', ') ??
			Object.values(flatErrors.nested ?? {})
				.flat()
				.join(', ') ??
			'Validation failed.'
		throw new Error(`Validation failed: ${errorMessages}`)
	}

	// const { description, location, name, date } = validationResult.output; // Old line
	const validatedOutput = validationResult.output; // Contains all validated fields

    const eventData: Partial<Event> = {
        organizerId: user.id, // from existing logic
        name: validatedOutput.name,
        date: new Date(validatedOutput.date), // Service's createEvent expects Date object for 'date'
        location: validatedOutput.location,
        description: validatedOutput.description,
        participantCount: validatedOutput.participantCount,

        // New fields
        raceType: validatedOutput.raceType,
        distance: validatedOutput.distance,
        elevationGain: validatedOutput.elevationGain,
        raceFormat: validatedOutput.raceFormat,
        logoUrl: validatedOutput.logoUrl,
        bibPickupDetails: validatedOutput.bibPickupDetails,
        registrationOpenDate: validatedOutput.registrationOpenDate, // Pass as string 'YYYY-MM-DD'
        referencePrice: validatedOutput.referencePrice,

        // isPartnered, status, bibsSold are set by the service.
    };

	try {
        const newEvent = await createEvent(eventData as Event); // Casting to Event, assuming service handles missing optionals.
		if (!newEvent) {
			throw new Error('Failed to create event after submission.');
		}
	} catch (error: unknown) {
		throw new Error(`Failed to create event: ${error instanceof Error ? error.message : String(error)}`)
	}
}
