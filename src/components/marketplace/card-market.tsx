'use client'

import React from 'react'

export default function CardMarket() {
	return (
		<>
			<div className="w-full max-w-xs">
				<div className="bg-card/80 border-border relative flex flex-col overflow-hidden rounded-2xl border shadow-[0_0_0_1px_hsl(var(--border)),inset_0_0_30px_hsl(var(--primary)/0.1),inset_0_0_60px_hsl(var(--accent)/0.05),0_0_50px_hsl(var(--primary)/0.2)] backdrop-blur-md">
					<div className="relative flex justify-center p-4">
						<div className="from-primary/10 via-accent/10 to-secondary/10 before:from-primary before:via-accent before:via-secondary before:to-ring relative h-48 w-full overflow-hidden rounded-xl bg-gradient-to-br shadow-[inset_0_0_20px_hsl(var(--primary)/0.3),inset_0_0_40px_hsl(var(--accent)/0.2),0_0_30px_hsl(var(--primary)/0.4)] before:absolute before:inset-0 before:-z-10 before:m-[-1px] before:rounded-xl before:bg-gradient-to-br before:p-0.5">
							<div className="absolute inset-0 opacity-10">
								<div className="h-full w-full animate-pulse bg-[linear-gradient(90deg,hsl(var(--foreground)/0.3)_1px,transparent_1px),linear-gradient(hsl(var(--foreground)/0.3)_1px,transparent_1px)] bg-[length:15px_15px]" />
							</div>
						</div>
					</div>
					<div className="via-border h-px w-full bg-gradient-to-r from-transparent to-transparent" />
					<div className="p-4">
						<span className="border-border bg-accent/20 text-accent-foreground mb-3 inline-block rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-md">
							Database
						</span>
						<h3 className="text-foreground mb-2 text-lg font-medium">Schema Management</h3>
						<p className="text-muted-foreground mb-4 text-xs leading-relaxed">
							Design, optimize and maintain your database structure with powerful schema tools.
						</p>
						<div className="flex items-center justify-between">
							<a
								className="border-border bg-accent/20 text-accent-foreground hover:bg-accent/30 hover:text-foreground flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium backdrop-blur-md transition"
								href="#"
							>
								Manage
								<svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24">
									<path
										d="M5 12H19M19 12L12 5M19 12L12 19"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
									/>
								</svg>
							</a>
							<span className="border-border bg-muted/20 text-muted-foreground rounded-full border px-2 py-1 text-xs backdrop-blur-md">
								Live
							</span>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
