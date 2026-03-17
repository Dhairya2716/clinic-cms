'use client'
import { useEffect, useState } from 'react'

export default function MyPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/prescriptions')
      .then(r => r.json())
      .then(d => { setPrescriptions(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Prescriptions</h1>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicines</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {prescriptions.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-900">
                    {p.appointment?.appointmentDate
                      ? new Date(p.appointment.appointmentDate).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">{p.appointment?.timeSlot || '—'}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{p.doctor?.name || '—'}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">
                    {Array.isArray(p.medicines)
                      ? <ul className="space-y-0.5">
                          {p.medicines.map((m: any, i: number) => (
                            <li key={i}>{m.name}{m.dosage ? ` — ${m.dosage}` : ''}{m.duration ? `, ${m.duration}` : ''}</li>
                          ))}
                        </ul>
                      : p.medicines || '—'}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">{p.notes || '—'}</td>
                </tr>
              ))}
              {prescriptions.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-6 text-center text-sm text-gray-400">No prescriptions found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
