import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">🏃</span>
            </div>
            <span className="text-sm text-gray-600">The Place to Bib</span>
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/faqs" className="text-gray-600 hover:text-green-600">
              FAQs
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-green-600">
              Contact Us
            </Link>
            <Link href="/marketplace" className="text-green-600 font-medium">
              Marketplace
            </Link>
            <Link href="/legal" className="text-gray-600 hover:text-green-600">
              Legal Notice
            </Link>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">© 2024 - All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
