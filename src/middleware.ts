import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/app/lib/session'
 
// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard','/driver']
const publicRoutes = ['/login', '/signup','/']
 
export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)
 
  // 3. Get and decrypt the session cookie
  const sessionCookie = req.cookies.get('session')
  const session = sessionCookie ? await decrypt(sessionCookie.value) : null

  // Handle logout
  if(req.nextUrl.pathname.startsWith('/logout')) {
    const response = NextResponse.redirect(new URL('/', req.nextUrl))
    response.cookies.delete('session')
    return response
  }

  // 4. Redirect to login if not authenticated on protected routes
  if (isProtectedRoute && !session?.userId) {
    const response = NextResponse.redirect(new URL('/', req.nextUrl))
    response.cookies.delete('session') // Clear invalid session
    return response
  }
 
  // 5. Handle authenticated user redirects
  if(session?.userId) {
    if(session?.role === 'admin' && !req.nextUrl.pathname.startsWith('/dashboard')){
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    } else if(session?.role === 'driver' && !req.nextUrl.pathname.startsWith('/driver')){
      return NextResponse.redirect(new URL('/driver', req.nextUrl))
    }
  }

  // 6. Handle public route redirects for authenticated users
  if (isPublicRoute && session?.userId) {
    if (session.role === 'driver' && !req.nextUrl.pathname.startsWith('/driver')) {
      return NextResponse.redirect(new URL('/driver', req.nextUrl))
    } else if (session.role === 'admin' && !req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }
  }
 
  return NextResponse.next()
}

// 7. Update matcher configuration to handle all routes except static files
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|uploads/).*)',
  ],
}
