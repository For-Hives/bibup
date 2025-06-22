'use server'

import { checkAdminAccess } from '@/guard/adminGuard'

import { getDashboardStats, getRecentActivity } from '@/services/dashboard.services'
import { createOrganizer, fetchAllOrganizers } from '@/services/organizer.services'
import { getAllEvents } from '@/services/event.services'
import { Organizer } from '@/models/organizer.model'

/**
 * Server action to create a new organizer (admin only)
 * Verifies authentication via Clerk, platform registration, and admin permissions
 */
export async function createOrganizerAction(organizerData: Omit<Organizer, 'created' | 'id' | 'updated'>): Promise<{
	data?: Organizer
	error?: string
	success: boolean
}> {
	try {
		// Verify admin access (checks Clerk auth, platform registration, and admin role)
		const adminUser = await checkAdminAccess()

		if (!adminUser) {
			return {
				success: false,
				error: 'Unauthorized: Admin access required',
			}
		}

		// Validate required fields
		if (!organizerData.name || !organizerData.email) {
			return {
				success: false,
				error: 'Name and email are required fields',
			}
		}

		// Create the organizer
		const newOrganizer = await createOrganizer(organizerData)

		if (!newOrganizer) {
			return {
				success: false,
				error: 'Failed to create organizer',
			}
		}

		console.info(`Admin ${adminUser.email} created organizer: ${newOrganizer.name}`)

		return {
			success: true,
			data: newOrganizer,
		}
	} catch (error) {
		console.error('Error creating organizer:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to create organizer',
		}
	}
}

/**
 * Server action to get all events for admin
 */
export async function getAllEventsAction(expandOrganizer = true) {
	try {
		const events = await getAllEvents(expandOrganizer)
		return {
			success: true,
			data: events,
		}
	} catch (error) {
		console.error('Error fetching all events:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to fetch events',
		}
	}
}

/**
 * Server action to get all organizers for admin
 */
export async function getAllOrganizersAction() {
	try {
		const organizers = await fetchAllOrganizers()

		return {
			success: true,
			data: organizers,
		}
	} catch (error) {
		console.error('Error fetching all organizers:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to fetch organizers',
		}
	}
}

/**
 * Server action to get dashboard statistics
 */
export async function getDashboardStatsAction() {
	try {
		const stats = await getDashboardStats()
		return {
			success: true,
			data: stats,
		}
	} catch (error) {
		console.error('Error fetching dashboard stats:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats',
		}
	}
}

/**
 * Server action to get recent activity
 */
export async function getRecentActivityAction() {
	try {
		const activity = await getRecentActivity()
		return {
			success: true,
			data: activity,
		}
	} catch (error) {
		console.error('Error fetching recent activity:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to fetch recent activity',
		}
	}
}
