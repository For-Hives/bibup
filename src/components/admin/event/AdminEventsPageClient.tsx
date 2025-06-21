'use client'

import {
	ColumnDef,
	ColumnFiltersState,
	FilterFn,
	flexRender,
	getCoreRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	PaginationState,
	Row,
	SortingState,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table'
import {
	Calendar,
	ChevronDown,
	ChevronFirst,
	ChevronLast,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	CircleAlert,
	CircleX,
	Columns3,
	Edit,
	Eye,
	Filter,
	MoreHorizontal,
	Plus,
	Search,
	Trash2,
	Users,
} from 'lucide-react'
import React, { useEffect, useId, useMemo, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

import type { Event } from '@/models/event.model'
import type { User } from '@/models/user.model'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

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

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<Event> = (row, columnId, filterValue) => {
	const searchableRowContent = `${row.original.name} ${row.original.location} ${row.original.typeCourse}`.toLowerCase()
	const searchTerm = String(filterValue ?? '').toLowerCase()
	return searchableRowContent.includes(searchTerm)
}

const statusFilterFn: FilterFn<Event> = (row, columnId, filterValue: string[]) => {
	if (!filterValue?.length) return true
	const status = getEventStatus(row.original)
	return filterValue.includes(status)
}

const getEventStatus = (event: Event) => {
	const now = new Date()
	const eventDate = new Date(event.eventDate)

	if (eventDate < now) return 'past'
	if (event.isPartnered && eventDate >= now) return 'active'
	if (eventDate >= now) return 'upcoming'
	return 'draft'
}

const getStatusBadge = (status: string, t: EventsTranslations) => {
	const statusConfig = {
		upcoming: {
			label: t.events.table.status.upcoming,
			className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
		},
		past: {
			label: t.events.table.status.past,
			className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
		},
		draft: {
			label: t.events.table.status.draft,
			className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
		},
		active: {
			label: t.events.table.status.active,
			className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
		},
	}
	const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
	return <Badge className={config.className}>{config.label}</Badge>
}

export default function AdminEventsPageClient({ translations: t, currentUser }: AdminEventsPageClientProps) {
	const router = useRouter()
	const id = useId()
	const inputRef = useRef<HTMLInputElement>(null)

	const [events, setEvents] = useState<Event[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [stats, setStats] = useState<EventsStats | null>(null)

	// Table state
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [pagination, setPagination] = useState<PaginationState>({
		pageSize: 10,
		pageIndex: 0,
	})
	const [sorting, setSorting] = useState<SortingState>([
		{
			id: 'eventDate',
			desc: false,
		},
	])

	// Define columns
	const columns: ColumnDef<Event>[] = useMemo(
		() => [
			{
				size: 28,
				id: 'select',
				header: ({ table }) => (
					<Checkbox
						aria-label="Select all"
						checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
						onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
					/>
				),
				enableSorting: false,
				enableHiding: false,
				cell: ({ row }) => (
					<Checkbox
						aria-label="Select row"
						checked={row.getIsSelected()}
						onCheckedChange={value => row.toggleSelected(!!value)}
					/>
				),
			},
			{
				size: 200,
				header: t.events.table.columns.name,
				filterFn: multiColumnFilterFn,
				enableHiding: false,
				cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
				accessorKey: 'name',
			},
			{
				size: 120,
				header: t.events.table.columns.date,
				cell: ({ row }) => <div>{new Date(row.getValue('eventDate')).toLocaleDateString()}</div>,
				accessorKey: 'eventDate',
			},
			{
				size: 180,
				header: t.events.table.columns.location,
				accessorKey: 'location',
			},
			{
				size: 100,
				header: t.events.table.columns.type,
				cell: ({ row }) => (
					<Badge className="capitalize" variant="outline">
						{row.getValue('typeCourse')}
					</Badge>
				),
				accessorKey: 'typeCourse',
			},
			{
				size: 120,
				header: t.events.table.columns.participants,
				cell: ({ row }) => {
					const count = row.getValue('participantCount')
					return count && typeof count === 'number' && count > 0 ? count.toLocaleString() : '-'
				},
				accessorKey: 'participantCount',
			},
			{
				size: 100,
				header: t.events.table.columns.status,
				filterFn: statusFilterFn,
				cell: ({ row }) => getStatusBadge(getEventStatus(row.original), t),
				accessorKey: 'status',
			},
			{
				size: 100,
				header: t.events.table.columns.partnered,
				cell: ({ row }) => (
					<Badge variant={row.getValue('isPartnered') ? 'default' : 'secondary'}>
						{row.getValue('isPartnered') ? 'Yes' : 'No'}
					</Badge>
				),
				accessorKey: 'isPartnered',
			},
			{
				size: 60,
				id: 'actions',
				header: () => <span className="sr-only">{t.events.table.columns.actions}</span>,
				enableSorting: false,
				enableHiding: false,
				cell: ({ row }) => <RowActions row={row} t={t} />,
			},
		],
		[t]
	)

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
						draftEvents: 0,
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

	const handleDeleteRows = () => {
		const selectedRows = table.getSelectedRowModel().rows
		const updatedData = events.filter(item => !selectedRows.some(row => row.original.id === item.id))
		setEvents(updatedData)
		table.resetRowSelection()
	}

	const table = useReactTable({
		state: {
			sorting,
			pagination,
			columnVisibility,
			columnFilters,
		},
		onSortingChange: setSorting,
		onPaginationChange: setPagination,
		onColumnVisibilityChange: setColumnVisibility,
		onColumnFiltersChange: setColumnFilters,
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getCoreRowModel: getCoreRowModel(),
		enableSortingRemoval: false,
		data: events,
		columns,
	})

	// Get unique status values
	const uniqueStatusValues = useMemo(() => {
		const statusColumn = table.getColumn('status')
		if (!statusColumn) return []
		const values = Array.from(statusColumn.getFacetedUniqueValues().keys()) as string[]
		return values.sort()
	}, [table.getColumn('status')?.getFacetedUniqueValues()])

	// Get counts for each status
	const statusCounts = useMemo(() => {
		const statusColumn = table.getColumn('status')
		if (!statusColumn) return new Map<string, number>()
		return statusColumn.getFacetedUniqueValues()
	}, [table.getColumn('status')?.getFacetedUniqueValues()])

	const selectedStatuses = useMemo(() => {
		const filterValue = table.getColumn('status')?.getFilterValue() as string[] | undefined
		return filterValue ?? []
	}, [table.getColumn('status')?.getFilterValue()])

	const handleStatusChange = (checked: boolean, value: string) => {
		const filterValue = table.getColumn('status')?.getFilterValue() as string[] | undefined
		const newFilterValue = filterValue ? [...filterValue] : []

		if (checked) {
			newFilterValue.push(value)
		} else {
			const index = newFilterValue.indexOf(value)
			if (index > -1) {
				newFilterValue.splice(index, 1)
			}
		}

		table.getColumn('status')?.setFilterValue(newFilterValue.length ? newFilterValue : undefined)
	}

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
							<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
									<Eye className="text-muted-foreground h-4 w-4" />
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
									<Search className="text-muted-foreground h-4 w-4" />
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

						{/* Advanced Table Section */}
						<div className="space-y-4">
							{/* Filters */}
							<div className="flex flex-wrap items-center justify-between gap-3">
								<div className="flex items-center gap-3">
									{/* Filter by name, location, or type */}
									<div className="relative">
										<Input
											aria-label="Filter events"
											className={cn('peer min-w-60 ps-9', Boolean(table.getColumn('name')?.getFilterValue()) && 'pe-9')}
											id={`${id}-input`}
											onChange={e => table.getColumn('name')?.setFilterValue(e.target.value)}
											placeholder={t.events.filters.search}
											ref={inputRef}
											type="text"
											value={(table.getColumn('name')?.getFilterValue() ?? '') as string}
										/>
										<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
											<Search aria-hidden="true" size={16} />
										</div>
										{Boolean(table.getColumn('name')?.getFilterValue()) && (
											<button
												aria-label="Clear filter"
												className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
												onClick={() => {
													table.getColumn('name')?.setFilterValue('')
													if (inputRef.current) {
														inputRef.current.focus()
													}
												}}
											>
												<CircleX aria-hidden="true" size={16} />
											</button>
										)}
									</div>

									{/* Filter by status */}
									<Popover>
										<PopoverTrigger asChild>
											<Button variant="outline">
												<Filter aria-hidden="true" className="-ms-1 opacity-60" size={16} />
												Status
												{selectedStatuses.length > 0 && (
													<span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
														{selectedStatuses.length}
													</span>
												)}
											</Button>
										</PopoverTrigger>
										<PopoverContent align="start" className="w-auto min-w-36 p-3">
											<div className="space-y-3">
												<div className="text-muted-foreground text-xs font-medium">Filters</div>
												<div className="space-y-3">
													{uniqueStatusValues.map((value, i) => (
														<div className="flex items-center gap-2" key={value}>
															<Checkbox
																checked={selectedStatuses.includes(value)}
																id={`${id}-${i}`}
																onCheckedChange={(checked: boolean) => handleStatusChange(checked, value)}
															/>
															<Label className="flex grow justify-between gap-2 font-normal" htmlFor={`${id}-${i}`}>
																{value}{' '}
																<span className="text-muted-foreground ms-2 text-xs">{statusCounts.get(value)}</span>
															</Label>
														</div>
													))}
												</div>
											</div>
										</PopoverContent>
									</Popover>

									{/* Toggle columns visibility */}
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="outline">
												<Columns3 aria-hidden="true" className="-ms-1 opacity-60" size={16} />
												View
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
											{table
												.getAllColumns()
												.filter(column => column.getCanHide())
												.map(column => {
													return (
														<DropdownMenuCheckboxItem
															checked={column.getIsVisible()}
															className="capitalize"
															key={column.id}
															onCheckedChange={value => column.toggleVisibility(!!value)}
															onSelect={event => event.preventDefault()}
														>
															{column.id}
														</DropdownMenuCheckboxItem>
													)
												})}
										</DropdownMenuContent>
									</DropdownMenu>
								</div>

								<div className="flex items-center gap-3">
									{/* Delete button */}
									{table.getSelectedRowModel().rows.length > 0 && (
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button className="ml-auto" variant="outline">
													<Trash2 aria-hidden="true" className="-ms-1 opacity-60" size={16} />
													Delete
													<span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
														{table.getSelectedRowModel().rows.length}
													</span>
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
													<div
														aria-hidden="true"
														className="flex size-9 shrink-0 items-center justify-center rounded-full border"
													>
														<CircleAlert className="opacity-80" size={16} />
													</div>
													<AlertDialogHeader>
														<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
														<AlertDialogDescription>
															This action cannot be undone. This will permanently delete{' '}
															{table.getSelectedRowModel().rows.length} selected{' '}
															{table.getSelectedRowModel().rows.length === 1 ? 'event' : 'events'}.
														</AlertDialogDescription>
													</AlertDialogHeader>
												</div>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<AlertDialogAction
														className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
														onClick={handleDeleteRows}
													>
														Delete
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									)}

									{/* Add event button */}
									<Link href="/admin/event/create">
										<Button className="ml-auto" variant="outline">
											<Plus aria-hidden="true" className="-ms-1 opacity-60" size={16} />
											Add Event
										</Button>
									</Link>
								</div>
							</div>

							{/* Table */}
							<div className="bg-background overflow-hidden rounded-md border">
								<Table className="table-fixed">
									<TableHeader>
										{table.getHeaderGroups().map(headerGroup => (
											<TableRow className="hover:bg-transparent" key={headerGroup.id}>
												{headerGroup.headers.map(header => {
													return (
														<TableHead className="h-11" key={header.id} style={{ width: `${header.getSize()}px` }}>
															{header.isPlaceholder ? null : header.column.getCanSort() ? (
																<div
																	className={cn(
																		header.column.getCanSort() &&
																			'flex h-full cursor-pointer items-center justify-between gap-2 select-none'
																	)}
																	onClick={header.column.getToggleSortingHandler()}
																	onKeyDown={e => {
																		if (header.column.getCanSort() && (e.key === 'Enter' || e.key === ' ')) {
																			e.preventDefault()
																			header.column.getToggleSortingHandler()?.(e)
																		}
																	}}
																	tabIndex={header.column.getCanSort() ? 0 : undefined}
																>
																	{flexRender(header.column.columnDef.header, header.getContext())}
																	{{
																		desc: <ChevronDown aria-hidden="true" className="shrink-0 opacity-60" size={16} />,
																		asc: <ChevronUp aria-hidden="true" className="shrink-0 opacity-60" size={16} />,
																	}[header.column.getIsSorted() as string] ?? null}
																</div>
															) : (
																flexRender(header.column.columnDef.header, header.getContext())
															)}
														</TableHead>
													)
												})}
											</TableRow>
										))}
									</TableHeader>
									<TableBody>
										{table.getRowModel().rows?.length ? (
											table.getRowModel().rows.map(row => (
												<TableRow data-state={row.getIsSelected() && 'selected'} key={row.id}>
													{row.getVisibleCells().map(cell => (
														<TableCell className="last:py-0" key={cell.id}>
															{flexRender(cell.column.columnDef.cell, cell.getContext())}
														</TableCell>
													))}
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell className="h-24 text-center" colSpan={columns.length}>
													<div className="text-center">
														<h3 className="text-foreground text-lg font-semibold">{t.events.table.empty.title}</h3>
														<p className="text-muted-foreground mb-4">{t.events.table.empty.description}</p>
														<Link href="/admin/event/create">
															<Button>{t.events.table.empty.createButton}</Button>
														</Link>
													</div>
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>

							{/* Pagination */}
							<div className="flex items-center justify-between gap-8">
								{/* Results per page */}
								<div className="flex items-center gap-3">
									<Label className="max-sm:sr-only" htmlFor={id}>
										Rows per page
									</Label>
									<Select
										onValueChange={value => {
											table.setPageSize(Number(value))
										}}
										value={table.getState().pagination.pageSize.toString()}
									>
										<SelectTrigger className="w-fit whitespace-nowrap" id={id}>
											<SelectValue placeholder="Select number of results" />
										</SelectTrigger>
										<SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
											{[5, 10, 25, 50].map(pageSize => (
												<SelectItem key={pageSize} value={pageSize.toString()}>
													{pageSize}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{/* Page number information */}
								<div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
									<p aria-live="polite" className="text-muted-foreground text-sm whitespace-nowrap">
										<span className="text-foreground">
											{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
											{Math.min(
												Math.max(
													table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
														table.getState().pagination.pageSize,
													0
												),
												table.getRowCount()
											)}
										</span>{' '}
										of <span className="text-foreground">{table.getRowCount().toString()}</span>
									</p>
								</div>

								{/* Pagination buttons */}
								<div>
									<Pagination>
										<PaginationContent>
											{/* First page button */}
											<PaginationItem>
												<Button
													aria-label="Go to first page"
													className="disabled:pointer-events-none disabled:opacity-50"
													disabled={!table.getCanPreviousPage()}
													onClick={() => table.firstPage()}
													size="icon"
													variant="outline"
												>
													<ChevronFirst aria-hidden="true" size={16} />
												</Button>
											</PaginationItem>
											{/* Previous page button */}
											<PaginationItem>
												<Button
													aria-label="Go to previous page"
													className="disabled:pointer-events-none disabled:opacity-50"
													disabled={!table.getCanPreviousPage()}
													onClick={() => table.previousPage()}
													size="icon"
													variant="outline"
												>
													<ChevronLeft aria-hidden="true" size={16} />
												</Button>
											</PaginationItem>
											{/* Next page button */}
											<PaginationItem>
												<Button
													aria-label="Go to next page"
													className="disabled:pointer-events-none disabled:opacity-50"
													disabled={!table.getCanNextPage()}
													onClick={() => table.nextPage()}
													size="icon"
													variant="outline"
												>
													<ChevronRight aria-hidden="true" size={16} />
												</Button>
											</PaginationItem>
											{/* Last page button */}
											<PaginationItem>
												<Button
													aria-label="Go to last page"
													className="disabled:pointer-events-none disabled:opacity-50"
													disabled={!table.getCanNextPage()}
													onClick={() => table.lastPage()}
													size="icon"
													variant="outline"
												>
													<ChevronLast aria-hidden="true" size={16} />
												</Button>
											</PaginationItem>
										</PaginationContent>
									</Pagination>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

function RowActions({ t, row }: { row: Row<Event>; t: EventsTranslations }) {
	const router = useRouter()
	const [showDeleteDialog, setShowDeleteDialog] = useState(false)

	const handleEdit = () => {
		router.push(`/admin/event/edit/${row.original.id}`)
	}

	const handleDelete = () => {
		// TODO: Implement delete functionality
		console.warn('Delete event:', row.original.id)
		setShowDeleteDialog(false)
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button className="h-8 w-8 p-0" variant="ghost">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuGroup>
						<DropdownMenuItem onClick={handleEdit}>
							<Edit className="mr-2 h-4 w-4" />
							{t.events.table.actions.edit}
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => router.push(`/events/${row.original.id}`)}>
							<Eye className="mr-2 h-4 w-4" />
							{t.events.table.actions.view}
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="text-destructive focus:text-destructive"
						onClick={() => setShowDeleteDialog(true)}
					>
						<Trash2 className="mr-2 h-4 w-4" />
						{t.events.table.actions.delete}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog onOpenChange={setShowDeleteDialog} open={showDeleteDialog}>
				<AlertDialogContent>
					<div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
						<div aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full border">
							<CircleAlert className="opacity-80" size={16} />
						</div>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete the event "{row.original.name}".
							</AlertDialogDescription>
						</AlertDialogHeader>
					</div>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={handleDelete}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
