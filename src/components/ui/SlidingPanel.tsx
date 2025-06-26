'use client'

import React, { useEffect, useRef } from 'react'

import { AnimatePresence, motion } from 'framer-motion'

import { cn } from '@/lib/utils'

interface SlidingPanelProps {
	children: React.ReactNode
	className?: string
	isOpen: boolean
	onClose: () => void
	title?: string
}

export function SlidingPanel({ title, onClose, isOpen, className, children }: Readonly<SlidingPanelProps>) {
	const panelRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose()
			}
		}

		if (isOpen) {
			document.addEventListener('keydown', handleEscape)
		} else {
			document.removeEventListener('keydown', handleEscape)
		}

		return () => {
			document.removeEventListener('keydown', handleEscape)
		}
	}, [isOpen, onClose])

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					animate={{ opacity: 1 }}
					className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm"
					exit={{ opacity: 0 }}
					initial={{ opacity: 0 }}
					onClick={onClose}
				>
					<motion.div
						animate={{ x: 0 }}
						className={cn(
							'bg-card fixed top-0 right-0 h-full w-full max-w-md overflow-y-auto p-6 shadow-lg',
							className
						)}
						exit={{ x: '100%' }}
						initial={{ x: '100%' }}
						onClick={e => e.stopPropagation()} // Prevent closing when clicking inside panel
						ref={panelRef}
						transition={{ type: 'spring', stiffness: 300, damping: 30 }}
					>
						<div className="mb-4 flex items-center justify-between">
							{Boolean(title) && <h2 className="text-2xl font-bold">{title}</h2>}
							<button className="text-muted-foreground hover:text-foreground" onClick={onClose}>
								<svg
									className="h-6 w-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
								</svg>
							</button>
						</div>
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
