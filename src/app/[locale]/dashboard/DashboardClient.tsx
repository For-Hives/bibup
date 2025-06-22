'use client'

import { Calendar, Clock, List, MapPin, Plus, Search, ShoppingCart, Tag, TrendingUp, Users, Zap } from 'lucide-react'

import Link from 'next/link'

import type { User } from '@/models/user.model'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface DashboardClientProps {
	clerkUser: SerializedClerkUser
	translations: DashboardTranslations
	user: null | User
}

interface DashboardTranslations {
	auth: {
		signInToAccessDashboard: string
	}
	dashboard: {
		buyer: {
			description: string
			title: string
		}
		seller: {
			description: string
			title: string
		}
		title: string
	}
}

interface SerializedClerkUser {
	emailAddresses: { emailAddress: string; id: string }[]
	firstName: null | string
	id: string
	imageUrl: string
	lastName: null | string
	username: null | string
}

export default function DashboardClient({ translations: t, clerkUser }: DashboardClientProps) {
	const userName = clerkUser.firstName ?? clerkUser.emailAddresses[0]?.emailAddress ?? 'User'

	return (
		<div className="from-background via-primary/5 to-background relative min-h-screen bg-gradient-to-br">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

			{/* User header */}
			<div className="bg-card/25 border-border/30 absolute top-0 right-0 left-0 z-20 mx-4 mt-12 mb-6 rounded-2xl border p-4 backdrop-blur-sm">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-muted-foreground text-sm">Welcome back</p>
						<p className="text-foreground font-medium">
							{userName}
							{clerkUser.emailAddresses[0] && (
								<span className="text-muted-foreground ml-2 text-sm">({clerkUser.emailAddresses[0].emailAddress})</span>
							)}
						</p>
					</div>
					<div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">MEMBER</div>
				</div>
			</div>

			<div className="relative pt-32 pb-12">
				<div className="container mx-auto max-w-6xl p-6">
					{/* Header */}
					<div className="mb-12 space-y-2 text-center">
						<h1 className="text-foreground text-4xl font-bold tracking-tight">{t.dashboard.title}</h1>
						<p className="text-muted-foreground text-lg">Choose how you want to use Beswib</p>
					</div>

					{/* Main Dashboard Cards - Only Buyer and Seller */}
					<div className="mx-auto mb-12 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
						{/* Buyer Dashboard */}
						<Card className="border-border/50 bg-card/80 flex h-full flex-col justify-between backdrop-blur-sm transition-all duration-200 hover:shadow-lg">
							<CardHeader className="text-center">
								<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 transition-colors group-hover:bg-blue-500/20">
									<ShoppingCart className="h-10 w-10" />
								</div>
								<CardTitle className="text-2xl">{t.dashboard.buyer.title}</CardTitle>
								<CardDescription className="text-base">{t.dashboard.buyer.description}</CardDescription>
							</CardHeader>
							<CardContent className="text-center">
								<Link href="/dashboard/buyer">
									<Button className="w-full" size="lg">
										<ShoppingCart className="mr-2 h-5 w-5" />
										Access Buyer Dashboard
									</Button>
								</Link>
							</CardContent>
						</Card>

						{/* Seller Dashboard */}
						<Card className="border-border/50 bg-card/80 hover:bg-card/90 group flex h-full flex-col justify-between backdrop-blur-sm transition-all duration-200 hover:shadow-lg">
							<CardHeader className="text-center">
								<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-500 transition-colors group-hover:bg-green-500/20">
									<Tag className="h-10 w-10" />
								</div>
								<CardTitle className="text-2xl">{t.dashboard.seller.title}</CardTitle>
								<CardDescription className="text-base">{t.dashboard.seller.description}</CardDescription>
							</CardHeader>
							<CardContent className="text-center">
								<div className="flex h-full w-full flex-col items-center justify-end">
									<Link className="w-full" href="/dashboard/seller">
										<Button className="w-full" size="lg">
											<Tag className="mr-2 h-5 w-5" />
											Access Seller Dashboard
										</Button>
									</Link>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Quick Actions Grid */}
					<div className="mb-12">
						<h2 className="text-foreground mb-8 text-center text-2xl font-bold">Quick Actions</h2>
						<div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
							{/* Sell Bib */}
							<Card className="border-border/50 bg-card/80 hover:bg-card/90 cursor-pointer backdrop-blur-sm transition-all duration-200 hover:shadow-md">
								<Link href="/dashboard/seller/sell-bib">
									<CardContent className="flex flex-col items-center p-4 text-center">
										<div className="bg-primary/10 text-primary mb-3 flex h-12 w-12 items-center justify-center rounded-full">
											<Plus className="h-6 w-6" />
										</div>
										<p className="text-sm font-medium">Sell Bib</p>
									</CardContent>
								</Link>
							</Card>

							{/* Browse Events */}
							<Card className="border-border/50 bg-card/80 hover:bg-card/90 cursor-pointer backdrop-blur-sm transition-all duration-200 hover:shadow-md">
								<Link href="/events">
									<CardContent className="flex flex-col items-center p-4 text-center">
										<div className="bg-primary/10 text-primary mb-3 flex h-12 w-12 items-center justify-center rounded-full">
											<Calendar className="h-6 w-6" />
										</div>
										<p className="text-sm font-medium">Browse Events</p>
									</CardContent>
								</Link>
							</Card>

							{/* Marketplace */}
							<Card className="border-border/50 bg-card/80 hover:bg-card/90 cursor-pointer backdrop-blur-sm transition-all duration-200 hover:shadow-md">
								<Link href="/marketplace">
									<CardContent className="flex flex-col items-center p-4 text-center">
										<div className="bg-primary/10 text-primary mb-3 flex h-12 w-12 items-center justify-center rounded-full">
											<Search className="h-6 w-6" />
										</div>
										<p className="text-sm font-medium">Marketplace</p>
									</CardContent>
								</Link>
							</Card>

							{/* My Listings */}
							<Card className="border-border/50 bg-card/80 hover:bg-card/90 cursor-pointer backdrop-blur-sm transition-all duration-200 hover:shadow-md">
								<Link href="/dashboard/seller/list-bib">
									<CardContent className="flex flex-col items-center p-4 text-center">
										<div className="bg-primary/10 text-primary mb-3 flex h-12 w-12 items-center justify-center rounded-full">
											<List className="h-6 w-6" />
										</div>
										<p className="text-sm font-medium">My Listings</p>
									</CardContent>
								</Link>
							</Card>

							{/* Calendar */}
							<Card className="border-border/50 bg-card/80 hover:bg-card/90 cursor-pointer backdrop-blur-sm transition-all duration-200 hover:shadow-md">
								<Link href="/calendar">
									<CardContent className="flex flex-col items-center p-4 text-center">
										<div className="bg-primary/10 text-primary mb-3 flex h-12 w-12 items-center justify-center rounded-full">
											<Clock className="h-6 w-6" />
										</div>
										<p className="text-sm font-medium">Calendar</p>
									</CardContent>
								</Link>
							</Card>

							{/* Contact */}
							<Card className="border-border/50 bg-card/80 hover:bg-card/90 cursor-pointer backdrop-blur-sm transition-all duration-200 hover:shadow-md">
								<Link href="/contact">
									<CardContent className="flex flex-col items-center p-4 text-center">
										<div className="bg-primary/10 text-primary mb-3 flex h-12 w-12 items-center justify-center rounded-full">
											<MapPin className="h-6 w-6" />
										</div>
										<p className="text-sm font-medium">Contact</p>
									</CardContent>
								</Link>
							</Card>
						</div>
					</div>

					{/* Featured Section */}
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						{/* Getting Started */}
						<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Zap className="h-5 w-5" />
									Getting Started
								</CardTitle>
								<CardDescription>New to Beswib? Here's how to get started quickly.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-center gap-3">
									<div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
										1
									</div>
									<p className="text-sm">Browse available race bibs in our marketplace</p>
								</div>
								<div className="flex items-center gap-3">
									<div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
										2
									</div>
									<p className="text-sm">List your own bibs for sale when plans change</p>
								</div>
								<div className="flex items-center gap-3">
									<div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
										3
									</div>
									<p className="text-sm">Connect with the running community</p>
								</div>
							</CardContent>
						</Card>

						{/* Platform Stats */}
						<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<TrendingUp className="h-5 w-5" />
									Platform Activity
								</CardTitle>
								<CardDescription>See what's happening on Beswib today.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-sm">Active Listings</span>
									<span className="text-primary font-semibold">Coming Soon</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm">Recent Transfers</span>
									<span className="text-primary font-semibold">Coming Soon</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm">Community Members</span>
									<span className="text-primary font-semibold">Growing Daily</span>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}
