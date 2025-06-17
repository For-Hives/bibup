'use client'

import { ArrowRight, Link, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface RadialOrbitalTimelineProps {
	timelineData: TimelineItem[]
}

interface TimelineItem {
	category: string
	content: string
	date: string
	energy: number
	icon: React.ElementType
	id: number
	relatedIds: number[]
	status: 'completed' | 'in-progress' | 'pending'
	title: string
}

export default function RadialOrbitalTimeline({ timelineData }: RadialOrbitalTimelineProps) {
	const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({})
	const [rotationAngle, setRotationAngle] = useState<number>(0)
	const [autoRotate, setAutoRotate] = useState<boolean>(true)
	const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({})
	const [centerOffset, setCenterOffset] = useState<{ x: number; y: number }>({
		y: 0,
		x: 0,
	})
	const [activeNodeId, setActiveNodeId] = useState<null | number>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const orbitRef = useRef<HTMLDivElement>(null)
	const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({})

	const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === containerRef.current || e.target === orbitRef.current) {
			setExpandedItems({})
			setActiveNodeId(null)
			setPulseEffect({})
			setAutoRotate(true)
		}
	}

	const toggleItem = (id: number) => {
		setExpandedItems(prev => {
			const newState = { ...prev }
			Object.keys(newState).forEach(key => {
				if (parseInt(key) !== id) {
					newState[parseInt(key)] = false
				}
			})

			newState[id] = !prev[id]

			if (!prev[id]) {
				setActiveNodeId(id)
				setAutoRotate(false)

				const relatedItems = getRelatedItems(id)
				const newPulseEffect: Record<number, boolean> = {}
				relatedItems.forEach(relId => {
					newPulseEffect[relId] = true
				})
				setPulseEffect(newPulseEffect)

				centerViewOnNode(id)
			} else {
				setActiveNodeId(null)
				setAutoRotate(true)
				setPulseEffect({})
			}

			return newState
		})
	}

	useEffect(() => {
		let rotationTimer: NodeJS.Timeout

		if (autoRotate) {
			rotationTimer = setInterval(() => {
				setRotationAngle(prev => {
					const newAngle = (prev + 0.3) % 360
					return Number(newAngle.toFixed(3))
				})
			}, 50)
		}

		return () => {
			if (rotationTimer) {
				clearInterval(rotationTimer)
			}
		}
	}, [autoRotate])

	const centerViewOnNode = (nodeId: number) => {
		if (!nodeRefs.current[nodeId]) return

		const nodeIndex = timelineData.findIndex(item => item.id === nodeId)
		const totalNodes = timelineData.length
		const targetAngle = (nodeIndex / totalNodes) * 360

		setRotationAngle(270 - targetAngle)
	}

	const calculateNodePosition = (index: number, total: number) => {
		const angle = ((index / total) * 360 + rotationAngle) % 360
		const radius = 200
		const radian = (angle * Math.PI) / 180

		const x = radius * Math.cos(radian) + centerOffset.x
		const y = radius * Math.sin(radian) + centerOffset.y

		const zIndex = Math.round(100 + 50 * Math.cos(radian))
		const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)))

		return { zIndex, y, x, opacity, angle }
	}

	const getRelatedItems = (itemId: number): number[] => {
		const currentItem = timelineData.find(item => item.id === itemId)
		return currentItem ? currentItem.relatedIds : []
	}

	const isRelatedToActive = (itemId: number): boolean => {
		if (!activeNodeId) return false
		const relatedItems = getRelatedItems(activeNodeId)
		return relatedItems.includes(itemId)
	}

	const getStatusStyles = (status: TimelineItem['status']): string => {
		switch (status) {
			case 'completed':
				return 'text-white bg-green-600 border-green-500'
			case 'in-progress':
				return 'text-white bg-blue-600 border-blue-500'
			case 'pending':
				return 'text-white bg-gray-600 border-gray-500'
			default:
				return 'text-white bg-gray-600 border-gray-500'
		}
	}

	return (
		<div
			className="z-40 flex h-128 w-full flex-col items-center justify-center"
			onClick={handleContainerClick}
			ref={containerRef}
		>
			<div className="relative flex h-full w-full max-w-6xl items-center justify-center">
				<div
					className="absolute flex h-full w-full items-center justify-center"
					ref={orbitRef}
					style={{
						transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
						perspective: '1000px',
					}}
				>
					{/* Centre orbital */}
					<div className="z-10 flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-teal-500">
						<div className="absolute h-24 w-24 animate-ping rounded-full border border-white/20 opacity-70"></div>
						<div className="absolute h-28 w-28 animate-ping rounded-full border border-white/10 opacity-50"></div>
						<div className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-md"></div>
					</div>

					{/* Orbite */}
					<div className="absolute h-96 w-96 rounded-full border border-white/10"></div>

					{/* Noeuds timeline */}
					{timelineData.map((item, index) => {
						const position = calculateNodePosition(index, timelineData.length)
						const isExpanded = expandedItems[item.id]
						const isRelated = isRelatedToActive(item.id)
						const isPulsing = pulseEffect[item.id]
						const Icon = item.icon

						const nodeStyle = {
							zIndex: isExpanded ? 200 : position.zIndex,
							transform: `translate(${position.x}px, ${position.y}px)`,
							opacity: isExpanded ? 1 : position.opacity,
						}

						return (
							<div
								className="absolute cursor-pointer transition-all duration-700"
								key={item.id}
								onClick={e => {
									e.stopPropagation()
									toggleItem(item.id)
								}}
								ref={el => (nodeRefs.current[item.id] = el)}
								style={nodeStyle}
							>
								{/* Effet de pulse */}
								<div
									className={`absolute -inset-1 rounded-full ${isPulsing ? 'animate-pulse duration-1000' : ''}`}
									style={{
										width: `${item.energy * 0.5 + 50}px`,
										top: `-${(item.energy * 0.5 + 50 - 40) / 2}px`,
										left: `-${(item.energy * 0.5 + 50 - 40) / 2}px`,
										height: `${item.energy * 0.5 + 50}px`,
										background: `radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0) 70%)`,
									}}
								></div>

								{/* Noeud principal */}
								<div
									className={`flex h-12 w-12 transform items-center justify-center rounded-full border-2 transition-all duration-300 ${
										isExpanded
											? 'scale-150 border-blue-400 bg-blue-500 text-white shadow-lg shadow-blue-500/50'
											: isRelated
												? 'animate-pulse border-blue-400 bg-blue-500/70 text-white'
												: 'border-blue-300/50 bg-slate-800/90 text-blue-300'
									} `}
								>
									<Icon size={20} />
								</div>

								{/* Titre du noeud */}
								<div
									className={`absolute top-14 text-xs font-semibold tracking-wider whitespace-nowrap transition-all duration-300 ${isExpanded ? 'scale-125 text-white' : 'text-blue-200/80'} `}
								>
									{item.title}
								</div>

								{/* Carte expandue */}
								{isExpanded && (
									<Card className="absolute top-20 left-1/2 w-72 -translate-x-1/2 overflow-visible border-blue-300/30 bg-slate-900/95 shadow-xl shadow-blue-500/20 backdrop-blur-lg">
										<div className="absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2 bg-blue-400/50"></div>
										<CardHeader className="pb-2">
											<div className="flex items-center justify-between">
												<Badge className={`text-xs ${getStatusStyles(item.status)}`}>
													{item.status === 'completed'
														? 'TERMINÉ'
														: item.status === 'in-progress'
															? 'EN COURS'
															: 'EN ATTENTE'}
												</Badge>
												<span className="font-mono text-xs text-blue-300/60">{item.date}</span>
											</div>
											<CardTitle className="mt-2 text-sm text-white">{item.title}</CardTitle>
										</CardHeader>
										<CardContent className="text-xs text-blue-100/90">
											<p>{item.content}</p>

											{/* Niveau de sécurité */}
											<div className="mt-4 border-t border-blue-300/10 pt-3">
												<div className="mb-1 flex items-center justify-between text-xs">
													<span className="flex items-center">
														<Zap className="mr-1 text-blue-400" size={10} />
														Niveau de Sécurité
													</span>
													<span className="font-mono text-blue-300">{item.energy}%</span>
												</div>
												<div className="h-1 w-full overflow-hidden rounded-full bg-blue-300/10">
													<div
														className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
														style={{ width: `${item.energy}%` }}
													></div>
												</div>
											</div>

											{/* Noeuds connectés */}
											{item.relatedIds.length > 0 && (
												<div className="mt-4 border-t border-blue-300/10 pt-3">
													<div className="mb-2 flex items-center">
														<Link className="mr-1 text-blue-400" size={10} />
														<h4 className="text-xs font-medium tracking-wider text-blue-300/80 uppercase">
															Étapes Connectées
														</h4>
													</div>
													<div className="flex flex-wrap gap-1">
														{item.relatedIds.map(relatedId => {
															const relatedItem = timelineData.find(i => i.id === relatedId)
															return (
																<Button
																	className="flex h-6 items-center rounded-sm border-blue-400/20 bg-transparent px-2 py-0 text-xs text-blue-200/80 transition-all hover:bg-blue-500/20 hover:text-blue-100"
																	key={relatedId}
																	onClick={e => {
																		e.stopPropagation()
																		toggleItem(relatedId)
																	}}
																	size="sm"
																	variant="outline"
																>
																	{relatedItem?.title}
																	<ArrowRight className="ml-1 text-blue-400/60" size={8} />
																</Button>
															)
														})}
													</div>
												</div>
											)}
										</CardContent>
									</Card>
								)}
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
