'use client'
import { useEffect, useState } from 'react'

export default function TvQueuePage() {
  const [queue, setQueue] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchQueue = async (d: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/queue?date=${d}`)
      const data = await res.json()
      setQueue(Array.isArray(data) ? data : [])
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQueue(date)
    const interval = setInterval(() => fetchQueue(date), 30_000)
    return () => clearInterval(interval)
  }, [date])

  // Simple bright colors mapped to index
  const colors = ['bg-blue-600', 'bg-green-600', 'bg-orange-500', 'bg-purple-600', 'bg-teal-600', 'bg-pink-600']

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-300">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">TV Display Queue</h1>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-gray-700 font-bold uppercase text-sm">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="border-2 border-gray-300 rounded px-3 py-2 text-gray-900 font-bold focus:outline-none focus:border-blue-600"
          />
          <button
            onClick={() => fetchQueue(date)}
            className="bg-black text-white px-5 py-2 font-bold uppercase tracking-wider rounded"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-2xl font-bold text-gray-600">Loading queue...</div>
          </div>
        ) : queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-3xl font-bold text-gray-500">No patients in queue</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {queue.map((entry: any, index: number) => {
              const bgColor = colors[index % colors.length]
              return (
                <div
                  key={entry.id}
                  className={`${bgColor} p-8 flex items-center justify-center`}
                >
                  <p className="text-2xl font-black text-white text-center tracking-tight leading-tight uppercase">
                    {entry.appointment?.patient?.name || entry.patientName}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
