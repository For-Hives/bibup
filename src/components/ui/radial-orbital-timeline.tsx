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
		const nodeRef = nodeRefs.current[nodeId]
		if (!nodeRef) return

		const nodeIndex = timelineData.findIndex(item => item.id === nodeId)
		const totalNodes = timelineData.length
		const targetAngle = (nodeIndex / totalNodes) * 360

		setRotationAngle(270 - targetAngle)
	}

	const calculateNodePosition = (index: number, total: number) => {
		const angle = ((index / total) * 360 + rotationAngle) % 360
		const radius = 200
		const radian = (angle * Math.PI) / 180

		const x = radius * Math.cos(radian)
		const y = radius * Math.sin(radian)

		const zIndex = Math.round(100 + 50 * Math.cos(radian))
		const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)))

		return { zIndex, y, x, opacity, angle }
	}

	const getRelatedItems = (itemId: number): number[] => {
		const currentItem = timelineData.find(item => item.id === itemId)
		return currentItem ? currentItem.relatedIds : []
	}

	const isRelatedToActive = (itemId: number): boolean => {
		if (activeNodeId === null) return false
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
			className="bg-background z-40 flex min-h-128 w-full flex-col items-center justify-center"
			onClick={handleContainerClick}
			ref={containerRef}
		>
			<div className="relative flex h-full w-full max-w-6xl items-center justify-center">
				<div
					className="absolute flex h-full w-full items-center justify-center"
					ref={orbitRef}
					style={{
						perspective: '1000px',
					}}
				>
					{/* Orbital Center */}
					<div className="from-primary via-chart-2 to-chart-3 z-10 flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-gradient-to-br">
						<div className="border-primary/20 absolute h-24 w-24 animate-ping rounded-full border opacity-70"></div>
						<div className="border-primary/10 absolute h-28 w-28 animate-ping rounded-full border opacity-50"></div>
						<div className="bg-primary-foreground/90 h-10 w-10 rounded-full backdrop-blur-md"></div>
					</div>

					{/* Orbit Ring */}
					<div className="border-border/30 absolute h-96 w-96 rounded-full border"></div>

					{/* Timeline Nodes */}
					{timelineData.map((item, index) => {
						const position = calculateNodePosition(index, timelineData.length)
						const isExpanded = expandedItems[item.id]
						const isRelated = isRelatedToActive(item.id)
						const isPulsing = pulseEffect[item.id] ?? false
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
								ref={el => {
									nodeRefs.current[item.id] = el
								}}
								style={nodeStyle}
							>
								{/* Pulse Effect */}
								<div
									className={`absolute -inset-1 rounded-full ${isPulsing ? 'animate-pulse duration-1000' : ''}`}
									style={{
										width: `${item.energy * 0.5 + 50}px`,
										top: `-${(item.energy * 0.5 + 50 - 40) / 2}px`,
										left: `-${(item.energy * 0.5 + 50 - 40) / 2}px`,
										height: `${item.energy * 0.5 + 50}px`,
										background: `radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, hsl(var(--primary) / 0) 70%)`,
									}}
								></div>

								{/* Main Node */}
								<div
									className={`flex h-12 w-12 transform items-center justify-center rounded-full border-2 transition-all duration-300 ${
										isExpanded
											? 'border-primary bg-primary text-primary-foreground shadow-primary/50 scale-150 shadow-lg'
											: isRelated
												? 'border-primary bg-primary/70 text-primary-foreground animate-pulse'
												: 'border-muted bg-card/90 text-muted-foreground'
									}`}
								>
									<Icon size={20} />
								</div>

								{/* Node Title */}
								<div
									className={`absolute top-14 text-xs font-semibold tracking-wider whitespace-nowrap transition-all duration-300 ${isExpanded ? 'text-foreground scale-125' : 'text-muted-foreground'}`}
								>
									{item.title}
								</div>

								{/* Expanded Card */}
								{isExpanded && (
									<Card className="border-primary/30 bg-card/95 shadow-primary/20 absolute top-20 left-1/2 w-72 -translate-x-1/2 overflow-visible shadow-xl backdrop-blur-lg">
										<div className="bg-primary/50 absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2"></div>
										<CardHeader className="pb-2">
											<div className="flex items-center justify-between">
												<Badge className={`text-xs ${getStatusStyles(item.status)}`}>
													{item.status === 'completed'
														? 'COMPLETED'
														: item.status === 'in-progress'
															? 'IN PROGRESS'
															: 'PENDING'}
												</Badge>
												<span className="text-muted-foreground font-mono text-xs">{item.date}</span>
											</div>
											<CardTitle className="text-foreground mt-2 text-sm">{item.title}</CardTitle>
										</CardHeader>
										<CardContent className="text-muted-foreground text-xs">
											<p>{item.content}</p>

											{/* Security Level */}
											<div className="border-border mt-4 border-t pt-3">
												<div className="mb-1 flex items-center justify-between text-xs">
													<span className="flex items-center">
														<Zap className="text-primary mr-1" size={10} />
														Security Level
													</span>
													<span className="text-foreground font-mono">{item.energy}%</span>
												</div>
												<div className="bg-muted h-1 w-full overflow-hidden rounded-full">
													<div
														className="from-primary to-chart-3 h-full bg-gradient-to-r"
														style={{ width: `${item.energy}%` }}
													></div>
												</div>
											</div>

											{/* Connected Nodes */}
											{item.relatedIds.length > 0 && (
												<div className="border-border mt-4 border-t pt-3">
													<div className="mb-2 flex items-center">
														<Link className="text-primary mr-1" size={10} />
														<h4 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
															Connected Steps
														</h4>
													</div>
													<div className="flex flex-wrap gap-1">
														{item.relatedIds.map(relatedId => {
															const relatedItem = timelineData.find(i => i.id === relatedId)
															return (
																<Button
																	className="border-primary/20 text-muted-foreground hover:bg-primary/20 hover:text-foreground flex h-6 items-center rounded-sm bg-transparent px-2 py-0 text-xs transition-all"
																	key={relatedId}
																	onClick={e => {
																		e.stopPropagation()
																		toggleItem(relatedId)
																	}}
																	size="sm"
																	variant="outline"
																>
																	{relatedItem?.title}
																	<ArrowRight className="text-primary/60 ml-1" size={8} />
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
