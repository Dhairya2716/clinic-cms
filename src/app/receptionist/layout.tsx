import ReceptionistSidebar from '@/components/ReceptionistSidebar'
export default function ReceptionistLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex text-black">
      <ReceptionistSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
