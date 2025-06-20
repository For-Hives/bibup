import { NextRequest, NextResponse } from 'next/server'
import { clerkMiddleware } from '@clerk/nextjs/server'

import { i18n } from '@/lib/i18n-config'

export default clerkMiddleware((auth, request: NextRequest) => {
	const { pathname } = request.nextUrl

	// Check if there is any supported locale in the pathname
	const pathnameHasLocale = i18n.locales.some(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

	if (pathnameHasLocale) {
		return NextResponse.next()
	}

	// Redirect if there is no locale
	const locale = i18n.defaultLocale
	request.nextUrl.pathname = `/${locale}${pathname}`
	return NextResponse.redirect(request.nextUrl)
})

export const config = {
	matcher: [
		// Skip all internal paths (_next/static, _next/image, api) and files with extensions
		'/((?!api|_next/static|_next/image|.*\\..*).*)',
	],
}
