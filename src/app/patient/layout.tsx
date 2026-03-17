import PatientSidebar from '@/components/PatientSidebar'
export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex text-black">
      <PatientSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
