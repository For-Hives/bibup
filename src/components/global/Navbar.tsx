import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image' // Import Image component
import Link from 'next/link'

export default function Navbar() {
	return (
		<header className="flex h-16 items-center justify-between gap-4 p-4">
			{' '}
			{/* Changed justify-end to justify-between */}
			<div>
				{' '}
				{/* Added a div to wrap the logo */}
				<Link href="/">
					<Image
						alt="App Logo"
						height={24} // Adjust height as needed
						src="/next.svg" // Using next.svg as a placeholder
						width={100} // Adjust width as needed
					/>
				</Link>
			</div>
			<div className="flex items-center gap-4">
				{' '}
				{/* Added a div to wrap the auth buttons and dashboard link */}
				<SignedOut>
					<SignInButton />
					<SignUpButton />
				</SignedOut>
				<SignedIn>
					<Link href="/dashboard">
						<button>Dashboard</button>
					</Link>
					<UserButton />
				</SignedIn>
			</div>
		</header>
	)
}
