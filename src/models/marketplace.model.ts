export type CardsProps = {
	races: Race[]
}

export type Race = {
	date: string
	distance: string
	id: number
	image?: string
	location: string
	name: string
	originalPrice: string
	participants: string
	price: string
	seller: string
	sport: Sport
	verified: boolean
}

export type Sport = 'Running' | 'Trail'
