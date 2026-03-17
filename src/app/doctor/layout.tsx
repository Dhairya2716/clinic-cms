import DoctorSidebar from '@/components/DoctorSidebar'
export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex text-black">
      <DoctorSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
