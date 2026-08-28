// src/lib/supabase/server.ts
// Cliente de Supabase para uso en Server Components, Server Actions y Route Handlers
// Maneja cookies automáticamente para mantener la sesión del usuario

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // En Server Components, set() lanza error pero puede ignorarse
            // si no necesitamos actualizar la sesión desde ese componente
          }
        },
      },
    }
  )
}

/**
 * Verifica si Supabase está configurado con credenciales reales.
 * Útil para mostrar modo demo cuando las env vars no están configuradas.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return Boolean(
    url && key &&
    url !== 'your-supabase-project-url' &&
    key !== 'your-supabase-anon-key'
  )
}
