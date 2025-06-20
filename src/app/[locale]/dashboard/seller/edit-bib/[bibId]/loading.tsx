export default function Loading() {
	return (
		<div className="container mx-auto max-w-3xl p-4">
			{/* Header */}
			<header className="mb-8 text-center">
				<div className="mx-auto mb-2 h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
				<div className="mx-auto h-4 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
			</header>

			{/* Event Details Section */}
			<section className="mb-8 rounded-lg border bg-white p-6 shadow-md dark:border-neutral-700 dark:bg-neutral-800">
				<div className="mb-4 h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
						<div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
					</div>
					<div className="space-y-2">
						<div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
						<div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
					</div>
					<div className="space-y-2">
						<div className="h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
						<div className="h-4 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
					</div>
				</div>
			</section>

			{/* Bib Details Section */}
			<section className="mb-8 rounded-lg border bg-white p-6 shadow-md dark:border-neutral-700 dark:bg-neutral-800">
				<div className="mb-4 h-6 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
				<div className="space-y-4">
					{/* Registration Number */}
					<div>
						<div className="mb-1 h-4 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
						<div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-600"></div>
					</div>

					{/* Price */}
					<div>
						<div className="mb-1 h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
						<div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-600"></div>
					</div>

					{/* Original Price */}
					<div>
						<div className="mb-1 h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
						<div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-600"></div>
					</div>

					{/* Size */}
					<div>
						<div className="mb-1 h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
						<div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-600"></div>
					</div>

					{/* Gender */}
					<div>
						<div className="mb-1 h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
						<div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-600"></div>
					</div>

					{/* Update Button */}
					<div className="h-10 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
				</div>
			</section>

			{/* Listing Status Section */}
			<section className="mb-8 rounded-lg border bg-white p-6 shadow-md dark:border-neutral-700 dark:bg-neutral-800">
				<div className="mb-4 h-6 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
				<div className="space-y-4">
					<div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-600"></div>
					<div className="h-10 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
				</div>
			</section>

			{/* Withdraw Section */}
			<section className="mb-8 rounded-lg border bg-white p-6 shadow-md dark:border-neutral-700 dark:bg-neutral-800">
				<div className="mb-4 h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
				<div className="h-10 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
			</section>

			{/* Back to Dashboard Link */}
			<div className="mt-8 text-center">
				<div className="mx-auto h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
			</div>
		</div>
	)
}
