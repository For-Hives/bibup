import { cn } from '@/lib/utils'

export const BentoGrid = ({ className, children }: { children?: React.ReactNode; className?: string }) => {
	return <div className={cn('mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-12', className)}>{children}</div>
}

export const BentoGridItem = ({
	title,
	icon,
	header,
	description,
	className,
}: {
	className?: string
	description?: React.ReactNode | string
	header?: React.ReactNode
	icon?: React.ReactNode
	title?: React.ReactNode | string
}) => {
	return (
		<div
			className={cn(
				'group/bento shadow-input row-span-1 flex min-h-fit flex-col justify-start space-y-4 rounded-xl border border-neutral-200 bg-white p-6 backdrop-blur-sm transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black/30 dark:shadow-none',
				className
			)}
		>
			{header}
			<div className="transition duration-200 group-hover/bento:translate-x-2">
				{icon}
				<div className="mt-3 mb-3 font-sans text-lg font-bold text-neutral-600 dark:text-neutral-200">{title}</div>
				<div className="font-sans text-sm font-normal text-neutral-600 dark:text-neutral-300">{description}</div>
			</div>
		</div>
	)
}
