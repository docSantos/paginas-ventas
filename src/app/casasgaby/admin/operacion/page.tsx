import { isSupabaseConfigured, createClient } from '@/lib/supabase/server'
import { OperacionClient } from '@/components/casasgaby/admin/OperacionClient'

export const metadata = {
  title: 'Operación In-House - Admin',
}

export default async function OperacionPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Operación In-House</h1>
        <div className="bg-amber-50 p-4 rounded-xl text-amber-800">
          Esta función requiere configuración de Supabase.
        </div>
      </div>
    )
  }

  const supabase = await createClient()

  // 1. Obtener reservas activas
  const { data: reservas } = await supabase
    .schema('hospedaje').from('reservas')
    .select(`*, propiedades ( id, titulo ), transacciones (*)`)
    .eq('estado', 'Activa')
    .order('fecha_entrada', { ascending: true })

  // 2. Obtener catálogo de servicios disponibles
  const { data: catalogoServicios } = await supabase
    .schema('hospedaje')
    .from('catalogo_servicios')
    .select('*')
    .order('nombre', { ascending: true })

  const solicitudIds = (reservas || []).map((r: any) => r.solicitud_id).filter(Boolean);
  let solicitudesMap = new Map();
  
  if (solicitudIds.length > 0) {
    const { data: sols } = await supabase
      .schema('hospedaje')
      .from('solicitudes')
      .select('id, servicios_extra')
      .in('id', solicitudIds);
    (sols || []).forEach((s: any) => solicitudesMap.set(s.id, s.servicios_extra));
  } else {
    const emails = (reservas || []).map((r: any) => r.email).filter(Boolean);
    if (emails.length > 0) {
      const { data: sols } = await supabase
        .schema('hospedaje')
        .from('solicitudes')
        .select('email, servicios_extra')
        .in('email', emails);
      (sols || []).forEach((s: any) => solicitudesMap.set(s.email, s.servicios_extra));
    }
  }

  const reservasConExtras = (reservas || []).map((r: any) => ({
    ...r,
    servicios_extra: solicitudesMap.get(r.solicitud_id) || solicitudesMap.get(r.email) || r.servicios_extra || []
  }));

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Operación In-House</h1>
        <p className="text-gray-500 mt-1">Recepción del día a día, llegadas y huéspedes en vivo.</p>
      </div>

      <OperacionClient 
        reservas={reservasConExtras} 
        servicios={catalogoServicios || []} 
      />
    </>
  )
}