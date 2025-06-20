import type { Metadata } from 'next'

import { Geist, Geist_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'

import { generateLocaleParams, type LocaleParams } from '@/lib/generateStaticParams'
import Footer from '@/components/global/footer'
import Header from '@/components/global/Header'

// import '/globals.css'
import '@/app/[locale]/globals.css'

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
	manifest: '/site.webmanifest',
	icons: {
		shortcut: '/favicon.ico',
		icon: [
			{ url: '/favicon.ico', sizes: 'any' },
			{ url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
			{ url: '/favicon.svg', type: 'image/svg+xml' },
		],
		apple: {
			url: '/apple-touch-icon.png',
			type: 'image/png',
			sizes: '180x180',
		},
	},
	description: 'Application in development - Not accessible to the public',
	appleWebApp: {
		title: 'BeSwib',
	},
}

// Generate static params for all locales
export function generateStaticParams() {
	return generateLocaleParams()
}

export default async function RootLayout({
	params,
	children,
}: Readonly<{
	children: React.ReactNode
	params: Promise<LocaleParams>
}>) {
	const { locale } = await params

	return (
		<ClerkProvider>
			<html className="dark" lang={locale}>
				<body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}>
					<Header localeParams={params} />
					{children}
					<Footer localeParams={params} />
					<Toaster />
				</body>
			</html>
		</ClerkProvider>
	)
}
