'use client'

import { Edit3, List, Plus, Search, Tag, Users } from 'lucide-react'

import Link from 'next/link'

import type { Event } from '@/models/event.model'
import type { Bib } from '@/models/bib.model'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface SellerDashboardClientProps {
	clerkUser: SerializedClerkUser
	sellerBibs: (Bib & { expand?: { eventId: Event } })[]
	translations: SellerTranslations
}

interface SellerTranslations {
	availableBibs: string
	bibListed: string
	bibManagement: {
		editButton: string
		gender: string
		price: string
		size: string
		status: string
	}
	myListings: string
	noBibsListed: string
	quickActions: string
	registrationNumber: string
	revenue: string
	sellFirstBib: string
	statistics: {
		availableBibs: string
		revenue: string
		soldBibs: string
		totalListings: string
	}
	title: string
	totalListings: string
	totalSold: string
	welcome: string
}

interface SerializedClerkUser {
	emailAddresses: { emailAddress: string; id: string }[]
	firstName: null | string
	id: string
	imageUrl: string
	lastName: null | string
	username: null | string
}

// Status display mapping
const getStatusDisplay = (status: string) => {
	switch (status) {
		case 'available':
			return { label: 'Available', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' }
		case 'expired':
			return { label: 'Expired', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' }
		case 'sold':
			return { label: 'Sold', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' }
		case 'validation_failed':
			return { label: 'Validation Failed', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' }
		case 'withdrawn':
			return { label: 'Withdrawn', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' }
		default:
			return { label: status, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' }
	}
}

export default function SellerDashboardClient({ translations: t, sellerBibs, clerkUser }: SellerDashboardClientProps) {
	const userName = clerkUser.firstName ?? clerkUser.emailAddresses[0]?.emailAddress ?? 'Seller'

	// Calculate statistics
	const totalListings = sellerBibs.length
	const availableBibs = sellerBibs.filter(bib => bib.status === 'available').length
	const soldBibs = sellerBibs.filter(bib => bib.status === 'sold').length
	const totalRevenue = sellerBibs.filter(bib => bib.status === 'sold').reduce((sum, bib) => sum + (bib.price || 0), 0)

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
					{/* Statistics Cards */}
					<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
						<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
							<CardHeader className="pb-2">
								<CardTitle className="text-muted-foreground text-sm">{t.statistics.totalListings}</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{totalListings}</div>
							</CardContent>
						</Card>

						<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
							<CardHeader className="pb-2">
								<CardTitle className="text-muted-foreground text-sm">{t.statistics.availableBibs}</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{availableBibs}</div>
							</CardContent>
						</Card>

						<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
							<CardHeader className="pb-2">
								<CardTitle className="text-muted-foreground text-sm">{t.statistics.soldBibs}</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{soldBibs}</div>
							</CardContent>
						</Card>

						<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
							<CardHeader className="pb-2">
								<CardTitle className="text-muted-foreground text-sm">{t.statistics.revenue}</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">€{totalRevenue.toFixed(2)}</div>
							</CardContent>
						</Card>
					</div>

					{/* Quick Actions */}
					<div className="mb-8">
						<h2 className="text-foreground mb-6 text-xl font-bold">{t.quickActions}</h2>
						<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
							<Link href="/dashboard/seller/sell-bib">
								<Card className="border-border/50 bg-card/80 hover:bg-card/90 cursor-pointer backdrop-blur-sm transition-all duration-200 hover:shadow-md">
									<CardContent className="flex flex-col items-center p-4 text-center">
										<div className="bg-primary/10 text-primary mb-3 flex h-12 w-12 items-center justify-center rounded-full">
											<Plus className="h-6 w-6" />
										</div>
										<p className="text-sm font-medium">Sell New Bib</p>
									</CardContent>
								</Card>
							</Link>

							<Link href="/dashboard/seller/list-bib">
								<Card className="border-border/50 bg-card/80 hover:bg-card/90 cursor-pointer backdrop-blur-sm transition-all duration-200 hover:shadow-md">
									<CardContent className="flex flex-col items-center p-4 text-center">
										<div className="bg-primary/10 text-primary mb-3 flex h-12 w-12 items-center justify-center rounded-full">
											<List className="h-6 w-6" />
										</div>
										<p className="text-sm font-medium">My Listings</p>
									</CardContent>
								</Card>
							</Link>

							<Link href="/marketplace">
								<Card className="border-border/50 bg-card/80 hover:bg-card/90 cursor-pointer backdrop-blur-sm transition-all duration-200 hover:shadow-md">
									<CardContent className="flex flex-col items-center p-4 text-center">
										<div className="bg-primary/10 text-primary mb-3 flex h-12 w-12 items-center justify-center rounded-full">
											<Search className="h-6 w-6" />
										</div>
										<p className="text-sm font-medium">View Marketplace</p>
									</CardContent>
								</Card>
							</Link>

							<Link href="/dashboard">
								<Card className="border-border/50 bg-card/80 hover:bg-card/90 cursor-pointer backdrop-blur-sm transition-all duration-200 hover:shadow-md">
									<CardContent className="flex flex-col items-center p-4 text-center">
										<div className="bg-primary/10 text-primary mb-3 flex h-12 w-12 items-center justify-center rounded-full">
											<Users className="h-6 w-6" />
										</div>
										<p className="text-sm font-medium">Main Dashboard</p>
									</CardContent>
								</Card>
							</Link>
						</div>
					</div>

					{/* Bib Listings */}
					<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Tag className="h-5 w-5" />
								{t.myListings}
							</CardTitle>
							<CardDescription>Manage your race bib listings and track performance</CardDescription>
						</CardHeader>
						<CardContent>
							{sellerBibs.length > 0 ? (
								<div className="space-y-4">
									{sellerBibs.map(bib => {
										const statusDisplay = getStatusDisplay(bib.status)
										return (
											<div className="rounded-lg border p-4" key={bib.id}>
												<div className="mb-3 flex items-start justify-between">
													<div>
														<h4 className="font-semibold">{bib.expand?.eventId?.name ?? `Event ID: ${bib.eventId}`}</h4>
														<p className="text-muted-foreground text-sm">
															{t.registrationNumber}: {bib.registrationNumber}
														</p>
													</div>
													<span className={`rounded-full px-3 py-1 text-xs font-medium ${statusDisplay.color}`}>
														{statusDisplay.label}
													</span>
												</div>

												<div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
													<div>
														<p className="text-muted-foreground">{t.bibManagement.price}</p>
														<p className="font-medium">€{bib.price?.toFixed(2) ?? 'N/A'}</p>
													</div>
													<div>
														<p className="text-muted-foreground">{t.bibManagement.size}</p>
														<p className="font-medium">{bib.optionValues?.size ?? 'N/A'}</p>
													</div>
													<div>
														<p className="text-muted-foreground">{t.bibManagement.gender}</p>
														<p className="font-medium">{bib.optionValues?.gender ?? 'N/A'}</p>
													</div>
													<div>
														<p className="text-muted-foreground">Event Date</p>
														<p className="font-medium">
															{bib.expand?.eventId
																? new Date(bib.expand.eventId.eventDate).toLocaleDateString()
																: 'N/A'}
														</p>
													</div>
												</div>

												{/* Edit button - only show for certain statuses */}
												{(bib.status === 'available' || bib.status === 'validation_failed') && (
													<div className="mt-3 flex justify-end">
														<Link href={`/dashboard/seller/edit-bib/${bib.id}`}>
															<Button size="sm" variant="outline">
																<Edit3 className="mr-2 h-4 w-4" />
																{t.bibManagement.editButton}
															</Button>
														</Link>
													</div>
												)}
											</div>
										)
									})}
								</div>
							) : (
								<div className="py-12 text-center">
									<Tag className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
									<h3 className="mb-2 text-lg font-semibold">{t.noBibsListed}</h3>
									<p className="text-muted-foreground mb-6">{t.sellFirstBib}</p>
									<Link href="/dashboard/seller/sell-bib">
										<Button size="lg">
											<Plus className="mr-2 h-4 w-4" />
											List Your First Bib
										</Button>
									</Link>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
