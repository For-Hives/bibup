import { Filter, Search, X } from 'lucide-react'
import { useState } from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function SearchFilterComponent() {
	const [selectedFilters, setSelectedFilters] = useState({
		distance: ['Marathon', 'Semi-Marathon', '10km'],
		geography: ['Paris', 'Lyon', 'Nice'],
		sport: ['Running', 'Trail'],
		price: [0, 200],
	})

	const [showFilters, setShowFilters] = useState(false)

	const removeFilter = (category: keyof typeof selectedFilters, value: string) => {
		setSelectedFilters(prev => ({
			...prev,
			[category]: (prev[category] as string[]).filter((item: string) => item !== value),
		}))
	}
	return (
		<div className="mb-8 rounded-xl bg-slate-800 p-6">
			{/* Search and Filters Bar */}
			<div className="flex flex-col gap-4 lg:flex-row">
				{/* Search Field */}
				<div className="relative flex-1">
					<Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-slate-400" />
					<Input
						className="border-slate-600 bg-slate-700 pl-12 text-white placeholder:text-slate-400"
						placeholder="Rechercher une course..."
					/>
				</div>
				{/* Filters */}
				<div className="flex gap-3">
					<Select>
						<SelectTrigger className="w-40 border-slate-600 bg-slate-700 text-white">
							<SelectValue placeholder="Sport" />
						</SelectTrigger>
						<SelectContent className="border-slate-600 bg-slate-700">
							<SelectItem value="running">Running</SelectItem>
							<SelectItem value="trail">Trail</SelectItem>
							<SelectItem value="triathlon">Triathlon</SelectItem>
							<SelectItem value="cyclisme">Cyclisme</SelectItem>
						</SelectContent>
					</Select>

					<Select>
						<SelectTrigger className="w-40 border-slate-600 bg-slate-700 text-white">
							<SelectValue placeholder="Distance" />
						</SelectTrigger>
						<SelectContent className="border-slate-600 bg-slate-700">
							<SelectItem value="5km">5km</SelectItem>
							<SelectItem value="10km">10km</SelectItem>
							<SelectItem value="semi">Semi-Marathon</SelectItem>
							<SelectItem value="marathon">Marathon</SelectItem>
							<SelectItem value="ultra">Ultra</SelectItem>
						</SelectContent>
					</Select>

					<Button
						className="border-slate-600 text-slate-300 hover:bg-slate-700"
						onClick={() => setShowFilters(!showFilters)}
						variant="outline"
					>
						<Filter className="mr-2 h-4 w-4" />
						Filtres
					</Button>
				</div>
				{/*Not Sure if it's useful ??*/}
				Active Filters
				{(selectedFilters.geography.length > 0 || selectedFilters.distance.length > 0) && (
					<div className="mt-4 flex flex-wrap gap-2 border-t border-slate-700 pt-4">
						{selectedFilters.geography.map(location => (
							<Badge className="bg-blue-600 text-white" key={location} variant="secondary">
								{location}
								<X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeFilter('geography', location)} />
							</Badge>
						))}
						{selectedFilters.distance.map(distance => (
							<Badge className="bg-green-600 text-white" key={distance} variant="secondary">
								{distance}
								<X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeFilter('distance', distance)} />
							</Badge>
						))}
					</div>
				)}
			</div>

			{/* Advanced Filters */}
			{showFilters && (
				<div className="mt-4 rounded-xl bg-slate-800 p-6">
					<h3 className="mb-4 font-semibold text-white">Filtres avancés</h3>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
						<div>
							<label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="price-slider">
								Prix (€)
							</label>
							<Slider
								className="mb-2"
								id="price-slider"
								max={500}
								onValueChange={value => setSelectedFilters(prev => ({ ...prev, price: value }))}
								step={10}
								value={selectedFilters.price}
							/>
							<div className="flex justify-between text-sm text-slate-400">
								<span>{selectedFilters.price[0]}€</span>
								<span>{selectedFilters.price[1]}€</span>
							</div>
						</div>

						<div>
							<label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="start-date">
								Date de début
							</label>
							<Input className="border-slate-600 bg-slate-700 text-white" id="start-date" type="date" />
							<label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="end-date">
								Date de fin
							</label>
							<Input className="border-slate-600 bg-slate-700 text-white" id="end-date" type="date" />
						</div>

						<div>
							<label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="region-select">
								Région
							</label>
							<Select>
								<SelectTrigger className="border-slate-600 bg-slate-700 text-white" id="region-select">
									<SelectValue placeholder="Toutes les régions" />
								</SelectTrigger>
								<SelectContent className="border-slate-600 bg-slate-700">
									<SelectItem value="idf">Île-de-France</SelectItem>
									<SelectItem value="paca">PACA</SelectItem>
									<SelectItem value="ara">Auvergne-Rhône-Alpes</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
