'use client'

import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

import CardMarketSimplified, { BibSaleSimplified } from './card-market-simplified'

export const HeroAnimation = ({ runs, autoplay = true }: { autoplay?: boolean; runs: BibSaleSimplified[] }) => {
	const [active, setActive] = useState(0)

	const handleNext = () => {
		setActive(prev => (prev + 1) % runs.length)
	}

	const handlePrev = () => {
		setActive(prev => (prev - 1 + runs.length) % runs.length)
	}

	const isActive = (index: number) => {
		return index === active
	}

	useEffect(() => {
		if (autoplay) {
			const interval = setInterval(handleNext, 5000)
			return () => clearInterval(interval)
		}
	}, [autoplay])

	const randomRotateY = () => {
		return Math.floor(Math.random() * 21) - 10
	}
	return (
		<div className="relative w-full pb-40">
			<div>
				<div className="relative h-116 w-full translate-x-1/3">
					<AnimatePresence>
						{runs.map((run, index) => (
							<motion.div
								animate={{
									zIndex: isActive(index) ? 40 : runs.length + 2 - index,
									z: isActive(index) ? 0 : -100,
									y: isActive(index) ? [0, -80, 0] : 0,
									scale: isActive(index) ? 1 : 0.95,
									rotate: isActive(index) ? 0 : randomRotateY(),
								}}
								className="absolute inset-0 origin-bottom"
								exit={{
									z: 100,
									scale: 0.9,
									rotate: randomRotateY(),
									opacity: 1,
								}}
								initial={{
									z: -100,
									scale: 0.9,
									rotate: randomRotateY(),
									opacity: 1,
								}}
								key={index}
								transition={{
									ease: 'easeInOut',
									duration: 0.4,
								}}
							>
								<CardMarketSimplified bibSaleSimplified={run} />
							</motion.div>
						))}
					</AnimatePresence>
				</div>
			</div>
			<div className="absolute right-1/4 bottom-20 z-50">
				<div className="flex gap-4 pt-12 md:pt-0">
					<button
						className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
						onClick={handlePrev}
					>
						<IconArrowLeft className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:rotate-12 dark:text-neutral-400" />
					</button>
					<button
						className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
						onClick={handleNext}
					>
						<IconArrowRight className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:-rotate-12 dark:text-neutral-400" />
					</button>
				</div>
			</div>
		</div>
	)
}
