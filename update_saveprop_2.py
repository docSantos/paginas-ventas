import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_save = """export async function saveProperty(data: any, id?: string) {
  const supabase = await getSupabaseServerClient()
  
  if (id) {
    const { error } = await supabase
      .from('propiedades')
      .update(data)
      .eq('id', id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase
      .from('propiedades')
      .insert([data])
    if (error) throw new Error(error.message)
  }
  
  revalidatePath('/casasgaby/admin')
  revalidatePath('/casasgaby')
}"""

new_save = """export async function saveProperty(data: any, id?: string, serviciosIds?: string[]) {
  const supabase = await getSupabaseServerClient()
  let propId = id;
  
  if (id) {
    const { error } = await supabase
      .from('propiedades')
      .update(data)
      .eq('id', id)
    if (error) throw new Error(error.message)
  } else {
    const { data: newData, error } = await supabase
      .from('propiedades')
      .insert([data])
      .select('id')
      .single()
    if (error) throw new Error(error.message)
    propId = newData.id
  }
  
  // Sync servicios
  if (propId && serviciosIds !== undefined) {
    // 1. Marcar todos como no disponibles primero
    await supabase.from('propiedad_servicios').update({ disponible: false }).eq('propiedad_id', propId);
    
    // 2. Insertar o actualizar los seleccionados a true
    for (const sId of serviciosIds) {
      const { data: exists } = await supabase.from('propiedad_servicios').select('id').eq('propiedad_id', propId).eq('servicio_id', sId).maybeSingle();
      if (exists) {
        await supabase.from('propiedad_servicios').update({ disponible: true }).eq('id', exists.id);
      } else {
        await supabase.from('propiedad_servicios').insert({ propiedad_id: propId, servicio_id: sId, disponible: true });
      }
    }
  }
  
  revalidatePath('/casasgaby/admin')
  revalidatePath('/casasgaby')
}"""

content = content.replace(old_save, new_save)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
