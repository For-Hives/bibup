import CardMarket, { BibSale } from '../marketplace/CardMarket'

const runsExample: BibSale[] = [
	{
		user: {
			lastName: 'Doe',
			id: '1',
			firstName: 'John',
		},
		status: 'available',
		price: 79.99,
		originalPrice: 100,
		id: '1',
		event: {
			type: 'running',
			participantCount: 10000,
			name: 'Marathon de Nantes',
			location: 'Nantes',
			image: '/bib-red.png',
			id: '1',
			distanceUnit: 'km',
			distance: 42,
			date: new Date(),
		},
	},
	{
		user: {
			lastName: 'Doe',
			id: '2',
			firstName: 'John',
		},
		status: 'available',
		price: 440,
		originalPrice: 500,
		id: '2',
		event: {
			type: 'running',
			participantCount: 64000,
			name: 'Ironman Nice',
			location: 'Nice',
			image: '/bib-green.png',
			id: '2',
			distanceUnit: 'km',
			distance: 226,
			date: new Date(),
		},
	},
	{
		user: {
			lastName: 'Doe',
			id: '3',
			firstName: 'John',
		},
		status: 'available',
		price: 9.99,
		originalPrice: 15,
		id: '3',
		event: {
			type: 'running',
			participantCount: 2630,
			name: 'Semi-marathon de Thonon',
			location: 'Thonon-les-bains',
			image: '/bib-pink.png',
			id: '3',
			distanceUnit: 'km',
			distance: 21,
			date: new Date(),
		},
	},
	{
		user: {
			lastName: 'Doe',
			id: '3',
			firstName: 'John',
		},
		status: 'available',
		price: 79.99,
		originalPrice: 100,
		id: '3',
		event: {
			type: 'running',
			participantCount: 10000,
			name: 'Marathon de Paris',
			location: 'Paris',
			image: '/bib-blue.png',
			id: '3',
			distanceUnit: 'km',
			distance: 42,
			date: new Date(),
		},
	},
	{
		user: {
			lastName: 'Doe',
			id: '4',
			firstName: 'John',
		},
		status: 'available',
		price: 900,
		originalPrice: 600,
		id: '4',
		event: {
			type: 'running',
			participantCount: 9000,
			name: 'Ultra Trail du Mont Blanc',
			location: 'Chamonix',
			image: '/bib-orange.png',
			id: '4',
			distanceUnit: 'km',
			distance: 170,
			date: new Date(),
		},
	},
]

// export default function MarketplaceGrid({ runs }: { runs: BibSale[] }) {
export default function MarketplaceGrid() {
	return (
		<div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 py-32 md:grid-cols-2 lg:grid-cols-4">
			{runsExample.map((run, index) => (
				<CardMarket bibSale={run} key={index} />
			))}
		</div>
	)
}
