import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

patch_comision = """  const { error: errUpd } = await db.from('reservas').update({
    comision_pagada: nuevoTotal,
    estado_comision: estado
  }).eq('id', reservaId)

  // Sync to comisiones table
  const { data: com } = await db.from('comisiones').select('*').eq('reserva_id', reservaId).maybeSingle()
  if (com) {
    await db.from('comisiones').update({
      monto_pagado: nuevoTotal,
      estado_pago: estado === 'liquidada' ? 'liquidado' : estado
    }).eq('id', com.id)
  }"""

content = re.sub(
    r"const \{ error: errUpd \} = await db\.from\('reservas'\)\.update\(\{.*?estado_comision: estado\s*\}\)\.eq\('id', reservaId\)",
    patch_comision,
    content,
    flags=re.DOTALL
)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
