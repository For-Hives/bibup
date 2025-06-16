'use client'

import { Calendar, MapPinned, User } from 'lucide-react'

import { DateTime } from 'luxon'
import Image from 'next/image'

import { cn } from '@/lib/utils'

export interface BibSaleSimplified {
	event: {
		date: Date
		distance: number
		distanceUnit: string
		location: string
		name: string
		participantCount: number
	}
	originalPrice: number
	price: number
}

export default function CardMarketSimplified({ bibSaleSimplified }: { bibSaleSimplified: BibSaleSimplified }) {
	return (
		<div className="w-full max-w-xs">
			<div className="bg-card/80 border-border relative flex flex-col overflow-hidden rounded-2xl border shadow-[0_0_0_1px_hsl(var(--border)),inset_0_0_30px_hsl(var(--primary)/0.1),inset_0_0_60px_hsl(var(--accent)/0.05),0_0_50px_hsl(var(--primary)/0.2)] backdrop-blur-md transition-all duration-300 hover:border-white/35">
				<div
					className={cn(
						'absolute inset-0 -z-20 opacity-50',
						'[background-size:20px_20px]',
						'[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]',
						'dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]'
					)}
				/>
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-25 dark:bg-black"></div>
				<div className="relative flex justify-center px-4 pt-4">
					<div className="from-primary/20 via-accent/20 to-secondary/20 before:from-primary before:via-accent before:via-secondary before:to-ring relative h-64 w-full overflow-hidden rounded-xl bg-gradient-to-br shadow-[inset_0_0_20px_hsl(var(--primary)/0.3),inset_0_0_40px_hsl(var(--accent)/0.2),0_0_30px_hsl(var(--primary)/0.4)] before:absolute before:inset-0 before:-z-10 before:m-[-1px] before:rounded-xl before:bg-gradient-to-br before:p-0.5">
						<Image
							alt="template-run"
							className="cover -z-10 rounded-2xl p-3"
							fill
							sizes="100vw"
							src="/template-run-2.png"
						/>
						<div className="absolute inset-0 z-10 opacity-10">
							<div className="h-full w-full animate-pulse bg-[linear-gradient(90deg,hsl(var(--foreground)/0.3)_1px,transparent_1px),linear-gradient(hsl(var(--foreground)/0.3)_1px,transparent_1px)] bg-[length:15px_15px]" />
						</div>
					</div>
				</div>

				<div className="via-border mt-4 h-px w-full bg-gradient-to-r from-transparent to-transparent" />
				<div className="flex flex-col gap-2 px-4 py-2">
					<div className="flex w-full justify-between">
						<h3 className="text-foreground text-lg font-bold">{bibSaleSimplified.event.name}</h3>
						<div className="relative flex flex-col items-center gap-2">
							<p className="text-2xl font-bold text-white">{bibSaleSimplified.price}€</p>
							<p className="absolute top-8 right-0 text-sm italic line-through">{bibSaleSimplified.originalPrice}€</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<Calendar className="h-5 w-5" />
						<p className="text-muted-foreground text-xs leading-relaxed">
							{formatDateWithLocale(bibSaleSimplified.event.date)}
						</p>
					</div>
					<div className="flex items-center gap-3">
						<MapPinned className="h-5 w-5" />
						<div className="flex items-center gap-1">
							<p className="text-muted-foreground text-xs leading-relaxed">{bibSaleSimplified.event.location}</p>
							<span className="text-muted-foreground text-xs leading-relaxed">•</span>
							<p className="text-muted-foreground text-xs leading-relaxed">
								{bibSaleSimplified.event.distance}
								<span className="text-muted-foreground text-xs leading-relaxed italic">
									{bibSaleSimplified.event.distanceUnit}
								</span>
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2 pb-2">
						<User className="h-5 w-5" />
						<p className="text-muted-foreground text-xs leading-relaxed">
							{formatParticipantCount(bibSaleSimplified.event.participantCount)} participants
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

// Helper function to format date with Luxon safely
function formatDateWithLocale(date: Date, locale?: null | string): string {
	try {
		const dt = DateTime.fromJSDate(date)
		if (!dt.isValid) {
			return new Date(date).toLocaleDateString()
		}

		// Use provided locale, or automatically detect browser locale
		const targetLocale = locale ?? (typeof navigator !== 'undefined' ? navigator.language : 'en-US')
		const dateTime = dt.setLocale(targetLocale)

		// Check if locale is valid after configuration
		if (!dateTime.isValid) {
			// If locale is not supported, use default locale
			return dt.toLocaleString(DateTime.DATE_MED)
		}

		return dateTime.toLocaleString(DateTime.DATE_MED)
	} catch {
		// Fallback to native JavaScript Date formatting
		return new Date(date).toLocaleDateString()
	}
}

function formatParticipantCount(participantCount: number) {
	// format the number, to display it with ',' and ' '
	return participantCount.toLocaleString('fr-FR', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	})
}
