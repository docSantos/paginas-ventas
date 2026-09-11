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
  const { data, error } = await supabase
    .schema('central')
    .from('transacciones_comisiones')
    .select('*')
    .limit(3);
    
  console.log('Error:', error);
  console.log('Comisiones:', JSON.stringify(data, null, 2));
}

test();
