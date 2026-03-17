import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = 'https://cmsback.sampaarsh.cloud'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const res = await fetch(`${API_URL}/appointments/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
