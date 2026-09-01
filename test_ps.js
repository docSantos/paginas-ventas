const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://pcjkoqxaftgqswblwaov.supabase.co',
  'sb_publishable_Gjcni8_Brjr63SUKu-VzVg_hDbzTz1b'
)

async function test() {
    const { data, error } = await supabase.from('propiedad_servicios').select('*').limit(1)
    console.log("propiedad_servicios:", data, error)
}
test()
