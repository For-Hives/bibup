import {
	IconBolt,
	IconCalendar,
	IconCreditCard,
	IconLock,
	IconShield,
	IconTrendingUp,
	IconUsers,
} from '@tabler/icons-react'
import React from 'react'

import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'

export default function FeaturesBento() {
	return (
		<section className="bg-muted/40 px-4 py-24">
			<div className="mx-auto max-w-7xl">
				<div className="mb-16 text-center">
					<h2 className="mb-6 text-4xl font-bold tracking-tight">Pourquoi choisir BibUp ?</h2>
					<p className="text-muted-foreground mx-auto max-w-3xl text-xl">
						Des avantages concrets pour chaque acteur de l'écosystème running
					</p>
				</div>

				<BentoGrid className="max-w-7xl">
					{items.map((item, i) => (
						<BentoGridItem
							className={i === 0 || i === 6 ? 'md:col-span-2' : ''}
							description={item.description}
							icon={item.icon}
							key={i}
							title={item.title}
						/>
					))}
				</BentoGrid>
			</div>
		</section>
	)
}

const items = [
	{
		title: 'Organisateurs : Sécurité & Croissance',
		icon: <IconCalendar className="text-primary h-5 w-5" />,
		description: (
			<div className="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
				<div>
					<h4 className="text-foreground mb-2 text-sm font-semibold">🛡️ Sécurité & Conformité</h4>
					<ul className="text-muted-foreground space-y-1 text-xs">
						<li>• Couverture réglementaire et juridique complète</li>
						<li>• Réduction des fraudes et faux dossards</li>
						<li>• Traçabilité totale des transferts</li>
						<li>• Aucun flux financier à gérer</li>
					</ul>
				</div>
				<div>
					<h4 className="text-foreground mb-2 text-sm font-semibold">📈 Visibilité & Croissance</h4>
					<ul className="text-muted-foreground space-y-1 text-xs">
						<li>• Effet communautaire : trafic vers votre course</li>
						<li>• Nouvelles inscriptions indirectes</li>
						<li>• Réduisez drastiquement le nombre de non-partants</li>
						<li>• Moins de gaspillages aux ravitaillements</li>
					</ul>
				</div>
				<div className="lg:col-span-2">
					<h4 className="text-foreground mb-2 text-sm font-semibold">⚡ Simplicité Opérationnelle</h4>
					<ul className="text-muted-foreground space-y-1 text-xs">
						<li>
							• Aucune charge technique • Centralisation des demandes de transfert • Réduction drastique des emails/SAV
						</li>
					</ul>
				</div>
			</div>
		),
	},
	{
		title: 'Simplicité Opérationnelle',
		icon: <IconBolt className="text-primary h-5 w-5" />,
		description: (
			<div className="mt-2">
				<h4 className="text-foreground mb-2 text-sm font-semibold">⚡ Zéro Charge Technique</h4>
				<ul className="text-muted-foreground space-y-1 text-xs">
					<li>• Aucune charge technique</li>
					<li>• Centralisation des demandes de transfert</li>
					<li>• Réduction drastique des emails/SAV</li>
					<li>• Aucun flux financier à gérer</li>
				</ul>
			</div>
		),
	},
	{
		title: 'Acheteurs : Confiance & Simplicité',
		icon: <IconUsers className="text-primary h-5 w-5" />,
		description: (
			<div className="mt-2 grid grid-cols-1 gap-3">
				<div>
					<h4 className="text-foreground mb-2 text-sm font-semibold">🔒 Confiance & Transparence</h4>
					<ul className="text-muted-foreground space-y-1 text-xs">
						<li>• Profils vendeurs vérifiés</li>
						<li>• Aucun risque de faux dossard</li>
						<li>• Nouveau dossard à votre nom</li>
						<li>• Assurance garantie le jour J</li>
					</ul>
				</div>
				<div>
					<h4 className="text-foreground mb-2 text-sm font-semibold">🎯 Simplicité & Confort</h4>
					<ul className="text-muted-foreground space-y-1 text-xs">
						<li>• Fini les négociations sur les réseaux sociaux</li>
						<li>• Paiement 100% sécurisé</li>
						<li>• Processus rapide et automatisé</li>
						<li>• Confirmation immédiate par email</li>
					</ul>
				</div>
			</div>
		),
	},
	{
		title: 'Sécurité Avant Tout',
		icon: <IconShield className="text-primary h-5 w-5" />,
		description: (
			<div className="mt-2">
				<p className="text-muted-foreground mb-2 text-xs">
					Sécurité de bout en bout avec transactions vérifiées, prévention des fraudes et conformité légale complète
					pour tous les transferts.
				</p>
				<ul className="text-muted-foreground space-y-1 text-xs">
					<li>• Protection anti-fraude</li>
					<li>• Vérification d'identité</li>
					<li>• Conformité réglementaire</li>
				</ul>
			</div>
		),
	},
	{
		title: 'Traitement Instantané',
		icon: <IconTrendingUp className="text-primary h-5 w-5" />,
		description: (
			<div className="mt-2">
				<p className="text-muted-foreground mb-2 text-xs">
					Traitement automatisé et rapide avec confirmation immédiate. Pas d'attente, pas de tracas, juste des
					transactions fluides.
				</p>
				<ul className="text-muted-foreground space-y-1 text-xs">
					<li>• Automatisation complète</li>
					<li>• Confirmation en temps réel</li>
					<li>• Interface intuitive</li>
				</ul>
			</div>
		),
	},
	{
		title: 'Vendeurs : Flexibilité & Rentabilité',
		icon: <IconCreditCard className="text-primary h-5 w-5" />,
		description: (
			<div className="mt-2 grid grid-cols-2 gap-3">
				<div>
					<h4 className="text-foreground mb-2 text-sm font-semibold">💰 Rentabilisation</h4>
					<ul className="text-muted-foreground space-y-1 text-xs">
						<li>• Revente dernière minute</li>
						<li>• Prix défini par le vendeur</li>
						<li>• Réception des fonds immédiat</li>
					</ul>
				</div>
				<div>
					<h4 className="text-foreground mb-2 text-sm font-semibold">🔄 Flexibilité</h4>
					<ul className="text-muted-foreground space-y-1 text-xs">
						<li>• Vente publique ou privée</li>
						<li>• Mise en vente rapide</li>
						<li>• Gestion simplifiée</li>
					</ul>
				</div>
			</div>
		),
	},
	{
		title: "Tranquillité d'Esprit Complète",
		icon: <IconLock className="text-primary h-5 w-5" />,
		description: (
			<div className="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
				<div>
					<h4 className="text-foreground mb-2 text-sm font-semibold">🛡️ Protection Garantie</h4>
					<ul className="text-muted-foreground space-y-1 text-xs">
						<li>• Assurance garantie le jour de la course</li>
						<li>• Traçabilité complète des transactions</li>
						<li>• Partenariats organisateurs vérifiés</li>
					</ul>
				</div>
				<div>
					<h4 className="text-foreground mb-2 text-sm font-semibold">🎯 Support & Assistance</h4>
					<ul className="text-muted-foreground space-y-1 text-xs">
						<li>• Support client 24/7</li>
						<li>• Protection complète contre la fraude</li>
						<li>• Résolution rapide des problèmes</li>
					</ul>
				</div>
			</div>
		),
	},
]
