'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DoctorQueue() {
  const [queue, setQueue] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/doctor/queue')
      .then(r => r.json())
      .then(d => { setQueue(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const statusColor: Record<string, string> = {
    waiting: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-blue-100 text-blue-700',
    done: 'bg-green-100 text-green-700',
    skipped: 'bg-gray-100 text-gray-500',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Today's Queue</h1>
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200"><h2 className="text-base font-semibold text-gray-800">Queue Entries</h2></div>
        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Token</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Appointment ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prescription</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {queue.map((entry: any) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-bold text-gray-900">#{entry.tokenNumber}</td>
                  {/* <td className="px-4 py-3 text-sm text-gray-900">{entry.appointment?.patient?.name || '—'}</td> */}
                  <td className="px-4 py-3 text-sm text-gray-900">{entry.patientName || '—'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor[entry.status] || ''}`}>{entry.status?.replace('_', ' ')}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{entry.appointmentId}</td>
                  <td className="px-4 py-3 text-sm">
                    <Link
                      href={`/doctor/prescription?appointmentId=${entry.appointmentId}&token=${entry.tokenNumber}`}
                      className="inline-block text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded px-2 py-1 hover:bg-blue-100"
                    >
                      + Prescription
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link
                      href={`/doctor/report?appointmentId=${entry.appointmentId}&token=${entry.tokenNumber}`}
                      className="inline-block text-xs bg-green-50 text-green-700 border border-green-200 rounded px-2 py-1 hover:bg-green-100"
                    >
                      + Report
                    </Link>
                  </td>
                </tr>
              ))}
              {queue.length === 0 && <tr><td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-400">No patients in today's queue.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
