import re

with open('src/app/casasgaby/admin/clientes/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Suspense import
if "import { Suspense } from 'react'" not in content:
    content = "import { Suspense } from 'react'\n" + content

old_fetch = """  // Fetch clientes with reservations and transactions
  const { data: clientes } = await supabase
    .schema('hospedaje').from('clientes')
    .select('*, reservas(*, propiedades(titulo), transacciones(*)), transacciones(*)')
    .order('codigo_numero', { ascending: true })

  return <ClientesClient clientes={clientes || []} />"""

new_fetch = """  // Fetch clientes with reservations and transactions
  const { data: clientes } = await supabase
    .schema('hospedaje').from('clientes')
    .select('*, reservas(*, propiedades(titulo), transacciones(*)), transacciones(*)')
    .order('codigo_numero', { ascending: true })

  // Fetch solicitudes para el embudo CRM
  const { data: solicitudes } = await supabase
    .schema('hospedaje').from('solicitudes')
    .select('*, propiedades(titulo)')
    .order('created_at', { ascending: false })

  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Cargando directorio...</div>}>
      <ClientesClient clientes={clientes || []} solicitudes={solicitudes || []} />
    </Suspense>
  )"""

content = content.replace(old_fetch, new_fetch)

with open('src/app/casasgaby/admin/clientes/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
