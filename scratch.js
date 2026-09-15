
const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf-8');
const lines = envFile.split('\n');
const env = {};
lines.forEach(l => {
  const parts = l.split('=');
  if (parts.length > 1) {
    const k = parts[0].trim();
    const v = parts.slice(1).join('=').trim().replace(/'/g, '').replace(/"/g, '');
    env[k] = v;
  }
});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['NEXT_PUBLIC_SUPABASE_ANON_KEY']);
async function run() {
  const carlosId = '44aa1065-397f-48d2-a927-1790661924e4';
  const { data } = await supabase.schema('hospedaje').from('reservas').select('propiedad_id').eq('id', carlosId);
  console.log(data);
}
run();

