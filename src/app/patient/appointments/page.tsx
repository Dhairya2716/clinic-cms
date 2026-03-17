'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const TIME_SLOTS = [
  '09:00-09:15',
  '09:15-09:30',
  '09:30-09:45',
  '09:45-10:00',
  '10:00-10:15',
  '10:15-10:30',
  '10:30-10:45',
  '10:45-11:00',
  '11:00-11:15',
  '11:15-11:30',
  '11:30-11:45',
  '11:45-12:00',
  '12:00-12:15',
  '12:15-12:30',
  '12:30-12:45',
  '12:45-13:00',
  '13:00-13:15',
  '13:15-13:30',
  '13:30-13:45',
  '13:45-14:00',
  '14:00-14:15',
  '14:15-14:30',
  '14:30-14:45',
  '14:45-15:00',
  '15:00-15:15',
  '15:15-15:30',
  '15:30-15:45',
  '15:45-16:00',
  '16:00-16:15',
  '16:15-16:30',
  '16:30-16:45',
  '16:45-17:00',
  '17:00-17:15',
  '17:15-17:30',
  '17:30-17:45',
  '17:45-15:00',
  '18:00-18:15',
  '18:15-18:30',
  '18:30-18:45',
  '18:45-19:00',
  '19:00-19:15',
  '19:15-19:30',
  '19:30-19:45',
  '19:45-20:00',
  '20:00-20:15',
  '20:15-20:30',
  '20:30-20:45',
  '20:45-21:00',
  '21:00-21:15',
  '21:15-21:30',
  '21:30-21:45',
  '21:45-22:00',
]

export default function BookAppointment() {
  const router = useRouter()
  const [date, setDate] = useState('')
  const [slot, setSlot] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentDate: date, timeSlot: slot })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || data.error || 'Booking failed')
      router.push('/patient')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Book Appointment</h1>
      <div className="bg-white rounded-lg shadow border border-gray-200 max-w-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-800">Select Date & Time</h2>
        </div>
        <div className="p-6">
          {error && <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input type="date" required value={date} min={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot *</label>
              <select required value={slot} onChange={e => setSlot(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900">
                <option value="">Select a slot</option>
                {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex space-x-3 pt-2">
              <button type="button" onClick={() => router.back()} className="border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={loading} className="bg-blue-600 text-white text-sm px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50">{loading ? 'Booking...' : 'Book Appointment'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
