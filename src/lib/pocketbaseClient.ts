// src/lib/pocketbaseClient.ts
import PocketBase from 'pocketbase'

const { POCKETBASE_TOKEN } = process.env
// Initialize PocketBase client
export const pb = new PocketBase(
	process.env.NEXT_PUBLIC_POCKETBASE_URL as string
)

pb.autoCancellation(false)

if (POCKETBASE_TOKEN) {
	pb.authStore.save(POCKETBASE_TOKEN, null)
}
