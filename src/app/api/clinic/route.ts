import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = 'https://cmsback.sampaarsh.cloud'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const res = await fetch(`${API_URL}/admin/clinic`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json()

    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('Clinic Proxy Error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
