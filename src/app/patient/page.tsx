'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/appointments')
      .then(r => r.json())
      .then(d => { setAppointments(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
        <Link href="/patient/appointments" className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700">+ Book Appointment</Link>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Slot</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Queue Token</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.map((apt: any) => (
                <tr key={apt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-900">{apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString() : '—'}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{apt.timeSlot}</td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${apt.status === 'queued' ? 'bg-yellow-100 text-yellow-700' : apt.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{apt.status}</span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">{apt.queueEntry?.tokenNumber ?? '—'}</td>
                  <td className="px-6 py-3 text-sm">
                    <Link href={`/patient/appointments/${apt.id}`} className="text-blue-600 hover:underline">View</Link>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-6 text-center text-sm text-gray-400">No appointments found. <Link href="/patient/appointments" className="text-blue-600 hover:underline">Book one now.</Link></td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
