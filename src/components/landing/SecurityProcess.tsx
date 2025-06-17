'use client'

import { CheckCircle, FileCheck, Handshake, RefreshCcw, Shield } from 'lucide-react'

import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline'

const securityProcessData = [
	{
		title: 'Partenariat',
		status: 'completed' as const,
		relatedIds: [1],
		id: 0,
		icon: Handshake,
		energy: 100,
		date: 'Étape 0',
		content: 'Partenariat avec les organisateurs des courses et autorisation avec eux pour assurer la légitimité.',
		category: 'Partenariat',
	},
	{
		title: 'Certification',
		status: 'completed' as const,
		relatedIds: [0, 2],
		id: 1,
		icon: Shield,
		energy: 95,
		date: 'Étape 1',
		content: "Vérification de la validité de l'inscription du vendeur et certification du dossard en vente.",
		category: 'Certification',
	},
	{
		title: 'Transfert',
		status: 'in-progress' as const,
		relatedIds: [1, 3],
		id: 2,
		icon: RefreshCcw,
		energy: 80,
		date: 'Étape 2',
		content: "Collecte des données d'inscription du nouveau coureur et transfert de propriété du dossard.",
		category: 'Transfert',
	},
	{
		title: 'Mise à jour',
		status: 'pending' as const,
		relatedIds: [2, 4],
		id: 3,
		icon: FileCheck,
		energy: 60,
		date: 'Étape 3',
		content: "Modification des données coureur auprès de l'organisateur et mise à jour des informations.",
		category: 'Mise à jour',
	},
	{
		title: 'Confirmation',
		status: 'pending' as const,
		relatedIds: [3],
		id: 4,
		icon: CheckCircle,
		energy: 100,
		date: 'Étape 4',
		content: "Validation finale auprès de toutes les parties et notifications de confirmation d'inscription.",
		category: 'Confirmation',
	},
]

export default function SecurityProcess() {
	return (
		<section className="">
			{/* Header Section */}
			<div className="mx-auto max-w-7xl">
				<h2 className="mb-4 text-center text-4xl font-bold text-white">Sécurité Maximale</h2>
				<p className="mx-auto max-w-2xl text-lg text-blue-200">
					Chaque transaction est traitée automatiquement avec la plus haute sécurité
				</p>
			</div>

			{/* Timeline Component */}
			<RadialOrbitalTimeline timelineData={securityProcessData} />
		</section>
	)
}
