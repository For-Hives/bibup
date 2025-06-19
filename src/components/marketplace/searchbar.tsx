'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Type for the filters that can be applied
type SelectedFilters = {
	dateEnd?: string
	dateStart?: string
	geography: string[]
	price: number[]
}

interface SearchbarProps {
	readonly onSearch: (value: string) => void
	readonly onSportChange: (sport: string | null) => void
	readonly onDistanceChange: (distance: string | null) => void
	readonly onAdvancedFiltersChange?: (filters: SelectedFilters) => void
	readonly regions?: string[]
	readonly maxPrice?: number
}

// Main searchbar component that handles filtering and searching functionality
// Switches from a stacked layout on mobile to a horizontal layout on desktop (>1280px)
export default function Searchbar({ onSearch, onSportChange, onDistanceChange, onAdvancedFiltersChange, regions = [], maxPrice = 200 }: SearchbarProps) {
	// State management for search and filters
	// searchTerm: value of the main search input
	// isDropdownOpen: controls visibility of advanced filters
	// selectedFilters: main state for all applied filters (used for badges and filtering)
	// tempPrice, tempRegion, tempDateStart, tempDateEnd: temporary states for advanced filters before applying
	// isHover, isHover2: hover states for select triggers
	const [searchTerm, setSearchTerm] = useState('') // Stores the current search input value
	const [isDropdownOpen, setIsDropdownOpen] = useState(false) // Controls the visibility of the filter dropdown

	// State for the price range filter
	const [, setPriceRange] = useState([0, 200])

	// Main state object that stores all currently applied filters
	// These filters are displayed as badges and used for filtering the results
	const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
		price: [0, maxPrice],
		geography: [],
		dateStart: undefined,
		dateEnd: undefined,
	})

	// Temporary states for the filter dropdown
	// These states are only applied when clicking the "Apply" button
	// This allows users to modify filters without affecting the results until they're ready
	const [tempPrice, setTempPrice] = useState<[number, number]>([0, maxPrice])
	const [tempRegion, setTempRegion] = useState<string[]>([])
	const [tempDateStart, setTempDateStart] = useState<string | undefined>(undefined)
	const [tempDateEnd, setTempDateEnd] = useState<string | undefined>(undefined)

	// States for hover effects on select triggers
	const [isHover, setIsHover] = useState(false)
	const [isHover2, setIsHover2] = useState(false)

	// Toggle function for the filter dropdown
	const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

	// Handler for search input changes
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value)
		onSearch(e.target.value)
	}

	// Filter removal handlers
	// These functions remove individual filters when clicking the X on their badges
	const handleRemoveGeography = (location: string) => {
		setSelectedFilters(prev => ({
			...prev,
			geography: prev.geography.filter((item: string) => item !== location),
		}))
	}

	const handleResetPrice = () => {
		setSelectedFilters(prev => {
			const updated = { ...prev, price: [0, maxPrice] }
			setPriceRange([0, maxPrice])
			setTempPrice([0, maxPrice])
			return updated
		})
	}

	const handleRemoveDateStart = () => {
		setSelectedFilters(prev => ({ ...prev, dateStart: undefined }))
	}

	const handleRemoveDateEnd = () => {
		setSelectedFilters(prev => ({ ...prev, dateEnd: undefined }))
	}

	// Synchronize price filters with maxPrice when it changes
	useEffect(() => {
		setSelectedFilters(prev => ({ ...prev, price: [0, maxPrice] }))
		setTempPrice([0, maxPrice])
		setPriceRange([0, maxPrice])
	}, [maxPrice])

	// Notify parent when selectedFilters changes
	useEffect(() => {
		if (onAdvancedFiltersChange) onAdvancedFiltersChange(selectedFilters)
	}, [selectedFilters, onAdvancedFiltersChange])

	return (
		// Main container with responsive padding and shadow
		<div className="flex w-full max-w-7xl flex-col rounded-xl bg-card/80 border border-border p-2 shadow-md xl:p-4 backdrop-blur-md">
			{/* Main content wrapper - switches from column to row layout on desktop */}
			<div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:gap-4">
				{/* Search input section - takes 3/4 of the width on desktop */}
				<div className="relative flex w-full items-center rounded-lg px-2 py-2 xl:w-3/4 xl:px-4">
					<input
						className="block w-full rounded-lg border border-border bg-card/60 p-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent"
						id="search_input"
						onChange={handleInputChange}
						placeholder="Rechercher une course, une ville, ..."
						required
						type="text"
						value={searchTerm}
					/>
				</div>

				{/* Filters section - takes 1/4 of the width on desktop */}
				<div className="flex w-full items-center gap-2 xl:w-1/4 xl:gap-4">
					{/* Sport dropdown - takes 1/3 of the filters section */}
					<div className="w-1/3">
						<Select onValueChange={value => onSportChange(value || null)}>
							<SelectTrigger
								className="h-9 w-full overflow-hidden border border-border text-ellipsis whitespace-nowrap text-foreground bg-card data-[placeholder]:!text-muted-foreground focus:border-accent focus:ring-accent placeholder:text-muted-foreground"
								onMouseEnter={() => setIsHover2(true)}
								onMouseLeave={() => setIsHover2(false)}
								style={{ backgroundColor: isHover2 ? 'rgba(var(--accent),0.08)' : 'var(--card)' }}
							>
								<SelectValue className="text-foreground" placeholder="Sport" />
							</SelectTrigger>
							<SelectContent className="border-border bg-card text-foreground">
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="all">
									Tous les sports
								</SelectItem>
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="running">
									Running
								</SelectItem>
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="trail">
									Trail
								</SelectItem>
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="triathlon">
									Triathlon
								</SelectItem>
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="cycling">
									Cyclisme
								</SelectItem>
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="swimming">
									Natation
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Distance dropdown - takes 1/3 of the filters section */}
					<div className="w-1/3">
						<Select onValueChange={value => onDistanceChange(value || null)}>
							<SelectTrigger
								className="h-9 w-full overflow-hidden border border-border text-ellipsis whitespace-nowrap text-foreground bg-card data-[placeholder]:!text-muted-foreground focus:border-accent focus:ring-accent placeholder:text-muted-foreground"
								onMouseEnter={() => setIsHover(true)}
								onMouseLeave={() => setIsHover(false)}
								style={{ backgroundColor: isHover ? 'rgba(var(--accent),0.08)' : 'var(--card)' }}
							>
								<SelectValue placeholder="Distance" />
							</SelectTrigger>
							<SelectContent className="border-border bg-card text-foreground">
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="all">
									Toutes les distances
								</SelectItem>
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="5">
									5km
								</SelectItem>
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="10">
									10km
								</SelectItem>
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="21">
									Semi-Marathon
								</SelectItem>
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="42">
									Marathon
								</SelectItem>
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="80">
									Ultra (+80km)
								</SelectItem>
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="tri-s">
									Triathlon S
								</SelectItem>
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="tri-m">
									Triathlon M
								</SelectItem>
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="tri-l">
									Triathlon L
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Filter button with dropdown - takes 1/3 of the filters section */}
					<div className="relative w-1/3">
						<Button
							className="h-9 w-full border border-border bg-card text-foreground hover:bg-card/80 px-3 py-0"
							onClick={toggleDropdown}
						>
							Filters
						</Button>
						{/* Advanced filters dropdown - appears when clicking the Filters button */}
						{isDropdownOpen && (
							<div className="absolute right-0 z-10 mt-2 w-full min-w-[220px] rounded-lg border border-border bg-card p-4 text-foreground shadow-lg xl:w-64">
								{/* Price range slider */}
								<div className="mb-4">
									<label className="mb-2 font-semibold" htmlFor="price-range-slider">
										Price Range
									</label>
									<input
										className="h-2 w-full appearance-none rounded-full bg-accent/30"
										id="price-range-slider"
										min={0}
										max={maxPrice}
										onChange={e => setTempPrice([0, +e.target.value])}
										style={{
											background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((tempPrice[1] / maxPrice) * 100).toFixed(0)}%, #E5E7EB ${((tempPrice[1] / maxPrice) * 100).toFixed(0)}%, #E5E7EB 100%)`,
										}}
										type="range"
										value={tempPrice[1]}
									/>
									<div className="mt-1 flex justify-between text-sm">
										<span>0€</span>
										<span>{tempPrice[1]}€</span>
									</div>
								</div>

								{/* Date range inputs */}
								<div className="flex flex-col justify-between text-sm">
									<label className="mb-2 block text-lg font-medium text-muted-foreground" htmlFor="date-start">
										Date
									</label>
									<div className="w-full flex-col space-y-2">
										<input
											className="h-10 w-full rounded border border-border bg-card/60 text-center text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent"
											id="date-start"
											onChange={e => setTempDateStart(e.target.value)}
											type="date"
											value={tempDateStart ?? ''}
										/>
										<input
											className="h-10 w-full rounded border border-border bg-card/60 text-center text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent"
											id="date-end"
											onChange={e => setTempDateEnd(e.target.value)}
											type="date"
											value={tempDateEnd ?? ''}
										/>
									</div>
								</div>

								{/* Region selector */}
								<div>
									<label className="mb-2 block text-lg font-medium text-muted-foreground" htmlFor="region-select">
										Région
									</label>
									<Select onValueChange={value => setTempRegion(value ? [value] : [])} value={tempRegion[0] || ''}>
										<SelectTrigger
											className="w-full border border-border bg-card/60 text-foreground data-[placeholder]:!text-muted-foreground focus:border-accent focus:ring-accent"
											id="region-select"
										>
											<SelectValue placeholder="Toutes les régions" />
										</SelectTrigger>
										<SelectContent className="border-border bg-card/80 text-foreground">
											{regions.length === 0 ? (
												<SelectItem value="" disabled>Aucune région</SelectItem>
											) : (
												regions.map(region => (
													<SelectItem key={region} value={region.toLowerCase()} className="focus:bg-slate-300 focus:text-gray-400">
														{region}
													</SelectItem>
												))
											)}
										</SelectContent>
									</Select>
								</div>

								{/* Apply button - updates the main filters state with temporary values */}
								<div className="mt-4">
									<Button
										className="w-full border border-border bg-accent/20 text-accent-foreground hover:bg-accent/30"
										onClick={() => {
											const newFilters = {
												price: tempPrice,
												geography: tempRegion,
												dateStart: tempDateStart,
												dateEnd: tempDateEnd,
											}
											setSelectedFilters(newFilters)
											setPriceRange(tempPrice)
											setIsDropdownOpen(false)
											if (onAdvancedFiltersChange) {
												onAdvancedFiltersChange(newFilters)
											}
										}}
									>
										Apply
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Divider between search/filters and filter badges */}
			<hr className="my-2 border-gray-400" />

			{/* Filter badges section - shows currently applied filters */}
			<div className="mt-4 flex flex-wrap gap-2 xl:mt-0 xl:gap-4">
				{/* Region filter badges */}
				{selectedFilters.geography.map(location => (
					<Badge
						className="max-w-[100px] overflow-hidden bg-blue-400 text-ellipsis whitespace-nowrap text-white"
						key={location}
						variant="secondary"
					>
						{location}
						<button
							aria-label="Remove geography filter"
							className="ml-1 flex h-3 w-3 cursor-pointer items-center justify-center"
							onClick={() => handleRemoveGeography(location)}
							type="button"
						>
							<X />
						</button>
					</Badge>
				))}
				{/* Price filter badge */}
				<Badge className="bg-yellow-400 text-white" key="price" variant="secondary">
					{selectedFilters.price[0] === 0 && selectedFilters.price[1] === maxPrice
						? 'All prices'
						: `Prix: ${selectedFilters.price[0]}€ - ${selectedFilters.price[1]}€`}
					<button
						aria-label="Reset price filter"
						className="ml-1 flex h-3 w-3 cursor-pointer items-center justify-center"
						onClick={handleResetPrice}
						type="button"
					>
						<X />
					</button>
				</Badge>
				{/* Start date filter badge */}
				{selectedFilters.dateStart != null && selectedFilters.dateStart !== '' && (
					<Badge className="bg-gray-400 text-white" key="dateStart" variant="secondary">
						{`Début: ${selectedFilters.dateStart}`}
						<button
							aria-label="Remove start date filter"
							className="ml-1 flex h-3 w-3 cursor-pointer items-center justify-center"
							onClick={handleRemoveDateStart}
							type="button"
						>
							<X />
						</button>
					</Badge>
				)}
				{/* End date filter badge */}
				{selectedFilters.dateEnd != null && selectedFilters.dateEnd !== '' && (
					<Badge className="bg-gray-400 text-white" key="dateEnd" variant="secondary">
						{`Fin: ${selectedFilters.dateEnd}`}
						<button
							aria-label="Remove end date filter"
							className="ml-1 flex h-3 w-3 cursor-pointer items-center justify-center"
							onClick={handleRemoveDateEnd}
							type="button"
						>
							<X />
						</button>
					</Badge>
				)}
			</div>
		</div>
	)
}
