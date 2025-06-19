import * as React from 'react'

import { getDateFormatPattern } from '@/lib/dateUtils'
import { cn } from '@/lib/utils'

export interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	locale?: string
	showHelper?: boolean
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
	({ showHelper = true, locale = 'fr', className, ...props }, ref) => {
		const dateFormat = getDateFormatPattern(locale)

		return (
			<div className="space-y-1">
				<input
					className={cn(
						'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
						className
					)}
					ref={ref}
					type="date"
					{...props}
				/>
				{showHelper && <p className="text-muted-foreground text-xs">Format: {dateFormat}</p>}
			</div>
		)
	}
)

DateInput.displayName = 'DateInput'

export { DateInput }
