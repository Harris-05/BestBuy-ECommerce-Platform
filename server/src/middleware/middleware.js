import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })

  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!token || token.role !== 'ADMIN')
      return NextResponse.redirect(new URL('/403', req.url))
  }

  if (req.nextUrl.pathname.startsWith('/account')) {
    if (!token)
      return NextResponse.redirect(new URL('/login', req.url))
  }

  if (req.nextUrl.pathname.startsWith('/checkout')) {
    if (!token)
      return NextResponse.redirect(new URL('/login?callbackUrl=/checkout', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/checkout/:path*'],
}
