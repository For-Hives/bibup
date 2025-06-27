'use client'

import React, { useMemo } from 'react'

import { parseAsArrayOf, parseAsFloat, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs'
import Fuse from 'fuse.js'

import type { BibSale } from '@/components/marketplace/CardMarket'

import OfferCounter from '@/components/marketplace/offerCounter'
import CardMarket from '@/components/marketplace/CardMarket'
import { Locale } from '@/lib/i18n-config'

import Searchbar from './searchbar'

// Type for advanced filters (same as in Searchbar) 🧐
type AdvancedFilters = {
	dateEnd?: string
	dateStart?: string
	geography: string[]
	price: number[]
}

// Props for the MarketplaceClient: receives an array of bibs to display 🛍️
interface MarketplaceClientProps {
	readonly bibs: BibSale[]
	locale: Locale
}

// --- Helper function to get the min/max range for each distance filter 📏
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
			return [110, 115] // Half Ironman total 💪
		case 'tri-m':
			return [50, 55] // Olympic distance total 🏊🚴🏃
		case 'tri-s':
			return [25, 30] // Sprint distance total 💨
		default:
			return [0, Infinity]
	}
}

// --- Helper function to sort bibs according to the selected sort option 🔄
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

// --- Main client component for the marketplace grid and filters 🖼️

export default function MarketplaceClient({ locale, bibs }: Readonly<MarketplaceClientProps>) {
	// TODO: translations -> locale 🌐
	// --- Query state management with URL sync using nuqs 🔗
	const [{ sport, sort, search, priceMin, priceMax, geography, distance, dateStart, dateEnd }, setFilters] =
		useQueryStates(
			{
				sport: parseAsString, // null when not set, string when set
				sort: parseAsStringLiteral(['date', 'distance', 'price-asc', 'price-desc'] as const).withDefault('date'),
				search: parseAsString.withDefault(''),
				priceMin: parseAsFloat.withDefault(0),
				priceMax: parseAsFloat.withDefault(200),
				geography: parseAsArrayOf(parseAsString, ',').withDefault([]),
				distance: parseAsString, // null when not set, string when set
				dateStart: parseAsString, // ISO date string or null
				dateEnd: parseAsString, // ISO date string or null
			},
			{
				history: 'push', // Use push for better UX
			}
		)

	// --- Extract unique locations from bibs for the region filter 🗺️
	const uniqueLocations = Array.from(new Set(bibs.map(bib => bib.event.location))).sort((a, b) => a.localeCompare(b)) // Unique, sorted list of locations 📍

	// --- Extract the maximum price from bibs for the price slider 💰
	const maxPrice = Math.max(...bibs.map(bib => bib.price), 0) // Maximum price for slider 💸

	// --- Handler functions to bridge the component interface with nuqs 🔗
	const handleSearch = React.useCallback(
		(searchTerm: string) => {
			void setFilters({ search: searchTerm })
		},
		[setFilters]
	)

	const handleSportChange = React.useCallback(
		(sportType: null | string) => {
			void setFilters({ sport: sportType })
		},
		[setFilters]
	)

	const handleDistanceChange = React.useCallback(
		(distanceFilter: null | string) => {
			void setFilters({ distance: distanceFilter })
		},
		[setFilters]
	)

	const handleSortChange = React.useCallback(
		(sortOption: string) => {
			void setFilters({ sort: sortOption as 'date' | 'distance' | 'price-asc' | 'price-desc' })
		},
		[setFilters]
	)

	const handleAdvancedFiltersChange = React.useCallback(
		(filters: AdvancedFilters) => {
			// Use a single update to prevent multiple re-renders
			void setFilters({
				priceMin: filters.price[0] ?? 0,
				priceMax: filters.price[1] ?? 200,
				geography: filters.geography,
				dateStart: filters.dateStart ?? null,
				dateEnd: filters.dateEnd ?? null,
			})
		},
		[setFilters]
	)

	// --- Fuse.js instance for fuzzy search on bibs (name, location, type) ✨
	const fuse = useMemo(
		() =>
			new Fuse(bibs, {
				threshold: 0.4,
				keys: ['event.name', 'event.location', 'event.type'],
			}),
		[bibs]
	)

	// --- Memoized filtered and sorted bibs to avoid unnecessary recalculations 🧠
	const filteredAndSortedBibs = useMemo(() => {
		let filtered = bibs

		// --- Fuzzy search with Fuse.js on search term 🔍
		if (search !== '') {
			const fuseResults = fuse.search(search)
			filtered = fuseResults.map(result => result.item)
		}

		// --- Filter by selected sport 🏅
		if (sport !== null && sport !== undefined && sport !== 'all') {
			filtered = filtered.filter(bib => bib.event.type === sport)
		}

		// --- Filter by selected distance 📏
		if (distance !== null && distance !== undefined && distance !== 'all') {
			const [minDistance, maxDistance] = getDistanceRange(distance)
			filtered = filtered.filter(bib => {
				const eventDistance = bib.event.distance
				return eventDistance >= minDistance && eventDistance <= maxDistance
			})
		}

		// --- Filter by price range 💰
		filtered = filtered.filter(bib => bib.price >= priceMin && bib.price <= priceMax)

		// --- Filter by region (geography) 🗺️
		if (geography.length > 0) {
			filtered = filtered.filter(bib => geography.includes(bib.event.location.toLowerCase()))
		}

		// --- Filter by start date 📅
		if (dateStart !== null && dateStart !== undefined && dateStart !== '') {
			const start = new Date(dateStart)
			filtered = filtered.filter(bib => new Date(bib.event.date) >= start)
		}

		// --- Filter by end date 📅
		if (dateEnd !== null && dateEnd !== undefined && dateEnd !== '') {
			const end = new Date(dateEnd)
			filtered = filtered.filter(bib => new Date(bib.event.date) <= end)
		}

		// --- Sort the filtered bibs 🔄
		return sortBibs(filtered, sort)
	}, [bibs, search, sport, distance, sort, priceMin, priceMax, geography, dateStart, dateEnd, fuse])

	// --- Main render: searchbar, offer counter, and grid of bib cards 🖼️
	return (
		<div className="flex flex-col space-y-6 pt-8">
			{/* Wrapper Searchbar with high z-index to ensure dropdown visibility ⬆️ */}
			<div className="relative z-[60]">
				<Searchbar
					maxPrice={maxPrice}
					onAdvancedFiltersChange={handleAdvancedFiltersChange}
					onDistanceChange={handleDistanceChange}
					onSearch={handleSearch}
					onSportChange={handleSportChange}
					regions={uniqueLocations}
				/>
			</div>
			{/* OfferCounter displays the number of results and the sort selector 🔢 */}
			<OfferCounter count={filteredAndSortedBibs.length} onSortChange={handleSortChange} sortValue={sort} />
			{/* Grid of bib cards, responsive layout 🖼️ */}
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{filteredAndSortedBibs.map(bib => (
					<CardMarket bibSale={bib} key={bib.id} locale={locale} />
				))}
			</div>
		</div>
	)
}

// MarketplaceClient: client component for filtering, sorting, and displaying bibs 🛍️
// Receives bibs as props from the server 📦
// Extracts unique locations and max price for dynamic filters 🗺️💰
// Handles all filter and sort state, and passes handlers to Searchbar ⚙️
