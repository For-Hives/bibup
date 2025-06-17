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
				className="relative col-span-1 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-xl md:col-span-3 dark:from-slate-800 dark:to-slate-700"
				initial={{ y: 20, opacity: 0 }}
				transition={{ delay: 0.6 }}
				whileHover={{ scale: 1.01 }}
			>
				<div className="relative z-10">
					<h1 className="mb-6 text-4xl font-bold text-white">{t.discussTogether}</h1>
					<p className="mb-8 text-gray-300">{t.useContactForm}</p>

					<div className="mb-2">
						<p className="text-gray-300">{t.runnerOrganizer}</p>
						<br />

						<div className="flex justify-between space-x-4">
							<div>
								<p className="text-gray-300">{t.ourTeamResponds}</p>
								<ul className="mt-2 list-inside list-disc space-y-1 text-gray-300">
									<li>{t.understandPlatform}</li>
									<li>{t.sellBibNotListed}</li>
									<li>{t.organizerAuthorize}</li>
									<li>{t.discussPartnership}</li>
								</ul>
								<p className="mt-4 text-gray-300">{t.fillFormResponse}</p>
							</div>
							<div className="flex w-1/3 items-center justify-center">
								<div className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-4">
									<MessageCircle className="h-18 w-18 text-white" />
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Background decoration */}
				<div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

				<div className="absolute top-0 right-0 h-40 w-40 rounded-bl-full bg-gradient-to-bl from-yellow-400/20 to-transparent"></div>
				<div className="absolute bottom-0 left-0 h-32 w-32 rounded-tr-full bg-gradient-to-tr from-purple-500/20 to-transparent"></div>
			</motion.div>
			{/* Main contact form - spans 2 rows */}
			<motion.div
				animate={{ y: 0, opacity: 1 }}
				className="relative col-span-1 row-span-2 overflow-hidden rounded-3xl bg-white shadow-xl md:col-span-2 dark:bg-slate-800"
				initial={{ y: 20, opacity: 0 }}
				transition={{ delay: 0.1 }}
				whileHover={{ scale: 1.02 }}
			>
				<div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-violet-600/60 to-transparent"></div>
				<div className="p-8">
					<h2 className="mb-6 text-2xl font-bold">{t.getInTouch}</h2>
					<ContactForm t={t} />
				</div>
				<div className="pointer-events-none absolute right-0 bottom-0 h-40 w-40 rounded-tl-full bg-gradient-to-tl from-purple-500/20 to-transparent"></div>
			</motion.div>

			{/* Email card with hover effect */}
			<BentoCard
				className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
				content="contact@beswib.com"
				delay={0.2}
				hoverEffect="glow"
				href="mailto:contact@beswib.com"
				icon={<Mail className="h-6 w-6" />}
				isActive={activeCard === 'email'}
				onMouseEnter={() => handleMouseEnter('email')}
				onMouseLeave={handleMouseLeave}
				title={t.email}
			/>

			{/* Support card with hover effect */}
			<BentoCard
				className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
				content="support@beswib.com"
				delay={0.3}
				hoverEffect="float"
				href="mailto:support@beswib.com"
				icon={<Users className="h-6 w-6" />}
				isActive={activeCard === 'support'}
				onMouseEnter={() => handleMouseEnter('support')}
				onMouseLeave={handleMouseLeave}
				title={t.support}
			/>

			{/* Partnerships card with hover effect */}
			<BentoCard
				className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20"
				content="partners@beswib.com"
				delay={0.4}
				hoverEffect="pulse"
				href="mailto:partners@beswib.com"
				icon={<Handshake className="h-6 w-6" />}
				isActive={activeCard === 'partnerships'}
				onMouseEnter={() => handleMouseEnter('partnerships')}
				onMouseLeave={handleMouseLeave}
				title={t.partnerships}
			/>

			{/* Interactive element */}
			<motion.div
				animate={{ y: 0, opacity: 1 }}
				className="relative col-span-1 flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 to-pink-100 p-6 text-center shadow-xl dark:from-purple-900/30 dark:to-pink-900/30"
				initial={{ y: 20, opacity: 0 }}
				onClick={() => window.open('https://twitter.com/beswib', '_blank', 'noopener,noreferrer')}
				transition={{ delay: 0.5 }}
				whileHover={{ scale: 1.05 }}
			>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
				<MousePointer2 className="mb-3 h-8 w-8 text-purple-600 dark:text-purple-400" />
				<h3 className="mb-2 text-lg font-semibold">{t.interactiveExperience}</h3>
				<p className="text-sm text-slate-600 dark:text-slate-300">{t.interactiveDescription}</p>
				<div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-pink-300/20 blur-xl dark:bg-pink-700/20"></div>
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
				<div
					className={cn(
						'mb-4 inline-block rounded-xl p-3',
						hoverEffect === 'glow'
							? 'bg-blue-200/50 dark:bg-blue-700/30'
							: hoverEffect === 'float'
								? 'bg-green-200/50 dark:bg-green-700/30'
								: 'bg-amber-200/50 dark:bg-amber-700/30'
					)}
				>
					{icon}
				</div>
				<h3 className="mb-1 text-lg font-semibold">{title}</h3>
				<p className="text-slate-600 dark:text-slate-300">{content}</p>
			</div>
			<Button className="group mt-4" size="sm" variant="ghost">
				Contact <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
			</Button>
			{/* Dynamic background effects based on hover state */}
			{hoverEffect === 'glow' && isActive && (
				<div className="absolute inset-0 bg-blue-400/10 transition-opacity duration-300 dark:bg-blue-400/5"></div>
			)}
			{hoverEffect === 'float' && (
				<div
					className={cn(
						'absolute right-0 bottom-0 h-32 w-32 rounded-full transition-all duration-500',
						isActive ? 'scale-125 bg-green-400/20' : 'bg-green-300/10'
					)}
				></div>
			)}
			{hoverEffect === 'pulse' && isActive && (
				<motion.div
					animate={{ opacity: [0.5, 0.2, 0.5] }}
					className="absolute inset-0 bg-amber-400/10 dark:bg-amber-400/5"
					transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
				></motion.div>
			)}
			<div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>{' '}
		</motion.a>
	)
}
