import { CardsProps } from '@/models/marketplace.model'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function CountRaceComponent({ races }: CardsProps) {
	return (
		<div className="mb-6 flex items-center justify-between">
			<p className="text-slate-300">{races.length} dossards disponibles</p>
			<Select>
				<SelectTrigger className="w-48 border-slate-600 bg-slate-800 text-white">
					<SelectValue placeholder="Trier par" />
				</SelectTrigger>
				<SelectContent className="border-slate-600 bg-slate-700">
					<SelectItem value="date">Date de course</SelectItem>
					<SelectItem value="price-asc">Prix croissant</SelectItem>
					<SelectItem value="price-desc">Prix décroissant</SelectItem>
					<SelectItem value="distance">Distance</SelectItem>
				</SelectContent>
			</Select>
		</div>
	)
}
