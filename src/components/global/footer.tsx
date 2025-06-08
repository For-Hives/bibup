import { SignedIn } from '@clerk/nextjs' // Import Clerk components
import Image from 'next/image'
import Link from 'next/link' // Import Link for internal navigation

export default function Footer() {
	return (
		<footer className="row-start-3 mt-10 flex flex-wrap items-center justify-center gap-[24px] border-t p-6">
			{/* Internal Links */}
			<Link className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="/events">
				Events
			</Link>
			<Link className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="/calendar">
				Calendar
			</Link>
			<Link className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="/faq">
				FAQ
			</Link>

			{/* Conditional Dashboard Link */}
			<SignedIn>
				<Link className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="/dashboard">
					Dashboard
				</Link>
			</SignedIn>

			{/* Existing External Links - kept them for now */}
			<a
				className="flex items-center gap-2 hover:underline hover:underline-offset-4"
				href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
				rel="noopener noreferrer"
				target="_blank"
			>
				<Image alt="File icon" aria-hidden height={16} src="/file.svg" width={16} />
				Learn
			</a>
			<a
				className="flex items-center gap-2 hover:underline hover:underline-offset-4"
				href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
				rel="noopener noreferrer"
				target="_blank"
			>
				<Image alt="Window icon" aria-hidden height={16} src="/window.svg" width={16} />
				Examples
			</a>
			<a
				className="flex items-center gap-2 hover:underline hover:underline-offset-4"
				href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
				rel="noopener noreferrer"
				target="_blank"
			>
				<Image alt="Globe icon" aria-hidden height={16} src="/globe.svg" width={16} />
				Go to nextjs.org →
			</a>
		</footer>
	)
}
