'use client'

import React, { useMemo, useState } from 'react'

import type { BibSale } from '@/components/marketplace/card-market'

import OfferCounter from '@/components/marketplace/offerCounter'
import CardMarket from '@/components/marketplace/card-market'

import Searchbar from './searchbar'

// Type for advanced filters (same as in Searchbar)
type AdvancedFilters = {
	dateEnd?: string
	dateStart?: string
	geography: string[]
	price: number[]
}

// Props for the MarketplaceClient: receives an array of bibs to display
interface MarketplaceClientProps {
	bibs: BibSale[]
}

// Helper function to get the min/max range for each distance filter
const getDistanceRange = (distanceFilter: null | string): [number, number] => {
	switch (distanceFilter) {
		case '5':
			return [4, 6]
		case '10':
			return [9, 11]
		case '21':
			return [20, 22]
		case '42':
			return [41, 43]
		case '80':
			return [80, Infinity]
		case 'tri-l':
			return [110, 115] // Half Ironman total
		case 'tri-m':
			return [50, 55] // Olympic distance total
		case 'tri-s':
			return [25, 30] // Sprint distance total
		default:
			return [0, Infinity]
	}
}

// Helper function to sort bibs according to the selected sort option
const sortBibs = (bibs: BibSale[], sort: string) => {
	switch (sort) {
		case 'distance':
			return [...bibs].sort((a, b) => b.event.distance - a.event.distance)
		case 'price-asc':
			return [...bibs].sort((a, b) => a.price - b.price)
		case 'price-desc':
			return [...bibs].sort((a, b) => b.price - a.price)
		case 'date':
		default:
			return [...bibs].sort((a, b) => new Date(a.event.date).getTime() - new Date(b.event.date).getTime())
	}
}

// Helper function to filter bibs by all filters
const filterBibs = (
	bibs: BibSale[],
	searchTerm: string,
	selectedSport: null | string,
	selectedDistance: null | string,
	advancedFilters: AdvancedFilters
) => {
	let filtered = bibs

	// Filter by search term (name, location, or type)
	if (searchTerm) {
		const search = searchTerm.toLowerCase()
		filtered = filtered.filter(
			bib =>
				bib.event.name.toLowerCase().includes(search) ||
				bib.event.location.toLowerCase().includes(search) ||
				bib.event.type.toLowerCase().includes(search)
		)
	}

	// Filter by selected sport
	if (typeof selectedSport === 'string' && selectedSport !== '' && selectedSport !== 'all') {
		filtered = filtered.filter(bib => bib.event.type === selectedSport)
	}

	// Filter by selected distance
	if (typeof selectedDistance === 'string' && selectedDistance !== '' && selectedDistance !== 'all') {
		const [minDistance, maxDistance] = getDistanceRange(selectedDistance)
		filtered = filtered.filter(bib => {
			const distance = bib.event.distance
			return distance >= minDistance && distance <= maxDistance
		})
	}

	// Filter by price range
	if (advancedFilters.price && advancedFilters.price.length === 2) {
		const [minPrice, maxPrice] = advancedFilters.price
		filtered = filtered.filter(bib => bib.price >= minPrice && bib.price <= maxPrice)
	}

	// Filter by region (geography)
	if (Array.isArray(advancedFilters.geography) && advancedFilters.geography.length > 0) {
		filtered = filtered.filter(bib => advancedFilters.geography.includes(bib.event.location.toLowerCase()))
	}

	// Filter by start date
	if (advancedFilters.dateStart) {
		const start = new Date(advancedFilters.dateStart)
		filtered = filtered.filter(bib => new Date(bib.event.date) >= start)
	}

	// Filter by end date
	if (advancedFilters.dateEnd) {
		const end = new Date(advancedFilters.dateEnd)
		filtered = filtered.filter(bib => new Date(bib.event.date) <= end)
	}

	return filtered
}

// Main client component for the marketplace grid and filters
export default function MarketplaceClient({ bibs }: MarketplaceClientProps) {
	// State for sorting, search term, selected sport, selected distance, and advanced filters
	const [sort, setSort] = useState('date')
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedSport, setSelectedSport] = useState<null | string>(null)
	const [selectedDistance, setSelectedDistance] = useState<null | string>(null)
	const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({ price: [0, 200], geography: [] })

	// Extract unique locations from bibs for the region filter
	const uniqueLocations = Array.from(new Set(bibs.map(bib => bib.event.location))).sort()

	// Extract the maximum price from bibs for the price slider
	const maxPrice = Math.max(...bibs.map(bib => bib.price), 0)

	// Memoized filtered and sorted bibs to avoid unnecessary recalculations
	const filteredAndSortedBibs = useMemo(() => {
		const filtered = filterBibs(bibs, searchTerm, selectedSport, selectedDistance, advancedFilters)
		return sortBibs(filtered, sort)
	}, [bibs, searchTerm, selectedSport, selectedDistance, sort, advancedFilters])

	return (
		<div className="flex flex-col space-y-6">
			{/* Searchbar handles search, sport, distance, and advanced filters */}
			<Searchbar
				maxPrice={maxPrice}
				onAdvancedFiltersChange={setAdvancedFilters}
				onDistanceChange={setSelectedDistance}
				onSearch={setSearchTerm}
				onSportChange={setSelectedSport}
				regions={uniqueLocations}
			/>
			{/* OfferCounter displays the number of results and the sort selector */}
			<OfferCounter count={filteredAndSortedBibs.length} onSortChange={setSort} sortValue={sort} />
			{/* Grid of bib cards, responsive layout */}
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{filteredAndSortedBibs.map(bib => (
					<CardMarket bibSale={bib} key={bib.id} />
				))}
			</div>
		</div>
	)
}

// MarketplaceClient: client component for filtering, sorting, and displaying bibs
// Receives bibs as props from the server
// Extracts unique locations and max price for dynamic filters
// Handles all filter and sort state, and passes handlers to Searchbar
