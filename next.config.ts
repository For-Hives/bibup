import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	trailingSlash: true,
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
	// eslint-disable-next-line @typescript-eslint/require-await
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
					{
						value:
							"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://*.clerk.accounts.dev https://clerk.com; object-src 'none'; frame-src https://js.stripe.com https://hooks.stripe.com https://*.clerk.accounts.dev; connect-src 'self' https://api.stripe.com https://*.clerk.accounts.dev https://clerk.com;",
						key: 'Content-Security-Policy',
					},
				],
			},
		]
	},
}

export default nextConfig
