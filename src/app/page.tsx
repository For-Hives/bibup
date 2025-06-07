import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-center px-4 sm:px-6 lg:px-8"> {/* 128px = header + footer height approx */}
      <main className="py-12 sm:py-20">
        <Image
          className="mx-auto mb-8 dark:invert" // Kept Next.js logo for now as per instruction, can be replaced
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={38}
          priority
        />

        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Welcome to <span className="text-blue-600">BibUp</span>!
        </h1>

        <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-10">
          Your go-to marketplace for buying and selling race bibs. Whether you can no longer make a race
          or you're looking for a last-minute entry, BibUp connects you with fellow runners.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/races"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Explore Races & Find Bibs
          </Link>
          <Link
            href="/dashboard/my-bibs" // This will redirect to sign-in if not authenticated
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
          >
            Sell Your Bib
          </Link>
        </div>

        <div className="mt-16 text-gray-500">
          <p className="text-sm">
            Ready to get started? <Link href="/sign-up" className="text-blue-600 hover:underline font-medium">Sign up now</Link> or browse the available races.
          </p>
        </div>
      </main>
    </div>
  );
}
