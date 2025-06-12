export interface User {
	bibUpBalance: number
	clerkId: string
	createdAt: Date
	email: string
	firstName: string
	id: string
	lastName: string
	role: 'admin' | 'user' // default 'user'
	updatedAt: Date
}
