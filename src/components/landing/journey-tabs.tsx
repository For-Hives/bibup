'use client'

import { DollarSign, ShoppingCart } from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FeatureSteps } from '@/components/ui/feature-steps'

const sellerJourney = [
	{
		title: 'Création de compte',
		step: 'Étape 1',
		image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3',
		content: 'Inscription rapide et confirmation par email',
	},
	{
		title: 'Enregistrement du dossard',
		step: 'Étape 2',
		image:
			'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?q=80&w=2274&auto=format&fit=crop&ixlib=rb-4.0.3',
		content: "Saisie du numéro d'inscription et données d'inscription",
	},
	{
		title: 'Validation',
		step: 'Étape 3',
		image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=2126&auto=format&fit=crop&ixlib=rb-4.0.3',
		content: "Vérification auprès de l'organisateur",
	},
	{
		title: 'Mise en vente',
		step: 'Étape 4',
		image:
			'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=2339&auto=format&fit=crop&ixlib=rb-4.0.3',
		content: 'Définition du prix et publication de votre offre publique ou privée',
	},
	{
		title: 'Paiement',
		step: 'Étape 5',
		image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3',
		content: "Réception des fonds sur votre compte BibUp puis retirer l'argent sur votre compte bancaire",
	},
]

const buyerJourney = [
	{
		title: 'Création de compte',
		step: 'Étape 1',
		image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3',
		content: 'Inscription et confirmation par email',
	},
	{
		title: 'Recherche de course',
		step: 'Étape 2',
		image:
			'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3',
		content: 'Navigation dans les courses et dossards disponibles',
	},
	{
		title: 'Achat',
		step: 'Étape 3',
		image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3',
		content: 'Saisie des informations coureur et paiement sécurisé',
	},
	{
		title: 'Confirmation',
		step: 'Étape 4',
		image:
			'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3',
		content: "Email de confirmation d'achat immédiat",
	},
	{
		title: 'Intégration course',
		step: 'Étape 5',
		image:
			'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3',
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

				<Tabs className="w-full" defaultValue="seller">
					<TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-2">
						<TabsTrigger className="flex cursor-pointer items-center gap-2" value="seller">
							<DollarSign className="h-4 w-4" />
							Parcours Vendeur
						</TabsTrigger>
						<TabsTrigger className="flex cursor-pointer items-center gap-2" value="buyer">
							<ShoppingCart className="h-4 w-4" />
							Parcours Acheteur
						</TabsTrigger>
					</TabsList>

					<TabsContent className="mt-0" value="seller">
						<FeatureSteps autoPlayInterval={3000} features={sellerJourney} />
					</TabsContent>

					<TabsContent className="mt-0" value="buyer">
						<FeatureSteps autoPlayInterval={3000} features={buyerJourney} />
					</TabsContent>
				</Tabs>
			</div>
		</section>
	)
}
