import type { Event } from '@/models/event.model'

import { type Dictionary, getTranslationsFromData } from '@/lib/getDictionary' // Updated import
import { getLocale } from '@/lib/getLocale'
import Link from 'next/link'

import { fetchApprovedPublicEvents } from '@/services/event.services'

import homeTranslations from './locales.json' // Import the new locales.json

export default async function Home() {
	let totalEvents = 0
	let totalBibsSold = 0

	// Get locale and dictionary
	const locale = await getLocale()
	// Get translations specifically for the home page using the new system
	const dictionary: Dictionary = getTranslationsFromData(locale, homeTranslations)

	try {
		const events: Event[] = await fetchApprovedPublicEvents()
		totalEvents = events.length
		totalBibsSold = events.reduce((sum, event) => sum + (event.bibsSold ?? 0), 0)
	} catch (error) {
		console.error('Failed to fetch event data for KPIs:', error)
	}

	// Ensure dictionary and its nested properties exist to prevent runtime errors
	const heroTitle = dictionary.home?.hero?.title ?? 'Welcome!' // Fallback text
	const heroSubtitle = dictionary.home?.hero?.subtitle ?? 'Find your next race bib.'
	const browseEventsButton = dictionary.home?.hero?.browseEventsButton ?? 'Browse Events'
	const impactTitle = dictionary.home?.impact?.title ?? 'Our Impact'
	const activeEventsText = dictionary.home?.impact?.activeEvents ?? 'Active Events'
	const bibsExchangedText = dictionary.home?.impact?.bibsExchanged ?? 'Bibs Exchanged'
	const ctaTitle = dictionary.home?.callToAction?.title ?? 'Get Started'
	const ctaDescription = dictionary.home?.callToAction?.description ?? 'Learn more or browse events.'
	const learnMoreButton = dictionary.home?.callToAction?.learnMoreButton ?? 'Learn More'

	return (
		<div className="font-[family-name:var(--font-geist-sans)] text-[var(--text-dark)]">
			{/* Hero Section */}
			<section className="bg-[var(--primary-pastel)] px-4 py-16 text-center md:py-24">
				<h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">{heroTitle}</h1>
				<p className="mb-8 text-lg text-white/90 md:text-xl">{heroSubtitle}</p>
				<Link className="btn btn-primary px-8 py-3 text-lg" href="/events">
					{browseEventsButton}
				</Link>
			</section>

			{/* KPIs Section - Bento Box Style */}
			<section className="px-4 py-12">
				<div className="mx-auto max-w-4xl text-center">
					<h2 className="mb-8 text-3xl font-bold text-[var(--text-dark)]">{impactTitle}</h2>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						{/* Bento Box for Active Events */}
						<div className="bento-box flex flex-col items-center justify-center text-center">
							<h3 className="mb-2 text-4xl font-bold text-[var(--accent-sporty)]">{totalEvents}</h3>
							<p className="text-xl text-[var(--text-dark)]">{activeEventsText}</p>
						</div>
						{/* Bento Box for Bibs Exchanged */}
						<div className="bento-box flex flex-col items-center justify-center text-center">
							<h3 className="mb-2 text-4xl font-bold text-[var(--accent-sporty)]">{totalBibsSold}</h3>
							<p className="text-xl text-[var(--text-dark)]">{bibsExchangedText}</p>
						</div>
					</div>
				</div>
			</section>

			{/* Call to Action / How it works (Simplified) */}
			<section className="bg-[var(--secondary-pastel)]/30 px-4 py-12">
				<div className="mx-auto max-w-4xl text-center">
					<h2 className="mb-4 text-3xl font-bold text-[var(--text-dark)]">{ctaTitle}</h2>
					<p className="mb-8 text-lg text-[var(--text-dark)]/80">{ctaDescription}</p>
					<div className="flex flex-col justify-center gap-4 md:flex-row">
						<Link className="btn btn-secondary" href="/faq">
							{learnMoreButton}
						</Link>
						{/* Future: Link to Sign Up or specific user roles */}
						{/* <Link href="/sign-up" className="btn btn-primary">
              Get Started
            </Link> */}
					</div>
				</div>
			</section>

			{/* Original Next.js info section - can be kept for reference or removed */}
			{/*
      <section className="p-8 pb-20 items-center justify-items-center bg-gray-100 dark:bg-gray-700">
        <main className="flex flex-col gap-[32px] items-center sm:items-start max-w-2xl mx-auto">
          <Image
            className="dark:invert mx-auto"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            <li className="mb-2 tracking-[-.01em]">
              Get started by editing{" "}
              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
                src/app/page.tsx
              </code>
            </li>
            <li className="tracking-[-.01em]">
              Save and see your changes instantly.
            </li>
          </ol>
        </main>
      </section>
      */}
		</div>
	)
}
