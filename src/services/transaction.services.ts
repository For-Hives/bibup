'use server'

import type { Transaction } from '@/models/transaction.model'

import { pb } from '@/lib/pocketbaseClient'

/**
 * Creates a new transaction record.
 * @param transactionData Data for the new transaction.
 *   Expects: bibId, buyerUserId (PocketBase User ID), sellerUserId (PocketBase User ID),
 *   amount (selling price of bib), platformFee, status.
 */
export async function createTransaction(
	transactionData: Omit<Transaction, 'id' | 'transactionDate'>
): Promise<null | Transaction> {
	if (
		transactionData.bibId === '' ||
		transactionData.buyerUserId === '' ||
		transactionData.sellerUserId === '' ||
		transactionData.amount === undefined ||
		transactionData.platformFee === undefined ||
		!transactionData.status
	) {
		console.error('Missing required fields for transaction creation:', transactionData)
		return null
	}

	try {
		const dataToCreate: Omit<Transaction, 'id'> = {
			...transactionData,
			transactionDate: new Date(),
		}

		const record = await pb.collection('transactions').create<Transaction>(dataToCreate)
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
		throw new Error('Error creating transaction: ' + (error instanceof Error ? error.message : String(error)))
	}
}
