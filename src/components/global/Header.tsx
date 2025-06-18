import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'

import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import pageTranslationsData from './locales.json'

export default async function Header() {
	const locale: string = await getLocale()

	const t = getTranslations(locale, pageTranslationsData)

	// Navigation links data
	const navigationLinks = [
		{ label: t.navbar.homeLink, href: '/', current: false },
		{ label: t.navbar.racesLink, href: '/events', current: false },
		{ label: t.navbar.calendarLink, href: '/calendar', current: false },
		{ label: t.navbar.marketplaceLink, href: '/marketplace', current: false },
		{ label: t.navbar.faqLink, href: '/faq', current: false },
		{ label: t.navbar.contactLink, href: '/contact', current: false },
	]

	return (
		<Disclosure
			as="nav"
			className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur"
		>
			<div className="mx-auto max-w-7xl px-4 xl:px-0">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center">
						<div className="">
							<Link href="/">
								<Image alt="Beswib" className="h-8 w-auto" height={32} src="/beswib.svg" width={32} />
							</Link>
						</div>
						<div className="hidden sm:ml-6 sm:block">
							<div className="flex space-x-4">
								{navigationLinks.map(link => (
									<Link
										className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
											link.current
												? 'bg-accent text-accent-foreground'
												: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
										}`}
										href={link.href}
										key={link.href}
									>
										{link.label}
									</Link>
								))}
							</div>
						</div>
					</div>
					<div className="hidden sm:ml-6 sm:block">
						<div className="text-foreground flex items-center">
							<div className="flex items-center gap-4">
								{/* Using page-specific translation for a navigation link */}
								<SignedIn>
									<Link href="/dashboard">
										<button className="text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors">
											{t.navbar.dashboardLink}
										</button>
									</Link>
									<UserButton />
								</SignedIn>
								<SignedOut>
									<SignInButton>
										<button className="text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors">
											{t.navbar.signIn}
										</button>
									</SignInButton>
									<SignUpButton>
										<button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-2 text-sm font-medium transition-colors">
											{t.navbar.signUp}
										</button>
									</SignUpButton>
								</SignedOut>
							</div>
						</div>
					</div>
					<div className="-mr-2 flex sm:hidden">
						{/* Mobile menu button */}
						<DisclosureButton className="group text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:ring-ring relative inline-flex items-center justify-center rounded-md p-2 transition-colors focus:ring-2 focus:outline-none focus:ring-inset">
							<span className="absolute -inset-0.5" />
							<span className="sr-only">Open main menu</span>
							<Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
							<XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
						</DisclosureButton>
					</div>
				</div>
			</div>

			<DisclosurePanel className="border-border bg-background border-b sm:hidden">
				<div className="space-y-1 px-2 pt-2 pb-3">
					{navigationLinks.map(link => (
						<DisclosureButton
							as={Link}
							className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
								link.current
									? 'bg-accent text-accent-foreground'
									: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
							}`}
							href={link.href}
							key={link.href}
						>
							{link.label}
						</DisclosureButton>
					))}

					{/* Mobile auth buttons */}
					<div className="border-border border-t pt-4 pb-3">
						<div className="flex flex-col space-y-2 px-2">
							<SignedIn>
								<DisclosureButton
									as={Link}
									className="text-muted-foreground hover:bg-accent hover:text-accent-foreground block rounded-md px-3 py-2 text-base font-medium transition-colors"
									href="/dashboard"
								>
									{t.navbar.dashboardLink}
								</DisclosureButton>
								<div className="px-3 py-2">
									<UserButton />
								</div>
							</SignedIn>
							<SignedOut>
								<SignInButton>
									<button className="text-muted-foreground hover:bg-accent hover:text-accent-foreground block w-full rounded-md px-3 py-2 text-left text-base font-medium transition-colors">
										{t.navbar.signIn}
									</button>
								</SignInButton>
								<SignUpButton>
									<button className="bg-primary text-primary-foreground hover:bg-primary/90 block w-full rounded-md px-3 py-2 text-left text-base font-medium transition-colors">
										{t.navbar.signUp}
									</button>
								</SignUpButton>
							</SignedOut>
						</div>
					</div>
				</div>
			</DisclosurePanel>
		</Disclosure>
	)
}
