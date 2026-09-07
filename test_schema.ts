import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  const { data, error } = await supabase.rpc('get_table_info', { table_name: 'solicitudes' })
  // Actually rpc might not exist. Let's just try to update a record to 'nueva' and see if it fails constraint.
  const { error: err2 } = await supabase.schema('hospedaje').from('solicitudes').update({ estado: 'nueva' }).eq('id', '00000000-0000-0000-0000-000000000000')
  console.log("Error updating to 'nueva':", err2)
}

run()
