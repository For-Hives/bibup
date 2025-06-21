export interface User {
	clerkId: string
	// PocketBase fields
	created: string
	createdAt: Date
	email: string
	firstName: string
	id: string
	lastName: string

	role: 'admin' | 'user'
	updated: string
}
