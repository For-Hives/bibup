import type { Metadata } from 'next'

import { Geist, Geist_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { getLocale } from '@/lib/getLocale'
import { Toaster } from 'sonner'

import Footer from '@/components/global/footer'
import Navbar from '@/components/global/Navbar'

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
	robots: {
		googleBot: {
			'max-image-preview': 'none',
			'max-video-preview': -1,
			noimageindex: true,
			'max-snippet': -1,
			follow: false,
			index: false,
		},
		follow: false,
		nocache: true,
		index: false,
	},
	description: 'Application in development - Not accessible to the public',
	title: 'Beswib - Application in development',
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const locale = await getLocale()

	return (
		<ClerkProvider>
			<html lang={locale}>
				<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
					<Navbar />
					{children}
					<Footer />
					<Toaster />
				</body>
			</html>
		</ClerkProvider>
	)
}
