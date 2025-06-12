import { User } from './user.model'

export interface Event {
	bibsSold: number // For KPI
	date: Date // Should be DateTime
	description?: string
	id: string
	isPartnered: boolean // Defaults to false
	location: string
	name: string
	organizerId: User['id'] // References a User ID
	participantCount: number
	status: 'approved' | 'cancelled' | 'completed' | 'pending_approval' | 'rejected'

	// New fields
	raceType?: string; // e.g., 'trail', 'road', 'triathlon', 'other'
	distance?: number; // in km
	elevationGain?: number; // in meters
	raceFormat?: string; // e.g., 'solo', 'team', 'relay', 'other'
	logoUrl?: string; // URL to the event logo
	bibPickupDetails?: string; // Textual details about bib pickup
	registrationOpenDate?: string; // Storing as ISO string 'YYYY-MM-DD' for simplicity with forms/JSON
	referencePrice?: number;

	// Add other relevant event details here
}
