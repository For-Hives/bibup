export interface EventOption {
	key: string // ex: "size", "gender", "meal" 🏷️
	label: string // ex: "Size", "Gender", "Meal" 🏷️ (Translated from French)
	required: boolean
	values: string[] // ex: ["XS","S","M","L","XL"] ✅
}
