import Image from 'next/image'
import Link from 'next/link'

import { HeroAnimation } from '@/components/landing/hero-animation'

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

export default function Home() {
	return (
		<div className="">
			{/* Hero Section */}
			<section className="relative pt-40">
				<Image
					alt="template-run"
					className="-z-10 -scale-x-100 overflow-hidden object-cover object-center opacity-30"
					fill
					sizes="100vw"
					src={'/TRV_Ultra_AlexDiaz.jpg'}
				/>
				<div className="from-background/100 to-background/100 absolute inset-0 -z-10 bg-gradient-to-r via-zinc-900/60"></div>
				<div className="z-20 mx-auto max-w-7xl">
					<div className="grid grid-cols-12 gap-4">
						<div className="col-span-5 flex flex-col justify-center gap-6 pb-32">
							<h1 className="text-foreground text-5xl font-bold tracking-tight">
								Un imprévu ?
								<br />
								Transfert ton dossard !
							</h1>
							<p className="text-muted-foreground text-lg">
								Que vous soyez plutôt running, trail, triathlon ou encore cyclisme Trouvez votre course favorite ou
								vendez votre dossard en toute confiance.
							</p>
							<div className="flex flex-row gap-4">
								<div>
									<Link
										className="border-input bg-background ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-11 items-center justify-center rounded-md border px-8 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
										href="/marketplace"
									>
										Organisateur ? Liste ta course
									</Link>
								</div>
								<div>
									<Link
										className="bg-primary text-primary-foreground ring-offset-background hover:bg-primary/90 focus-visible:ring-ring inline-flex h-11 items-center justify-center rounded-md px-8 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
										href="/events"
									>
										Consulter les courses
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

			{/* Features Section */}
			<section className="bg-muted/40 px-4 py-16">
				<div className="mx-auto max-w-6xl">
					<h2 className="text-foreground mb-12 text-center text-3xl font-bold tracking-tight">
						Pourquoi choisir Beswib ?
					</h2>
					<div className="grid gap-8 md:grid-cols-3">
						<div className="text-center">
							<div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
								<span className="text-primary text-xl">🏃</span>
							</div>
							<h3 className="text-foreground mb-2 text-xl font-semibold">Courses</h3>
							<p className="text-muted-foreground">
								Découvrez une large sélection d'événements sportifs et trouvez votre prochaine course
							</p>
						</div>
						<div className="text-center">
							<div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
								<span className="text-primary text-xl">🛒</span>
							</div>
							<h3 className="text-foreground mb-2 text-xl font-semibold">Marché</h3>
							<p className="text-muted-foreground">
								Achetez et vendez des dossards en toute sécurité avec notre plateforme de confiance
							</p>
						</div>
						<div className="text-center">
							<div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
								<span className="text-primary text-xl">📅</span>
							</div>
							<h3 className="text-foreground mb-2 text-xl font-semibold">Calendrier</h3>
							<p className="text-muted-foreground">
								Organisez vos événements et ne manquez jamais une course importante
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}
