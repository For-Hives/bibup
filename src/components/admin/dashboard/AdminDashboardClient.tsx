'use client'

import { Calendar, CheckCircle, Clock, CreditCard, Eye, Plus } from 'lucide-react'
import React from 'react'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

import type { User } from '@/models/user.model'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getTranslations } from '@/lib/getDictionary'
import { Button } from '@/components/ui/button'

import translations from '../../../app/admin/locales.json'

interface AdminDashboardClientProps {
	currentUser: null | User
	translations: Translations
}

type Translations = ReturnType<typeof getTranslations<(typeof translations)['en'], 'en'>>

export default function AdminDashboardClient({ translations: t, currentUser }: AdminDashboardClientProps) {
	const router = useRouter()

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

	return (
		<div className="from-background via-primary/5 to-background relative min-h-screen bg-gradient-to-br">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

			{/* Admin header with user info */}
			<div className="bg-card/25 border-border/30 absolute top-0 right-0 left-0 z-20 mx-4 mt-24 mb-6 rounded-2xl border p-4 backdrop-blur-sm">
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
				<div className="container mx-auto max-w-6xl p-6">
					<div className="space-y-8">
						{/* Header */}
						<div className="space-y-2 text-center">
							<h1 className="text-foreground text-4xl font-bold">{t.dashboard.title}</h1>
							<p className="text-muted-foreground text-lg">{t.dashboard.subtitle}</p>
						</div>

						{/* Dashboard Cards Grid */}
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
							{/* Create Event Card */}
							<Card className="border-border/50 bg-card/80 hover:bg-card/90 group backdrop-blur-sm transition-all duration-200 hover:shadow-lg">
								<CardHeader className="text-center">
									<div className="bg-primary/10 text-primary group-hover:bg-primary/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors">
										<Plus className="h-8 w-8" />
									</div>
									<CardTitle className="text-xl">{t.dashboard.actions.createEvent}</CardTitle>
									<CardDescription>Create and configure new racing events for the platform</CardDescription>
								</CardHeader>
								<CardContent className="text-center">
									<Link href="/admin/event">
										<Button className="w-full">
											<Plus className="mr-2 h-4 w-4" />
											{t.dashboard.actions.createEvent}
										</Button>
									</Link>
								</CardContent>
							</Card>

							{/* View Events Card */}
							<Card className="border-border/50 bg-card/80 hover:bg-card/90 group backdrop-blur-sm transition-all duration-200 hover:shadow-lg">
								<CardHeader className="text-center">
									<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 transition-colors group-hover:bg-blue-500/20">
										<Eye className="h-8 w-8" />
									</div>
									<CardTitle className="text-xl">View Events</CardTitle>
									<CardDescription>Browse and manage all racing events on the platform</CardDescription>
								</CardHeader>
								<CardContent className="text-center">
									<Link href="/events">
										<Button className="w-full" variant="outline">
											<Eye className="mr-2 h-4 w-4" />
											View All Events
										</Button>
									</Link>
								</CardContent>
							</Card>

							{/* Validate Events Card */}
							<Card className="border-border/50 bg-card/80 hover:bg-card/90 group backdrop-blur-sm transition-all duration-200 hover:shadow-lg">
								<CardHeader className="text-center">
									<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500 transition-colors group-hover:bg-green-500/20">
										<CheckCircle className="h-8 w-8" />
									</div>
									<CardTitle className="text-xl">Validate Events</CardTitle>
									<CardDescription>Review and approve events proposed by organizers</CardDescription>
								</CardHeader>
								<CardContent className="text-center">
									<Link href="/admin/events/validate">
										<Button className="w-full" variant="outline">
											<CheckCircle className="mr-2 h-4 w-4" />
											Validate Events
										</Button>
									</Link>
								</CardContent>
							</Card>

							{/* Transactions Card (Coming Soon) */}
							<Card className="border-border/50 bg-card/60 cursor-not-allowed opacity-60 backdrop-blur-sm">
								<CardHeader className="text-center">
									<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-500/10 text-gray-500">
										<CreditCard className="h-8 w-8" />
									</div>
									<CardTitle className="text-xl text-gray-500">{t.dashboard.sections.transactions.title}</CardTitle>
									<CardDescription className="text-gray-400">
										{t.dashboard.sections.transactions.description}
									</CardDescription>
								</CardHeader>
								<CardContent className="text-center">
									<Button className="w-full" disabled>
										<Clock className="mr-2 h-4 w-4" />
										Coming Soon
									</Button>
								</CardContent>
							</Card>
						</div>

						{/* Quick Stats Overview */}
						<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Calendar className="h-5 w-5" />
									{t.dashboard.sections.overview.title}
								</CardTitle>
								<CardDescription>{t.dashboard.sections.overview.description}</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
									<div className="text-center">
										<div className="text-primary text-2xl font-bold">12</div>
										<div className="text-muted-foreground text-sm">Active Events</div>
									</div>
									<div className="text-center">
										<div className="text-2xl font-bold text-blue-500">3</div>
										<div className="text-muted-foreground text-sm">Pending Approval</div>
									</div>
									<div className="text-center">
										<div className="text-2xl font-bold text-green-500">156</div>
										<div className="text-muted-foreground text-sm">Total Bibs Listed</div>
									</div>
									<div className="text-center">
										<div className="text-2xl font-bold text-orange-500">1,284</div>
										<div className="text-muted-foreground text-sm">Registered Users</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}
