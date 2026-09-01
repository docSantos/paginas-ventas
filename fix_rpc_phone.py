import sys
import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace RPC call to also update the phone correctly
old_rpc = r"""  const \{ data: clienteId, error: errCliente \} = await db\.rpc\('upsert_cliente_reserva', \{
    p_tenant_id: 'casasgaby',
    p_nombre: solicitud\.nombre_cliente \|\| solicitud\.nombre_completo \|\| solicitud\.nombre \|\| 'Huésped',
    p_email: solicitud\.email \|\| solicitud\.email_cliente \|\| '',
    p_telefono: solicitud\.telefono \|\| solicitud\.telefono_cliente \|\| ''
  \}\)

  if \(errCliente \|\| !clienteId\) \{
    console\.error\('Error al resolver cliente:', errCliente\)
    throw new Error\('No se pudo vincular o crear el cliente\.'\)
  \}"""

new_rpc = """  let codigoPais = '+52';
  let phoneDigits = (solicitud.telefono || solicitud.telefono_cliente || '').replace(/\\D/g, '');
  if (phoneDigits.startsWith('52') && phoneDigits.length >= 12) {
    codigoPais = '+52';
    phoneDigits = phoneDigits.substring(2);
  } else if (phoneDigits.startsWith('34') && phoneDigits.length >= 11) {
    codigoPais = '+34';
    phoneDigits = phoneDigits.substring(2);
  } else if (phoneDigits.startsWith('1') && phoneDigits.length >= 11) {
    codigoPais = '+1';
    phoneDigits = phoneDigits.substring(1);
  }

  const { data: clienteId, error: errCliente } = await db.rpc('upsert_cliente_reserva', {
    p_tenant_id: 'casasgaby',
    p_nombre: solicitud.nombre_cliente || solicitud.nombre_completo || solicitud.nombre || 'Huésped',
    p_email: solicitud.email || solicitud.email_cliente || '',
    p_telefono: phoneDigits
  })

  if (errCliente || !clienteId) {
    console.error('Error al resolver cliente:', errCliente)
    throw new Error('No se pudo vincular o crear el cliente.')
  }
  
  await db.from('clientes').update({ codigo_pais: codigoPais, telefono: phoneDigits }).eq('id', clienteId);"""

content = re.sub(old_rpc, new_rpc, content)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
