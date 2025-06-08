// src/lib/pocketbaseClient.ts
import PocketBase from 'pocketbase'

const { POCKETBASE_TOKEN, NEXT_PUBLIC_POCKETBASE_URL } = process.env

if (!NEXT_PUBLIC_POCKETBASE_URL) {
	throw new Error('NEXT_PUBLIC_POCKETBASE_URL environment variable is required')
}

// Initialize PocketBase client
export const pb = new PocketBase(NEXT_PUBLIC_POCKETBASE_URL)

pb.autoCancellation(false)

if (POCKETBASE_TOKEN) {
	pb.authStore.save(POCKETBASE_TOKEN, null)
}
