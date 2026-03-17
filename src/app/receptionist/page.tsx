'use client'
import { useEffect, useState } from 'react'

const VALID_TRANSITIONS: Record<string, string[]> = {
  waiting: ['in_progress', 'skipped'],
  in_progress: ['done'],
  done: [],
  skipped: [],
}

export default function ReceptionistQueue() {
  const [queue, setQueue] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [updating, setUpdating] = useState<number | null>(null)

  const [updateError, setUpdateError] = useState('')

  useEffect(() => { fetchQueue() }, [date])

  const fetchQueue = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/queue?date=${date}`)
      const data = await res.json()
      setQueue(Array.isArray(data) ? data : [])
    } finally { setLoading(false) }
  }

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id)
    setUpdateError('')
    try {
      const res = await fetch(`/api/queue/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: status.replace('_', '-') })
      })
      const data = await res.json()
      if (res.ok) {
        fetchQueue()
      } else {
        setUpdateError(`Error ${res.status}: ${data.message || data.error || JSON.stringify(data)}`)
      }
    } catch (e: any) {
      setUpdateError(e.message)
    } finally { setUpdating(null) }
  }

  const statusColor: Record<string, string> = {
    waiting: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-blue-100 text-blue-700',
    done: 'bg-green-100 text-green-700',
    skipped: 'bg-gray-100 text-gray-500',
  }

  return (
    <div>
      {updateError && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded flex justify-between">
          <span>{updateError}</span>
          <button onClick={() => setUpdateError('')} className="text-red-400 hover:text-red-600 font-bold">&times;</button>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daily Queue</h1>
        <div className="flex items-center space-x-3">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          <button onClick={fetchQueue} className="text-sm text-blue-600 hover:underline">Refresh</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Token</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Slot</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Appointment Id</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {queue.map((entry: any) => {
                const transitions = VALID_TRANSITIONS[entry.status] ?? []
                return (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-bold text-gray-900">#{entry.tokenNumber}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{entry.appointment?.patient?.name || '—'}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{entry.appointment?.timeSlot || '—'}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor[entry.status] || 'bg-gray-100 text-gray-700'}`}>{entry.status.replace('_', ' ')}</span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">{entry.appointmentId}</td>
                    <td className="px-6 py-3 text-sm space-x-2">
                      {transitions.map(next => (
                        <button key={next} disabled={updating === entry.id} onClick={() => updateStatus(entry.id, next)} className="text-xs border border-gray-300 rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-50 capitalize">{next.replace('_', ' ')}</button>
                      ))}
                      {transitions.length === 0 && <span className="text-gray-400 text-xs">—</span>}
                    </td>
                  </tr>
                )
              })}
              {queue.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-6 text-center text-sm text-gray-400">No queue entries for this date.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
