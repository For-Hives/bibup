import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

import { createEvent } from '@/services/event.services'
import { Event } from '@/models/event.model'

export async function POST(request: NextRequest) {
	try {
		// Check authentication
		const { userId } = await auth()
		if (userId === null || userId === undefined || userId === '') {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
		}

		// Parse the form data
		const formData = await request.formData()

		// Extract basic fields
		const name = formData.get('name') as string
		const location = formData.get('location') as string
		const eventDate = formData.get('eventDate') as string
		const description = formData.get('description') as string
		const typeCourse = formData.get('typeCourse') as 'route' | 'trail' | 'triathlon' | 'ultra'
		const participantCount = parseInt(formData.get('participantCount') as string, 10)
		const bibPickupWindowBeginDate = formData.get('bibPickupWindowBeginDate') as string
		const bibPickupWindowEndDate = formData.get('bibPickupWindowEndDate') as string
		const isPartnered = formData.get('isPartnered') === 'true'

		// Extract optional fields
		const distanceKmValue = formData.get('distanceKm')
		const distanceKm =
			distanceKmValue !== null && distanceKmValue !== '' ? parseFloat(distanceKmValue as string) : undefined
		const elevationGainMValue = formData.get('elevationGainM')
		const elevationGainM =
			elevationGainMValue !== null && elevationGainMValue !== ''
				? parseInt(elevationGainMValue as string, 10)
				: undefined
		const officialStandardPriceValue = formData.get('officialStandardPrice')
		const officialStandardPrice =
			officialStandardPriceValue !== null && officialStandardPriceValue !== ''
				? parseFloat(officialStandardPriceValue as string)
				: undefined
		const transferDeadline = (formData.get('transferDeadline') as string) ?? undefined
		const parcoursUrl = (formData.get('parcoursUrl') as string) ?? undefined
		const registrationUrl = (formData.get('registrationUrl') as string) ?? undefined
		const bibPickupLocation = (formData.get('bibPickupLocation') as string) ?? undefined

		// Handle logo file
		const logoFile = formData.get('logo') as File | null

		// Handle options
		const optionsJson = formData.get('options') as string
		let options = []
		try {
			options = optionsJson ? JSON.parse(optionsJson) : []
		} catch (error) {
			console.error('Error parsing options:', error)
			options = []
		}

		// Validate required fields
		if (!name || !location || !eventDate || !description) {
			return NextResponse.json(
				{ message: 'Missing required fields: name, location, eventDate, description' },
				{ status: 400 }
			)
		}

		// Create event data object
		const eventData: Omit<Event, 'id'> = {
			typeCourse,
			transferDeadline: transferDeadline ? new Date(transferDeadline) : undefined,
			registrationUrl,
			participantCount,
			parcoursUrl,
			options,
			officialStandardPrice,
			name,
			logo: logoFile ?? new File([], ''),
			location,
			isPartnered,
			eventDate: new Date(eventDate),
			elevationGainM,
			distanceKm,
			description,
			bibPickupWindowEndDate: new Date(bibPickupWindowEndDate),
			bibPickupWindowBeginDate: new Date(bibPickupWindowBeginDate),
			bibPickupLocation,
		}

		// Create the event using the service
		const createdEvent = await createEvent(eventData as Event)

		if (!createdEvent) {
			return NextResponse.json({ message: 'Failed to create event' }, { status: 500 })
		}

		return NextResponse.json(createdEvent, { status: 201 })
	} catch (error) {
		console.error('Error in POST /api/admin/events:', error)
		return NextResponse.json(
			{ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		)
	}
}
