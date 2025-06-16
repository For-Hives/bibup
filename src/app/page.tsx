import Link from 'next/link'

import CardMarket from '@/components/marketplace/card-market'

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col">
			{/* Hero Section */}
			<section className="from-background to-muted/20 flex flex-1 items-center justify-center bg-gradient-to-b px-4 py-16 text-center">
				<div className="mx-auto max-w-4xl space-y-6">
					<h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-6xl">
						Bienvenue sur <span className="text-primary">Beswib</span>
					</h1>
					<p className="text-muted-foreground text-xl sm:text-2xl">
						La plateforme pour acheter et vendre des dossards de course
					</p>
					<div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
						<Link
							className="bg-primary text-primary-foreground ring-offset-background hover:bg-primary/90 focus-visible:ring-ring inline-flex h-11 items-center justify-center rounded-md px-8 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
							href="/events"
						>
							Découvrir les événements
						</Link>
						<Link
							className="border-input bg-background ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-11 items-center justify-center rounded-md border px-8 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
							href="/marketplace"
						>
							Parcourir le marché
						</Link>
					</div>
				</div>
			</section>
			<div className="flex flex-col gap-4 p-10">
				<div className="flex w-full justify-center">
					<CardMarket />
				</div>
			</div>

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
