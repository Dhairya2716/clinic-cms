import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = 'https://cmsback.sampaarsh.cloud'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || data.error || 'Login failed' },
        { status: res.status }
      )
    }

    // Set JWT as httpOnly cookie
    const cookieStore = await cookies()
    cookieStore.set({
      name: 'token',
      value: data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Login Proxy Error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
