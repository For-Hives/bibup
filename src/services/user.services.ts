import type { User } from '@/models/user.model'

import { pb } from '@/lib/pocketbaseClient'

export interface CreateUserDTO {
	clerkId: string;
	email: string;
	firstName: string;
	lastName: string;
	phone?: string; // New
	address?: { // New
		street: string;
		city: string;
		postalCode: string;
		country: string;
	};
	dateOfBirth?: string; // New (ISO date string)
}

export async function createUser(userData: CreateUserDTO): Promise<null | User> {
	try {
		const newUserRecord = {
			clerkId: userData.clerkId,
			email: userData.email,
			firstName: userData.firstName,
			lastName: userData.lastName,
			phone: userData.phone, // New
			address: userData.address, // New
			dateOfBirth: userData.dateOfBirth, // New
			roles: ['buyer'], // Default role
			bibUpBalance: 0,
		};

		// Remove undefined fields before sending to PocketBase to avoid errors
		// if PocketBase expects a field not to be null or undefined explicitly.
		// Or ensure PocketBase schema allows nulls for these optional fields.
		// For simplicity here, we assume PocketBase handles undefined fields correctly by omitting them.
		Object.keys(newUserRecord).forEach(key => {
			const recordKey = key as keyof typeof newUserRecord;
			if (newUserRecord[recordKey] === undefined) {
				delete newUserRecord[recordKey];
			}
		});


		const record = await pb.collection('users').create<User>(newUserRecord as User); // Cast needed if types mismatch due to optional fields
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

export interface UpdateUserDTO {
	firstName?: string;
	lastName?: string;
	phone?: string;
	address?: {
		street: string;
		city: string;
		postalCode: string;
		country: string;
	};
	dateOfBirth?: string; // ISO date string e.g., 'YYYY-MM-DD'
	// Potentially other fields like roles or bibUpBalance if they can be updated through specific events.
	// For now, focus on the profile fields.
}

export async function updateUser(userId: string, userData: UpdateUserDTO): Promise<null | User> {
	if (!userId) {
		console.error('User ID (PocketBase record ID) is required to update user data.');
		return null;
	}

	try {
		// Construct the data payload carefully, only including fields that are present in userData.
		// PocketBase's update method might replace the whole record or merge,
		// so it's safer to be explicit if we only want to update certain fields.
		// However, for this DTO, it's designed to carry all updatable profile fields.
		const updatePayload: Partial<User> = {};

		if (userData.firstName !== undefined) updatePayload.firstName = userData.firstName;
		if (userData.lastName !== undefined) updatePayload.lastName = userData.lastName;
		if (userData.phone !== undefined) updatePayload.phone = userData.phone;
		if (userData.address !== undefined) updatePayload.address = userData.address;
		if (userData.dateOfBirth !== undefined) updatePayload.dateOfBirth = userData.dateOfBirth;
		// Note: email and clerkId are generally not updated after creation.
		// Roles and bibUpBalance might be updated by other specific services/events.


		if (Object.keys(updatePayload).length === 0) {
			console.warn(`No data provided to update user ${userId}.`);
			// Optionally fetch and return the current user record if no actual update is made
			return fetchUserById(userId);
		}

		const record = await pb.collection('users').update<User>(userId, updatePayload);
		return record;
	} catch (error: unknown) {
		if (error != null && typeof error === 'object') {
			if ('message' in error && typeof (error as { message: unknown }).message === 'string') {
				console.error('PocketBase error details during update:', (error as { message: string }).message);
			}
			if ('response' in error) {
				const response = (error as { response: unknown }).response;
				if (response != null && typeof response === 'object' && 'data' in response) {
					console.error('PocketBase response data during update:', (response as { data: unknown }).data);
				}
			}
		}
		throw new Error(`Error updating user ${userId} in PocketBase: ` + (error instanceof Error ? error.message : String(error)));
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
		const user = await fetchUserByClerkId(clerkUserId)
		if (user == null) {
			console.error(`User with Clerk ID ${clerkUserId} not found. Cannot update balance.`)
			return null // Or throw new Error('User not found, cannot update balance.')
		}

		const currentBalance = user.bibUpBalance ?? 0
		const newBalance = currentBalance + amountToAdd

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
			console.error('PocketBase error details:', (error as { message: string }).message)
		}
		throw new Error(
			`Error updating balance for user ${clerkUserId}: ` + (error instanceof Error ? error.message : String(error))
		)
	}
}
