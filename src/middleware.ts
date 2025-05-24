import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/app/lib/session'
import { cookies } from 'next/headers'
 
// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard','/driver']
const publicRoutes = ['/login', '/signup','/']
 
export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)
 
  // 3. Decrypt the session from the cookie
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  const session = await decrypt(cookie)
  if(req.nextUrl.pathname.startsWith('/logout')) {
    cookieStore.delete('session');
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }
  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }
 
  // 5. Redirect to /dashboard if the user is authenticated and admin
  if(session?.userId){
    if(session?.role === 'admin' && !req.nextUrl.pathname.startsWith('/dashboard')){
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }else if(session?.role === 'driver' && !req.nextUrl.pathname.startsWith('/driver')){
      return NextResponse.redirect(new URL('/driver', req.nextUrl))
    }
  }

  if (
    isPublicRoute &&
    session?.userId &&
    session?.role === 'driver' &&
    !req.nextUrl.pathname.startsWith('/driver')
  ){
    return NextResponse.redirect(new URL('/driver', req.nextUrl))
  }else if (
    isPublicRoute &&
    session?.userId &&
    session?.role === 'admin' &&
    !req.nextUrl.pathname.startsWith('/dashboard')
  ){
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }
 
  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|uploads/).*)',],
}