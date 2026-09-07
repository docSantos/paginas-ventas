import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add cambiarEtapaSolicitud
if 'export async function cambiarEtapaSolicitud' not in content:
    new_action = """
export async function cambiarEtapaSolicitud(solicitudId: string, nuevaEtapa: string, notas?: string) {
  const supabase = await createClient()
  const db = supabase as any
  
  // Here we could also save 'notas' if there's a column, or just update the state
  const updateData: any = { estado: nuevaEtapa }
  if (notas !== undefined) {
    // If you add a 'notas' column to solicitudes in the future
    // updateData.notas = notas
  }
  
  const { error } = await db.schema('hospedaje').from('solicitudes').update(updateData).eq('id', solicitudId)
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/casasgaby')
  return { success: true }
}

export async function convertirSolicitudAReserva(solicitudId: string, datosReserva: any) {
  // Alias or wrapper for aprobarSolicitud
  const res = await aprobarSolicitud(
    solicitudId,
    datosReserva.montoAcordado,
    datosReserva.montoAnticipo,
    datosReserva.metodo || 'transferencia_mxn',
    datosReserva.moneda || 'MXN',
    datosReserva.tc || 1,
    datosReserva.extras || []
  )
  
  if (res && res.success) {
    // Force the state to 'convertida' instead of 'Aprobada' for CRM purposes
    const supabase = await createClient()
    const db = supabase as any
    await db.schema('hospedaje').from('solicitudes').update({ estado: 'convertida' }).eq('id', solicitudId)
  }
  
  return res
}
"""
    content = content + new_action

# 2. Modify aprobarSolicitud validation
old_val = "if (solicitud.estado !== 'Pendiente') throw new Error('La solicitud ya fue procesada')"
new_val = "if (!['Pendiente', 'nueva', 'contactado', 'cotizado', 'anticipo_pendiente'].includes(solicitud.estado)) throw new Error('La solicitud ya fue procesada o está en una etapa inválida')"

content = content.replace(old_val, new_val)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
