export default function Loading() {
	return (
		<div className="container mx-auto max-w-2xl p-6">
			{/* Header */}
			<header className="mb-8 text-center">
				<div className="mx-auto mb-4 h-8 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
			</header>

			{/* Form */}
			<div className="space-y-6">
				{/* Checkbox for not listed event */}
				<div className="flex items-center space-x-2">
					<div className="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
					<div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
				</div>

				{/* Event Selection */}
				<div>
					<div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
					<div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-600"></div>
				</div>

				{/* Registration Number */}
				<div>
					<div className="mb-2 h-4 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
					<div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-600"></div>
				</div>

				{/* Price */}
				<div>
					<div className="mb-2 h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
					<div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-600"></div>
				</div>

				{/* Original Price */}
				<div>
					<div className="mb-2 h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
					<div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-600"></div>
				</div>

				{/* Size */}
				<div>
					<div className="mb-2 h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
					<div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-600"></div>
				</div>

				{/* Gender */}
				<div>
					<div className="mb-2 h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
					<div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-600"></div>
				</div>

				{/* Notes */}
				<div>
					<div className="mb-2 h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
					<div className="h-20 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-600"></div>
				</div>

				{/* Legal Notice */}
				<div className="space-y-2">
					<div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
					<div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
				</div>

				{/* Submit Button */}
				<div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-600"></div>
			</div>

			{/* Back to Dashboard Link */}
			<div className="mt-4 h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
		</div>
	)
}
