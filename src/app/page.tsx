import { TrafficCone } from 'lucide-react'

import Image from 'next/image'
import Link from 'next/link'

import { HeroAnimation } from '@/components/landing/HeroAnimation'
import SecurityProcess from '@/components/landing/SecurityProcess'
import JourneyTabs from '@/components/landing/JourneyTabs'
import FeaturesBento from '@/components/landing/Features'
import BesWibCTA from '@/components/landing/CTASection'
import { getTranslations } from '@/lib/getDictionary'
import BibStats from '@/components/landing/BibStats'
import { getLocale } from '@/lib/getLocale'

import translations from './locales.json'

const runs = [
	{
		price: 79.99,
		originalPrice: 100,
		event: {
			participantCount: 10000,
			name: 'Marathon de Nantes',
			location: 'Nantes',
			image: '/bib-red.png',
			distanceUnit: 'km',
			distance: 42,
			date: new Date(),
		},
	},
	{
		price: 440,
		originalPrice: 500,
		event: {
			participantCount: 64000,
			name: 'Ironman Nice',
			location: 'Nice',
			image: '/bib-green.png',
			distanceUnit: 'km',
			distance: 226,
			date: new Date(),
		},
	},
	{
		price: 9.99,
		originalPrice: 15,
		event: {
			participantCount: 2630,
			name: 'Semi-marathon de Thonon',
			location: 'Thonon-les-bains',
			image: '/bib-pink.png',
			distanceUnit: 'km',
			distance: 21,
			date: new Date(),
		},
	},
	{
		price: 79.99,
		originalPrice: 100,
		event: {
			participantCount: 10000,
			name: 'Marathon de Paris',
			location: 'Paris',
			image: '/bib-blue.png',
			distanceUnit: 'km',
			distance: 42,
			date: new Date(),
		},
	},
	{
		price: 900,
		originalPrice: 600,
		event: {
			participantCount: 9000,
			name: 'Ultra Trail du Mont Blanc',
			location: 'Chamonix',
			image: '/bib-orange.png',
			distanceUnit: 'km',
			distance: 170,
			date: new Date(),
		},
	},
]

export default async function Home() {
	const locale = await getLocale()
	const t = getTranslations(locale, translations)

	return (
		<div className="relative">
			{/* Hero Section */}
			<section className="relative pt-40">
				<Image
					alt="template-run"
					className="-z-10 -scale-x-100 overflow-hidden object-cover object-center opacity-30"
					fill
					sizes="100vw"
					src={'/landing/background.jpg'}
				/>
				<div className="from-background/100 to-background/100 absolute inset-0 -z-10 bg-gradient-to-r via-zinc-900/60"></div>
				<div className="z-20 mx-auto max-w-7xl">
					<div className="grid grid-cols-12 gap-4">
						<div className="col-span-5 flex flex-col justify-center gap-6 pb-32">
							<h1
								className="text-foreground text-5xl font-bold tracking-tight"
								dangerouslySetInnerHTML={{ __html: t.home.hero.title }}
							></h1>
							<p className="text-muted-foreground text-lg">{t.home.hero.description}</p>
							<div className="flex flex-row gap-4">
								<div>
									<Link
										className="border-input bg-background ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-11 items-center justify-center rounded-md border px-8 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
										href="/marketplace"
									>
										{t.home.hero.organizerButton}
									</Link>
								</div>
								<div>
									<Link
										className="bg-primary text-primary-foreground ring-offset-background hover:bg-primary/90 focus-visible:ring-ring inline-flex h-11 items-center justify-center rounded-md px-8 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
										href="/events"
									>
										{t.home.hero.consultRacesButton}
									</Link>
								</div>
							</div>
						</div>
						<div className="col-span-7">
							<HeroAnimation runs={runs} />
						</div>
					</div>
				</div>
			</section>
			{/* Stats Section */}
			<BibStats />
			{/* Journey Section */}
			<JourneyTabs />
			{/* Features Section */}
			<FeaturesBento />
			{/* Security Process Section */}
			<SecurityProcess />
			{/* CTA Section */}
			<BesWibCTA />
			{/* <MarketplaceGrid />  */}

			<div className="fixed right-0 bottom-0 z-50 m-8 flex items-center gap-2 rounded-3xl border border-amber-500 bg-white p-2 text-amber-500">
				<TrafficCone className="h-4 w-4" />
				<p className="text-sm">{t.home.hero.workInProgress}</p>
			</div>
		</div>
	)
}
