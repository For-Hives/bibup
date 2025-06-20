import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { getLocale } from '@/lib/getLocale'

const unauthorizedTranslations = {
	fr: {
		title: 'Access Denied',
		message: 'You do not have permission to access this page.',
		contactSupport: 'Contact Support',
		backToHome: 'Back to Home',
		adminRequired: 'Administrator privileges are required to view this content.',
	},
	en: {
		title: 'Access Denied',
		message: 'You do not have permission to access this page.',
		contactSupport: 'Contact Support',
		backToHome: 'Back to Home',
		adminRequired: 'Administrator privileges are required to view this content.',
	},
} as const

export default async function UnauthorizedPage() {
	const locale = await getLocale()
	const t = unauthorizedTranslations[locale as keyof typeof unauthorizedTranslations] ?? unauthorizedTranslations.en

	return (
		<div className="from-background via-primary/5 to-background relative min-h-screen bg-gradient-to-br">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
			<div className="relative flex min-h-screen items-center justify-center p-6">
				<div className="border-border/50 bg-card/80 w-full max-w-md rounded-3xl border p-8 text-center shadow-[0_0_0_1px_hsl(var(--border)),inset_0_0_30px_hsl(var(--primary)/0.1),inset_0_0_60px_hsl(var(--accent)/0.05),0_0_50px_hsl(var(--primary)/0.2)] backdrop-blur-md">
					{/* Error Icon */}
					<div className="mb-6 text-6xl text-red-600 dark:text-red-400">🚫</div>

					{/* Title */}
					<h1 className="text-foreground mb-4 text-3xl font-bold">{t.title}</h1>

					{/* Messages */}
					<div className="mb-6 space-y-3">
						<p className="text-muted-foreground text-lg">{t.message}</p>
						<p className="text-muted-foreground text-sm">{t.adminRequired}</p>
					</div>

					{/* Action buttons */}
					<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
						<Button asChild size="lg" variant="default">
							<Link href="/">{t.backToHome}</Link>
						</Button>
						<Button asChild size="lg" variant="outline">
							<Link href="/contact">{t.contactSupport}</Link>
						</Button>
					</div>

					{/* Additional help text */}
					<div className="border-border/30 mt-8 border-t pt-6">
						<p className="text-muted-foreground text-xs">
							If you believe this is an error, please contact the administrator.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
