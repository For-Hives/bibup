'use client'

import { CTASection } from '@/components/ui/cta-with-rectangle'

export default function BibUpCTA() {
	return (
		<CTASection
			actions={[
				{
					variant: 'outline',
					text: 'Devenir organisateur partenaire',
					href: '/dashboard/organizer',
				},
				{
					variant: 'default',
					text: 'Accéder à la WebApp',
					href: '/marketplace',
				},
			]}
			withGlow={true}
		/>
	)
}
