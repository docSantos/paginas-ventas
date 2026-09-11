const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  if (line.trim().startsWith('#') || !line.includes('=')) return acc;
  const [k, ...v] = line.split('=');
  acc[k.trim()] = v.join('=').trim().replace(/['"]/g, '');
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data: reservas, error } = await supabase
    .schema('hospedaje')
    .from('reservas')
    .select('*')
    .limit(1);
    
  console.log('Error:', error);
  console.log('Reservas cols:', Object.keys(reservas[0]));
}

test();
