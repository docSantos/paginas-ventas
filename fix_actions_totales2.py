import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

def extract_function(name, text):
    start = text.find(f"export async function {name}")
    if start == -1: return None, -1, -1
    # finding the closing brace of the function
    brace_count = 0
    in_func = False
    for i in range(start, len(text)):
        if text[i] == '{':
            brace_count += 1
            in_func = True
        elif text[i] == '}':
            brace_count -= 1
        if in_func and brace_count == 0:
            return text[start:i+1], start, i+1
    return None, -1, -1

# Replacement for actualizarTarifaBase
body, start, end = extract_function("actualizarTarifaBase", content)
new_actualizarTarifaBase = """export async function actualizarTarifaBase(reservaId: string, tarifaBase: number) {
  if (tarifaBase <= 0) throw new Error('La tarifa base debe ser mayor a 0');
  const supabase = await createClient()
  const db = supabase as any

  const { data: reserva } = await db.from('reservas').select('porcentaje_comision, ajustes_reserva(*)').eq('id', reservaId).maybeSingle()
  if (!reserva) throw new Error('Reserva no encontrada')

  const cargosList = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'cargo') || []
  const descuentosList = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'descuento') || []
  
  const cargos = cargosList.reduce((acc: number, a: any) => acc + Number(a.monto), 0)
  const descuentos = descuentosList.reduce((acc: number, a: any) => acc + Number(a.monto), 0)
  
  const nuevoTotal = Math.max(0, tarifaBase + cargos - descuentos)

  const comisionBaseCalculada = tarifaBase * (Number(reserva.porcentaje_comision) / 100 || 0.025)
  const comisionCargos = cargosList.reduce((acc: number, a: any) => acc + Number(a.monto_comision || 0), 0)
  const nuevoMontoComision = comisionBaseCalculada + comisionCargos

  await db.from('reservas').update({ tarifa_base: tarifaBase, monto_total_acordado: nuevoTotal, monto_comision: nuevoMontoComision }).eq('id', reservaId)

  await db.from('comisiones').update({
    monto_estancia: nuevoTotal,
    monto_comision: nuevoMontoComision
  }).eq('reserva_id', reservaId)

  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath('/casasgaby/admin/clientes')
  revalidatePath('/casasgaby/admin/finanzas')
  return { success: true }
}"""
if start != -1: content = content[:start] + new_actualizarTarifaBase + content[end:]

# Replacement for agregarAjusteReserva
body, start, end = extract_function("agregarAjusteReserva", content)
new_agregarAjusteReserva = """export async function agregarAjusteReserva(reservaId: string, tipo: 'cargo' | 'descuento', concepto: string, monto: number, esServicio: boolean = false) {
  if (!monto || isNaN(Number(monto)) || Number(monto) <= 0) {
    throw new Error('El monto debe ser un nmero positivo mayor a cero.')
  }
  
  const supabase = await createClient()
  const db = supabase as any

  const { data: tenant } = await db.from('tenants_config').select('porcentaje_comision_base, comision_servicios_porcentaje').eq('id', 'casasgaby').maybeSingle()
  const pComisionBase = tenant?.porcentaje_comision_base ? Number(tenant.porcentaje_comision_base) : 2.50
  const pComisionServicios = tenant?.comision_servicios_porcentaje ? Number(tenant.comision_servicios_porcentaje) : 5.00

  let porcentaje_comision = 0;
  if (tipo === 'cargo') {
    porcentaje_comision = esServicio ? pComisionServicios : pComisionBase;
  }

  await db.from('ajustes_reserva').insert({ reserva_id: reservaId, tipo, concepto, monto, porcentaje_comision, monto_comision: (monto * porcentaje_comision) / 100 })

  const { data: reserva } = await db.from('reservas').select('tarifa_base, porcentaje_comision, ajustes_reserva(*)').eq('id', reservaId).maybeSingle()
  if (reserva) {
    const tarifaBase = Number(reserva.tarifa_base) || 0
    const cargosList = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'cargo') || []
    const descuentosList = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'descuento') || []
    const cargos = cargosList.reduce((acc: number, a: any) => acc + Number(a.monto), 0)
    const descuentos = descuentosList.reduce((acc: number, a: any) => acc + Number(a.monto), 0)
    
    const nuevoTotal = Math.max(0, tarifaBase + cargos - descuentos)
    
    const comisionBaseCalculada = tarifaBase * (Number(reserva.porcentaje_comision) / 100 || (pComisionBase/100))
    const comisionCargos = cargosList.reduce((acc: number, a: any) => acc + Number(a.monto_comision || 0), 0)
    const nuevoMontoComision = comisionBaseCalculada + comisionCargos
    
    await db.from('reservas').update({ monto_total_acordado: nuevoTotal, monto_comision: nuevoMontoComision }).eq('id', reservaId)

    await db.from('comisiones').update({
      monto_estancia: nuevoTotal,
      monto_comision: nuevoMontoComision
    }).eq('reserva_id', reservaId)
  }

  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath('/casasgaby/admin/clientes')
  revalidatePath('/casasgaby/admin/finanzas')
  return { success: true }
}"""
if start != -1: content = content[:start] + new_agregarAjusteReserva + content[end:]

# Replacement for eliminarAjusteReserva
body, start, end = extract_function("eliminarAjusteReserva", content)
new_eliminarAjusteReserva = """export async function eliminarAjusteReserva(ajusteId: string, reservaId: string) {
  const supabase = await createClient()
  const db = supabase as any

  await db.from('ajustes_reserva').delete().eq('id', ajusteId).eq('reserva_id', reservaId)

  const { data: reserva } = await db.from('reservas').select('tarifa_base, porcentaje_comision, ajustes_reserva(*)').eq('id', reservaId).maybeSingle()
  if (reserva) {
    const tarifaBase = Number(reserva.tarifa_base) || 0
    const cargosList = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'cargo') || []
    const descuentosList = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'descuento') || []
    const cargos = cargosList.reduce((acc: number, a: any) => acc + Number(a.monto), 0)
    const descuentos = descuentosList.reduce((acc: number, a: any) => acc + Number(a.monto), 0)
    
    const nuevoTotal = Math.max(0, tarifaBase + cargos - descuentos)
    
    const comisionBaseCalculada = tarifaBase * (Number(reserva.porcentaje_comision) / 100 || 0.025)
    const comisionCargos = cargosList.reduce((acc: number, a: any) => acc + Number(a.monto_comision || 0), 0)
    const nuevoMontoComision = comisionBaseCalculada + comisionCargos
    
    await db.from('reservas').update({ monto_total_acordado: nuevoTotal, monto_comision: nuevoMontoComision }).eq('id', reservaId)

    await db.from('comisiones').update({
      monto_estancia: nuevoTotal,
      monto_comision: nuevoMontoComision
    }).eq('reserva_id', reservaId)
  }

  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath('/casasgaby/admin/clientes')
  revalidatePath('/casasgaby/admin/finanzas')
  return { success: true }
}"""
if start != -1: content = content[:start] + new_eliminarAjusteReserva + content[end:]

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
