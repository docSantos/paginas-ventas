import { notFound } from 'next/navigation'
import { isSupabaseConfigured, createClient } from '@/lib/supabase/server'
import { MOCK_PROPIEDADES } from '@/types/casasgaby'
import { PropertyDetailClient } from '@/components/casasgaby/PropertyDetailClient'

export const metadata = {
  title: 'Detalles de la Casa',
}

export default async function PropiedadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  let propiedad = null
  let isDemo = true

  if (!isSupabaseConfigured()) {
    propiedad = MOCK_PROPIEDADES.find(p => p.id === id) || null
  } else {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('id', id)
        .single()
        
      if (!error && data) {
        propiedad = data
        isDemo = false
      } else {
        // Fallback a mock data si la tabla no existe o hay error
        propiedad = MOCK_PROPIEDADES.find(p => p.id === id) || null
      }
    } catch (e) {
      console.error(e)
      // Fallback a mock data si hay excepción
      propiedad = MOCK_PROPIEDADES.find(p => p.id === id) || null
    }
  }

  if (!propiedad) {
    notFound()
  }

  return (
    <PropertyDetailClient 
      propiedad={propiedad} 
      isDemo={isDemo} 
    />
  )
}
