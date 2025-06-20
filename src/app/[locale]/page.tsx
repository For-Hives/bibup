import { generateLocaleParams, type LocaleParams } from '@/lib/generateStaticParams'
import SecurityProcess from '@/components/landing/security-process/SecurityProcess'
import JourneyTabs from '@/components/landing/journey-tabs/JourneyTabs'
import FeaturesBento from '@/components/landing/features/Features'
import BibStats from '@/components/landing/bib-stats/BibStats'
import BesWibCTA from '@/components/landing/cta/CTASection'
import Hero from '@/components/landing/hero/Hero'

// Generate static params for all locales
export function generateStaticParams() {
	return generateLocaleParams()
}

export default async function Home({ params }: { params: Promise<LocaleParams> }) {
	// Locale will be used when components are updated for i18n
	await params

	return (
		<div className="relative">
			{/* Hero Section */}
			<Hero localeParams={params} />
			{/* Stats Section */}
			<BibStats localeParams={params} />
			{/* Journey Section */}
			<JourneyTabs localeParams={params} />
			{/* Features Section */}
			<FeaturesBento localeParams={params} />
			{/* Security Process Section */}
			<SecurityProcess localeParams={params} />
			{/* CTA Section */}
			<BesWibCTA localeParams={params} />
			{/* <MarketplaceGrid />  */}
			{/* 
			<div className="fixed right-0 bottom-0 z-50 m-8 mb-24 flex items-center gap-2 rounded-3xl border border-amber-500 bg-white p-2 text-amber-500">
				<TrafficCone className="h-4 w-4" />
				<p className="text-sm">{t.home.hero.workInProgress}</p>
			</div> */}
		</div>
	)
}
