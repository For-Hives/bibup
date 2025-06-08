'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'

const LoggedInHeader = () => (
	<header className="border-b border-slate-700 bg-slate-800">
		<div className="container mx-auto">
			<div className="mx-auto flex max-w-7xl items-center justify-between p-6">
				<Link href="/race" className="text-2xl font-bold">
					BibUp
				</Link>

				<nav className="hidden items-center space-x-8 md:flex">
					<Link href="/race" className="transition-colors hover:text-blue-400">
						Courses
					</Link>
					<Link href="/calendrier" className="transition-colors hover:text-blue-400">
						Calendrier
					</Link>
					<Link href="/marketplace" className="transition-colors hover:text-blue-400">
						Marketplace
					</Link>
					<Link href="/faq" className="transition-colors hover:text-blue-400">
						FAQ
					</Link>
					<Link href="/contact" className="transition-colors hover:text-blue-400">
						Contact
					</Link>
				</nav>

				<div className="flex items-center space-x-4">
					<Button className="bg-blue-600 hover:bg-blue-700">Vendre un dossard</Button>
					<Link href="#" className="text-slate-300 hover:text-white">
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
				<Link href="/" className="text-2xl font-bold">
					BibUp
				</Link>
				<div className="hidden space-x-8 md:flex">
					<Link href="/race" className="transition-colors hover:text-blue-400">
						Courses
					</Link>
					<Link href="/calendrier" className="transition-colors hover:text-blue-400">
						Calendrier
					</Link>
					<Link href="/marketplace" className="transition-colors hover:text-blue-400">
						Marketplace
					</Link>
					<Link href="/faq" className="transition-colors hover:text-blue-300">
						FAQ
					</Link>
					<Link href="/contact" className="transition-colors hover:text-blue-400">
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
				<Button onClick={toggleConnection} className="bg-gray-800 text-white hover:bg-black">
					Toggle Connexion
				</Button>
			</div>

			{isConnected ? <LoggedInHeader /> : <LoggedOutHeader />}
		</>
	)
}
