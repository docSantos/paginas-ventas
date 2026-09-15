'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { ArrowRight, Loader2, KeyRound } from 'lucide-react'

export function LoginClient() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Cliente estándar sin overrides de cookies
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ))

  useEffect(() => {
    // Si ya existe una sesión en el cliente, redirigir limpio
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        window.location.href = '/casasgaby/admin'
      }
    })
  }, [supabase.auth])

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError('')
    
    if (!email || !password) {
      setError('Por favor, ingresa tu correo y contraseña.')
      return
    }

    setLoading(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError('Credenciales inválidas. Por favor intenta nuevamente.')
        setLoading(false)
        return
      }

      window.location.href = '/casasgaby/admin'
    } catch (err: any) {
      setError('Ocurrió un error al conectar. Inténtalo de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-teal-100">
          <KeyRound className="w-6 h-6 text-teal-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Acceso al Panel</h2>
        <p className="text-sm text-gray-500 mt-1">Ingresa con tu correo y contraseña</p>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 text-center animate-in fade-in duration-200">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-xl border-gray-200 text-gray-900 focus:border-teal-500 focus:ring-teal-500 outline-none transition-colors"
            placeholder="tu@correo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-xl border-gray-200 text-gray-900 focus:border-teal-500 focus:ring-teal-500 outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button
          type="button"
          onClick={() => handleLogin()}
          disabled={loading}
          className="w-full mt-2 h-12 flex items-center justify-center text-base font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-xl touch-manipulation cursor-pointer transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Iniciando sesión...
            </>
          ) : (
            <>
              Iniciar sesión
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}