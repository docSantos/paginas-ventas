import { isSupabaseConfigured, createClient } from '@/lib/supabase/server'
import { ReservasClient } from '@/components/casasgaby/admin/ReservasClient'

export const metadata = {
  title: 'Gestión de Reservas - Admin',
}

export default async function ReservasPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Gestión de Reservas</h1>
        <div className="bg-amber-50 p-4 rounded-xl text-amber-800">
          Esta función requiere configuración de Supabase.
        </div>
      </div>
    )
  }

  const supabase = await createClient()

  const { data: solicitudes } = await supabase
    .schema('hospedaje').from('solicitudes')
    .select(`*, propiedades ( titulo )`)
    .order('created_at', { ascending: false })

  const { data: servicios } = await supabase.schema('hospedaje').from('catalogo_servicios').select('*').eq('tenant_id', 'casasgaby').eq('activo', true)
  const { data: tenant } = await supabase.schema('hospedaje').from('tenants_config').select('porcentaje_comision_extras, porcentaje_comision_base').eq('id', 'casasgaby').maybeSingle() as { data: any }
const { data: reglaComisiones } = await supabase.schema('central').from('reglas_comisiones').select('porcentaje_base, porcentaje_extras').eq('modulo', 'hospedaje').eq('activo', true).single()

const { data: propiedades } = await supabase.schema('hospedaje').from('propiedades').select('id, titulo').eq('activa', true)

  const ahora = new Date()
  const hoyStr = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}`

  const { data: reservas } = await supabase
    .schema('hospedaje').from('reservas')
    .select(`*, propiedades ( id, titulo, precio_por_noche, precio_por_semana, precio_por_mes ), ajustes_reserva (*), comisiones (*), transacciones (*)`)
    .eq('estado', 'Activa')
    .gte('fecha_salida', hoyStr)
    .order('fecha_entrada', { ascending: true })
	
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

  const reservaIds = (reservas || []).map((r: any) => r.id).filter(Boolean);
  let comisionesMap = new Map();
  if (reservaIds.length > 0) {
    const { data: comisiones } = await supabase
      .schema('central')
      .from('transacciones_comisiones')
      .select('*')
      .in('referencia_id', reservaIds)
      .eq('origen_modulo', 'hospedaje');
    
    (comisiones || []).forEach((c: any) => {
      if (!comisionesMap.has(c.referencia_id)) {
        comisionesMap.set(c.referencia_id, []);
      }
      comisionesMap.get(c.referencia_id).push({
        ...c,
        monto: c.monto_comision,
        porcentaje: c.porcentaje_comision
      });
    });
  }

  const reservasConExtras = (reservas || []).map((r: any) => ({
    ...r,
    servicios_extra: solicitudesMap.get(r.solicitud_id) || solicitudesMap.get(r.email) || r.servicios_extra || [],
    comisiones: comisionesMap.get(r.id) || []
  }));


  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Reservas</h1>
        <p className="text-gray-500 mt-1">Aprueba solicitudes y bloquea fechas en el calendario.</p>
      </div>

      <ReservasClient 
        solicitudes={solicitudes || []} 
        reservas={reservasConExtras} 
        servicios={servicios || []}
        propiedades={propiedades || []}
        tenantExtras={reglaComisiones?.porcentaje_extras || tenant?.porcentaje_comision_extras || 5}
        tenantBase={reglaComisiones?.porcentaje_base || tenant?.porcentaje_comision_base || 2.50}
      />
    </>
  )
}
