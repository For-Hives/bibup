import type { Metadata } from 'next'

import { Geist, Geist_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'

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
