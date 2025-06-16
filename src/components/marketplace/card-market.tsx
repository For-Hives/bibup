'use client'

import React from 'react'

export default function CardMarket() {
	return (
		<>
			<div className="w-full max-w-xs">
				<div className="relative flex flex-col overflow-hidden rounded-2xl border border-indigo-500/30 bg-indigo-500/5 shadow-[0_0_0_1px_rgba(79,70,229,0.3),inset_0_0_30px_rgba(79,70,229,0.1),inset_0_0_60px_rgba(59,130,246,0.05),0_0_50px_rgba(139,92,246,0.2)] backdrop-blur-md">
					<div className="relative flex justify-center p-4">
						<div className="relative h-48 w-full overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-purple-500/10 shadow-[inset_0_0_20px_rgba(79,70,229,0.3),inset_0_0_40px_rgba(59,130,246,0.2),0_0_30px_rgba(139,92,246,0.4)] before:absolute before:inset-0 before:-z-10 before:m-[-1px] before:rounded-xl before:bg-gradient-to-br before:from-indigo-500 before:via-blue-500 before:via-purple-500 before:to-amber-500 before:p-0.5">
							<div className="absolute inset-0 opacity-10">
								<div className="h-full w-full animate-pulse bg-[linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[length:15px_15px]" />
							</div>
						</div>
					</div>
					<div className="h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
					<div className="p-4">
						<span className="mb-3 inline-block rounded-full border border-indigo-400/30 bg-white/5 px-3 py-1 text-xs font-medium text-indigo-300 backdrop-blur-md">
							Database
						</span>
						<h3 className="mb-2 text-lg font-medium text-white">Schema Management</h3>
						<p className="mb-4 text-xs leading-relaxed text-white/70">
							Design, optimize and maintain your database structure with powerful schema tools.
						</p>
						<div className="flex items-center justify-between">
							<a
								className="flex items-center rounded-lg border border-indigo-400/30 bg-white/5 px-3 py-1.5 text-xs font-medium text-indigo-400 backdrop-blur-md transition hover:text-indigo-300"
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
							<span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/50 backdrop-blur-md">
								Live
							</span>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
