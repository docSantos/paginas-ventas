import { ReactNode } from 'react'
import { AdminBottomNav } from '@/components/casasgaby/admin/AdminBottomNav'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      <main className="flex-1 overflow-auto p-4 md:p-8 max-w-5xl mx-auto w-full">
        {children}
      </main>
      <AdminBottomNav />
    </div>
  )
}
