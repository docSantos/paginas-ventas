import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_logic = """  if (!solicitud) return { success: false, message: 'La solicitud no existe o ya fue eliminada.' }
  if (solicitud.estado !== 'Pendiente') throw new Error('La solicitud ya fue procesada')

  const { data: tenant } = await db.from('tenants_config').select('porcentaje_comision_base').eq('id', 'casasgaby').maybeSingle()"""

new_logic = """  if (!solicitud) return { success: false, message: 'La solicitud no existe o ya fue eliminada.' }
  if (solicitud.estado !== 'Pendiente') throw new Error('La solicitud ya fue procesada')

  // VALIDACIÓN DE OVERBOOKING
  const { data: conflictos, error: errConflictos } = await db
    .from('reservas')
    .select('id, fecha_entrada, fecha_salida')
    .eq('propiedad_id', solicitud.propiedad_id)
    .neq('estado', 'cancelada')
    .lt('fecha_entrada', solicitud.fecha_salida)
    .gt('fecha_salida', solicitud.fecha_entrada);

  if (errConflictos) throw new Error('Error al verificar disponibilidad de fechas.');
  if (conflictos && conflictos.length > 0) {
    return { 
      success: false, 
      message: `Conflicto de fechas: ya existe una reserva activa del ${conflictos[0].fecha_entrada} al ${conflictos[0].fecha_salida}. No se puede aprobar.` 
    };
  }

  const { data: tenant } = await db.from('tenants_config').select('porcentaje_comision_base').eq('id', 'casasgaby').maybeSingle()"""

content = content.replace(old_logic, new_logic)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
