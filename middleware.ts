import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const protectedRoutes = [
  { prefix: '/photographer', cookie: 'akashmadhu_photographer', role: 'photographer' },
  { prefix: '/gallery', cookie: 'akashmadhu_gallery', role: 'gallery' },
]

export async function middleware(request: NextRequest) {
  const match = protectedRoutes.find((route) => request.nextUrl.pathname.startsWith(route.prefix))
  if (!match || request.nextUrl.pathname.endsWith('/login')) return NextResponse.next()

  const token = request.cookies.get(match.cookie)?.value
  if (token && process.env.AUTH_SESSION_SECRET) {
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SESSION_SECRET))
      if (payload.role === match.role) return NextResponse.next()
    } catch {
      // Fall through to login redirect.
    }
  }

  const url = request.nextUrl.clone()
  url.pathname = `${match.prefix}/login`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/photographer/:path*', '/gallery/:path*'],
}
