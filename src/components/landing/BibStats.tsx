'use client'

import { useEffect, useRef, useState } from 'react'
import NumberFlow from '@number-flow/react'

interface StatItem {
	label: string
	suffix: string
	value: string
}

const stats: StatItem[] = [
	{
		value: '2500',
		suffix: '+',
		label: 'Dossards vendus',
	},
	{
		value: '150',
		suffix: '+',
		label: 'Courses partenaires',
	},
	{
		value: '98',
		suffix: '%',
		label: 'Taux de satisfaction',
	},
]

export default function BibStats() {
	const [baseValue] = useState(0)
	const [isVisible, setIsVisible] = useState(false)
	const [hasAnimated, setHasAnimated] = useState(false)
	const sectionRef = useRef<HTMLElement>(null)

	useEffect(() => {
		const currentSection = sectionRef.current
		if (!currentSection) return

		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					// Trigger animation when component is fully visible (100% in viewport)
					if (entry.isIntersecting && entry.intersectionRatio >= 0.8 && !hasAnimated) {
						setIsVisible(true)
						setHasAnimated(true) // Prevent re-triggering
					}
				})
			},
			{
				threshold: 0.8, // Trigger when 80% of the component is visible
				rootMargin: '0px',
			}
		)

		observer.observe(currentSection)

		return () => {
			observer.disconnect()
		}
	}, [hasAnimated])

	return (
		<section className="bg-card/50 border-border border-t py-16" ref={sectionRef}>
			<div className="mx-auto max-w-6xl px-4">
				<div className="grid gap-8 md:grid-cols-3">
					{stats.map((stat, index) => (
						<div className="text-center" key={index}>
							<div className="text-primary mb-2 text-4xl font-bold md:text-5xl">
								<NumberFlow
									transformTiming={{
										easing: 'ease-in-out',
										duration: 1500,
									}}
									value={Number(isVisible ? stat.value : baseValue)}
								/>
								{stat.suffix}
							</div>
							<p className="text-muted-foreground text-lg">{stat.label}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
