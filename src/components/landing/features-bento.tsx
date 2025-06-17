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
import { cn } from '@/lib/utils'

const FeaturesSkeleton = ({ className }: { className?: string }) => (
	<div
		className={cn(
			'flex h-full min-h-[6rem] w-full flex-1 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800',
			className
		)}
	></div>
)

export default function FeaturesBento() {
	return (
		<section className="bg-muted/40 px-4 py-24">
			<div className="mx-auto max-w-7xl">
				<div className="mb-16 text-center">
					<h2 className="mb-6 text-4xl font-bold tracking-tight">Why choose BibUp?</h2>
					<p className="text-muted-foreground mx-auto max-w-3xl text-xl">
						Concrete advantages for every actor in the running ecosystem
					</p>
				</div>

				<BentoGrid className="max-w-7xl">
					{items.map((item, i) => (
						<BentoGridItem
							className={i === 0 || i === 6 ? 'md:col-span-2' : ''}
							description={item.description}
							header={item.header}
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
		title: 'Organizers: Security & Growth',
		icon: <IconCalendar className="h-4 w-4 text-neutral-500" />,
		header: <FeaturesSkeleton className="bg-gradient-to-br from-slate-600 to-slate-800" />,
		description: (
			<div className="space-y-2">
				<div>
					<strong>🛡️ Security & Compliance</strong>
					<ul className="mt-1 space-y-1 text-xs">
						<li>• Complete legal and regulatory coverage</li>
						<li>• Fraud reduction and fake bibs prevention</li>
						<li>• Total transfer traceability</li>
					</ul>
				</div>
				<div>
					<strong>📈 Growth & Visibility</strong>
					<ul className="mt-1 space-y-1 text-xs">
						<li>• Community effect: traffic to your race</li>
						<li>• New indirect registrations</li>
						<li>• Reduce no-shows dramatically</li>
					</ul>
				</div>
			</div>
		),
	},
	{
		title: 'Operational Simplicity',
		icon: <IconBolt className="h-4 w-4 text-neutral-500" />,
		header: <FeaturesSkeleton className="bg-gradient-to-br from-orange-500 to-yellow-500" />,
		description: (
			<div className="space-y-2">
				<strong>⚡ Zero Technical Burden</strong>
				<ul className="mt-1 space-y-1 text-xs">
					<li>• No technical charges</li>
					<li>• Centralized transfer requests</li>
					<li>• Drastic reduction in emails/support</li>
					<li>• No financial flows to manage</li>
				</ul>
			</div>
		),
	},
	{
		title: 'Buyers: Trust & Simplicity',
		icon: <IconUsers className="h-4 w-4 text-neutral-500" />,
		header: <FeaturesSkeleton className="bg-gradient-to-br from-blue-500 to-cyan-500" />,
		description: (
			<div className="space-y-2">
				<div>
					<strong>🔒 Trust & Transparency</strong>
					<ul className="mt-1 space-y-1 text-xs">
						<li>• Verified seller profiles</li>
						<li>• No risk of fake bibs</li>
						<li>• New bib with your name</li>
					</ul>
				</div>
				<div>
					<strong>🎯 Comfort & Ease</strong>
					<ul className="mt-1 space-y-1 text-xs">
						<li>• No more social media negotiations</li>
						<li>• 100% secure payment</li>
						<li>• Instant email confirmation</li>
					</ul>
				</div>
			</div>
		),
	},
	{
		title: 'Security First',
		icon: <IconShield className="h-4 w-4 text-neutral-500" />,
		header: <FeaturesSkeleton className="bg-gradient-to-br from-green-500 to-emerald-500" />,
		description:
			'End-to-end security with verified transactions, fraud prevention, and complete legal compliance for all transfers.',
	},
	{
		title: 'Instant Processing',
		icon: <IconTrendingUp className="h-4 w-4 text-neutral-500" />,
		header: <FeaturesSkeleton className="bg-gradient-to-br from-purple-500 to-violet-500" />,
		description:
			'Automated and rapid processing with immediate confirmation. No waiting, no hassle, just smooth transactions.',
	},
	{
		title: 'Sellers: Flexibility & Profit',
		icon: <IconCreditCard className="h-4 w-4 text-neutral-500" />,
		header: <FeaturesSkeleton className="bg-gradient-to-br from-rose-500 to-pink-500" />,
		description: (
			<div className="space-y-2">
				<div>
					<strong>💰 Monetization</strong>
					<ul className="mt-1 space-y-1 text-xs">
						<li>• Last-minute resale (per organizer)</li>
						<li>• Seller-defined pricing</li>
						<li>• Immediate fund reception</li>
					</ul>
				</div>
				<div>
					<strong>🔄 Flexibility</strong>
					<ul className="mt-1 space-y-1 text-xs">
						<li>• Public or private sales</li>
						<li>• Quick and simple listing</li>
					</ul>
				</div>
			</div>
		),
	},
	{
		title: 'Complete Peace of Mind',
		icon: <IconLock className="h-4 w-4 text-neutral-500" />,
		header: <FeaturesSkeleton className="bg-gradient-to-br from-indigo-500 to-blue-600" />,
		description: (
			<div className="space-y-2">
				<strong>🛡️ Guaranteed Protection</strong>
				<ul className="mt-1 space-y-1 text-xs">
					<li>• Day-of-race insurance guarantee</li>
					<li>• Full transaction traceability</li>
					<li>• Verified organizer partnerships</li>
					<li>• 24/7 customer support</li>
					<li>• Complete fraud protection</li>
				</ul>
			</div>
		),
	},
]
