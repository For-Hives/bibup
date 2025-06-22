export interface Organizer {
	created: Date
	email: string
	id: string
	isPartnered: boolean
	logo?: string // filename.jpg
	name: string
	updated: Date
	website?: string
}

// For creation forms that include file upload
export interface OrganizerWithLogoFile extends Omit<Organizer, 'created' | 'id' | 'updated'> {
	logoFile?: File
}
