import type { Metadata } from 'next'

import { Geist, Geist_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'
import Script from 'next/script'

import Footer from '@/components/global/footer'
import Header from '@/components/global/Header'
import { getLocale } from '@/lib/getLocale'

import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Beswib - Application in development',
	robots: {
		nocache: true,
		index: false,
		googleBot: {
			noimageindex: true,
			'max-video-preview': -1,
			'max-snippet': -1,
			'max-image-preview': 'none',
			index: false,
			follow: false,
		},
		follow: false,
	},
	description: 'Application in development - Not accessible to the public',
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const locale = await getLocale()

	return (
		<ClerkProvider>
			{/* <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="shortcut icon" href="/favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<meta name="apple-mobile-web-app-title" content="BeSwib" />
<link rel="manifest" href="/site.webmanifest" /> */}
			<html className="dark" lang={locale}>
				<body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}>
					<Header />
					{children}
					<Footer />
					<Toaster />
				</body>
			</html>
		</ClerkProvider>
	)
}
