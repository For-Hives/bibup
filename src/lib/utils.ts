import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

// === FAKER UTILITIES FOR MARKETPLACE ===

// Available bib colors for random selection
export const BIB_COLORS = [
	'/bib-red.png',
	'/bib-green.png',
	'/bib-blue.png',
	'/bib-pink.png',
	'/bib-orange.png',
] as const

// French first names for realistic faker data
const FRENCH_FIRST_NAMES = [
	'Sophie',
	'Alexandre',
	'Claire',
	'Thomas',
	'Camille',
	'Julien',
	'Marie',
	'Nicolas',
	'Emma',
	'Lucas',
	'Léa',
	'Hugo',
	'Chloé',
	'Louis',
	'Manon',
	'Ethan',
	'Inès',
	'Mathis',
	'Jade',
	'Noah',
	'Lola',
	'Nathan',
	'Zoé',
	'Enzo',
	'Lilou',
	'Maxime',
	'Eva',
	'Antoine',
] as const

// French last names for realistic faker data
const FRENCH_LAST_NAMES = [
	'Martin',
	'Dubois',
	'Lemoine',
	'Rousseau',
	'Bernard',
	'Moreau',
	'Laurent',
	'Simon',
	'Michel',
	'Lefebvre',
	'Leroy',
	'Roux',
	'David',
	'Bertrand',
	'Morel',
	'Fournier',
	'Girard',
	'Bonnet',
	'Dupont',
	'Lambert',
	'Fontaine',
	'Robin',
	'Morin',
	'Picard',
] as const

// Event types with their characteristics
export const EVENT_TYPES = ['running', 'trail', 'triathlon', 'cycling', 'swimming'] as const

/**
 * Get a random bib color from available colors
 */
export const getRandomBibColor = (): string => {
	return BIB_COLORS[Math.floor(Math.random() * BIB_COLORS.length)]
}

/**
 * Get a distributed set of bib colors ensuring different colors for each item
 * @param count Number of colors needed
 * @returns Array of bib colors with no duplicates until all colors are used
 */
export const getBibColorsDistributed = (count: number): string[] => {
	const colors: string[] = []
	const availableColors = [...BIB_COLORS]

	for (let i = 0; i < count; i++) {
		// If we've used all colors, reset the available colors array
		if (availableColors.length === 0) {
			availableColors.push(...BIB_COLORS)
		}

		// Pick a random color from available colors and remove it
		const randomIndex = Math.floor(Math.random() * availableColors.length)
		const selectedColor = availableColors.splice(randomIndex, 1)[0]
		colors.push(selectedColor)
	}

	return colors
}

/**
 * Get a random future date within the next 6 months
 */
export const getRandomFutureDate = (): Date => {
	const now = new Date()
	const sixMonthsFromNow = new Date(now.getTime() + 6 * 30 * 24 * 60 * 60 * 1000)
	const randomTime = now.getTime() + Math.random() * (sixMonthsFromNow.getTime() - now.getTime())
	return new Date(randomTime)
}

/**
 * Generate realistic pricing with discount logic
 */
export const generatePricing = (originalPrice: number): { originalPrice: number; price: number } => {
	// Generate a discount between 5% and 30%
	const discountPercent = 0.05 + Math.random() * 0.25
	const discountedPrice = Math.round(originalPrice * (1 - discountPercent) * 100) / 100

	return {
		price: discountedPrice,
		originalPrice,
	}
}

/**
 * Get a random French first name
 */
export const getRandomFirstName = (): string => {
	return FRENCH_FIRST_NAMES[Math.floor(Math.random() * FRENCH_FIRST_NAMES.length)]
}

/**
 * Get a random French last name
 */
export const getRandomLastName = (): string => {
	return FRENCH_LAST_NAMES[Math.floor(Math.random() * FRENCH_LAST_NAMES.length)]
}

/**
 * Get a random event type
 */
export const getRandomEventType = (): string => {
	return EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)]
}

/**
 * Get a random participant count based on event type and distance
 */
export const getRandomParticipantCount = (eventType: string, distance: number): number => {
	let baseCount = 1000

	// Adjust base count based on event type
	switch (eventType) {
		case 'cycling':
			baseCount = Math.floor(800 + Math.random() * 1200) // 800-2000
			break
		case 'running':
			baseCount = Math.floor(2000 + Math.random() * 8000) // 2000-10000
			break
		case 'trail':
			baseCount = Math.floor(500 + Math.random() * 2000) // 500-2500
			break
		case 'triathlon':
			baseCount = Math.floor(1000 + Math.random() * 2000) // 1000-3000
			break
		default:
			baseCount = Math.floor(500 + Math.random() * 1500) // 500-2000
	}

	// Adjust based on distance - longer distances typically have fewer participants
	if (distance > 100) {
		baseCount = Math.floor(baseCount * 0.3) // Ultra distances
	} else if (distance > 50) {
		baseCount = Math.floor(baseCount * 0.6) // Long distances
	} else if (distance > 20) {
		baseCount = Math.floor(baseCount * 0.8) // Medium distances
	}

	return Math.max(100, baseCount) // Minimum 100 participants
}

// Event templates for more realistic faker data
const EVENT_TEMPLATES = [
	{ type: 'running', name: 'Marathon de {city}', distance: 42, basePrice: 120 },
	{ type: 'running', name: 'Semi-marathon de {city}', distance: 21, basePrice: 35 },
	{ type: 'running', name: '10km de {city}', distance: 10, basePrice: 20 },
	{ type: 'trail', name: 'Trail de {city}', distance: 25, basePrice: 45 },
	{ type: 'trail', name: 'Ultra Trail de {city}', distance: 100, basePrice: 150 },
	{ type: 'triathlon', name: 'Ironman {city}', distance: 226, basePrice: 600 },
	{ type: 'triathlon', name: 'Triathlon de {city}', distance: 51, basePrice: 80 },
	{ type: 'cycling', name: 'Cyclosportive de {city}', distance: 120, basePrice: 40 },
] as const

// French cities for event locations
const FRENCH_CITIES = [
	'Paris',
	'Lyon',
	'Marseille',
	'Nice',
	'Toulouse',
	'Nantes',
	'Strasbourg',
	'Montpellier',
	'Bordeaux',
	'Lille',
	'Rennes',
	'Reims',
	'Saint-Étienne',
	'Toulon',
	'Le Havre',
	'Grenoble',
	'Dijon',
	'Angers',
	'Villeurbanne',
	'Le Mans',
	'Aix-en-Provence',
	'Clermont-Ferrand',
	'Brest',
	'Tours',
	'Limoges',
	'Amiens',
	'Annecy',
	'Perpignan',
	'Boulogne-Billancourt',
	'Orléans',
	'Mulhouse',
	'Rouen',
	'Caen',
	'Nancy',
	'Saint-Denis',
	'Argenteuil',
	'Montreuil',
	'Roubaix',
	'Tourcoing',
	'Nanterre',
	'Vitry-sur-Seine',
	'Créteil',
	'Avignon',
	'Poitiers',
	'Aubervilliers',
	'Dunkerque',
	'Aulnay-sous-Bois',
	'Colombes',
	'Versailles',
	'Fort-de-France',
	'Courbevoie',
	'Cherbourg-en-Cotentin',
	'Rueil-Malmaison',
	'Champigny-sur-Marne',
	'Chamonix',
	'Thonon-les-bains',
	'Megève',
	'Biarritz',
	'Deauville',
	'Cannes',
	'Saint-Tropez',
] as const

/**
 * Generate a complete BibSale object with realistic faker data
 */
export const generateFakeBibSale = (id: string) => {
	const eventTemplate = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)]
	const city = FRENCH_CITIES[Math.floor(Math.random() * FRENCH_CITIES.length)]
	const eventName = eventTemplate.name.replace('{city}', city)

	// Add some variation to distance and price
	const distanceVariation = eventTemplate.distance * (0.9 + Math.random() * 0.2) // ±10% variation
	const finalDistance = Math.round(distanceVariation)

	const priceVariation = eventTemplate.basePrice * (0.8 + Math.random() * 0.4) // ±20% variation
	const basePrice = Math.round(priceVariation)

	return {
		user: {
			lastName: getRandomLastName(),
			id: `user-${id}`,
			firstName: getRandomFirstName(),
		},
		status: 'available' as const,
		...generatePricing(basePrice),
		id,
		event: {
			type: eventTemplate.type as 'cycling' | 'other' | 'running' | 'swimming' | 'trail' | 'triathlon',
			participantCount: getRandomParticipantCount(eventTemplate.type, finalDistance),
			name: eventName,
			location: city,
			image: getRandomBibColor(),
			id: `event-${id}`,
			distanceUnit: 'km' as const,
			distance: finalDistance,
			date: getRandomFutureDate(),
		},
	}
}

/**
 * Generate an array of fake BibSale objects with distributed bib colors
 */
export const generateFakeBibSales = (count: number) => {
	const colors = getBibColorsDistributed(count)
	return Array.from({ length: count }, (_, index) => {
		const bibSale = generateFakeBibSale((index + 1).toString())
		// Override the random color with the distributed color
		bibSale.event.image = colors[index]
		return bibSale
	})
}
