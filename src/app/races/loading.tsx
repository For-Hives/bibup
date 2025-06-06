export default function Loading() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {/* Title Skeleton */}
        <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>

        <div className="w-full max-w-2xl">
          {/* Form Skeleton */}
          <div className="flex gap-4 items-center flex-col sm:flex-row mb-8">
            <div className="flex gap-4 w-full sm:w-auto">
              {/* Input Skeleton */}
              <div className="h-10 w-full sm:w-64 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              {/* Button Skeleton */}
              <div className="h-10 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Race List Section Skeleton */}
          <div className="mt-8">
            {/* Section Title Skeleton */}
            <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-4"></div>

            {/* Race Items Skeleton */}
            <ul className="space-y-2">
              {[...Array(5)].map((_, index) => (
                <li key={index}>
                  <div className="h-6 w-full max-w-xs bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
