// src/lib/supabase/client.ts
// Cliente de Supabase para uso en Client Components (browser)
// Usar con "use client" en el componente que lo llame

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
