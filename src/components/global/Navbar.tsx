import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { getLocale } from '@/lib/getLocale' // Assuming this path
import Link from 'next/link'

// globalTranslationsData import removed as it's no longer passed to getTranslations
import { getTranslations } from '../../lib/getDictionary' // Corrected path
import pageTranslationsData from './locales.json' // Renamed import

export default async function Navbar() {
	const locale: string = await getLocale() // Explicitly type locale

	

	const t = getTranslations(
		locale,
		pageTranslationsData
		// globalTranslationsData argument removed
		// DefaultLocaleKey will use its default 'en' from getTranslations signature
	)

	return (
		<header className="flex h-16 items-center justify-between gap-4 p-4">
			<div>
				{/* Using global translation for App Name */}
				<Link href="/">
					{}
					<h1>{t.GLOBAL.appName}</h1>
				</Link>
			</div>
			<div className="flex items-center gap-4">
				{/* Using page-specific translation for a navigation link */}
				<Link href="/">
					<button>{t.navbar.homeLink}</button>
				</Link>
				<SignedIn>
					<Link href="/dashboard">
						<button>Dashboard</button>
					</Link>
					<UserButton />
				</SignedIn>
				<SignedOut>
					<SignInButton />
					<SignUpButton />
				</SignedOut>
			</div>
		</header>
	)
}
