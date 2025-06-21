'use server'

import { getDashboardStats, getRecentActivity } from '@/services/dashboard.services'
import { fetchAllOrganizers } from '@/services/organizer.services'
import { getAllEvents } from '@/services/event.services'

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
