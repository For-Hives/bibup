'use client'

import React, { useState } from 'react'
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

export default function Searchbar() {
	// State for the search input value
	const [searchTerm, setSearchTerm] = useState('')
	// State to control the visibility of the filter dropdown
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	// const [sortBy, setSortBy] = useState('Best Match')
	// const [deliveryType, setDeliveryType] = useState('Regular Delivery')

	// State for the currently applied price range (used for the badge and slider sync)
	const [, setPriceRange] = useState([0, 200])
	// State for the filters that are currently applied (displayed as badges)
	const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
		price: [0, 200],
		geography: [],
		dateStart: undefined,
		dateEnd: undefined,
	})

	// Temporary states for the filter dropdown (not applied until 'Apply' is clicked)
	const [tempPrice, setTempPrice] = useState<[number, number]>([0, 200])
	const [tempRegion, setTempRegion] = useState<string[]>([])
	const [tempDateStart, setTempDateStart] = useState<string | undefined>(undefined)
	const [tempDateEnd, setTempDateEnd] = useState<string | undefined>(undefined)

	// States for hover effects on select triggers
	const [isHover, setIsHover] = useState(false)
	const [isHover2, setIsHover2] = useState(false)

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen)
	}

	// Handle input change for the search bar
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value)
	}

	// Handler to remove a geography filter
	const handleRemoveGeography = (location: string) => {
		setSelectedFilters(prev => ({
			...prev,
			geography: prev.geography.filter((item: string) => item !== location),
		}))
	}
	// Handler to reset price filter
	const handleResetPrice = () => {
		setSelectedFilters(prev => ({ ...prev, price: [0, 200] }))
		setPriceRange([0, 200])
	}
	// Handler to remove dateStart filter
	const handleRemoveDateStart = () => {
		setSelectedFilters(prev => ({ ...prev, dateStart: undefined }))
	}
	// Handler to remove dateEnd filter
	const handleRemoveDateEnd = () => {
		setSelectedFilters(prev => ({ ...prev, dateEnd: undefined }))
	}

	return (
		<div className="flex w-full max-w-7xl flex-col rounded-xl bg-white p-4 shadow-md">
			<div className="flex items-center">
				{/* Search Bar Input */}
				<div className="relative flex w-3/4 items-center rounded-lg px-4 py-2">
					<input
						className="block w-full rounded-lg border border-gray-400 bg-gray-50 p-2.5 pr-10 text-sm text-gray-900"
						id="search_input"
						onChange={handleInputChange}
						placeholder="Search..."
						required
						type="text"
						value={searchTerm}
					/>
					{/* Search Button (icon only, not functional) */}
					<button
						className="absolute top-1/2 right-7 flex -translate-y-1/2 items-center text-gray-500 hover:text-gray-600 focus:outline-none"
						// onClick={handleSearch}
						type="submit"
					>
						<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path
								clipRule="evenodd"
								d="M8 4a6 6 0 100 12 6 6 0 000-12zm0 2a4 4 0 100 8 4 4 0 000-8zm5.707 9.293a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414z"
								fillRule="evenodd"
							/>
						</svg>
					</button>
				</div>

				<div className="flex w-1/4 items-center gap-2">
					{/* Example select for sport (not used in filters anymore) */}
					<div className="flex w-1/3 items-center">
						<Select>
							<SelectTrigger
								className="w-40 max-w-[100px] overflow-hidden border-gray-400 text-ellipsis whitespace-nowrap text-gray-400 data-[placeholder]:!text-gray-400"
								onMouseEnter={() => setIsHover2(true)}
								onMouseLeave={() => setIsHover2(false)}
								style={{ backgroundColor: isHover2 ? '#D1D5DB' : '#FFFFFF' }}
							>
								<SelectValue className="text-gray-400" placeholder="Sport" />
							</SelectTrigger>
							<SelectContent className="border-gray-400 bg-white text-gray-400">
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="running">
									Running
								</SelectItem>
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="trail">
									Trail
								</SelectItem>
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="triathlon">
									Triathlon
								</SelectItem>
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="cyclisme">
									Cyclisme
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Example select for distance (not used in filters anymore) */}
					<div className="flex w-1/3 items-center">
						<Select>
							<SelectTrigger
								className="w-40 max-w-[100px] overflow-hidden border-gray-400 bg-slate-700 text-ellipsis whitespace-nowrap text-gray-400 data-[placeholder]:!text-gray-400"
								onMouseEnter={() => setIsHover(true)}
								onMouseLeave={() => setIsHover(false)}
								style={{ backgroundColor: isHover ? '#D1D5DB' : '#FFFFFF' }}
							>
								<SelectValue placeholder="Distance" />
							</SelectTrigger>
							<SelectContent className="border-gray-400 bg-white text-gray-400">
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="5km">
									5km
								</SelectItem>
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="10km">
									10km
								</SelectItem>
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="semi">
									Semi-Marathon
								</SelectItem>
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="marathon">
									Marathon
								</SelectItem>
								<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="ultra">
									Ultra
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Dropdown Filter Button */}
					<div className="relative w-1/3">
						<Button
							className="border border-gray-400 bg-white text-gray-400 hover:bg-gray-300"
							onClick={toggleDropdown}
						>
							Filters
						</Button>
						{/* Dropdown content for filters (price, date, region, distance) */}
						{isDropdownOpen && (
							<div className="absolute z-10 mt-2 w-64 rounded-lg border border-gray-400 bg-white p-4 text-gray-400 shadow-lg">
								{/* Price Range Filter */}
								<div className="mb-4">
									<label className="mb-2 font-semibold" htmlFor="price-range-slider">
										Price Range
									</label>
									<input
										className="h-2 w-full appearance-none rounded-full bg-gray-300"
										id="price-range-slider"
										max={200}
										min={0}
										onChange={e => setTempPrice([0, +e.target.value])}
										style={{
											background: `linear-gradient(to right, #2563EB 0%, #2563EB ${((tempPrice[1] / 200) * 100).toFixed(0)}%, #E5E7EB ${((tempPrice[1] / 200) * 100).toFixed(0)}%, #E5E7EB 100%)`,
										}}
										type="range"
										value={tempPrice[1]}
									/>
									<div className="mt-1 flex justify-between text-sm">
										<span>0€</span>
										<span>{tempPrice[1]}€</span>
									</div>
								</div>

								{/* Date Range Filter */}
								<div className="flex flex-col justify-between text-sm">
									<label className="mb-2 block text-lg font-medium text-slate-300" htmlFor="date-start">
										Date
									</label>
									<div className="w-full flex-col space-y-2">
										<input
											className="h-10 w-full rounded border border-slate-600 bg-white text-center text-gray-400 focus:border-gray-400"
											id="date-start"
											onChange={e => setTempDateStart(e.target.value)}
											type="date"
											value={tempDateStart ?? ''}
										/>
										<input
											className="h-10 w-full rounded border border-slate-600 bg-white text-center text-gray-400 focus:border-gray-400"
											id="date-end"
											onChange={e => setTempDateEnd(e.target.value)}
											type="date"
											value={tempDateEnd ?? ''}
										/>
									</div>
								</div>

								{/* Region Filter */}
								<div>
									<label className="mb-2 block text-lg font-medium text-slate-300" htmlFor="region-select">
										Région
									</label>
									<Select onValueChange={value => setTempRegion(value ? [value] : [])} value={tempRegion[0] || ''}>
										<SelectTrigger
											className="w-full border-gray-400 bg-slate-700 text-gray-400 data-[placeholder]:!text-gray-400"
											id="region-select"
											style={{ backgroundColor: isHover ? '#D1D5DB' : '#FFFFFF' }}
										>
											<SelectValue placeholder="Toutes les régions" />
										</SelectTrigger>
										<SelectContent className="border-gray-400 bg-white text-gray-400">
											<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="idf">
												Île-de-France
											</SelectItem>
											<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="paca">
												PACA
											</SelectItem>
											<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="ara">
												Auvergne-Rhône-Alpes
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{/* Apply Button: applies the temporary filter states to the global filters */}
								<div className="mt-4">
									<Button
										className="w-full border border-gray-400 bg-white text-gray-400 hover:bg-slate-200"
										onClick={() => {
											setSelectedFilters({
												price: tempPrice,
												geography: tempRegion,
												dateStart: tempDateStart,
												dateEnd: tempDateEnd,
											})
											setPriceRange(tempPrice)
											setIsDropdownOpen(false)
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

			<hr className="border-gray-400" />

			{/* Selected Filters as Badges (only price, region, and dates) */}
			<div className="mt-4 flex flex-wrap gap-2">
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
					{selectedFilters.price[0] === 0 && selectedFilters.price[1] === 200
						? 'All prices'
						: `Prix: 0€ - ${selectedFilters.price[1]}€`}
					<button
						aria-label="Reset price filter"
						className="ml-1 flex h-3 w-3 cursor-pointer items-center justify-center"
						onClick={handleResetPrice}
						type="button"
					>
						<X />
					</button>
				</Badge>
				{/* Date filter badges */}
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
