import { CheckCircle } from 'lucide-react'

interface ProgressStepsProps {
	currentStepIndex: number
	steps: readonly string[]
	translations: Record<string, { description: string; title: string }>
}

export default function ProgressSteps({ translations: t, steps, currentStepIndex }: ProgressStepsProps) {
	return (
		<div className="mb-16">
			<div className="mx-auto flex max-w-4xl items-center justify-between">
				{steps.map((step, index) => {
					const isActive = index === currentStepIndex
					const isCompleted = index < currentStepIndex
					const stepData = t[step]

					return (
						<div className="flex items-center" key={step}>
							<div className="flex flex-col items-center">
								<div
									className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-medium transition-all duration-200 ${
										isCompleted
											? 'bg-primary text-primary-foreground shadow-lg'
											: isActive
												? 'bg-primary/20 text-primary border-primary border-2 shadow-md'
												: 'bg-muted text-muted-foreground'
									} `}
								>
									{isCompleted ? <CheckCircle className="h-6 w-6" /> : index + 1}
								</div>
								<div className="mt-3 text-center">
									<p className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
										{stepData.title}
									</p>
									<p className="text-muted-foreground mt-1 text-xs">{stepData.description}</p>
								</div>
							</div>
							{index < steps.length - 1 && (
								<div
									className={`mx-8 h-px w-24 transition-all duration-200 ${isCompleted ? 'bg-primary' : 'bg-muted'}`}
								/>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}
