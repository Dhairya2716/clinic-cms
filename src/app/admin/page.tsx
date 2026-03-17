'use client'

import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [clinic, setClinic] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/clinic')
      .then((res) => res.json())
      .then((data) => {
        setClinic(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-4 text-gray-600">Loading...</div>
  if (!clinic || clinic.error) return <div className="p-4 text-red-600">Failed to load clinic data.</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-600 p-6 rounded-lg text-white shadow-sm">
          <h3 className="text-blue-100 text-sm font-bold uppercase tracking-wide mb-2">Total Users</h3>
          <p className="text-4xl font-extrabold">{clinic.userCount ?? '—'}</p>
        </div>

        <div className="bg-green-600 p-6 rounded-lg text-white shadow-sm">
          <h3 className="text-green-100 text-sm font-bold uppercase tracking-wide mb-2">Appointments</h3>
          <p className="text-4xl font-extrabold">{clinic.appointmentCount ?? '—'}</p>
        </div>

        <div className="bg-orange-500 p-6 rounded-lg text-white shadow-sm">
          <h3 className="text-orange-50 text-sm font-bold uppercase tracking-wide mb-2">Queue Entries</h3>
          <p className="text-4xl font-extrabold">{clinic.queueCount ?? '—'}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Clinic Information</h2>
        <table className="text-sm text-gray-700 w-full">
          <tbody>
            <tr className="border-b"><td className="py-2 font-medium w-32">Name</td><td className="py-2">{clinic.name}</td></tr>
            <tr><td className="py-2 font-medium">Clinic Code</td><td className="py-2 font-mono">{clinic.code}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
