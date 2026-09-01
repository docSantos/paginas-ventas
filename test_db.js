const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://pcjkoqxaftgqswblwaov.supabase.co',
  'sb_publishable_Gjcni8_Brjr63SUKu-VzVg_hDbzTz1b'
)

async function run() {
  const { data, error } = await supabase.from('propiedades').select('id, titulo').eq('tenant_id', 'casasgaby').limit(1)
  console.log("Propiedad:", data, error)
}
run()
