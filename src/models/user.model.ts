export interface User {
	bibUpBalance: number // Default to 0
	clerkId: string // For linking to Clerk user
	email: string
	firstName: string
	id: string
	lastName: string
	roles: Array<'admin' | 'buyer' | 'organizer' | 'seller'>
	// Add other relevant user profile information here
}
