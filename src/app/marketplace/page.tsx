'use client'

import { Race } from '@/models/marketplace.model'

import CountRaceComponent from '@/components/marketplace/countRace.component'
import LoadMoreComponent from '@/components/marketplace/loadMore.component'
import SearchComponent from '@/components/marketplace/search.component'
import CardsComponent from '@/components/marketplace/cards.component'
import Header from '@/components/global/Header'

export default function Marketplace() {
	const races: Race[] = [
		{
			image: '/placeholder.svg?height=200&width=300',
			name: 'Marathon de Paris',
			participants: '45,000',
			date: '14 Avril 2024',
			originalPrice: '120€',
			seller: 'Marie L.',
			location: 'Paris',
			distance: '42km',
			sport: 'Running',
			verified: true,
			price: '85€',
			id: 1,
		},
		{
			image: '/placeholder.svg?height=200&width=300',
			name: 'Trail des Templiers',
			date: '20 Octobre 2024',
			participants: '8,000',
			originalPrice: '85€',
			seller: 'Thomas M.',
			location: 'Millau',
			distance: '56km',
			sport: 'Trail',
			verified: true,
			price: '65€',
			id: 2,
		},
		{
			image: '/placeholder.svg?height=200&width=300',
			name: 'Semi-Marathon de Lyon',
			date: '15 Septembre 2024',
			participants: '15,000',
			originalPrice: '50€',
			seller: 'Julie R.',
			location: 'Lyon',
			distance: '21km',
			sport: 'Running',
			verified: false,
			price: '35€',
			id: 3,
		},
	]

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<Header />

			<div className="container mx-auto px-4 py-8">
				{/* Page Title */}
				<div className="mb-8">
					<h1 className="mb-2 text-3xl font-bold text-white">Marketplace des dossards</h1>
					<p className="text-slate-300">Trouve le dossard parfait pour ton prochain défi</p>
				</div>

				{/* Search component */}
				<SearchComponent />

				{/* Results Count component */}
				<CountRaceComponent races={races} />

				{/*CardsComponent components*/}
				<CardsComponent races={races} />

				{/* Load More Component */}
				<LoadMoreComponent />
			</div>
		</div>
	)
}
