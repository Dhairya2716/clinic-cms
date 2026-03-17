'use client'

import { useState, useEffect } from 'react'

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('patient')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, role }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Failed to create user')

      setSuccess(`User "${data.name}" created successfully.`)
      setName(''); setEmail(''); setPassword(''); setPhone(''); setRole('patient')
      fetchUsers()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">User Management</h1>

      
      <div className="bg-white rounded-lg shadow border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-800">Add New User</h2>
        </div>
        <div className="p-6">
          {error && <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded">{error}</div>}
          {success && <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded">{success}</div>}

          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900" placeholder="9876543210" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900">
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="receptionist">Receptionist</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={creating} className="bg-blue-600 text-white py-2 px-5 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                {creating ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>

      
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-800">All Users</h2>
          <button onClick={fetchUsers} className="text-sm text-blue-600 hover:underline">Refresh</button>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize
                      ${user.role === 'admin' ? 'bg-red-100 text-red-700' : ''}
                      ${user.role === 'doctor' ? 'bg-green-100 text-green-700' : ''}
                      ${user.role === 'receptionist' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${user.role === 'patient' ? 'bg-blue-100 text-blue-700' : ''}
                    `}>{user.role}</span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">{user.phone || '—'}</td>
                  <td className="px-6 py-3 text-sm text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-6 text-center text-sm text-gray-400">No users found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
