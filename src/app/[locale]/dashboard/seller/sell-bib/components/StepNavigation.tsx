import { ArrowLeft, ArrowRight } from 'lucide-react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

interface StepNavigationProps {
	createdBib: boolean
	isFirstStep: boolean
	isLastStep: boolean
	isSubmitting: boolean
	onNext: () => void
	onPrevious: () => void
	onSubmit: () => Promise<void>
	translations: {
		cancel: string
		finish: string
		loading: string
		next: string
		previous: string
	}
}

export default function StepNavigation({
	translations: t,
	onSubmit,
	onPrevious,
	onNext,
	isSubmitting,
	isLastStep,
	isFirstStep,
	createdBib,
}: StepNavigationProps) {
	const router = useRouter()

	return (
		<div className="flex items-center justify-between pt-8">
			<Button
				disabled={isSubmitting}
				onClick={() => (createdBib ? router.push('/dashboard/seller') : router.push('/dashboard/seller'))}
				size="lg"
				variant="outline"
			>
				{createdBib ? 'Retour au Dashboard' : t.cancel}
			</Button>

			<div className="flex gap-4">
				{!isFirstStep && !createdBib && (
					<Button disabled={isSubmitting} onClick={onPrevious} size="lg" variant="outline">
						<ArrowLeft className="mr-2 h-4 w-4" />
						{t.previous}
					</Button>
				)}

				{!isLastStep ? (
					<Button disabled={isSubmitting} onClick={onNext} size="lg">
						{t.next}
						<ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				) : !createdBib ? (
					<Button className="min-w-32" disabled={isSubmitting} onClick={() => void onSubmit()} size="lg">
						{isSubmitting ? t.loading : t.finish}
					</Button>
				) : (
					<Button onClick={() => router.push('/dashboard/seller')} size="lg">
						Terminer
					</Button>
				)}
			</div>
		</div>
	)
}
