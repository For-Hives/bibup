import { Organizer } from '@/models/organizer.model'
import { pb } from '@/lib/pocketbaseClient'

/**
 * Create a new organizer
 */
export async function createOrganizer(
	organizerData: Omit<Organizer, 'created' | 'id' | 'updated'>
): Promise<null | Organizer> {
	try {
		const record = await pb.collection('organizer').create(organizerData)

		return {
			website: record.website,
			updated: new Date(record.updated),
			name: record.name,
			logo: record.logo,
			isPartnered: record.isPartnered,
			id: record.id,
			email: record.email,
			created: new Date(record.created),
		}
	} catch (error) {
		console.error('Error creating organizer:', error)
		return null
	}
}

/**
 * Delete organizer
 */
export async function deleteOrganizer(id: string): Promise<boolean> {
	try {
		await pb.collection('organizer').delete(id)
		return true
	} catch (error) {
		console.error('Error deleting organizer:', error)
		return false
	}
}

/**
 * Fetch all organizers
 */
export async function fetchAllOrganizers(): Promise<Organizer[]> {
	try {
		const records = await pb.collection('organizer').getFullList({
			sort: 'name',
		})

		return records.map(record => ({
			website: record.website,
			updated: new Date(record.updated),
			name: record.name,
			logo: record.logo,
			isPartnered: record.isPartnered,
			id: record.id,
			email: record.email,
			created: new Date(record.created),
		}))
	} catch (error) {
		console.error('Error fetching organizers:', error)
		return []
	}
}

/**
 * Fetch organizer by ID
 */
export async function fetchOrganizerById(id: string): Promise<null | Organizer> {
	try {
		const record = await pb.collection('organizer').getOne(id)

		return {
			website: record.website,
			updated: new Date(record.updated),
			name: record.name,
			logo: record.logo,
			isPartnered: record.isPartnered,
			id: record.id,
			email: record.email,
			created: new Date(record.created),
		}
	} catch (error) {
		console.error('Error fetching organizer by ID:', error)
		return null
	}
}

/**
 * Fetch partnered organizers only
 */
export async function fetchPartneredOrganizers(): Promise<Organizer[]> {
	try {
		const records = await pb.collection('organizer').getFullList({
			sort: 'name',
			filter: 'isPartnered = true',
		})

		return records.map(record => ({
			website: record.website,
			updated: new Date(record.updated),
			name: record.name,
			logo: record.logo,
			isPartnered: record.isPartnered,
			id: record.id,
			email: record.email,
			created: new Date(record.created),
		}))
	} catch (error) {
		console.error('Error fetching partnered organizers:', error)
		return []
	}
}

/**
 * Update organizer
 */
export async function updateOrganizer(
	id: string,
	organizerData: Partial<Omit<Organizer, 'created' | 'id' | 'updated'>>
): Promise<null | Organizer> {
	try {
		const record = await pb.collection('organizer').update(id, organizerData)

		return {
			website: record.website,
			updated: new Date(record.updated),
			name: record.name,
			logo: record.logo,
			isPartnered: record.isPartnered,
			id: record.id,
			email: record.email,
			created: new Date(record.created),
		}
	} catch (error) {
		console.error('Error updating organizer:', error)
		return null
	}
}
