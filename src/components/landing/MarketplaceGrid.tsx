import {
	generatePricing,
	getBibColorsDistributed,
	getRandomFirstName,
	getRandomFutureDate,
	getRandomLastName,
	getRandomParticipantCount,
	// generateFakeBibSales // Uncomment to use fully random data
} from '@/lib/utils'
import { getTranslations } from '@/lib/getDictionary'
import { Locale } from '@/lib/i18n-config'

import marketplaceTranslations from '../marketplace/locales.json'
import CardMarket, { BibSale } from '../marketplace/CardMarket'

// Get distributed colors for our 5 examples to ensure each bib has a different color
const bibColors = getBibColorsDistributed(5)

// --- Predefined examples with controlled content for consistent demo
const runsExample: BibSale[] = [
	{
		user: {
			lastName: getRandomLastName(),
			id: '1',
			firstName: getRandomFirstName(),
		},
		status: 'available',
		...generatePricing(100),
		id: '1',
		event: {
			type: 'running',
			participantCount: getRandomParticipantCount('running', 42),
			name: 'Marathon de Nantes',
			location: 'Nantes',
			image: bibColors[0], // First distributed color
			id: '1',
			distanceUnit: 'km',
			distance: 42,
			date: getRandomFutureDate(),
		},
	},
	{
		user: {
			lastName: getRandomLastName(),
			id: '2',
			firstName: getRandomFirstName(),
		},
		status: 'available',
		...generatePricing(525),
		id: '2',
		event: {
			type: 'triathlon',
			participantCount: getRandomParticipantCount('triathlon', 226),
			name: 'Ironman Nice',
			location: 'Nice',
			image: bibColors[1], // Second distributed color
			id: '2',
			distanceUnit: 'km',
			distance: 226,
			date: getRandomFutureDate(),
		},
	},
	{
		user: {
			lastName: getRandomLastName(),
			id: '3',
			firstName: getRandomFirstName(),
		},
		status: 'available',
		...generatePricing(25),
		id: '3',
		event: {
			type: 'running',
			participantCount: getRandomParticipantCount('running', 21),
			name: 'Semi-marathon de Thonon',
			location: 'Thonon-les-bains',
			image: bibColors[2], // Third distributed color
			id: '3',
			distanceUnit: 'km',
			distance: 21,
			date: getRandomFutureDate(),
		},
	},
	{
		user: {
			lastName: getRandomLastName(),
			id: '4',
			firstName: getRandomFirstName(),
		},
		status: 'available',
		...generatePricing(120),
		id: '4',
		event: {
			type: 'running',
			participantCount: getRandomParticipantCount('running', 42),
			name: 'Marathon de Paris',
			location: 'Paris',
			image: bibColors[3], // Fourth distributed color
			id: '4',
			distanceUnit: 'km',
			distance: 42,
			date: getRandomFutureDate(),
		},
	},
	{
		user: {
			lastName: getRandomLastName(),
			id: '5',
			firstName: getRandomFirstName(),
		},
		status: 'available',
		...generatePricing(180),
		id: '5',
		event: {
			type: 'trail',
			participantCount: getRandomParticipantCount('trail', 170),
			name: 'Ultra Trail du Mont Blanc',
			location: 'Chamonix',
			image: bibColors[4], // Fifth distributed color
			id: '5',
			distanceUnit: 'km',
			distance: 170,
			date: getRandomFutureDate(),
		},
	},
]

// --- Alternative: Fully random data generation
// Uncomment the lines below and comment out the runsExample above to use fully random data:
// const runsExample: BibSale[] = generateFakeBibSales(5)

export default function MarketplaceGrid({ locale }: { locale: Locale }) {
	const t = getTranslations(locale, marketplaceTranslations)

	return (
		<div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 py-32 md:grid-cols-2 lg:grid-cols-4">
			{runsExample.map((run, index) => (
				<CardMarket bibSale={run} key={index} translations={t} />
			))}
		</div>
	)
}
