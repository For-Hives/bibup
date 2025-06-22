'use client'

import type { User as ClerkUser } from '@clerk/nextjs/server'

import { AlertCircle, Edit, Eye, Package, Plus, Tag, TrendingUp, Users } from 'lucide-react'

import Link from 'next/link'

import type { Event } from '@/models/event.model'
import type { User } from '@/models/user.model'
import type { Bib } from '@/models/bib.model'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface SellerDashboardClientProps {
	clerkUser: ClerkUser
	errorMessage: null | string
	listedBibs: (Bib & { expand?: { eventId: Event } })[]
	successMessage: null | string
	translations: SellerTranslations
	user: null | User
}

interface SellerTranslations {
	bibFor: string
	editBib: string
	gender: string
	listNewBib: string
	manageBibListings: string
	noBibsListed: string
	originalPrice: string
	pleaseSignIn: string
	price: string
	registrationNumber: string
	sellBib: string
	size: string
	status: string
	title: string
	welcomeMessage: string
	yourListedBibs: string
}

// Helper to get status styling
const getBibStatusStyle = (status: Bib['status']) => {
	switch (status) {
		case 'available':
			return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
		case 'expired':
			return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'

		case 'sold':
			return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
		case 'validation_failed':
			return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
		case 'withdrawn':
			return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
		default:
			return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
	}
}

export default function SellerDashboardClient({
	translations: t,
	successMessage,
	listedBibs,
	errorMessage,
	clerkUser,
}: SellerDashboardClientProps) {
	const userName = clerkUser.firstName ?? clerkUser.emailAddresses[0]?.emailAddress ?? 'Seller'

	// Calculate stats
	const availableBibs = listedBibs.filter(bib => bib.status === 'available').length
	const soldBibs = listedBibs.filter(bib => bib.status === 'sold').length
	const totalRevenue = listedBibs.filter(bib => bib.status === 'sold').reduce((sum, bib) => sum + bib.price, 0)

	return (
		<div className="from-background via-primary/5 to-background relative min-h-screen bg-gradient-to-br">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

			{/* User header */}
			<div className="bg-card/25 border-border/30 absolute top-0 right-0 left-0 z-20 mx-4 mt-12 mb-6 rounded-2xl border p-4 backdrop-blur-sm">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-muted-foreground text-sm">Seller Dashboard</p>
						<p className="text-foreground flex items-center gap-2 font-medium">
							<Tag className="h-4 w-4" />
							{userName}
							{clerkUser.emailAddresses[0] && (
								<span className="text-muted-foreground ml-2 text-sm">({clerkUser.emailAddresses[0].emailAddress})</span>
							)}
						</p>
					</div>
					<div className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">SELLER</div>
				</div>
			</div>

			<div className="relative pt-32 pb-12">
				<div className="container mx-auto max-w-6xl p-6">
					{/* Header */}
					<div className="mb-12 space-y-2 text-center">
						<h1 className="text-foreground text-4xl font-bold tracking-tight">{t.title}</h1>
						<p className="text-muted-foreground text-lg">
							{t.welcomeMessage}, {userName}!
						</p>
					</div>

					{/* Messages */}
					{successMessage && (
						<div className="mb-8 rounded-lg border border-green-300 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-900/20">
							<div className="flex items-center gap-3">
								<Package className="h-6 w-6 text-green-600 dark:text-green-400" />
								<p className="font-medium text-green-800 dark:text-green-200">{successMessage}</p>
							</div>
						</div>
					)}

					{errorMessage && (
						<div className="mb-8 rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
							<div className="flex items-center gap-3">
								<AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
								<p className="font-medium text-red-800 dark:text-red-200">Error: {errorMessage}</p>
							</div>
						</div>
					)}

					{/* Stats Cards */}
					<div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-4">
						<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Listings</CardTitle>
								<Package className="text-muted-foreground h-4 w-4" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{listedBibs.length}</div>
								<p className="text-muted-foreground text-xs">Bibs listed for sale</p>
							</CardContent>
						</Card>

						<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Available</CardTitle>
								<Eye className="text-muted-foreground h-4 w-4" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{availableBibs}</div>
								<p className="text-muted-foreground text-xs">Currently for sale</p>
							</CardContent>
						</Card>

						<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Sold</CardTitle>
								<TrendingUp className="text-muted-foreground h-4 w-4" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{soldBibs}</div>
								<p className="text-muted-foreground text-xs">Successfully sold</p>
							</CardContent>
						</Card>

						<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Revenue</CardTitle>
								<TrendingUp className="text-muted-foreground h-4 w-4" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
								<p className="text-muted-foreground text-xs">Total earned</p>
							</CardContent>
						</Card>
					</div>

					{/* Quick Actions */}
					<div className="mb-12">
						<h2 className="text-foreground mb-6 text-xl font-bold">Quick Actions</h2>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
							<Link href="/dashboard/seller/sell-bib">
								<Card className="border-border/50 bg-card/80 hover:bg-card/90 group cursor-pointer backdrop-blur-sm transition-all duration-200 hover:shadow-lg">
									<CardContent className="flex items-center p-6">
										<div className="bg-primary/10 text-primary group-hover:bg-primary/20 mr-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors">
											<Plus className="h-6 w-6" />
										</div>
										<div>
											<p className="font-medium">{t.sellBib}</p>
											<p className="text-muted-foreground text-sm">Quick multi-step form</p>
										</div>
									</CardContent>
								</Card>
							</Link>

							<Link href="/dashboard/seller/list-bib">
								<Card className="border-border/50 bg-card/80 hover:bg-card/90 group cursor-pointer backdrop-blur-sm transition-all duration-200 hover:shadow-lg">
									<CardContent className="flex items-center p-6">
										<div className="bg-primary/10 text-primary group-hover:bg-primary/20 mr-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors">
											<Package className="h-6 w-6" />
										</div>
										<div>
											<p className="font-medium">{t.listNewBib}</p>
											<p className="text-muted-foreground text-sm">Advanced listing form</p>
										</div>
									</CardContent>
								</Card>
							</Link>

							<Link href="/marketplace">
								<Card className="border-border/50 bg-card/80 hover:bg-card/90 group cursor-pointer backdrop-blur-sm transition-all duration-200 hover:shadow-lg">
									<CardContent className="flex items-center p-6">
										<div className="bg-primary/10 text-primary group-hover:bg-primary/20 mr-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors">
											<Eye className="h-6 w-6" />
										</div>
										<div>
											<p className="font-medium">View Marketplace</p>
											<p className="text-muted-foreground text-sm">See what's selling</p>
										</div>
									</CardContent>
								</Card>
							</Link>

							<Link href="/dashboard">
								<Card className="border-border/50 bg-card/80 hover:bg-card/90 group cursor-pointer backdrop-blur-sm transition-all duration-200 hover:shadow-lg">
									<CardContent className="flex items-center p-6">
										<div className="bg-primary/10 text-primary group-hover:bg-primary/20 mr-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors">
											<Users className="h-6 w-6" />
										</div>
										<div>
											<p className="font-medium">Main Dashboard</p>
											<p className="text-muted-foreground text-sm">Back to overview</p>
										</div>
									</CardContent>
								</Card>
							</Link>
						</div>
					</div>

					{/* My Listings */}
					<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Package className="h-5 w-5" />
								{t.yourListedBibs}
							</CardTitle>
							<CardDescription>Manage your race bib listings</CardDescription>
						</CardHeader>
						<CardContent>
							{listedBibs.length > 0 ? (
								<div className="space-y-4">
									{listedBibs.map(bib => {
										const eventName = bib.expand?.eventId?.name
										const eventIdDisplay = bib.eventId && bib.eventId !== '' ? bib.eventId : 'N/A'
										const displayBibName = eventName ?? `Event ID: ${eventIdDisplay}`
										const canEdit = ['available', 'expired', 'sold', 'validation_failed', 'withdrawn'].includes(
											bib.status
										)

										return (
											<div
												className="border-border/50 bg-background/50 rounded-lg border p-4 backdrop-blur-sm"
												key={bib.id}
											>
												<div className="flex items-start justify-between">
													<div className="flex-1">
														<div className="mb-2 flex items-center gap-3">
															<h4 className="font-semibold">
																{t.bibFor} {displayBibName}
															</h4>
															<span
																className={`rounded-full px-2 py-1 text-xs font-medium ${getBibStatusStyle(bib.status)}`}
															>
																{bib.status.replace(/_/g, ' ').toUpperCase()}
															</span>
														</div>

														<div className="text-muted-foreground grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
															<div>
																<p className="font-medium">{t.registrationNumber}</p>
																<p>{bib.registrationNumber}</p>
															</div>
															<div>
																<p className="font-medium">{t.price}</p>
																<p>${bib.price.toFixed(2)}</p>
															</div>
															{bib.originalPrice && bib.originalPrice !== 0 && !isNaN(bib.originalPrice) && (
																<div>
																	<p className="font-medium">{t.originalPrice}</p>
																	<p>${bib.originalPrice.toFixed(2)}</p>
																</div>
															)}
															{bib.optionValues?.size && (
																<div>
																	<p className="font-medium">{t.size}</p>
																	<p>{bib.optionValues.size}</p>
																</div>
															)}
														</div>

														{bib.optionValues?.gender && (
															<p className="text-muted-foreground mt-2 text-sm">
																{t.gender}: {bib.optionValues.gender}
															</p>
														)}
													</div>

													{canEdit && (
														<Link href={`/dashboard/seller/edit-bib/${bib.id}`}>
															<Button size="sm" variant="outline">
																<Edit className="mr-2 h-4 w-4" />
																{t.editBib}
															</Button>
														</Link>
													)}
												</div>
											</div>
										)
									})}
								</div>
							) : (
								<div className="py-12 text-center">
									<Package className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
									<p className="text-muted-foreground mb-6 text-lg">{t.noBibsListed}</p>
									<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
										<Link href="/dashboard/seller/sell-bib">
											<Button>
												<Plus className="mr-2 h-4 w-4" />
												{t.sellBib}
											</Button>
										</Link>
										<Link href="/dashboard/seller/list-bib">
											<Button variant="outline">
												<Package className="mr-2 h-4 w-4" />
												{t.listNewBib}
											</Button>
										</Link>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
