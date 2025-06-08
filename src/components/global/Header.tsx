'use client'
import { Bell, User } from 'lucide-react'
import { useState } from 'react'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

const LoggedInHeader = () => (
	<header className="border-b border-slate-700 bg-slate-800">
		<div className="container mx-auto">
			<div className="mx-auto flex max-w-7xl items-center justify-between p-6">
				<Link className="text-2xl font-bold" href="/race">
					BibUp
				</Link>

				<nav className="hidden items-center space-x-8 md:flex">
					<Link className="transition-colors hover:text-blue-400" href="/race">
						Courses
					</Link>
					<Link className="transition-colors hover:text-blue-400" href="/calendrier">
						Calendrier
					</Link>
					<Link className="transition-colors hover:text-blue-400" href="/marketplace">
						Marketplace
					</Link>
					<Link className="transition-colors hover:text-blue-400" href="/faq">
						FAQ
					</Link>
					<Link className="transition-colors hover:text-blue-400" href="/contact">
						Contact
					</Link>
				</nav>

				<div className="flex items-center space-x-4">
					<Button className="bg-blue-600 hover:bg-blue-700">Vendre un dossard</Button>
					<Link className="text-slate-300 hover:text-white" href="#">
						<Bell className="h-5 w-5" />
					</Link>
					<Link href="/profile">
						<div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-600 transition-colors hover:bg-blue-700">
							<span className="text-sm font-medium text-white">JD</span>
						</div>
					</Link>
				</div>
			</div>
		</div>
	</header>
)

const LoggedOutHeader = () => {
	const pathname = usePathname()

	return (
		<header className="border-b border-slate-700 bg-slate-800 text-white">
			<nav className="mx-auto flex max-w-7xl items-center justify-between p-6">
				<Link className="text-2xl font-bold" href="/">
					BibUp
				</Link>
				<div className="hidden space-x-8 md:flex">
					<Link className="transition-colors hover:text-blue-400" href="/race">
						Courses
					</Link>
					<Link className="transition-colors hover:text-blue-400" href="/calendrier">
						Calendrier
					</Link>
					<Link className="transition-colors hover:text-blue-400" href="/marketplace">
						Marketplace
					</Link>
					<Link className="transition-colors hover:text-blue-300" href="/faq">
						FAQ
					</Link>
					<Link className="transition-colors hover:text-blue-400" href="/contact">
						Contact
					</Link>
				</div>
				<div className="flex space-x-4">
					{pathname !== '/login' && (
						<Link href="/login">
							<Button className="bg-blue-600 hover:bg-blue-700">Se connecter</Button>
						</Link>
					)}
					{pathname !== '/signup' && (
						<Link href="/signup">
							<Button className="bg-blue-600 hover:bg-blue-700">S'inscrire</Button>
						</Link>
					)}
				</div>
			</nav>
		</header>
	)
}

export default function Header() {
	// For demonstration, we use a state. In a real app, this would come from an auth context.
	const [isConnected, setIsConnected] = useState(false)

	// You can remove this button in production
	const toggleConnection = () => setIsConnected(!isConnected)

	return (
		<>
			<div style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 1000 }}>
				<Button className="bg-gray-800 text-white hover:bg-black" onClick={toggleConnection}>
					Toggle Connexion
				</Button>
			</div>

			{isConnected ? <LoggedInHeader /> : <LoggedOutHeader />}
		</>
	)
}
