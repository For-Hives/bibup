'use client'

import {
	AlertTriangle,
	Calendar,
	Clock,
	DollarSign,
	ExternalLink,
	Globe,
	Mail,
	MapPin,
	Mountain,
	Route,
	Users,
	X,
} from 'lucide-react'

import type { Organizer } from '@/models/organizer.model'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface EventViewProps {
	event: {
		bibPickupLocation?: string
		bibPickupWindowBeginDate?: Date | string
		bibPickupWindowEndDate?: Date | string
		description: string
		distanceKm?: number
		elevationGainM?: number
		eventDate: Date | string
		location: string
		name: string
		officialStandardPrice?: number
		options?: Array<{
			key: string
			label: string
			required: boolean
			values: string[]
		}>
		organizer: string
		parcoursUrl?: string
		participants?: number
		registrationUrl?: string
		transferDeadline?: Date | string
		typeCourse: 'route' | 'trail' | 'triathlon' | 'ultra'
	}
	onClose: () => void
	organizer?: Organizer
}

export function EventView(props: Readonly<EventViewProps>) {
	const { organizer, onClose, event } = props

	const formatDate = (date: Date | string | undefined) => {
		if (!date) return ''
		const d = typeof date === 'string' ? new Date(date) : date
		return d.toLocaleDateString('fr-FR', {
			year: 'numeric',
			weekday: 'long',
			month: 'long',
			day: 'numeric',
		})
	}

	const formatTime = (date: Date | string | undefined) => {
		if (!date) return ''
		const d = typeof date === 'string' ? new Date(date) : date
		return d.toLocaleTimeString('fr-FR', {
			minute: '2-digit',
			hour12: false,
			hour: '2-digit',
		})
	}

	const formatDateTime = (date: Date | string | undefined) => {
		if (!date) return ''
		return `${formatDate(date)} à ${formatTime(date)}`
	}

	const getEventTypeColor = (typeCourse: string) => {
		switch (typeCourse) {
			case 'route':
				return 'bg-blue-500'
			case 'trail':
				return 'bg-green-500'
			case 'triathlon':
				return 'bg-purple-500'
			case 'ultra':
				return 'bg-red-500'
			default:
				return 'bg-gray-500'
		}
	}

	const getEventTypeIcon = (typeCourse: string) => {
		switch (typeCourse) {
			case 'route':
				return <Route className="h-4 w-4" />
			case 'trail':
				return <Mountain className="h-4 w-4" />
			case 'triathlon':
				return <Users className="h-4 w-4" />
			case 'ultra':
				return <AlertTriangle className="h-4 w-4" />
			default:
				return <Route className="h-4 w-4" />
		}
	}

	const isRegistrationOpen = () => {
		if (!event.transferDeadline) return true
		return new Date() < event.transferDeadline
	}

	const isBibPickupActive = () => {
		const now = new Date()
		return now >= event.bibPickupWindowBeginDate && now <= event.bibPickupWindowEndDate
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
			onClick={e => {
				if (e.target === e.currentTarget) {
					onClose()
				}
			}}
		>
			<Card className="flex max-h-[90vh] w-full max-w-2xl flex-col">
				<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
					<div className="flex-1">
						<div className="mb-2 flex items-center gap-2">
							<Badge className={`${getEventTypeColor(event.typeCourse)} text-white`}>
								{getEventTypeIcon(event.typeCourse)}
								<span className="ml-1 capitalize">{event.typeCourse}</span>
							</Badge>
							{!isRegistrationOpen() ? <Badge variant="destructive">Registration Closed</Badge> : null}
							{isBibPickupActive() ? (
								<Badge className="bg-orange-500" variant="default">
									Bib Pickup Open
								</Badge>
							) : null}
						</div>
						<CardTitle className="text-2xl">
							{typeof event.name === 'string' && event.name.length > 0 ? event.name : ''}
						</CardTitle>
					</div>
					<Button onClick={onClose} size="icon" variant="ghost">
						<X className="h-4 w-4" />
					</Button>
				</CardHeader>

				<div className="flex-1 overflow-y-auto">
					<CardContent className="space-y-6">
						{/* Event Details */}
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<Calendar className="text-muted-foreground h-4 w-4" />
									<div>
										<div className="font-medium">{formatDateTime(event.eventDate)}</div>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<MapPin className="text-muted-foreground h-4 w-4" />
									<div className="font-medium">{event.location}</div>
								</div>

								{typeof event.distanceKm === 'number' && !isNaN(event.distanceKm) && (
									<div className="flex items-center gap-2">
										<Route className="text-muted-foreground h-4 w-4" />
										<div>
											<span className="font-medium">{event.distanceKm} km</span>
											{typeof event.elevationGainM === 'number' && !isNaN(event.elevationGainM) && (
												<span className="text-muted-foreground ml-2">(+{event.elevationGainM}m dénivelé)</span>
											)}
										</div>
									</div>
								)}
							</div>

							<div className="space-y-3">
								{typeof event.participants === 'number' && !isNaN(event.participants) && (
									<div className="flex items-center gap-2">
										<Users className="text-muted-foreground h-4 w-4" />
										<div className="font-medium">{event.participants} participants</div>
									</div>
								)}

								{typeof event.officialStandardPrice === 'number' && !isNaN(event.officialStandardPrice) && (
									<div className="flex items-center gap-2">
										<DollarSign className="text-muted-foreground h-4 w-4" />
										<div className="font-medium">{event.officialStandardPrice} €</div>
									</div>
								)}

								{event.transferDeadline && (
									<div className="flex items-center gap-2">
										<Clock className="text-muted-foreground h-4 w-4" />
										<div>
											<div className="text-muted-foreground text-sm">Date limite de transfert</div>
											<div className="font-medium">{formatDate(event.transferDeadline)}</div>
										</div>
									</div>
								)}
							</div>
						</div>

						<Separator />

						{/* Description */}
						<div>
							<h3 className="mb-2 font-semibold">Description</h3>
							<p className="text-muted-foreground leading-relaxed">{event.description}</p>
						</div>

						{/* Registration Options */}
						{Array.isArray(event.options) && event.options.length > 0 ? (
							<>
								<Separator />
								<div>
									<h3 className="mb-3 font-semibold">Options d'inscription</h3>
									<div className="space-y-2">
										{event.options.map(option => (
											<div className="flex items-center justify-between rounded-lg border p-3" key={option.key}>
												<div>
													<div className="font-medium">{option.label}</div>
												</div>
												{Array.isArray(option.values) && option.values.length > 0 ? (
													<div className="font-semibold">{option.values.join(', ')}</div>
												) : null}
											</div>
										))}
									</div>
								</div>
							</>
						) : null}

						{/* Bib Pickup */}
						{typeof event.bibPickupLocation === 'string' && event.bibPickupLocation.length > 0 ? (
							<>
								<Separator />
								<div>
									<h3 className="mb-3 font-semibold">Retrait des dossards</h3>
									<div className="space-y-2">
										<div>
											<span className="font-medium">Lieu : </span>
											{event.bibPickupLocation}
										</div>
										{event.bibPickupWindowBeginDate !== undefined && event.bibPickupWindowEndDate !== undefined ? (
											<div>
												<span className="font-medium">Créneau : </span>
												{formatDateTime(event.bibPickupWindowBeginDate as string)}
												{' - '}
												{formatDateTime(event.bibPickupWindowEndDate as string)}
											</div>
										) : null}
									</div>
								</div>
							</>
						) : null}

						{/* Organizer */}
						{organizer && (
							<>
								<Separator />
								<div>
									<h3 className="mb-3 font-semibold">Organisateur</h3>
									<div className="space-y-2">
										<div className="font-medium">{organizer.name}</div>
										<div className="flex flex-wrap gap-4 text-sm">
											{organizer.email && (
												<div className="flex items-center gap-1">
													<Mail className="h-3 w-3" />
													<a className="text-blue-600 hover:underline" href={`mailto:${organizer.email}`}>
														{organizer.email}
													</a>
												</div>
											)}
											{typeof organizer.website === 'string' && organizer.website.length > 0 && (
												<div className="flex items-center gap-1">
													<Globe className="h-3 w-3" />
													<a
														className="text-blue-600 hover:underline"
														href={organizer.website}
														rel="noopener noreferrer"
														target="_blank"
													>
														Site web
													</a>
												</div>
											)}
										</div>
									</div>
								</div>
							</>
						)}

						{/* Action Buttons */}
						<Separator />
						<div className="flex flex-wrap gap-3">
							{typeof event.registrationUrl === 'string' && event.registrationUrl.length > 0 && isRegistrationOpen() ? (
								<Button asChild>
									<a href={event.registrationUrl} rel="noopener noreferrer" target="_blank">
										<ExternalLink className="mr-2 h-4 w-4" />
										S'inscrire
									</a>
								</Button>
							) : null}
							{typeof event.parcoursUrl === 'string' && event.parcoursUrl.length > 0 && (
								<Button asChild variant="outline">
									<a href={event.parcoursUrl} rel="noopener noreferrer" target="_blank">
										<Route className="mr-2 h-4 w-4" />
										Voir le parcours
									</a>
								</Button>
							)}
						</div>
					</CardContent>
				</div>
			</Card>
		</div>
	)
}
