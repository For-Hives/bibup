export default function Loading() {
	return (
		<div className="container mx-auto max-w-7xl p-6">
			<div className="space-y-8">
				{/* Header */}
				<div className="space-y-2">
					<div className="h-8 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
					<div className="h-4 w-96 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 5 }).map((_, i) => (
						<div className="h-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" key={i}></div>
					))}
				</div>

				{/* Quick Actions */}
				<div className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>

				{/* Recent Activity */}
				<div className="h-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>

				{/* Management Sections */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
					<div className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
				</div>
			</div>
		</div>
	)
}
