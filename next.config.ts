import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	async headers() {
		return [
			{
				// Apply to all routes
				source: '/(.*)',
				headers: [
					{
						key: 'X-Robots-Tag',
						value: 'noindex, nofollow, noarchive, nosnippet, noimageindex, nocache',
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
				],
			},
		]
	},
}

export default nextConfig
