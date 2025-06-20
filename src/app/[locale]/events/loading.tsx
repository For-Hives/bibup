export default function Loading() {
	return (
		<div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
			<main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
				{/* Title Skeleton */}
				<div className="h-8 w-48 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>

				<div className="w-full max-w-2xl">
					{/* Form Skeleton */}
					<div className="mb-8 flex flex-col items-center gap-4 sm:flex-row">
						<div className="flex w-full gap-4 sm:w-auto">
							{/* Input Skeleton */}
							<div className="h-10 w-full animate-pulse rounded bg-gray-300 sm:w-64 dark:bg-gray-700"></div>
							{/* Button Skeleton */}
							<div className="h-10 w-16 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
						</div>
					</div>

					{/* Race List Section Skeleton */}
					<div className="mt-8">
						{/* Section Title Skeleton */}
						<div className="mb-4 h-8 w-32 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>

						{/* Race Items Skeleton */}
						<ul className="space-y-2">
							{Array.from({ length: 5 }, (_, index) => (
								<li key={index}>
									<div className="h-6 w-full max-w-xs animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</main>
		</div>
	)
}
