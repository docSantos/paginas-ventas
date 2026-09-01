import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_update = "export async function actualizarCliente(clienteId: string, data: { nombre_completo: string, email: string, telefono: string }) {\n  try {\n    const supabase = await createClient()\n    const db = supabase as any\n\n    const { error } = await db\n      .from('clientes')\n      .update({ nombre_completo: data.nombre_completo, email: data.email.trim().toLowerCase(), telefono: data.telefono })\n      .eq('id', clienteId)"

new_update = """export async function actualizarCliente(clienteId: string, data: { nombre_completo: string, email: string, telefono: string }) {
  try {
    const supabase = await createClient()
    const db = supabase as any

    let codigoPais = '+52';
    let digits = (data.telefono || '').replace(/\\D/g, '');
    if (digits.startsWith('52') && digits.length >= 12) {
      codigoPais = '+52';
      digits = digits.substring(2);
    } else if (digits.startsWith('34') && digits.length >= 11) {
      codigoPais = '+34';
      digits = digits.substring(2);
    } else if (digits.startsWith('1') && digits.length >= 11) {
      codigoPais = '+1';
      digits = digits.substring(1);
    }

    const { error } = await db
      .from('clientes')
      .update({ nombre_completo: data.nombre_completo, email: data.email.trim().toLowerCase(), telefono: digits, codigo_pais: codigoPais })
      .eq('id', clienteId)"""

# Instead of re.sub we can just use replace
content = content.replace(old_update, new_update)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
