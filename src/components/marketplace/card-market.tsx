'use client'

import React from 'react'

export default function CardMarket() {
	return (
		<>
			<div className="w-full max-w-xs">
				<div className="card-border relative flex flex-col overflow-hidden rounded-2xl">
					<div className="relative flex justify-center p-4">
						<div className="gradient-border inner-glow relative h-48 w-full overflow-hidden rounded-xl">
							{/* Animated grid background */}
							<div className="absolute inset-0 opacity-10">
								<div className="gradient-element h-full w-full animate-pulse" />
							</div>
						</div>
					</div>
					<div className="h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
					<div className="p-4">
						<span className="glass mb-3 inline-block rounded-full border border-indigo-400/30 px-3 py-1 text-xs font-medium text-indigo-300">
							Database
						</span>
						<h3 className="mb-2 text-lg font-medium text-white">Schema Management</h3>
						<p className="mb-4 text-xs leading-relaxed text-white/70">
							Design, optimize and maintain your database structure with powerful schema tools.
						</p>
						<div className="flex items-center justify-between">
							<a
								className="glass flex items-center rounded-lg border border-indigo-400/30 px-3 py-1.5 text-xs font-medium text-indigo-400 transition hover:text-indigo-300"
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
							<span className="glass rounded-full border border-white/10 px-2 py-1 text-xs text-white/50">Live</span>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
