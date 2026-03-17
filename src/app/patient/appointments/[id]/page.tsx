'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function AppointmentDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/appointments/${id}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>
  if (!data) return <div className="p-4 text-red-600">Not found.</div>

  return (
    <div>
      <div className="flex items-center mb-6 space-x-3">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700">&larr; Back</button>
        <h1 className="text-2xl font-bold text-gray-800">Appointment Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Appointment Info</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex"><dt className="w-32 font-medium text-gray-600">Date</dt><dd className="text-gray-900">{data.appointmentDate}</dd></div>
            <div className="flex"><dt className="w-32 font-medium text-gray-600">Time Slot</dt><dd className="text-gray-900">{data.timeSlot}</dd></div>
            <div className="flex"><dt className="w-32 font-medium text-gray-600">Status</dt><dd className="capitalize text-gray-900">{data.status}</dd></div>
            {data.queueEntry && <div className="flex"><dt className="w-32 font-medium text-gray-600">Queue Token</dt><dd className="text-gray-900">#{data.queueEntry.tokenNumber} — {data.queueEntry.status}</dd></div>}
          </dl>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Prescription</h2>
          {data.prescription ? (
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="font-medium text-gray-600">Medicines</dt>
                <dd className="text-gray-900 mt-1">
                  {Array.isArray(data.prescription.medicines) ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {data.prescription.medicines.map((m: any, idx: number) => (
                        <li key={idx}>
                          <span className="font-medium">{m.name}</span>
                          {m.dosage && <span className="text-gray-600"> — {m.dosage}</span>}
                          {m.duration && <span className="text-gray-600"> ({m.duration})</span>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    data.prescription.medicines
                  )}
                </dd>
              </div>
              {data.prescription.notes && <div><dt className="font-medium text-gray-600">Notes</dt><dd className="text-gray-900 mt-1">{data.prescription.notes}</dd></div>}
            </dl>
          ) : <p className="text-sm text-gray-400">No prescription yet.</p>}
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Report</h2>
          {data.report ? (
            <dl className="space-y-2 text-sm">
              <div><dt className="font-medium text-gray-600">Diagnosis</dt><dd className="text-gray-900 mt-1">{data.report.diagnosis}</dd></div>
              {data.report.tests && <div><dt className="font-medium text-gray-600">Tests</dt><dd className="text-gray-900 mt-1">{data.report.tests}</dd></div>}
              {data.report.remarks && <div><dt className="font-medium text-gray-600">Remarks</dt><dd className="text-gray-900 mt-1">{data.report.remarks}</dd></div>}
            </dl>
          ) : <p className="text-sm text-gray-400">No report yet.</p>}
        </div>
      </div>
    </div>
  )
}
