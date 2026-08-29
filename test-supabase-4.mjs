import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://pcjkoqxaftgqswblwaov.supabase.co',
  'sb_publishable_Gjcni8_Brjr63SUKu-VzVg_hDbzTz1b'
)

async function testSupabase() {
  const { data, error } = await supabase.from('propiedades').select('*')
  if (error) {
    console.error("Error consultando propiedades:", error.message)
    return
  }
  console.log("Propiedades actuales en la BD:")
  console.dir(data, { depth: null })
  
  const { data: buckets } = await supabase.storage.listBuckets()
  console.log("\nBuckets:")
  console.dir(buckets?.map(b => b.name))
}

testSupabase()
