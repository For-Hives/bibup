export interface EventOption {
	key: string // ex: "size", "gender", "meal"
	label: string // ex: "Taille", "Genre", "Repas"
	required: boolean
	values: string[] // ex: ["XS","S","M","L","XL"]
}
