import type { User } from '@/models/user.model' // Adjust path as needed

import { pb } from '@/lib/pocketbaseClient' // Assuming PocketBase client is initialized here

export interface CreateUserDTO {
	clerkId: string
	email: string
	firstName: string
	lastName: string
	// roles and bibUpBalance will be set to defaults by the service
}

export async function createUser(userData: CreateUserDTO): Promise<null | User> {
	try {
		const newUserRecord = {
			firstName: userData.firstName,
			lastName: userData.lastName,
			clerkId: userData.clerkId,
			email: userData.email,
			roles: ['buyer'], // Default role
			bibUpBalance: 0, // Default balance
		}

		const record = await pb.collection('users').create<User>(newUserRecord)
		return record
	} catch (error: unknown) {
		// It's good to check for specific PocketBase error types if possible
		// For example, if it's a unique constraint violation, etc.
		if (error != null && typeof error === 'object') {
			if ('message' in error && typeof (error as { message: unknown }).message === 'string') {
				// Still log PocketBase specific errors if needed, but re-throw
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

// Potential future functions:
// export async function getUserById(id: string): Promise<User | null> { ... } // This would be for PocketBase record ID

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
		// Assuming 'clerkId' is a unique field in your 'users' collection
		const record = await pb.collection('users').getFirstListItem<User>(`clerkId = "${clerkId}"`)
		return record
	} catch (error: unknown) {
		// PocketBase getFirstListItem throws an error if no item is found or multiple are found (if not unique)
		// It also throws for other query errors.
		if (
			error != null &&
			typeof error === 'object' &&
			'status' in error &&
			(error as { status: unknown }).status === 404
		) {
			// Explicitly return null on 404 as this is a "not found" case, not an unexpected error
			console.warn(`User with Clerk ID ${clerkId} not found in PocketBase.`)
			return null
		}
		// For other errors, you might want to throw or handle differently
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
			// Explicitly return null on 404 as this is a "not found" case, not an unexpected error
			console.warn(`User with PocketBase ID ${userId} not found.`)
			return null
		}
		throw new Error(
			`Error fetching user by PocketBase ID "${userId}": ` + (error instanceof Error ? error.message : String(error))
		)
	}
}

/**
 * Updates a user's Beswib balance.
 * @param clerkUserId The Clerk User ID of the user whose balance is to be updated.
 * @param amountToAdd The amount to add to the user's balance (can be negative to subtract).
 */
export async function updateUserBalance(clerkUserId: string, amountToAdd: number): Promise<null | User> {
	if (clerkUserId === '') {
		console.error('Clerk User ID is required to update balance.')
		return null
	}
	if (typeof amountToAdd !== 'number' || isNaN(amountToAdd)) {
		console.error('Invalid amount specified for balance update.')
		return null
	}

	try {
		// 1. Fetch the user by their Clerk ID to get their PocketBase record ID and current balance.
		const user = await fetchUserByClerkId(clerkUserId)
		if (user == null) {
			console.error(`User with Clerk ID ${clerkUserId} not found. Cannot update balance.`)
			return null
		}

		// 2. Calculate the new balance.
		const currentBalance = user.bibUpBalance ?? 0
		const newBalance = currentBalance + amountToAdd

		// 3. Update the user's record with the new balance.
		// PocketBase `update` method requires the record ID.
		const updatedRecord = await pb.collection('users').update<User>(user.id, {
			bibUpBalance: newBalance,
		})

		return updatedRecord
	} catch (error: unknown) {
		if (
			error != null &&
			typeof error === 'object' &&
			'message' in error &&
			typeof (error as { message: unknown }).message === 'string'
		) {
			// Still log PocketBase specific errors if needed, but re-throw
			console.error('PocketBase error details:', (error as { message: string }).message)
		}
		throw new Error(
			`Error updating balance for user ${clerkUserId}: ` + (error instanceof Error ? error.message : String(error))
		)
	}
}

// export async function updateUserRoles(clerkId: string, roles: string[]): Promise<User | null> { ... }
