import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix in cancelarReserva
old_comisiones_1 = """    // 2. Lógica de cancelación con comisiones (Respetando saldo a favor y sin .catch)
    const { data: comision } = await db.from('comisiones').select('*').eq('reserva_id', reservaId).maybeSingle()
    if (comision) {
      const nuevoEstadoComision = Number(comision.monto_pagado) > 0 ? 'cancelada_con_saldo_a_favor' : 'cancelada'
      const { error: comErr } = await db.from('comisiones').update({ estado_pago: nuevoEstadoComision }).eq('id', comision.id)
      if (comErr) throw new Error('Error al actualizar estado de comisión: ' + comErr.message)
    }"""
# In the actual file it might have unicode decoding (Lgica, etc)
# I will use Regex matching the block structure:
old_block_1 = r"// 2\. L.gica de cancelaci.n con comisiones.*?\n\s+const \{ data: comision \} = .*?maybeSingle\(\)\n\s+if \(comision\) \{\n\s+const nuevoEstadoComision =.*?\n\s+const \{ error: comErr \} =.*?\n\s+if \(comErr\).*?\n\s+\}"

new_block_1 = """// 2. Lógica de cancelación con comisiones (Envuelto en try/catch)
    try {
      const { data: comision } = await db.from('comisiones').select('*').eq('reserva_id', reservaId).maybeSingle()
      if (comision) {
        await db.from('comisiones').update({ estado_pago: 'cancelada' }).eq('id', comision.id)
      }
    } catch (err) {
      console.warn("No se pudo actualizar la comisión, continuando cancelación:", err)
    }"""

content = re.sub(old_block_1, new_block_1, content, flags=re.DOTALL)

# Fix in cancelarReservaConReembolso
old_block_2 = r"// 1\. Manejo de comisiones\n\s+const \{ data: comision \} = .*?maybeSingle\(\)\n\s+if \(comision\) \{\n\s+const nuevoEstadoComision =.*?\n\s+const \{ error: comErr \} =.*?\n\s+if \(comErr\).*?\n\s+\}"

new_block_2 = """// 1. Manejo de comisiones (Envuelto en try/catch seguro)
    try {
      const { data: comision } = await db.from('comisiones').select('*').eq('reserva_id', reservaId).maybeSingle()
      if (comision) {
        await db.from('comisiones').update({ estado_pago: 'cancelada' }).eq('id', comision.id)
      }
    } catch (err) {
      console.warn("No se pudo actualizar la comisión, continuando cancelación:", err)
    }"""

content = re.sub(old_block_2, new_block_2, content, flags=re.DOTALL)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
