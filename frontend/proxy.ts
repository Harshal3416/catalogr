import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Only /admin/* (store management) requires sign-in. The public
// directory/landing at '/' (redirected to /home) and storefronts stay open.
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    await auth.protect();
    
    // Optional: restrict by role
    // const { sessionClaims } = await auth();
    // if (sessionClaims?.metadata?.role !== 'admin') {
    //   return NextResponse.redirect(new URL('/', req.url));
    // }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};