
const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf-8');
const lines = envFile.split('\n');
const env = {};
lines.forEach(l => {
  const parts = l.split('=');
  if (parts.length > 1) {
    const k = parts[0].trim();
    const v = parts.slice(1).join('=').trim().replace(/'/g, '');
    env[k] = v;
  }
});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['NEXT_PUBLIC_SUPABASE_ANON_KEY']);
async function run() {
  const { data } = await supabase.schema('hospedaje').from('reservas').select('fecha_entrada, fecha_salida, tarifa_base, monto_total_acordado').eq('id', '44aa1065-397f-48d2-a927-1790661924e4');
  console.log(data);
}
run();

