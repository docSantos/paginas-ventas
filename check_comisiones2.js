const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...v] = line.split('=');
  if (k && v) acc[k] = v.join('=').trim();
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data, error } = await supabase.schema('central').from('transacciones_comisiones').select('*').limit(5);
  console.log('Error:', error);
  console.log('Data:', data);
  
  const { data: res, error: e2 } = await supabase.schema('hospedaje').from('reservas').select('*, comisiones(*)').limit(1);
  console.log('Error 2:', e2);
  //console.log('Data 2:', res);
}
test();
