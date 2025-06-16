'use client'

import LoadMoreComponent from '@/components/marketplace/loadMoreComponent'
import SearchComponent from '@/components/marketplace/searchComponent'
import CountComponent from '@/components/marketplace/countComponent'
import Cards from '@/components/marketplace/cards'

export default function Marketplace() {
	// const [selectedFilters, setSelectedFilters] = useState({
	// 	distance: ['Marathon', 'Semi-Marathon', '10km'],
	// 	geography: ['Paris', 'Lyon', 'Nice'],
	// 	sport: ['Running', 'Trail'],
	// 	price: [0, 200],
	// })
	//
	// const [showFilters, setShowFilters] = useState(false)
	//
	// const races = [
	// 	{
	// 		image: '/placeholder.svg?height=200&width=300',
	// 		name: 'Marathon de Paris',
	// 		participants: '45,000',
	// 		date: '14 Avril 2024',
	// 		originalPrice: '120€',
	// 		seller: 'Marie L.',
	// 		location: 'Paris',
	// 		distance: '42km',
	// 		sport: 'Running',
	// 		verified: true,
	// 		price: '85€',
	// 		id: 1,
	// 	},
	// ]
	//
	// const removeFilter = (category: keyof typeof selectedFilters, value: string) => {
	// 	setSelectedFilters(prev => ({
	// 		...prev,
	// 		[category]: (prev[category] as string[]).filter((item: string) => item !== value),
	// 	}))
	// }

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			{/*<Header />*/}

			<div className="container mx-auto px-4 py-8">
				{/* Page Title */}
				<div className="mb-8">
					<h1 className="mb-2 text-3xl font-bold text-white">Marketplace des dossards</h1>
					<p className="text-slate-300">Trouve le dossard parfait pour ton prochain défi</p>
				</div>

				{/* Search component */}
				<SearchComponent />

				{/* Results Count component */}
				{/*todo: Use parameters to display all cards instead of json in the card file*/}
				<CountComponent />

				{/*Cards components*/}
				{/*todo: Use parameters to display all cards instead of json in the card file*/}
				<Cards />

				{/* Load More Component */}
				<LoadMoreComponent />
			</div>
		</div>
	)
}
