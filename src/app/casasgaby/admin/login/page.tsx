import { Metadata } from 'next'
import { LoginClient } from './LoginClient'
import { Home } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Login - Admin Casas Gaby',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md absolute top-4 left-4">
        <Link href="/casasgaby" className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          <Home className="w-4 h-4 mr-1.5" />
          Volver a la web
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-teal-600 mb-2">Casas Gaby</h1>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl sm:rounded-2xl border border-gray-100 sm:px-10">
          <LoginClient />
        </div>
      </div>
    </div>
  )
}
