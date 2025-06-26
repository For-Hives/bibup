'use client'

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SlidingPanelProps {
	isOpen: boolean
	onClose: () => void
	children: React.ReactNode
	title?: string
	className?: string
}

export function SlidingPanel({ isOpen, onClose, children, title, className }: SlidingPanelProps) {
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
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-[99] bg-black/50 backdrop-blur-sm"
					onClick={onClose}
				>
					<motion.div
						ref={panelRef}
						initial={{ x: '100%' }}
						animate={{ x: 0 }}
						exit={{ x: '100%' }}
						transition={{ type: 'spring', stiffness: 300, damping: 30 }}
						className={cn(
							'bg-card fixed top-0 right-0 h-full w-full max-w-md overflow-y-auto p-6 shadow-lg',
							className
						)}
						onClick={e => e.stopPropagation()} // Prevent closing when clicking inside panel
					>
						<div className="mb-4 flex items-center justify-between">
							{title && <h2 className="text-2xl font-bold">{title}</h2>}
							<button onClick={onClose} className="text-muted-foreground hover:text-foreground">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
