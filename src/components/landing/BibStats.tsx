'use client'

import NumberFlow from '@number-flow/react'
import { useEffect, useState } from 'react'

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
	const [isLoading, setIsLoading] = useState(true)
	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false)
		})
	}, [])

	return (
		<section className="bg-card/50 border-border border-t py-16">
			<div className="mx-auto max-w-6xl px-4">
				<div className="grid gap-8 md:grid-cols-3">
					{stats.map((stat, index) => (
						<div className="text-center" key={index}>
							<div className="text-primary mb-2 text-4xl font-bold md:text-5xl">
								<NumberFlow
									transformTiming={{
										easing: 'ease-in-out',
										duration: 1000,
									}}
									value={Number(isLoading ? baseValue : stat.value)}
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
