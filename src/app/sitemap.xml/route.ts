import { NextResponse } from 'next/server'

export function GET() {
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Web site in development - No URL to index -->
</urlset>`

	return new NextResponse(sitemap, {
		headers: {
			'X-Robots-Tag': 'noindex',
			'Content-Type': 'application/xml',
		},
	})
}
