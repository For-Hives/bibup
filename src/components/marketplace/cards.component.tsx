import { Calendar, MapPin, Users } from 'lucide-react'

import { CardsProps, Sport } from '@/models/marketplace.model'
import Image from 'next/image'
import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Colors for Differents badges
const getSportBadgeClass = (sport: Sport): string => {
	const sportClasses = {
		Running: 'bg-blue-600',
		Trail: 'bg-green-600',
	}
	return sportClasses[sport] || 'bg-purple-600'
}

// Operation to calculte discount
const calculateDiscount = (originalPrice: string, price: string): number => {
	const original = parseFloat(originalPrice.replace('€', ''))
	const current = parseFloat(price.replace('€', ''))
	return Math.round(((original - current) / original) * 100)
}

export default function CardsComponent({ races }: CardsProps) {
	return (
		// Grid
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{/*Loop for each races*/}
			{races.map(race => (
				// Card
				<Link href="/login" key={race.id} passHref>
					<Card className="hover:bg-slate-750 group cursor-pointer overflow-hidden border-slate-700 bg-slate-800 transition-all duration-300 hover:scale-105">
						<div className="relative">
							{/*Race Image*/}
							<Image
								alt={`Image of ${race.name}`}
								className="h-48 w-full object-cover"
								height={200}
								src={race.image ?? '/placeholder.svg'}
								width={300}
							/>
							{/*Colored Badge*/}
							<div className="absolute top-3 left-3">
								<Badge className={`${getSportBadgeClass(race.sport)} text-white`}>{race.sport}</Badge>
							</div>
							{/*Discount*/}
							<div className="absolute top-3 right-3 rounded-full bg-red-600 px-2 py-1 text-sm font-medium text-white">
								-{calculateDiscount(race.originalPrice, race.price)}%
							</div>
							{/*Race Verified logo*/}
							{race.verified && (
								<div className="absolute right-3 bottom-3 rounded-full bg-green-600 p-1 text-white">
									<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
										<path
											clipRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											fillRule="evenodd"
										/>
									</svg>
								</div>
							)}
						</div>

						{/*Content*/}
						<CardContent className="p-4">
							{/*Race Name*/}
							<h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-blue-400">
								{race.name}
							</h3>

							{/*Race Date*/}
							<div className="mb-4 space-y-2">
								<div className="flex items-center text-sm text-slate-400">
									<Calendar className="mr-2 h-4 w-4" />
									{race.date}
								</div>
								{/*Race location and distance*/}
								<div className="flex items-center text-sm text-slate-400">
									<MapPin className="mr-2 h-4 w-4" />
									{race.location} • {race.distance}
								</div>
								{/*Race Participants*/}
								<div className="flex items-center text-sm text-slate-400">
									<Users className="mr-2 h-4 w-4" />
									{race.participants} participants
								</div>
							</div>

							<div className="mb-4 flex items-center justify-between">
								<div className="flex items-center space-x-2">
									{/*Race Price (with discount)*/}
									<span className="text-2xl font-bold text-green-400">{race.price}</span>
									{/*Race Original Price*/}
									<span className="text-sm text-slate-500 line-through">{race.originalPrice}</span>
								</div>
								<div className="text-sm text-slate-400">par {race.seller}</div>
							</div>

							{/*Go to button*/}
							<Button className="w-full bg-blue-600 text-white hover:bg-blue-700">Voir le dossard</Button>
						</CardContent>
					</Card>
				</Link>
			))}
		</div>
	)
}
