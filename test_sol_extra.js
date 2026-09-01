const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://pcjkoqxaftgqswblwaov.supabase.co',
  'sb_publishable_Gjcni8_Brjr63SUKu-VzVg_hDbzTz1b'
)

async function test() {
    const { data, error } = await supabase.from('solicitudes').select('servicios_extra').limit(1)
    console.log("solicitudes:", data, error)
}
test()
