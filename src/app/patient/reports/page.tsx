'use client'
import { useEffect, useState } from 'react'

export default function MyReports() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/reports')
      .then(r => r.json())
      .then(d => { setReports(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Reports</h1>
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Slot</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnosis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tests Recommended</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map((r: any) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-900">
                    {r.appointment?.appointmentDate
                      ? new Date(r.appointment.appointmentDate).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">{r.appointment?.timeSlot || '—'}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{r.doctor?.name || '—'}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">{r.diagnosis || '—'}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">{r.testRecommended || '—'}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">{r.remarks || '—'}</td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-6 text-center text-sm text-gray-400">No reports found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
