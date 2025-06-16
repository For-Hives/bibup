import Link from 'next/link'

import type { Event } from '@/models/event.model'

import { fetchApprovedPublicEvents } from '@/services/event.services'
import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import homeTranslations from './locales.json'

export default async function Home() {
	let totalEvents = 0
	let totalBibsSold = 0

	// Get locale and translations with automatic type inference
	const locale = await getLocale()
	const t = getTranslations(locale, homeTranslations) // No manual type assertion needed!

	try {
		const events: Event[] = await fetchApprovedPublicEvents()
		totalEvents = events.length
		totalBibsSold = 69 // TODO: recalculate this based on actual bib sales data (no precalculed data available)
	} catch (error) {
		console.error('Failed to fetch event data for KPIs:', error)
	}

	return (
		<div>hi</div>
		// TODO: Implement full landing page with translations
		// <div className="font-[family-name:var(--font-geist-sans)] text-[var(--text-dark)]">
		// 	{/* Hero Section */}
		// 	<section className="bg-[var(--primary-pastel)] px-4 py-16 text-center md:py-24">
		// 		<h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">{t.home.hero.title}</h1>
		// 		<p className="mb-8 text-lg text-white/90 md:text-xl">{t.home.hero.subtitle}</p>
		// 		<Link className="btn btn-primary px-8 py-3 text-lg" href="/events">
		// 			{t.home.hero.browseEventsButton}
		// 		</Link>
		// 	</section>
		// 	{/* More sections... */}
		// </div>
	)
}
