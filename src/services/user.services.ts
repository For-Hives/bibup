import type { User } from '@/models/user.model'

import { pb } from '@/lib/pocketbaseClient'

export async function createUser(userData: Omit<User, 'id'>): Promise<null | User> {
	try {
		const record = await pb.collection('users').create<User>(userData)
		return record
	} catch (error: unknown) {
		if (error != null && typeof error === 'object') {
			if ('message' in error && typeof (error as { message: unknown }).message === 'string') {
				console.error('PocketBase error details:', (error as { message: string }).message)
			}
			if ('response' in error) {
				const response = (error as { response: unknown }).response
				if (response != null && typeof response === 'object' && 'data' in response) {
					console.error('PocketBase response data:', (response as { data: unknown }).data)
				}
			}
		}
		throw new Error('Error creating user in PocketBase: ' + (error instanceof Error ? error.message : String(error)))
	}
}

/**
 * Fetches a user from PocketBase by their Clerk ID.
 * @param clerkId The Clerk User ID.
 */
export async function fetchUserByClerkId(clerkId: string): Promise<null | User> {
	if (clerkId === '') {
		console.error('Clerk ID is required to fetch user data.')
		return null
	}
	try {
		const record = await pb.collection('users').getFirstListItem<User>(`clerkId = "${clerkId}"`)
		return record
	} catch (error: unknown) {
		// PocketBase getFirstListItem throws an error if no item is found (which is a 404).
		// This is an expected "not found" case, so we return null.
		if (
			error != null &&
			typeof error === 'object' &&
			'status' in error &&
			(error as { status: unknown }).status === 404
		) {
			console.warn(`User with Clerk ID ${clerkId} not found in PocketBase.`)
			return null
		}
		// For other types of errors, re-throw.
		throw new Error(
			`Error fetching user by Clerk ID "${clerkId}": ` + (error instanceof Error ? error.message : String(error))
		)
	}
}

/**
 * Fetches a user from PocketBase using their PocketBase record ID.
 * @param userId The PocketBase record ID of the user.
 * @returns The full User object if found, otherwise null.
 */
export async function fetchUserById(userId: string): Promise<null | User> {
	if (userId === '') {
		console.error('User ID (PocketBase record ID) is required to fetch user data.')
		return null
	}
	try {
		const record = await pb.collection('users').getOne<User>(userId)
		return record
	} catch (error: unknown) {
		if (
			error != null &&
			typeof error === 'object' &&
			'status' in error &&
			(error as { status: unknown }).status === 404
		) {
			// Expected "not found" case.
			console.warn(`User with PocketBase ID ${userId} not found.`)
			return null
		}
		throw new Error(
			`Error fetching user by PocketBase ID "${userId}": ` + (error instanceof Error ? error.message : String(error))
		)
	}
}

/**
 * Checks if a user has admin role.
 * @param user The user object to check.
 */
export function isAdmin(user: null | User): boolean {
	return user?.role === 'admin'
}
