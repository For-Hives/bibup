'use client'

import { Calendar, Eye, Plus, Search, Users } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

import type { Event } from '@/models/event.model'
import type { User } from '@/models/user.model'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

import { getAllEventsAction } from '../../../app/admin/actions'

interface AdminEventsPageClientProps {
	currentUser: null | User
	translations: EventsTranslations
}

interface EventsStats {
	activeEvents: number
	draftEvents: number
	partneredEvents: number
	pastEvents: number
	totalEvents: number
	upcomingEvents: number
}

interface EventsTranslations {
	events: {
		actions: {
			createEvent: string
			createEventDescription: string
			importEvents: string
			importEventsDescription: string
			manageCategories: string
			manageCategoriesDescription: string
		}
		filters: {
			active: string
			all: string
			partnered: string
			past: string
			search: string
			upcoming: string
		}
		sections: {
			actions: {
				description: string
				title: string
			}
			overview: {
				description: string
				title: string
			}
		}
		stats: {
			activeEvents: string
			draftEvents: string
			partneredEvents: string
			pastEvents: string
			totalEvents: string
			upcomingEvents: string
		}
		subtitle: string
		table: {
			actions: {
				delete: string
				duplicate: string
				edit: string
				view: string
			}
			columns: {
				actions: string
				date: string
				location: string
				name: string
				participants: string
				partnered: string
				status: string
				type: string
			}
			empty: {
				createButton: string
				description: string
				title: string
			}
			status: {
				active: string
				cancelled: string
				draft: string
				past: string
				upcoming: string
			}
		}
		title: string
		ui: {
			comingSoon: string
			loading: string
			refreshing: string
		}
	}
}

export default function AdminEventsPageClient({ translations: t, currentUser }: AdminEventsPageClientProps) {
	const router = useRouter()
	const [events, setEvents] = useState<Event[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [stats, setStats] = useState<EventsStats | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				setIsLoading(true)
				const result = await getAllEventsAction()

				if (result.success && result.data) {
					const eventsData = result.data
					setEvents(eventsData)

					// Calculate stats
					const now = new Date()
					const statsData: EventsStats = {
						upcomingEvents: eventsData.filter((event: Event) => new Date(event.eventDate) >= now).length,
						totalEvents: eventsData.length,
						pastEvents: eventsData.filter((event: Event) => new Date(event.eventDate) < now).length,
						partneredEvents: eventsData.filter((event: Event) => event.isPartnered).length,
						draftEvents: 0, // Will be implemented later with event status field
						activeEvents: eventsData.filter((event: Event) => new Date(event.eventDate) >= now && event.isPartnered)
							.length,
					}
					setStats(statsData)
				} else {
					console.error('Error fetching events:', result.error)
					setEvents([])
					setStats({
						upcomingEvents: 0,
						totalEvents: 0,
						pastEvents: 0,
						partneredEvents: 0,
						draftEvents: 0,
						activeEvents: 0,
					})
				}
			} catch (error) {
				console.error('Error fetching events:', error)
				setEvents([])
				setStats({
					upcomingEvents: 0,
					totalEvents: 0,
					pastEvents: 0,
					partneredEvents: 0,
					draftEvents: 0,
					activeEvents: 0,
				})
			} finally {
				setIsLoading(false)
			}
		}

		void fetchEvents()
	}, [])

	// Safety check - if currentUser is null, show error
	if (!currentUser) {
		return (
			<div className="from-background via-destructive/5 to-background relative min-h-screen bg-gradient-to-br">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
				<div className="relative flex min-h-screen items-center justify-center">
					<div className="border-border/50 bg-card/80 w-full max-w-md rounded-3xl border p-8 text-center shadow-[0_0_0_1px_hsl(var(--border)),inset_0_0_30px_hsl(var(--destructive)/0.1),inset_0_0_60px_hsl(var(--accent)/0.05),0_0_50px_hsl(var(--destructive)/0.2)] backdrop-blur-md">
						<div className="mb-6 text-6xl text-red-600 dark:text-red-400">⚠</div>
						<h1 className="text-foreground mb-4 text-3xl font-bold">Access Error</h1>
						<p className="text-muted-foreground mb-6 text-lg">
							Unable to verify admin access. Please try logging in again.
						</p>
						<button
							className="bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 text-white"
							onClick={() => router.push('/sign-in')}
						>
							Sign In
						</button>
					</div>
				</div>
			</div>
		)
	}

	if (isLoading) {
		return (
			<div className="from-background via-primary/5 to-background relative min-h-screen bg-gradient-to-br">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
				<div className="relative pt-32 pb-12">
					<div className="container mx-auto max-w-7xl p-6">
						<div className="space-y-8">
							<div className="space-y-2 text-center">
								<div className="mx-auto h-12 w-96 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
								<div className="mx-auto h-6 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
							</div>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
								{Array.from({ length: 6 }).map((_, i) => (
									<div className="h-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" key={i}></div>
								))}
							</div>
							<div className="h-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	const filteredEvents = events.filter((event: Event) => {
		const matchesSearch =
			event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			event.location.toLowerCase().includes(searchQuery.toLowerCase())

		if (!matchesSearch) return false

		const now = new Date()
		const eventDate = new Date(event.eventDate)

		switch (statusFilter) {
			case 'active':
				return eventDate >= now && event.isPartnered
			case 'partnered':
				return event.isPartnered
			case 'past':
				return eventDate < now
			case 'upcoming':
				return eventDate >= now
			default:
				return true
		}
	})

	const getEventStatus = (event: Event) => {
		const now = new Date()
		const eventDate = new Date(event.eventDate)

		if (eventDate < now) return 'past'
		if (event.isPartnered && eventDate >= now) return 'active'
		if (eventDate >= now) return 'upcoming'
		return 'draft'
	}

	const getStatusBadge = (status: string) => {
		const baseClasses = 'text-xs font-medium px-2 py-1 rounded-full'

		switch (status) {
			case 'active':
				return (
					<Badge className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}>
						{t.events.table.status.active}
					</Badge>
				)
			case 'past':
				return (
					<Badge className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`}>
						{t.events.table.status.past}
					</Badge>
				)
			case 'upcoming':
				return (
					<Badge className={`${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`}>
						{t.events.table.status.upcoming}
					</Badge>
				)
			default:
				return (
					<Badge className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`}>
						{t.events.table.status.draft}
					</Badge>
				)
		}
	}

	return (
		<div className="from-background via-primary/5 to-background relative min-h-screen bg-gradient-to-br">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

			{/* Admin header with user info */}
			<div className="bg-card/25 border-border/30 absolute top-0 right-0 left-0 z-20 mx-4 mt-12 mb-6 rounded-2xl border p-4 backdrop-blur-sm">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-muted-foreground text-sm">Connected as</p>
						<p className="text-foreground font-medium">
							{currentUser.firstName} {currentUser.lastName} ({currentUser.email})
						</p>
					</div>
					<div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
						{currentUser.role.toUpperCase()}
					</div>
				</div>
			</div>

			{/* Main content */}
			<div className="relative pt-32 pb-12">
				<div className="container mx-auto max-w-7xl p-6">
					<div className="space-y-8">
						{/* Header */}
						<div className="space-y-2 text-center">
							<h1 className="text-foreground text-4xl font-bold">{t.events.title}</h1>
							<p className="text-muted-foreground text-lg">{t.events.subtitle}</p>
						</div>

						{/* Stats Grid */}
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
							<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">{t.events.stats.totalEvents}</CardTitle>
									<Calendar className="text-muted-foreground h-4 w-4" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{stats?.totalEvents ?? 0}</div>
								</CardContent>
							</Card>

							<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">{t.events.stats.activeEvents}</CardTitle>
									<Users className="text-muted-foreground h-4 w-4" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{stats?.activeEvents ?? 0}</div>
								</CardContent>
							</Card>

							<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">{t.events.stats.upcomingEvents}</CardTitle>
									<Calendar className="text-muted-foreground h-4 w-4" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{stats?.upcomingEvents ?? 0}</div>
								</CardContent>
							</Card>

							<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">{t.events.stats.pastEvents}</CardTitle>
									<Calendar className="text-muted-foreground h-4 w-4" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{stats?.pastEvents ?? 0}</div>
								</CardContent>
							</Card>

							<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">{t.events.stats.partneredEvents}</CardTitle>
									<Users className="text-muted-foreground h-4 w-4" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{stats?.partneredEvents ?? 0}</div>
								</CardContent>
							</Card>

							<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">{t.events.stats.draftEvents}</CardTitle>
									<Calendar className="text-muted-foreground h-4 w-4" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{stats?.draftEvents ?? 0}</div>
								</CardContent>
							</Card>
						</div>

						{/* Quick Actions Section */}
						<div className="mb-8">
							<div className="mb-6">
								<h2 className="text-foreground mb-2 text-2xl font-bold">{t.events.sections.actions.title}</h2>
								<p className="text-muted-foreground">{t.events.sections.actions.description}</p>
							</div>

							<div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
								{/* Create Event Card */}
								<Link href="/admin/event/create">
									<Card className="border-border/50 bg-card/50 hover:bg-card/80 group cursor-pointer transition-all duration-300 hover:shadow-lg">
										<CardHeader>
											<div className="flex items-center gap-3">
												<div className="bg-primary/10 text-primary rounded-lg p-2">
													<Plus className="h-5 w-5" />
												</div>
												<div>
													<CardTitle className="text-foreground group-hover:text-primary transition-colors">
														{t.events.actions.createEvent}
													</CardTitle>
													<CardDescription className="text-muted-foreground">
														{t.events.actions.createEventDescription}
													</CardDescription>
												</div>
											</div>
										</CardHeader>
									</Card>
								</Link>
							</div>
						</div>

						{/* Events Table */}
						<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
							<CardHeader>
								<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
									<div>
										<CardTitle className="text-xl">{t.events.sections.overview.title}</CardTitle>
										<CardDescription>{t.events.sections.overview.description}</CardDescription>
									</div>
									<div className="flex flex-col gap-2 md:flex-row">
										<div className="relative">
											<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
											<Input
												className="w-full pl-10 md:w-64"
												onChange={e => setSearchQuery(e.target.value)}
												placeholder={t.events.filters.search}
												value={searchQuery}
											/>
										</div>
										<select
											className="border-input bg-background ring-offset-background focus:ring-ring rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2"
											onChange={e => setStatusFilter(e.target.value)}
											value={statusFilter}
										>
											<option value="all">{t.events.filters.all}</option>
											<option value="active">{t.events.filters.active}</option>
											<option value="upcoming">{t.events.filters.upcoming}</option>
											<option value="past">{t.events.filters.past}</option>
											<option value="partnered">{t.events.filters.partnered}</option>
										</select>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								{filteredEvents.length === 0 ? (
									<div className="py-12 text-center">
										<Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
										<h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
											{t.events.table.empty.title}
										</h3>
										<p className="mb-6 text-gray-500 dark:text-gray-400">{t.events.table.empty.description}</p>
										<Link href="/admin/event/create">
											<Button>
												<Plus className="mr-2 h-4 w-4" />
												{t.events.table.empty.createButton}
											</Button>
										</Link>
									</div>
								) : (
									<div className="overflow-x-auto">
										<table className="w-full">
											<thead>
												<tr className="border-b">
													<th className="px-4 py-3 text-left font-medium">{t.events.table.columns.name}</th>
													<th className="px-4 py-3 text-left font-medium">{t.events.table.columns.date}</th>
													<th className="px-4 py-3 text-left font-medium">{t.events.table.columns.location}</th>
													<th className="px-4 py-3 text-left font-medium">{t.events.table.columns.type}</th>
													<th className="px-4 py-3 text-left font-medium">{t.events.table.columns.participants}</th>
													<th className="px-4 py-3 text-left font-medium">{t.events.table.columns.status}</th>
													<th className="px-4 py-3 text-left font-medium">{t.events.table.columns.partnered}</th>
													<th className="px-4 py-3 text-left font-medium">{t.events.table.columns.actions}</th>
												</tr>
											</thead>
											<tbody>
												{filteredEvents.map(event => (
													<tr className="hover:bg-muted/50 border-b" key={event.id}>
														<td className="px-4 py-3 font-medium">{event.name}</td>
														<td className="px-4 py-3">{new Date(event.eventDate).toLocaleDateString()}</td>
														<td className="px-4 py-3">{event.location}</td>
														<td className="px-4 py-3">
															<Badge className="capitalize" variant="outline">
																{event.typeCourse}
															</Badge>
														</td>
														<td className="px-4 py-3">{event.participantCount?.toLocaleString() ?? '-'}</td>
														<td className="px-4 py-3">{getStatusBadge(getEventStatus(event))}</td>
														<td className="px-4 py-3">
															{event.isPartnered ? (
																<Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
																	Yes
																</Badge>
															) : (
																<Badge variant="outline">No</Badge>
															)}
														</td>
														<td className="px-4 py-3">
															<div className="flex gap-2">
																<Button size="sm" variant="outline">
																	<Eye className="h-4 w-4" />
																</Button>
															</div>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}
