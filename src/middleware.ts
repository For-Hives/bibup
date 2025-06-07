import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define route matchers for role-protected routes
const isOrganizerRoute = createRouteMatcher(['/dashboard/organizer(.*)']);
const isSellerRoute = createRouteMatcher(['/dashboard/seller(.*)']);
// Add more role-specific route matchers as needed, e.g., for admin
const isAdminRoute = createRouteMatcher(['/dashboard/admin(.*)']);

export default clerkMiddleware((auth, req) => {
  const { userId, sessionClaims } = auth();

  // If the user is logged in
  if (userId) {
    // Retrieve roles from session claims; ensure it's an array.
    // Roles are expected to be in publicMetadata.
    const userRoles = (sessionClaims?.publicMetadata?.roles as string[]) || [];

    // Organizer route protection
    if (isOrganizerRoute(req) && !userRoles.includes('organizer') && !userRoles.includes('admin')) {
      // Redirect to homepage if not an organizer (or admin)
      const homeUrl = new URL('/', req.url);
      return NextResponse.redirect(homeUrl);
    }

    // Seller route protection
    if (isSellerRoute(req) && !userRoles.includes('seller') && !userRoles.includes('admin')) {
      // Redirect to homepage if not a seller (or admin)
      const homeUrl = new URL('/', req.url);
      return NextResponse.redirect(homeUrl);
    }

    // Admin route protection
    if (isAdminRoute(req) && !userRoles.includes('admin')) {
      // Redirect to homepage if not an admin
      const homeUrl = new URL('/', req.url);
      return NextResponse.redirect(homeUrl);
    }

    // Add checks for other roles and routes here if necessary
  }
  // For users who are not logged in:
  // - Access to public routes is allowed (defined in publicRoutes).
  // - Access to protected routes will be handled by Clerk's default behavior,
  //   which typically redirects to the sign-in page.
  // This ensures that publicRoutes remain accessible and protected routes
  // trigger authentication if the user is not logged in.

  // Allow the request to proceed if none of the above conditions resulted in a redirect.
  return NextResponse.next();
}, {
  publicRoutes: [
    '/',
    '/events',
    '/events/:id', // Detail page for an event
    '/calendar',
    '/rules',
    '/faq',
    '/sign-in(.*)', // Clerk sign-in routes
    '/sign-up(.*)', // Clerk sign-up routes
    '/api/public-events(.*)', // Example for public API routes
    // Potentially add an "/access-denied" page here if you create one
  ],
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
