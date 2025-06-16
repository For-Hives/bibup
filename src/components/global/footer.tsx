import Link from 'next/link'

export default function Footer() {
	return (
		<footer className="row-start-3 mt-10 flex flex-wrap items-center justify-center gap-[24px] border-t p-6">
			<p>
				Made with ❤️ by{' '}
				<Link className="underline" href="https://forhives.fr/">
					ForHives
				</Link>
			</p>
		</footer>
	)
}
