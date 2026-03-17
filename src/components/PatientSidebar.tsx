'use client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function PatientSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }
  const items = [
    { name: 'Dashboard', path: '/patient' },
    { name: 'Book Appointment', path: '/patient/appointments' },
    { name: 'My Prescriptions', path: '/patient/prescriptions' },
    { name: 'My Reports', path: '/patient/reports' },
  ]
  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-700">
        <span className="text-xl font-semibold">Patient Portal</span>
      </div>
      <div className="flex-1 py-4">
        <ul className="space-y-1">
          {items.map(item => (
            <li key={item.name}>
              <Link href={item.path} className={`block px-6 py-2 text-sm border-l-4 ${pathname === item.path ? 'bg-gray-900 text-white border-blue-500' : 'text-gray-300 hover:bg-gray-700 hover:text-white border-transparent'}`}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border-t border-gray-700">
        <button onClick={handleLogout} className="w-full text-left px-2 py-2 text-sm text-gray-300 hover:text-white">Logout</button>
      </div>
    </div>
  )
}
