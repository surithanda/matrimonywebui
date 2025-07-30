// app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Read token from cookies (or use headers if you store it elsewhere)
  const token = request.cookies.get('token')?.value;

  // List of public routes that don't require auth
  const publicRoutes = ['/login', '/register', '/otp', '/forgotpassword'];
console.log("I came here")
  // If not logged in and not on a public route, redirect to login
  // if (!token && !publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  // Optionally, add token validation logic here (e.g., check expiry)
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)'], // Protect all routes except static files
};