'use client'

import { Dot } from 'lucide-react'
import * as React from 'react'

import { OTPInput, OTPInputContext } from 'input-otp'
import { cn } from '@/lib/utils'

const InputOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, React.ComponentPropsWithoutRef<typeof OTPInput>>(
	({ containerClassName, className, ...props }, ref) => (
		<OTPInput
			className={cn('disabled:cursor-not-allowed', className)}
			containerClassName={cn('flex items-center gap-2 has-[:disabled]:opacity-50', containerClassName)}
			ref={ref}
			{...props}
		/>
	)
)
InputOTP.displayName = 'InputOTP'

const InputOTPGroup = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(
	({ className, ...props }, ref) => <div className={cn('flex items-center', className)} ref={ref} {...props} />
)
InputOTPGroup.displayName = 'InputOTPGroup'

const InputOTPSlot = React.forwardRef<
	React.ElementRef<'div'>,
	React.ComponentPropsWithoutRef<'div'> & { index: number }
>(({ className, index, ...props }, ref) => {
	const inputOTPContext = React.useContext(OTPInputContext)
	const { hasFakeCaret, isActive, char } = inputOTPContext.slots[index]

	return (
		<div
			className={cn(
				'border-input relative flex h-10 w-10 items-center justify-center border-y border-r text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md',
				isActive && 'ring-ring ring-offset-background z-10 ring-2',
				className
			)}
			ref={ref}
			{...props}
		>
			{char}
			{hasFakeCaret && (
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
					<div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
				</div>
			)}
		</div>
	)
})
InputOTPSlot.displayName = 'InputOTPSlot'

const InputOTPSeparator = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(
	({ ...props }, ref) => (
		<div ref={ref} role="separator" {...props}>
			<Dot />
		</div>
	)
)
InputOTPSeparator.displayName = 'InputOTPSeparator'

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot }
