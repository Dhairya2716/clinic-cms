import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Decode JWT payload WITHOUT verifying signature.
// We trust the external API issued it; the external API will re-verify on each proxied call.
function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1]
    // Base64url decode
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(base64)
    return JSON.parse(json)
  } catch {
    return null
  }
}

const protectedPageRoutes = ['/admin', '/patient', '/receptionist', '/doctor']
const protectedApiRoutes = ['/api/clinic', '/api/users', '/api/appointments', '/api/queue', '/api/prescriptions', '/api/reports', '/api/doctor/queue']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtectedPage = protectedPageRoutes.some((route) => pathname.startsWith(route))
  const isProtectedApi = protectedApiRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedPage || isProtectedApi) {
    const token = request.cookies.get('token')?.value

    if (!token) {
      if (isProtectedApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Decode without verifying signature — external API will verify on actual data calls
    const payload = decodeJwtPayload(token)

    if (!payload) {
      if (isProtectedApi) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const role = payload.role as string

    // Role-based page access
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL(`/${role}`, request.url))
    }
    if (pathname.startsWith('/patient') && role !== 'patient') {
      return NextResponse.redirect(new URL(`/${role}`, request.url))
    }
    if (pathname.startsWith('/receptionist') && role !== 'receptionist') {
      return NextResponse.redirect(new URL(`/${role}`, request.url))
    }
    if (pathname.startsWith('/doctor') && role !== 'doctor') {
      return NextResponse.redirect(new URL(`/${role}`, request.url))
    }

    return NextResponse.next()
  }

  // Redirect logged-in users away from login page
  if (pathname === '/login') {
    const token = request.cookies.get('token')?.value
    if (token) {
      const payload = decodeJwtPayload(token)
      if (payload?.role) {
        return NextResponse.redirect(new URL(`/${payload.role}`, request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
