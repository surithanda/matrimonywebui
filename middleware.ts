import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/forgot-password',
  '/reset-password',
  '/verify-otp'
];

// Define protected route patterns that require authentication
const protectedRoutePatterns = [
  '/profiles',
  '/dashboard',
  '/search',
  '/recommendations',
  '/favourites',
  '/createprofile',
  '/updateprofile',
  '/account',
  '/changepassword',
  '/payments',
  '/settings'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('matrimony-token')?.value;
  
  console.log("🔥 MIDDLEWARE:", pathname, "| Token:", !!token);
  
  // Check if current path is a public route
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // Check if current path matches any protected route pattern
  const isProtectedRoute = protectedRoutePatterns.some(pattern => 
    pathname.startsWith(pattern)
  );
  
  // If it's a public route, allow access
  if (isPublicRoute) {
    console.log("✅ PUBLIC ROUTE - Allowing access");
    return NextResponse.next();
  }
  
  // If it's a protected route, check for authentication
  if (isProtectedRoute) {
    if (!token) {
      console.log("🚨 PROTECTED ROUTE - No token, redirecting to login");
      return NextResponse.redirect(new URL('/login', request.url));
    }
    console.log("✅ PROTECTED ROUTE - Token found, allowing access");
    return NextResponse.next();
  }
  
  // For any other routes not explicitly defined, allow access
  console.log("➡️ OTHER ROUTE - Allowing access");
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Include all routes to run middleware universally
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ]
};