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
		<Disclosure as="nav" className="">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center">
						<div className="shrink-0">
							<Link href="/">
								<Image alt="Beswib" className="h-20 w-auto" height={32} src="/beswib.svg" width={32} />
							</Link>
						</div>
						<div className="hidden sm:ml-6 sm:block">
							<div className="flex space-x-4">
								{navigationLinks.map(link => (
									<Link
										className={`rounded-md px-3 py-2 text-sm font-medium ${
											link.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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
						<div className="flex items-center text-white">
							<div className="flex items-center gap-4">
								{/* Using page-specific translation for a navigation link */}
								<SignedIn>
									<Link href="/dashboard">
										<button>{t.navbar.dashboardLink}</button>
									</Link>
									<UserButton />
								</SignedIn>
								<SignedOut>
									<SignInButton>
										<button className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
											Sign In
										</button>
									</SignInButton>
									<SignUpButton>
										<button className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
											Sign Up
										</button>
									</SignUpButton>
								</SignedOut>
							</div>
						</div>
					</div>
					<div className="-mr-2 flex sm:hidden">
						{/* Mobile menu button */}
						<DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
							<span className="absolute -inset-0.5" />
							<span className="sr-only">Open main menu</span>
							<Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
							<XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
						</DisclosureButton>
					</div>
				</div>
			</div>

			<DisclosurePanel className="border-b-2 border-gray-500 sm:hidden">
				<div className="space-y-1 px-2 pt-2 pb-3">
					{navigationLinks.map(link => (
						<DisclosureButton
							as={Link}
							className={`block rounded-md px-3 py-2 text-base font-medium ${
								link.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
							}`}
							href={link.href}
							key={link.href}
						>
							{link.label}
						</DisclosureButton>
					))}

					{/* Mobile auth buttons */}
					<div className="border-t border-gray-700 pt-4 pb-3">
						<div className="flex flex-col space-y-2 px-2">
							<SignedIn>
								<DisclosureButton
									as={Link}
									className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
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
									<button className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
										Sign In
									</button>
								</SignInButton>
								<SignUpButton>
									<button className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
										Sign Up
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
