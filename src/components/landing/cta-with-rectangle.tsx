'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CTAProps {
	actions: Array<{
		href: string
		text: string
		variant?: 'default' | 'outline' | 'secondary'
	}>
	className?: string
	translations?: {
		ctaSection: {
			description: string
			title: string
		}
	}
	withGlow?: boolean
}

export function CTASection({ withGlow = true, translations, className, actions }: CTAProps) {
	return (
		<section
			className={cn(
				'from-background via-primary/5 to-background mx-auto my-24 max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br pt-0 md:pt-0',
				className
			)}
		>
			<div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-12 text-center sm:gap-8 md:py-24">
				{/* Title */}
				<h2 className="animate-fade-in-up text-3xl font-semibold opacity-0 delay-200 sm:text-4xl">
					{translations?.ctaSection.title ??
						'Beswib transforme la gestion des transferts de dossards en solution gagnante pour tous'}
				</h2>

				{/* Description */}
				<p
					className="animate-fade-in-up text-muted-foreground max-w-4xl text-lg opacity-0 delay-300"
					dangerouslySetInnerHTML={{
						__html:
							translations?.ctaSection.description ??
							'Organisateurs : réduisez vos risques et votre charge administrative <br />Coureurs : achetez et vendez en toute sécurité, sans négociation ni stress',
					}}
				/>

				{/* Action Buttons */}
				<div className="animate-fade-in-up flex flex-col gap-4 opacity-0 delay-500 sm:flex-row">
					{actions.map((action, index) => (
						<Button asChild className="min-w-64 text-base" key={index} size="lg" variant={action.variant ?? 'default'}>
							<a href={action.href}>{action.text}</a>
						</Button>
					))}
				</div>

				{/* Glow Effect */}
				{withGlow ? (
					<div className="fade-top-lg animate-scale-in shadow-glow pointer-events-none absolute inset-0 rounded-2xl opacity-0 delay-700" />
				) : null}
			</div>
		</section>
	)
}
