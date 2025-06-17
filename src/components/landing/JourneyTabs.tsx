'use client'

import { DollarSign, ShoppingCart } from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FeatureSteps } from '@/components/ui/FeatureSteps'

const sellerJourney = [
	{
		title: 'Création de compte',
		step: 'Étape 1',
		image: '/landing/how-it-works/inscription.jpg',
		content: 'Inscription rapide et confirmation par email',
	},
	{
		title: 'Enregistrement du dossard',
		step: 'Étape 2',
		image: '/landing/how-it-works/saisie.jpg',
		content: "Saisie du numéro d'inscription et données d'inscription",
	},
	{
		title: 'Validation',
		step: 'Étape 3',
		image: '/landing/how-it-works/validation.jpg',
		content: "Vérification auprès de l'organisateur",
	},
	{
		title: 'Mise en vente',
		step: 'Étape 4',
		image: '/landing/how-it-works/marketplace.jpg',
		content: 'Définition du prix et publication de votre offre publique ou privée',
	},
	{
		title: 'Paiement',
		step: 'Étape 5',
		image: '/landing/how-it-works/run.jpg',
		content: "Réception des fonds sur votre compte BibUp puis retirer l'argent sur votre compte bancaire",
	},
]

const buyerJourney = [
	{
		title: 'Création de compte',
		step: 'Étape 1',
		image: '/landing/how-it-works/inscription.jpg',
		content: 'Inscription et confirmation par email',
	},
	{
		title: 'Recherche de course',
		step: 'Étape 2',
		image: '/landing/how-it-works/search-buy.jpg',
		content: 'Navigation dans les courses et dossards disponibles',
	},
	{
		title: 'Achat',
		step: 'Étape 3',
		image: '/landing/how-it-works/marketplace.jpg',
		content: 'Saisie des informations coureur et paiement sécurisé',
	},
	{
		title: 'Confirmation',
		step: 'Étape 4',
		image: '/landing/how-it-works/confirmation.jpg',
		content: "Email de confirmation d'achat immédiat",
	},
	{
		title: 'Intégration course',
		step: 'Étape 5',
		image: '/landing/how-it-works/run.jpg',
		content: "Confirmation d'inscription auprès de l'organisateur",
	},
]

export default function JourneyTabs() {
	return (
		<section className="bg-muted/30 py-16 md:py-24">
			<div className="mx-auto max-w-7xl px-4">
				<div className="mb-12 text-center">
					<h2 className="text-foreground mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
						Comment ça marche ?
					</h2>
					<p className="text-muted-foreground mx-auto max-w-3xl text-lg md:text-xl">
						Découvrez le processus simple et sécurisé pour vendre ou acheter des dossards sur BibUp
					</p>
				</div>

				<Tabs className="w-full" defaultValue="buyer">
					<TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-2">
						<TabsTrigger className="flex cursor-pointer items-center gap-2" value="buyer">
							<ShoppingCart className="h-4 w-4" />
							Parcours Acheteur
						</TabsTrigger>
						<TabsTrigger className="flex cursor-pointer items-center gap-2" value="seller">
							<DollarSign className="h-4 w-4" />
							Parcours Vendeur
						</TabsTrigger>
					</TabsList>

					<TabsContent className="mt-0" value="buyer">
						<FeatureSteps autoPlayInterval={3000} features={buyerJourney} />
					</TabsContent>
					<TabsContent className="mt-0" value="seller">
						<FeatureSteps autoPlayInterval={3000} features={sellerJourney} />
					</TabsContent>
				</Tabs>
			</div>
		</section>
	)
}
