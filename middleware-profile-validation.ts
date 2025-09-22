import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the request is for the [mode] route
  const modeMatch = pathname.match(/^\/([^\/]+)(?:\/|$)/);
  
  if (modeMatch) {
    const mode = modeMatch[1];
    const validModes = ['createprofile', 'updateprofile'];
    
    // If it's a mode route but not a valid mode, redirect to 404
    if (!validModes.includes(mode) && pathname.startsWith('/')) {
      // Only check for routes that might be profile modes
      const potentialModeRoutes = [
        '/invalidmode',
        '/profile',
        '/create',
        '/update',
        '/edit'
      ];
      
      if (potentialModeRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};