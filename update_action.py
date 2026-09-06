import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"""export async function checkOutAnticipado\(reservaId: string, nuevoCosto: number, nuevaFechaSalida: string\) \{
  const supabase = await createClient\(\)
  const db = supabase as any
  const \{ error \} = await db\.schema\('hospedaje'\)\.from\('reservas'\)\.update\(\{ 
    costo_total: nuevoCosto,
    monto_total_acordado: nuevoCosto,
    fecha_salida: nuevaFechaSalida,
    check_out_real_at: new Date\(\)\.toISOString\(\)
  \}\)\.eq\('id', reservaId\)"""

replacement = """export async function checkOutAnticipado(reservaId: string, nuevoCosto: number, nuevaFechaSalida: string, marcarSalida: boolean = true) {
  const supabase = await createClient()
  const db = supabase as any
  const payload: any = {
    costo_total: nuevoCosto,
    monto_total_acordado: nuevoCosto,
    fecha_salida: nuevaFechaSalida
  }
  if (marcarSalida) {
    payload.check_out_real_at = new Date().toISOString()
  }
  const { error } = await db.schema('hospedaje').from('reservas').update(payload).eq('id', reservaId)"""

content = re.sub(pattern, replacement, content)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
