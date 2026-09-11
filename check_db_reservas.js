const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  if (line.trim().startsWith('#') || !line.includes('=')) return acc;
  const [k, ...v] = line.split('=');
  acc[k.trim()] = v.join('=').trim().replace(/['"]/g, '');
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data: reservas, error } = await supabase
    .schema('hospedaje')
    .from('reservas')
    .select('id, nombre_cliente, comisiones (*)')
    .limit(3);
    
  console.log('Error:', error);
  console.log('Reservas:', JSON.stringify(reservas, null, 2));
}

test();
