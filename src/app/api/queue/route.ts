import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = 'https://cmsback.sampaarsh.cloud'

// GET /api/queue?date=YYYY-MM-DD -> /queue?date=YYYY-MM-DD
export async function GET(req: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
  const res = await fetch(`${API_URL}/queue?date=${date}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
