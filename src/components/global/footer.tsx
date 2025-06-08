import Link from 'next/link'

export function Footer() {
	return (
		<footer className="border-t bg-gray-100">
			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-col items-start justify-between md:flex-row md:items-center">
					<div className="mb-4 flex items-center space-x-2 md:mb-0">
						<div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500">
							<span className="text-xs font-bold text-white">🏃</span>
						</div>
						<span className="text-sm text-gray-600">The Place to Bib</span>
					</div>

					<div className="flex flex-wrap gap-6 text-sm">
						<Link className="text-gray-600 hover:text-green-600" href="/faqs">
							FAQs
						</Link>
						<Link className="text-gray-600 hover:text-green-600" href="/contact">
							Contact Us
						</Link>
						<Link className="font-medium text-green-600" href="/marketplace">
							Marketplace
						</Link>
						<Link className="text-gray-600 hover:text-green-600" href="/legal">
							Legal Notice
						</Link>
					</div>
				</div>

				<div className="mt-4 border-t border-gray-200 pt-4">
					<p className="text-xs text-gray-500">© 2024 - All rights reserved.</p>
				</div>
			</div>
		</footer>
	)
}
