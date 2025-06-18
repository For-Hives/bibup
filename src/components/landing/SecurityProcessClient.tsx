'use client'

import { CheckCircle, FileCheck, Handshake, RefreshCcw, Shield } from 'lucide-react'

import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline'

interface SecurityProcessClientProps {
	translations: {
		security: {
			certification: { content: string; title: string }
			confirmation: { content: string; title: string }
			partnership: { content: string; title: string }
			subtitle: string
			title: string
			transfer: { content: string; title: string }
			update: { content: string; title: string }
		}
	}
}

export default function SecurityProcessClient({ translations }: SecurityProcessClientProps) {
	const t = translations

	const securityProcessData = [
		{
			title: t.security.partnership.title,
			status: 'completed' as const,
			relatedIds: [1],
			id: 0,
			icon: Handshake,
			energy: 100,
			date: 'Step 1',
			content: t.security.partnership.content,
			category: 'Partnership',
		},
		{
			title: t.security.certification.title,
			status: 'completed' as const,
			relatedIds: [0, 2],
			id: 1,
			icon: Shield,
			energy: 95,
			date: 'Step 2',
			content: t.security.certification.content,
			category: 'Certification',
		},
		{
			title: t.security.transfer.title,
			status: 'in-progress' as const,
			relatedIds: [1, 3],
			id: 2,
			icon: RefreshCcw,
			energy: 80,
			date: 'Step 3',
			content: t.security.transfer.content,
			category: 'Transfer',
		},
		{
			title: t.security.update.title,
			status: 'pending' as const,
			relatedIds: [2, 4],
			id: 3,
			icon: FileCheck,
			energy: 60,
			date: 'Step 4',
			content: t.security.update.content,
			category: 'Update',
		},
		{
			title: t.security.confirmation.title,
			status: 'pending' as const,
			relatedIds: [3],
			id: 4,
			icon: CheckCircle,
			energy: 100,
			date: 'Step 5',
			content: t.security.confirmation.content,
			category: 'Confirmation',
		},
	]

	return (
		<section className="pt-16 pb-32">
			{/* Header Section */}
			<div className="mx-auto max-w-7xl px-6 py-16">
				<h2 className="text-foreground mb-4 text-center text-4xl font-bold">{t.security.title}</h2>
				<p className="text-muted-foreground mx-auto max-w-2xl text-center text-lg">{t.security.subtitle}</p>
			</div>

			{/* Timeline Component */}
			<RadialOrbitalTimeline timelineData={securityProcessData} />
		</section>
	)
}
