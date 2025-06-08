import type { Metadata } from 'next'

import { getDictionary } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'Dashboard | BibUp',
}

export default async function DashboardPage() {
	const locale = await getLocale()
	const dictionary = await getDictionary(locale)
	const { userId } = await auth()

	if (userId == null) {
		// Optionally, redirect to login if not authenticated, though Clerk should handle this.
		// For now, we'll just not render the links if no user.
		// Or, this page could be protected by middleware.
	}

	return (
		<div className="mx-auto max-w-4xl p-4 text-[var(--text-dark)] md:p-8">
			<header className="mb-12 text-center">
				<h1 className="text-4xl font-bold">{dictionary.dashboard.title}</h1>
			</header>

			{userId != null && (
				<nav className="grid grid-cols-1 gap-6 md:grid-cols-3">
					<Link
						className="block rounded-xl border border-[var(--border-color)] bg-white p-6 text-center shadow-lg transition-shadow hover:shadow-xl dark:bg-neutral-800"
						href="/dashboard/organizer"
					>
						<h2 className="mb-2 text-2xl font-semibold">{dictionary.dashboard.organizer.title}</h2>
						<p className="text-sm text-gray-600 dark:text-gray-400">{dictionary.dashboard.organizer.description}</p>
					</Link>
					<Link
						className="block rounded-xl border border-[var(--border-color)] bg-white p-6 text-center shadow-lg transition-shadow hover:shadow-xl dark:bg-neutral-800"
						href="/dashboard/buyer"
					>
						<h2 className="mb-2 text-2xl font-semibold">{dictionary.dashboard.buyer.title}</h2>
						<p className="text-sm text-gray-600 dark:text-gray-400">{dictionary.dashboard.buyer.description}</p>
					</Link>
					<Link
						className="block rounded-xl border border-[var(--border-color)] bg-white p-6 text-center shadow-lg transition-shadow hover:shadow-xl dark:bg-neutral-800"
						href="/dashboard/seller"
					>
						<h2 className="mb-2 text-2xl font-semibold">{dictionary.dashboard.seller.title}</h2>
						<p className="text-sm text-gray-600 dark:text-gray-400">{dictionary.dashboard.seller.description}</p>
					</Link>
				</nav>
			)}

			{userId == null && (
				<div className="text-center">
					<p>{dictionary.auth.signInToAccessDashboard}</p>
					{/* Optionally, add a sign-in button here if not relying on global auth handling */}
				</div>
			)}
		</div>
	)
}
