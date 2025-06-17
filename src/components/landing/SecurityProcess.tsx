'use client'

import { CheckCircle, FileCheck, Handshake, RefreshCcw, Shield } from 'lucide-react'

import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline'

const securityProcessData = [
	{
		title: 'Partnership',
		status: 'completed' as const,
		relatedIds: [1],
		id: 0,
		icon: Handshake,
		energy: 100,
		date: 'Step 1',
		content: 'Partnership with race organizers and authorization to ensure legitimacy.',
		category: 'Partnership',
	},
	{
		title: 'Certification',
		status: 'completed' as const,
		relatedIds: [0, 2],
		id: 1,
		icon: Shield,
		energy: 95,
		date: 'Step 2',
		content: 'Verification of seller registration validity and bib certification for sale.',
		category: 'Certification',
	},
	{
		title: 'Transfer',
		status: 'in-progress' as const,
		relatedIds: [1, 3],
		id: 2,
		icon: RefreshCcw,
		energy: 80,
		date: 'Step 3',
		content: 'Collection of new runner registration data and bib ownership transfer.',
		category: 'Transfer',
	},
	{
		title: 'Update',
		status: 'pending' as const,
		relatedIds: [2, 4],
		id: 3,
		icon: FileCheck,
		energy: 60,
		date: 'Step 4',
		content: 'Runner data modification with organizer and information update.',
		category: 'Update',
	},
	{
		title: 'Confirmation',
		status: 'pending' as const,
		relatedIds: [3],
		id: 4,
		icon: CheckCircle,
		energy: 100,
		date: 'Step 5',
		content: 'Final validation with all parties and registration confirmation notifications.',
		category: 'Confirmation',
	},
]

export default function SecurityProcess() {
	return (
		<section className="pt-16 pb-32">
			{/* Header Section */}
			<div className="mx-auto max-w-7xl px-6 py-16">
				<h2 className="text-foreground mb-4 text-center text-4xl font-bold">Maximum Security</h2>
				<p className="text-muted-foreground mx-auto max-w-2xl text-center text-lg">
					Every transaction is processed automatically with the highest security standards
				</p>
			</div>

			{/* Timeline Component */}
			<RadialOrbitalTimeline timelineData={securityProcessData} />
		</section>
	)
}
