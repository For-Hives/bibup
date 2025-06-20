export interface User {
	clerkId: string
	createdAt: Date
	email: string
	firstName: string
	id: string
	lastName: string
	roles: 'admin' | 'user'
}
