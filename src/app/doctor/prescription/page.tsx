'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

type Medicine = {
  name: string
  dosage: string
  duration: string
}

function PrescriptionForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const appointmentId = searchParams.get('appointmentId') || ''
  const token = searchParams.get('token') || ''

  const [medicines, setMedicines] = useState<Medicine[]>([{ name: '', dosage: '', duration: '' }])
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', duration: '' }])
  }

  const removeMedicine = (index: number) => {
    if (medicines.length === 1) return
    setMedicines(medicines.filter((_, i) => i !== index))
  }

  const updateMedicine = (index: number, field: keyof Medicine, value: string) => {
    const updated = [...medicines]
    updated[index][field] = value
    setMedicines(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!appointmentId) { setError('No appointment ID provided.'); return }

    const medicinesList = medicines.filter(m => m.name.trim())

    if (!medicinesList.length) { setError('Please add at least one medicine.'); return }

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch(`/api/prescriptions/${appointmentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicines: medicinesList, notes })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to save')
      setSuccess('Prescription saved successfully!')
      setMedicines([{ name: '', dosage: '', duration: '' }])
      setNotes('')
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
        <h1 className="text-2xl font-bold text-gray-800">Add Prescription</h1>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 max-w-2xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-800">Prescription Details</h2>
        </div>
        <div className="p-6">
          {error && <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded">{error}</div>}
          {success && <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Appointment ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Appointment ID</label>
              <input
                type="text"
                value={appointmentId}
                disabled
                className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2 text-sm text-gray-600 font-mono"
              />
            </div>

            {/* Medicines */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Medicines *</label>
                <button
                  type="button"
                  onClick={addMedicine}
                  className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded px-3 py-1 hover:bg-blue-100"
                >
                  + Add Medicine
                </button>
              </div>

              <div className="space-y-3">
                {/* Header row */}
                <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 uppercase px-1">
                  <div className="col-span-4">Name</div>
                  <div className="col-span-4">Dosage</div>
                  <div className="col-span-3">Duration</div>
                  <div className="col-span-1"></div>
                </div>

                {medicines.map((med, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-4">
                      <input
                        type="text"
                        required
                        value={med.name}
                        onChange={e => updateMedicine(i, 'name', e.target.value)}
                        placeholder="Paracetamol"
                        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={e => updateMedicine(i, 'dosage', e.target.value)}
                        placeholder="500mg × 3/day"
                        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={med.duration}
                        onChange={e => updateMedicine(i, 'duration', e.target.value)}
                        placeholder="5 days"
                        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button
                        type="button"
                        onClick={() => removeMedicine(i)}
                        disabled={medicines.length === 1}
                        className="text-red-400 hover:text-red-600 disabled:opacity-20 text-lg leading-none"
                        title="Remove"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Additional instructions, dietary advice, follow-up..."
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button type="button" onClick={() => router.back()} className="border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={submitting || !appointmentId} className="bg-blue-600 text-white text-sm px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                {submitting ? 'Saving...' : 'Save Prescription'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function AddPrescriptionPage() {
  return (
    <Suspense fallback={<div className="p-4 text-gray-500">Loading...</div>}>
      <PrescriptionForm />
    </Suspense>
  )
}
