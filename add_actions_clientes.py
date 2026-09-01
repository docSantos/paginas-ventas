import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_actions = """
export async function actualizarCliente(clienteId: string, data: { nombre: string, email: string, telefono: string }) {
  try {
    const supabase = await createClient()
    const db = supabase as any

    const { error } = await db
      .from('clientes')
      .update({ nombre: data.nombre, email: data.email.trim().toLowerCase(), telefono: data.telefono })
      .eq('id', clienteId)

    if (error) throw new Error(error.message)

    revalidatePath('/casasgaby/admin/clientes')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al actualizar el cliente' }
  }
}

export async function fusionarClientes(origenId: string, destinoId: string) {
  try {
    const supabase = await createClient()
    const db = supabase as any

    const { error } = await db.rpc('merge_clientes', { 
      cliente_origen_id: origenId, 
      cliente_destino_id: destinoId 
    })

    if (error) throw new Error(error.message)

    revalidatePath('/casasgaby/admin/clientes')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al fusionar clientes' }
  }
}
"""

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content + "\n" + new_actions)
