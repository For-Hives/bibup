export default function Loading() {
	return (
		<div className="space-y-6 rounded-xl border border-[var(--border-color)] bg-white p-6 shadow-lg md:p-8 dark:bg-neutral-800">
			{/* Event Name Field */}
			<div>
				<div className="mb-1 h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-neutral-600"></div>
				<div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-neutral-600"></div>
			</div>

			{/* Event Date Field */}
			<div>
				<div className="mb-1 h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-neutral-600"></div>
				<div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-neutral-600"></div>
			</div>

			{/* Event Location Field */}
			<div>
				<div className="mb-1 h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-neutral-600"></div>
				<div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-neutral-600"></div>
			</div>

			{/* Event Description Field */}
			<div>
				<div className="mb-1 h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-neutral-600"></div>
				<div className="h-24 w-full animate-pulse rounded-md bg-gray-200 dark:bg-neutral-600"></div>
			</div>

			{/* Participant Count Field */}
			<div>
				<div className="mb-1 h-4 w-36 animate-pulse rounded bg-gray-200 dark:bg-neutral-600"></div>
				<div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-neutral-600"></div>
			</div>

			{/* Submit Button */}
			<div className="h-10 w-full animate-pulse rounded bg-gray-200 dark:bg-neutral-600"></div>
		</div>
	)
}
