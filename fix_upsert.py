import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the UPSERT block inside aprobarSolicitud
old_block = r"// --- UPSERT EN CLIENTES ---[\s\S]*?// -------------------------"
new_block = """// --- UPSERT EN CLIENTES ---
  const { data: clienteId, error: errCliente } = await db.rpc('upsert_cliente_reserva', {
    p_tenant_id: 'casasgaby',
    p_nombre: solicitud.nombre_cliente || solicitud.nombre_completo || solicitud.nombre || 'Huésped',
    p_email: solicitud.email || solicitud.email_cliente || '',
    p_telefono: solicitud.telefono || solicitud.telefono_cliente || ''
  })

  if (errCliente || !clienteId) {
    console.error('Error al resolver cliente:', errCliente)
    throw new Error('No se pudo vincular o crear el cliente.')
  }
  // -------------------------"""

content = re.sub(old_block, new_block, content)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
