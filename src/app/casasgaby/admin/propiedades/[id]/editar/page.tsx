import { PropertyForm } from '../../PropertyForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Editar Propiedad - Admin',
}

export default async function EditarPropiedadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  
  const supabase = await createClient()
  const { data, error } = await supabase.schema('hospedaje').from('propiedades').select('*').eq('id', id).single()
  
  if (error || !data) {
    notFound()
  }

  const { data: serviciosCatalogo } = await supabase.schema('hospedaje').from('catalogo_servicios').select('*').eq('tenant_id', 'casasgaby').eq('activo', true)
  const { data: propiedadServicios } = await supabase.schema('hospedaje').from('propiedad_servicios').select('servicio_id').eq('propiedad_id', id).eq('disponible', true)
  const activosIds = propiedadServicios ? propiedadServicios.map((ps: any) => ps.servicio_id) : []


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/casasgaby/admin" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Volver al Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Editar Casa</h1>
        <PropertyForm initialData={data} serviciosCatalogo={serviciosCatalogo || []} initialServiciosIds={activosIds} />
      </div>
    </div>
  )
}
