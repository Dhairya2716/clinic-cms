import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = 'https://cmsback.sampaarsh.cloud'

// GET /api/doctor/queue -> /doctor/queue
export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const res = await fetch(`${API_URL}/doctor/queue`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
