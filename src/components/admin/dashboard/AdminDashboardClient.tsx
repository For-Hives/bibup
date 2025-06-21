'use client'

import {
	Activity,
	AlertCircle,
	Calendar,
	DollarSign,
	Eye,
	FileText,
	Plus,
	Settings,
	TrendingUp,
	Users,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

import Link from 'next/link'

import type { User } from '@/models/user.model'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getTranslations } from '@/lib/getDictionary'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import translations from '../../../app/admin/locales.json'

interface AdminDashboardClientProps {
	currentUser: null | User
	translations: Translations
}

interface DashboardStats {
	pendingBibs: number
	pendingEvents: number
	todaysTransactions: number
	totalBibs: number
	totalEvents: number
	totalUsers: number
}

interface RecentActivity {
	id: string
	status: 'completed' | 'failed' | 'pending'
	timestamp: Date
	title: string
	type: 'bib_validation' | 'event_creation' | 'user_registration'
}

type Translations = ReturnType<typeof getTranslations<(typeof translations)['en'], 'en'>>

export default function AdminDashboardClient({ translations: t }: AdminDashboardClientProps) {
	const [stats, setStats] = useState<DashboardStats>({
		totalUsers: 0,
		totalEvents: 0,
		totalBibs: 0,
		todaysTransactions: 0,
		pendingEvents: 0,
		pendingBibs: 0,
	})
	const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		// Fetch dashboard data
		const fetchDashboardData = () => {
			try {
				// Mock data for now - replace with actual API calls
				setStats({
					totalUsers: 5420,
					totalEvents: 45,
					totalBibs: 1230,
					todaysTransactions: 24,
					pendingEvents: 3,
					pendingBibs: 18,
				})

				setRecentActivity([
					{
						type: 'bib_validation',
						title: 'Bib #12345 needs validation for Marathon de Paris',
						timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
						status: 'pending',
						id: '1',
					},
					{
						type: 'event_creation',
						title: 'New event "Trail des Templiers" created',
						timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
						status: 'completed',
						id: '2',
					},
					{
						type: 'user_registration',
						title: '5 new users registered today',
						timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
						status: 'completed',
						id: '3',
					},
				])
			} catch (error) {
				console.error('Error fetching dashboard data:', error)
			} finally {
				setIsLoading(false)
			}
		}

		void fetchDashboardData()
	}, [])

	const getActivityIcon = (type: RecentActivity['type']) => {
		switch (type) {
			case 'bib_validation':
				return <FileText className="h-4 w-4" />
			case 'event_creation':
				return <Calendar className="h-4 w-4" />
			case 'user_registration':
				return <Users className="h-4 w-4" />
			default:
				return <Activity className="h-4 w-4" />
		}
	}

	const getStatusBadgeVariant = (status: RecentActivity['status']) => {
		switch (status) {
			case 'completed':
				return 'default'
			case 'failed':
				return 'destructive'
			case 'pending':
				return 'secondary'
			default:
				return 'secondary'
		}
	}

	if (isLoading) {
		return (
			<div className="container mx-auto max-w-7xl p-6">
				<div className="space-y-6">
					<div className="space-y-2">
						<div className="h-8 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
						<div className="h-4 w-96 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
					</div>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: 6 }).map((_, i) => (
							<div className="h-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" key={i}></div>
						))}
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto max-w-7xl p-6">
			<div className="space-y-8">
				{/* Header */}
				<div className="space-y-2">
					<h1 className="text-foreground text-3xl font-bold">{t.dashboard.title}</h1>
					<p className="text-muted-foreground">{t.dashboard.subtitle}</p>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">{t.dashboard.stats.totalEvents}</CardTitle>
							<Calendar className="text-muted-foreground h-4 w-4" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.totalEvents}</div>
							<p className="text-muted-foreground text-xs">
								{stats.pendingEvents} {t.dashboard.stats.pendingEvents.toLowerCase()}
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">{t.dashboard.stats.totalBibs}</CardTitle>
							<FileText className="text-muted-foreground h-4 w-4" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.totalBibs}</div>
							<p className="text-muted-foreground text-xs">
								{stats.pendingBibs} {t.dashboard.stats.pendingBibs.toLowerCase()}
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">{t.dashboard.stats.totalUsers}</CardTitle>
							<Users className="text-muted-foreground h-4 w-4" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.totalUsers}</div>
							<p className="text-muted-foreground text-xs">
								<TrendingUp className="inline h-3 w-3" /> +12% from last month
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">{t.dashboard.stats.todaysTransactions}</CardTitle>
							<DollarSign className="text-muted-foreground h-4 w-4" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.todaysTransactions}</div>
							<p className="text-muted-foreground text-xs">€2,450 total volume</p>
						</CardContent>
					</Card>

					<Card className="md:col-span-2">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">{t.dashboard.stats.pendingBibs}</CardTitle>
							<AlertCircle className="h-4 w-4 text-orange-500" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-orange-500">{stats.pendingBibs}</div>
							<p className="text-muted-foreground text-xs">Require immediate attention</p>
						</CardContent>
					</Card>
				</div>

				{/* Quick Actions */}
				<Card>
					<CardHeader>
						<CardTitle>{t.dashboard.sections.overview.title}</CardTitle>
						<CardDescription>{t.dashboard.sections.overview.description}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
							<Button asChild className="h-auto flex-col p-6">
								<Link href="/admin/event">
									<Plus className="mb-2 h-6 w-6" />
									{t.dashboard.actions.createEvent}
								</Link>
							</Button>

							<Button asChild className="h-auto flex-col p-6" variant="outline">
								<Link href="/admin/bibs">
									<Eye className="mb-2 h-6 w-6" />
									{t.dashboard.actions.reviewBibs}
								</Link>
							</Button>

							<Button asChild className="h-auto flex-col p-6" variant="outline">
								<Link href="/admin/users">
									<Settings className="mb-2 h-6 w-6" />
									{t.dashboard.actions.manageUsers}
								</Link>
							</Button>

							<Button asChild className="h-auto flex-col p-6" variant="outline">
								<Link href="/admin/transactions">
									<DollarSign className="mb-2 h-6 w-6" />
									{t.dashboard.actions.viewTransactions}
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Recent Activity */}
				<Card>
					<CardHeader>
						<CardTitle>{t.dashboard.recentActivity.title}</CardTitle>
					</CardHeader>
					<CardContent>
						{recentActivity.length > 0 ? (
							<div className="space-y-4">
								{recentActivity.map(activity => (
									<div className="flex items-center justify-between border-b pb-4 last:border-b-0" key={activity.id}>
										<div className="flex items-center space-x-3">
											<div className="bg-muted rounded-full p-2">{getActivityIcon(activity.type)}</div>
											<div>
												<p className="text-sm font-medium">{activity.title}</p>
												<p className="text-muted-foreground text-xs">{activity.timestamp.toLocaleString()}</p>
											</div>
										</div>
										<Badge variant={getStatusBadgeVariant(activity.status)}>{activity.status}</Badge>
									</div>
								))}
							</div>
						) : (
							<p className="text-muted-foreground">{t.dashboard.recentActivity.noRecentActivity}</p>
						)}
					</CardContent>
				</Card>

				{/* Management Sections */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Calendar className="h-5 w-5" />
								<span>{t.dashboard.sections.events.title}</span>
							</CardTitle>
							<CardDescription>{t.dashboard.sections.events.description}</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<div className="flex justify-between">
									<span className="text-sm">Active Events</span>
									<span className="font-medium">{stats.totalEvents - stats.pendingEvents}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm">Pending Approval</span>
									<span className="font-medium text-orange-500">{stats.pendingEvents}</span>
								</div>
							</div>
							<Button asChild className="mt-4 w-full" variant="outline">
								<Link href="/admin/events">Manage Events</Link>
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<FileText className="h-5 w-5" />
								<span>{t.dashboard.sections.bibs.title}</span>
							</CardTitle>
							<CardDescription>{t.dashboard.sections.bibs.description}</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<div className="flex justify-between">
									<span className="text-sm">Active Listings</span>
									<span className="font-medium">{stats.totalBibs - stats.pendingBibs}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm">Pending Validation</span>
									<span className="font-medium text-orange-500">{stats.pendingBibs}</span>
								</div>
							</div>
							<Button asChild className="mt-4 w-full" variant="outline">
								<Link href="/admin/bibs">Review Bibs</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
