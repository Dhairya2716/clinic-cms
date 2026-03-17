'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function ReportForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const appointmentId = searchParams.get('appointmentId') || ''
  const token = searchParams.get('token') || ''

  const [diagnosis, setDiagnosis] = useState('')
  const [tests, setTests] = useState('')
  const [remarks, setRemarks] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!appointmentId) { setError('No appointment ID provided.'); return }
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch(`/api/reports/${appointmentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagnosis, tests, remarks })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to save')
      setSuccess('Report saved successfully!')
      setDiagnosis('')
      setTests('')
      setRemarks('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700">&larr; Back</button>
        <h1 className="text-2xl font-bold text-gray-800">Add Report</h1>
      </div>

      {appointmentId && (
        <p className="text-sm text-gray-500 mb-4">
          Appointment ID: <span className="font-mono font-medium text-gray-800">{appointmentId}</span>
          {token && <> &nbsp;·&nbsp; Token: <span className="font-medium text-gray-800">#{token}</span></>}
        </p>
      )}

      <div className="bg-white rounded-lg shadow border border-gray-200 max-w-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-800">Report Details</h2>
        </div>
        <div className="p-6">
          {error && <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded">{error}</div>}
          {success && <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Appointment ID</label>
              <input
                type="text"
                value={appointmentId}
                disabled
                className='w-full border border-gray-200 bg-gray-200 bg-gray-50 rounded px-3 py-2 text-sm text-gray-600 font-mono'
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis *</label>
              <textarea required rows={3} value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder="e.g. Viral fever with mild dehydration" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tests Recommended</label>
              <input type="text" value={tests} onChange={e => setTests(e.target.value)} placeholder="e.g. CBC, Blood culture" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <textarea rows={3} value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Additional remarks or follow-up instructions..." className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900" />
            </div>
            <div className="flex space-x-3 pt-2">
              <button type="button" onClick={() => router.back()} className="border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={submitting || !appointmentId} className="bg-green-600 text-white text-sm px-5 py-2 rounded hover:bg-green-700 disabled:opacity-50">
                {submitting ? 'Saving...' : 'Save Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function AddReportPage() {
  return (
    <Suspense fallback={<div className="p-4 text-gray-500">Loading...</div>}>
      <ReportForm />
    </Suspense>
  )
}
