import {
	IconCalendar,
	IconChartBar,
	IconCreditCard,
	IconGlobe,
	IconMail,
	IconSearch,
	IconStar,
	IconUsers,
} from '@tabler/icons-react'
import React from 'react'

import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'

const ImagePlaceholder = ({
	icon: Icon,
	gradient,
	decorations,
}: {
	decorations?: React.ReactNode
	gradient: string
	icon: React.ComponentType<{ className?: string }>
}) => (
	<div className={`relative h-32 w-full rounded-lg ${gradient} overflow-hidden`}>
		{decorations}
		<div className="absolute inset-0 flex items-center justify-center">
			<Icon className="h-12 w-12 text-white/80" />
		</div>
		<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
	</div>
)

const CircleDecoration = ({ className }: { className: string }) => (
	<div className={`absolute rounded-full ${className}`} />
)

const SquareDecoration = ({ className }: { className: string }) => <div className={`absolute rounded ${className}`} />

export default function FeaturesBento() {
	return (
		<section className="bg-muted border-t border-neutral-200/10 px-4 py-24">
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
							className={item.className}
							description={item.description}
							header={item.header}
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
		header: (
			<ImagePlaceholder
				decorations={
					<>
						<CircleDecoration className="top-4 left-4 h-8 w-8 bg-white/20" />
						<CircleDecoration className="top-8 right-8 h-4 w-4 bg-white/30" />
						<SquareDecoration className="bottom-6 left-8 h-6 w-6 bg-white/10" />
					</>
				}
				gradient="bg-gradient-to-br from-slate-600/30 to-slate-800/30 backdrop-blur-sm mix-blend-hard-light"
				icon={IconCalendar}
			/>
		),
		description: (
			<div className="mt-3 grid grid-cols-1 gap-6 lg:grid-cols-2">
				<div>
					<h4 className="text-foreground mb-3 text-base font-semibold">🛡️ Sécurité & Conformité</h4>
					<ul className="text-muted-foreground space-y-2 text-sm">
						<li>• Couverture réglementaire et juridique complète</li>
						<li>• Réduction des fraudes et faux dossards</li>
						<li>• Traçabilité totale des transferts</li>
						<li>• Aucun flux financier à gérer</li>
					</ul>
				</div>
				<div>
					<h4 className="text-foreground mb-3 text-base font-semibold">📈 Visibilité & Croissance</h4>
					<ul className="text-muted-foreground space-y-2 text-sm">
						<li>• Effet communautaire : trafic vers votre course</li>
						<li>• Nouvelles inscriptions indirectes</li>
						<li>• Réduisez drastiquement le nombre de non-partants</li>
						<li>• Moins de gaspillages aux ravitaillements</li>
					</ul>
				</div>
			</div>
		),
		className: 'md:col-span-6',
	},
	{
		title: 'Acheteurs : Confiance Total',
		header: (
			<ImagePlaceholder
				decorations={
					<>
						<CircleDecoration className="top-2 right-4 h-6 w-6 bg-white/25" />
						<CircleDecoration className="bottom-4 left-6 h-3 w-3 bg-white/40" />
						<div className="absolute top-6 left-2 h-1 w-12 rounded bg-white/20" />
					</>
				}
				gradient="bg-gradient-to-br from-blue-500/30 to-cyan-500/30 backdrop-blur-sm mix-blend-hard-light"
				icon={IconUsers}
			/>
		),
		description: (
			<div className="mt-3 space-y-3">
				<div>
					<h4 className="text-foreground mb-2 text-sm font-semibold">🔒 Protection Garantie</h4>
					<p className="text-muted-foreground text-xs">
						Profils vérifiés, aucun risque de fraude, nouveau dossard à votre nom
					</p>
				</div>
				<div>
					<h4 className="text-foreground mb-2 text-sm font-semibold">⚡ Simplicité</h4>
					<p className="text-muted-foreground text-xs">Paiement sécurisé, processus automatisé</p>
				</div>
			</div>
		),
		className: 'md:col-span-3',
	},
	{
		title: 'Recherche Intelligente',
		header: (
			<ImagePlaceholder
				decorations={
					<>
						<CircleDecoration className="top-4 right-6 h-10 w-10 bg-white/15" />
						<CircleDecoration className="bottom-8 left-4 h-3 w-3 bg-white/40" />
						<div className="absolute top-8 left-8 h-6 w-6 rounded-full border-2 border-white/25" />
					</>
				}
				gradient="bg-gradient-to-br from-purple-500/30 to-violet-600/30 backdrop-blur-sm mix-blend-hard-light"
				icon={IconSearch}
			/>
		),
		description: (
			<div className="mt-3">
				<p className="text-muted-foreground mb-2 text-sm">Trouvez votre course idéale en quelques clics</p>
				<ul className="text-muted-foreground space-y-1 text-xs">
					<li>• Filtres avancés par distance, date, lieu</li>
					<li>• Suggestions personnalisées</li>
					<li>• Alertes pour vos courses favorites</li>
				</ul>
			</div>
		),
		className: 'md:col-span-3',
	},
	{
		title: 'Vendeurs : Rentabilité',
		header: (
			<ImagePlaceholder
				decorations={
					<>
						<SquareDecoration className="top-3 left-3 h-4 w-4 rotate-45 bg-white/30" />
						<CircleDecoration className="right-4 bottom-6 h-5 w-5 bg-white/20" />
						<div className="absolute bottom-2 left-2 h-8 w-8 rounded-full border border-white/30" />
					</>
				}
				gradient="bg-gradient-to-br from-emerald-500/30 to-teal-600/30 backdrop-blur-sm mix-blend-hard-light"
				icon={IconCreditCard}
			/>
		),
		description: (
			<div className="mt-3">
				<p className="text-muted-foreground mb-3 text-sm">
					Revente dernière minute, prix libre, réception immédiate des fonds
				</p>
				<div className="text-muted-foreground flex items-center space-x-2 text-xs">
					<span className="bg-primary/10 text-primary rounded px-2 py-1">Public</span>
					<span className="bg-primary/10 text-primary rounded px-2 py-1">Privé</span>
				</div>
			</div>
		),
		className: 'md:col-span-5',
	},

	{
		title: 'Analytics & Insights',
		header: (
			<ImagePlaceholder
				decorations={
					<>
						<div className="absolute bottom-4 left-4 flex space-x-1">
							<div className="h-6 w-2 rounded-sm bg-white/30" />
							<div className="h-4 w-2 rounded-sm bg-white/40" />
							<div className="h-8 w-2 rounded-sm bg-white/50" />
						</div>
						<CircleDecoration className="top-6 right-6 h-4 w-4 bg-white/25" />
					</>
				}
				gradient="bg-gradient-to-br from-orange-500/30 to-red-500/30 backdrop-blur-sm mix-blend-hard-light"
				icon={IconChartBar}
			/>
		),
		description: (
			<div className="mt-3">
				<p className="text-muted-foreground mb-2 text-sm">Suivez les tendances du marché en temps réel</p>
				<ul className="text-muted-foreground space-y-1 text-xs">
					<li>• Prix moyens par événement</li>
					<li>• Taux de demande</li>
					<li>• Prévisions de popularité</li>
				</ul>
			</div>
		),
		className: 'md:col-span-3',
	},
	{
		title: 'Communauté Globale',
		header: (
			<ImagePlaceholder
				decorations={
					<>
						<div className="absolute top-6 left-6 h-8 w-8 rounded-full border border-white/30" />
						<CircleDecoration className="top-8 right-8 h-3 w-3 bg-white/50" />
						<CircleDecoration className="bottom-6 left-8 h-2 w-2 bg-white/40" />
						<CircleDecoration className="right-4 bottom-8 h-4 w-4 bg-white/20" />
					</>
				}
				gradient="bg-gradient-to-br from-pink-500/30 to-rose-500/30 backdrop-blur-sm mix-blend-hard-light"
				icon={IconGlobe}
			/>
		),
		description: (
			<div className="mt-3">
				<p className="text-muted-foreground mb-2 text-sm">Connectez-vous avec des runners du monde entier</p>
				<div className="flex items-center space-x-2">
					<span className="text-primary text-2xl font-bold">12K+</span>
					<span className="text-muted-foreground text-xs">utilisateurs actifs</span>
				</div>
			</div>
		),
		className: 'md:col-span-4',
	},
	{
		title: 'Notifications Smart',
		header: (
			<ImagePlaceholder
				decorations={
					<>
						<SquareDecoration className="top-4 left-4 h-6 w-6 rounded-md bg-white/20" />
						<CircleDecoration className="top-2 right-6 h-3 w-3 bg-white/40" />
						<div className="absolute right-4 bottom-4 flex space-x-1">
							<div className="h-1 w-1 rounded-full bg-white/50" />
							<div className="h-1 w-1 rounded-full bg-white/50" />
							<div className="h-1 w-1 rounded-full bg-white/50" />
						</div>
					</>
				}
				gradient="bg-gradient-to-br from-indigo-500/30 to-blue-600/30 backdrop-blur-sm mix-blend-hard-light"
				icon={IconMail}
			/>
		),
		description: (
			<div className="mt-3">
				<p className="text-muted-foreground mb-2 text-sm">Restez informé au bon moment</p>
				<ul className="text-muted-foreground space-y-1 text-xs">
					<li>• Nouveaux dossards disponibles</li>
					<li>• Baisse de prix</li>
					<li>• Rappels importants</li>
				</ul>
			</div>
		),
		className: 'md:col-span-4',
	},
	{
		title: 'Support Premium 24/7',
		header: (
			<ImagePlaceholder
				decorations={
					<>
						<div className="absolute top-4 left-4">
							<div className="h-6 w-6 animate-pulse rounded-full border-2 border-white/30" />
							<div className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white/20" />
						</div>
						<CircleDecoration className="top-8 right-12 h-4 w-4 bg-white/25" />
						<CircleDecoration className="bottom-6 left-12 h-3 w-3 bg-white/35" />
						<SquareDecoration className="right-6 bottom-4 h-5 w-5 rotate-12 bg-white/15" />
					</>
				}
				gradient="bg-gradient-to-br from-yellow-500/30 via-orange-500/30 to-red-500/30 backdrop-blur-sm mix-blend-hard-light"
				icon={IconStar}
			/>
		),
		description: (
			<div className="mt-3 grid grid-cols-1 gap-6 lg:grid-cols-2">
				<div>
					<h4 className="text-foreground mb-3 text-base font-semibold">🎯 Assistance Dédiée</h4>
					<ul className="text-muted-foreground space-y-2 text-sm">
						<li>• Support client 24/7 en français</li>
						<li>• Résolution rapide des problèmes</li>
						<li>• Chat en temps réel</li>
						<li>• Suivi personnalisé</li>
					</ul>
				</div>
				<div>
					<h4 className="text-foreground mb-3 text-base font-semibold">🛡️ Garanties Premium</h4>
					<ul className="text-muted-foreground space-y-2 text-sm">
						<li>• Protection complète contre la fraude</li>
						<li>• Assurance le jour de la course</li>
						<li>• Remboursement garanti</li>
						<li>• Médiation en cas de litige</li>
					</ul>
				</div>
			</div>
		),
		className: 'md:col-span-8',
	},
]
