'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Users', path: '/admin/users' },
  ]

  return (
    <div className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col shadow-sm z-10">
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-sm text-white font-bold text-lg">C</div>
        <span className="text-lg font-semibold tracking-tight text-slate-800">Clinic Admin</span>
      </div>
      <div className="flex-1 py-6 px-3">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Menu</div>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path
            return (
               <li key={item.name}>
                 <Link
                   href={item.path}
                   className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                     isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                   }`}
                 >
                   {item.name}
                 </Link>
               </li>
            )
          })}
        </ul>
      </div>
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md font-medium transition-colors border border-slate-200 shadow-sm bg-white"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
