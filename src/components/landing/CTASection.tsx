'use client'

import { CTASection } from '@/components/ui/cta-with-rectangle'

export default function BibUpCTA() {
	return (
		<CTASection
			actions={[
				{
					variant: 'default',
					text: 'Accéder à la WebApp',
					href: '/marketplace',
				},
				{
					variant: 'outline',
					text: 'Devenir organisateur partenaire',
					href: '/dashboard/organizer',
				},
			]}
			badge={{
				text: 'Solution Gagnante',
			}}
			className="from-background via-primary/5 to-background bg-gradient-to-br"
			description="Organisateurs : réduisez vos risques et votre charge administrative • Coureurs : achetez et vendez en toute sécurité, sans négociation ni stress"
			title="BibUp transforme la gestion des transferts de dossards en solution gagnante pour tous"
			withGlow={true}
		/>
	)
}
