import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function CountComponent() {
	const races = [
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
	]

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
