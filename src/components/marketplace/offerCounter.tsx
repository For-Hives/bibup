import React from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Props for OfferCounter: count of bibs, current sort value, and sort change handler
interface OfferCounterProps {
	readonly count: number
	readonly onSortChange: (value: string) => void
	readonly sortValue: string
}

// OfferCounter displays the number of available bibs and a sort dropdown
export default function OfferCounter({ sortValue, onSortChange, count }: OfferCounterProps) {
	let countLabel = ''
	if (count === 0) {
		countLabel = 'Aucun dossard disponible'
	} else if (count === 1) {
		countLabel = '1 dossard disponible'
	} else {
		countLabel = `${count.toLocaleString('fr-FR')} dossards disponibles`
	}
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			{/* Display the number of available bibs, with pluralization */}
			<p className="text-sm text-gray-400">{countLabel}</p>
			{/* Dropdown to select the sort order */}
			<Select onValueChange={onSortChange} value={sortValue}>
				<SelectTrigger className="border-border text-foreground bg-card data-[placeholder]:!text-muted-foreground focus:border-accent focus:ring-accent placeholder:text-muted-foreground w-full border sm:w-48">
					<SelectValue placeholder="Trier par" />
				</SelectTrigger>
				<SelectContent className="border-border bg-card text-foreground">
					<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="date">
						Date de course
					</SelectItem>
					<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="price-asc">
						Prix croissant
					</SelectItem>
					<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="price-desc">
						Prix décroissant
					</SelectItem>
					<SelectItem className="focus:bg-slate-300 focus:text-gray-400" value="distance">
						Distance
					</SelectItem>
				</SelectContent>
			</Select>
		</div>
	)
}
