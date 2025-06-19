import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
	{
				secondary: 'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
				outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
				destructive:
					'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
				default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)

function Badge({
	variant,
	className,
	asChild = false,
	...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : 'span'

	return <Comp className={cn(badgeVariants({ variant }), className)} data-slot="badge" {...props} />
}

export { Badge, badgeVariants }

import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
	'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
	{
		variants: {
			variant: {
				secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
				outline: 'text-foreground',
				destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
				default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ variant, className, ...props }: BadgeProps) {
	return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
