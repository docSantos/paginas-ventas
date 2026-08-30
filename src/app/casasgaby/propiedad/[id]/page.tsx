import { notFound } from 'next/navigation'
import type { Metadata, ResolvingMetadata } from 'next'
import { isSupabaseConfigured, createClient } from '@/lib/supabase/server'
import { MOCK_PROPIEDADES } from '@/types/casasgaby'
import type { Reserva } from '@/types/casasgaby'
import { PropertyDetailClient } from '@/components/casasgaby/PropertyDetailClient'

// 1. Generación Dinámica de Metadata (SEO y OpenGraph para WhatsApp)
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params
  
  let propiedad = null

  if (!isSupabaseConfigured()) {
    propiedad = MOCK_PROPIEDADES.find(p => p.id === id) || null
  } else {
    const supabase = await createClient()
    const { data } = await supabase.from('propiedades').select('*').eq('id', id).single()
    if (data) propiedad = data
  }

  if (!propiedad) {
    return { title: 'Propiedad no encontrada' }
  }

  const imageUrl = propiedad.fotos?.[0] || 'https://via.placeholder.com/1200x630?text=Casas+Gaby'
  const title = propiedad.titulo
  const description = propiedad.descripcion?.slice(0, 150) + '...'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function PropiedadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  let propiedad = null
  let isDemo = true
  let reservasActivas: Pick<Reserva, 'fecha_entrada' | 'fecha_salida'>[] = []
  let adminPhone: string | undefined = undefined

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
        
        // 2. Cargar fechas ocupadas (Reservas Activas) para el calendario usando la Vista Segura
        const db = supabase as any
        const { data: reservas } = await db
          .from('vista_fechas_ocupadas')
          .select('fecha_entrada, fecha_salida')
          .eq('propiedad_id', id)
          
        if (reservas) {
          reservasActivas = reservas
        }
        
        // 3. Obtener número de WA activo
        const { data: activePhone } = await db
          .from('configuracion_telefonos')
          .select('telefono')
          .eq('activo', true)
          .single()
          
        adminPhone = activePhone?.telefono || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "529981424300"
      } else {
        propiedad = MOCK_PROPIEDADES.find(p => p.id === id) || null
      }
    } catch (e) {
      console.error(e)
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
      reservas={reservasActivas}
      adminPhone={adminPhone}
    />
  )
}
