import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'

import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import pageTranslationsData from './locales.json'

export default async function Navbar() {
	const locale: string = await getLocale()

	const t = getTranslations(locale, pageTranslationsData)

	return (
		<header className="flex h-16 items-center justify-between gap-4 p-4">
			<div>
				{/* Using global translation for App Name */}
				<Link className="flex items-center gap-2 text-[var(--text-dark)] hover:text-[var(--accent-sporty)]" href="/">
					<Image
						alt={String(t.GLOBAL.logoAltText)}
						className="mr-2 inline-block"
						height={80}
						src="/logo.svg"
						width={80}
					/>
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
						<button>{t.navbar.dashboardLink}</button>
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
