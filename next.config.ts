import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'loremflickr.com',
			},
			{
				protocol: 'https',
				hostname: 'picsum.photos',
			},
			{
				protocol: 'https',
				hostname: '*.andy-cinquin.fr',
			},
			{
				protocol: 'https',
				hostname: '*.beswib.com',
			},
		],
	},
	async headers() {
		return [
			{
				// Apply to all routes
				source: '/(.*)',
				headers: [
					{
						value: 'noindex, nofollow, noarchive, nosnippet, noimageindex, nocache',
						key: 'X-Robots-Tag',
					},
					{
						value: 'nosniff',
						key: 'X-Content-Type-Options',
					},
				],
			},
		]
	},
}

export default nextConfig
