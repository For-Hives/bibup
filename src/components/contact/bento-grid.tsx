'use client'

import { ArrowRight, Handshake, Mail, MessageCircle, MousePointer2, Users } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import type React from 'react'

import ContactTranslations from '@/app/contact/locales.json'
import { getTranslations } from '@/lib/getDictionary'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type BentoCardProps = {
	className?: string
	content: string
	delay: number
	hoverEffect: 'float' | 'glow' | 'pulse'
	href: string
	icon: React.ReactNode

	isActive: boolean
	onMouseEnter: () => void
	onMouseLeave: () => void
	title: string
}

import ContactForm from './contact-form'

type Props = {
	t: Translations
}

type Translations = ReturnType<typeof getTranslations<(typeof ContactTranslations)['en'], 'en'>>

export default function BentoGrid({ t }: Props) {
	const [activeCard, setActiveCard] = useState<null | string>(null)

	const handleMouseEnter = (id: string) => {
		setActiveCard(id)
	}

	const handleMouseLeave = () => {
		setActiveCard(null)
	}

	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
			{/* Information card - spans full width */}
			<motion.div
				animate={{ y: 0, opacity: 1 }}
				className="bg-primary relative col-span-1 overflow-hidden rounded-3xl p-8 shadow-xl md:col-span-3"
				initial={{ y: 20, opacity: 0 }}
				transition={{ delay: 0.6 }}
				whileHover={{ scale: 1.01 }}
			>
				<div className="relative z-10">
					<h1 className="text-primary-foreground mb-6 text-4xl font-bold">{t.discussTogether}</h1>
					<p className="text-primary-foreground/80 mb-8">{t.useContactForm}</p>

					<div className="mb-2">
						<p className="text-primary-foreground/80">{t.runnerOrganizer}</p>
						<br />

						<div className="flex justify-between space-x-4">
							<div>
								<p className="text-primary-foreground/80">{t.ourTeamResponds}</p>
								<ul className="text-primary-foreground/80 mt-2 list-inside list-disc space-y-1">
									<li>{t.understandPlatform}</li>
									<li>{t.sellBibNotListed}</li>
									<li>{t.organizerAuthorize}</li>
									<li>{t.discussPartnership}</li>
								</ul>
								<p className="text-primary-foreground/80 mt-4">{t.fillFormResponse}</p>
							</div>
							<div className="flex w-1/3 items-center justify-center">
								<div className="bg-primary-foreground/10 rounded-full p-4 backdrop-blur-sm">
									<MessageCircle className="text-primary-foreground h-18 w-18" />
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Background decoration */}
				<div className="via-primary-foreground/30 absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent to-transparent"></div>
				<div className="from-primary-foreground/10 absolute top-0 right-0 h-40 w-40 rounded-bl-full bg-gradient-to-bl to-transparent"></div>
				<div className="from-primary-foreground/10 absolute bottom-0 left-0 h-32 w-32 rounded-tr-full bg-gradient-to-tr to-transparent"></div>
			</motion.div>

			{/* Main contact form - spans 2 rows */}
			<motion.div
				animate={{ y: 0, opacity: 1 }}
				className="bg-card border-border relative col-span-1 row-span-2 overflow-hidden rounded-3xl border shadow-xl md:col-span-2"
				initial={{ y: 20, opacity: 0 }}
				transition={{ delay: 0.1 }}
				whileHover={{ scale: 1.02 }}
			>
				<div className="via-primary/60 absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent to-transparent"></div>
				<div className="p-8">
					<h2 className="text-card-foreground mb-6 text-2xl font-bold">{t.getInTouch}</h2>
					<ContactForm t={t} />
				</div>
				<div className="from-accent/30 via-accent/5 pointer-events-none absolute right-0 bottom-0 h-45 w-45 rounded-tl-full bg-gradient-to-tl to-transparent"></div>
			</motion.div>

			{/* Email card with hover effect */}
			<BentoCard
				className="bg-card border-border hover:border-primary/50 border transition-colors"
				content="contact@beswib.com"
				delay={0.2}
				hoverEffect="glow"
				href="mailto:contact@beswib.com"
				icon={<Mail className="text-primary h-6 w-6" />}
				isActive={activeCard === 'email'}
				onMouseEnter={() => handleMouseEnter('email')}
				onMouseLeave={handleMouseLeave}
				title={t.email}
			/>

			{/* Support card with hover effect */}
			<BentoCard
				className="bg-card border-border hover:border-primary/50 border transition-colors"
				content="support@beswib.com"
				delay={0.3}
				hoverEffect="float"
				href="mailto:support@beswib.com"
				icon={<Users className="text-primary h-6 w-6" />}
				isActive={activeCard === 'support'}
				onMouseEnter={() => handleMouseEnter('support')}
				onMouseLeave={handleMouseLeave}
				title={t.support}
			/>

			{/* Partnerships card with hover effect */}
			<BentoCard
				className="bg-card border-border hover:border-primary/50 border transition-colors"
				content="partners@beswib.com"
				delay={0.4}
				hoverEffect="pulse"
				href="mailto:partners@beswib.com"
				icon={<Handshake className="text-primary h-6 w-6" />}
				isActive={activeCard === 'partnerships'}
				onMouseEnter={() => handleMouseEnter('partnerships')}
				onMouseLeave={handleMouseLeave}
				title={t.partnerships}
			/>

			{/* Interactive element */}
			<motion.div
				animate={{ y: 0, opacity: 1 }}
				className="bg-accent border-border hover:border-primary/50 relative col-span-1 flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border p-6 text-center shadow-xl transition-colors"
				initial={{ y: 20, opacity: 0 }}
				onClick={() => window.open('https://twitter.com/beswib', '_blank', 'noopener,noreferrer')}
				transition={{ delay: 0.5 }}
				whileHover={{ scale: 1.05 }}
			>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>
				<MousePointer2 className="text-accent-foreground mb-3 h-8 w-8" />
				<h3 className="text-accent-foreground mb-2 text-lg font-semibold">{t.interactiveExperience}</h3>
				<p className="text-muted-foreground text-sm">{t.interactiveDescription}</p>
				<div className="bg-primary/10 absolute -right-4 -bottom-4 h-24 w-24 rounded-full blur-xl"></div>
			</motion.div>
		</div>
	)
}

function BentoCard({
	title,
	onMouseLeave,
	onMouseEnter,
	isActive,
	icon,
	href,
	hoverEffect,
	delay,
	content,
	className,
}: BentoCardProps) {
	return (
		<motion.a
			animate={{ y: 0, opacity: 1 }}
			className={cn(
				'relative col-span-1 flex flex-col items-start justify-between overflow-hidden rounded-3xl p-6 shadow-xl',
				className
			)}
			href={href}
			initial={{ y: 20, opacity: 0 }}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			transition={{ delay }}
			whileHover={{ scale: 1.03 }}
		>
			<div className="z-10">
				<div className="bg-accent mb-4 inline-block rounded-xl p-3">{icon}</div>
				<h3 className="text-card-foreground mb-1 text-lg font-semibold">{title}</h3>
				<p className="text-muted-foreground">{content}</p>
			</div>
			<Button className="group mt-4" size="sm" variant="ghost">
				Contact <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
			</Button>

			{/* Dynamic background effects based on hover state */}
			{hoverEffect === 'glow' && isActive && (
				<div className="bg-primary/5 absolute inset-0 transition-opacity duration-300"></div>
			)}
			{hoverEffect === 'float' && (
				<div
					className={cn(
						'absolute right-0 bottom-0 h-32 w-32 rounded-full transition-all duration-500',
						isActive ? 'bg-primary/10 scale-125' : 'bg-accent/20'
					)}
				></div>
			)}
			{hoverEffect === 'pulse' && isActive && (
				<motion.div
					animate={{ opacity: [0.5, 0.2, 0.5] }}
					className="bg-primary/5 absolute inset-0"
					transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
				></motion.div>
			)}
			<div className="via-primary/30 absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent to-transparent"></div>
		</motion.a>
	)
}
