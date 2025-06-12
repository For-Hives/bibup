export interface User {
	bibUpBalance: number // Default to 0
	clerkId: string // For linking to Clerk user
	email: string
	firstName: string
	id: string
	lastName: string
	roles: Array<'admin' | 'buyer' | 'organizer' | 'seller'>
	phone?: string // New field
	address?: { // New field
		street: string
		city: string
		postalCode: string
		country: string
	}
	dateOfBirth?: string // New field (ISO date string e.g., 'YYYY-MM-DD')
	// Add other relevant user profile information here
}
