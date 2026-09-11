const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const [, url] = env.match(/NEXT_PUBLIC_SUPABASE_URL=([^\r\n]+)/) || [];
const [, key] = env.match(/SUPABASE_SERVICE_ROLE_KEY=([^\r\n]+)/) || env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=([^\r\n]+)/) || [];

const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.schema('hospedaje').from('reservas').update({
    porcentaje_comision: 15.00,
    monto_comision: 3075.00,
    comision_pagada: 0.00,
    estado_comision: 'pendiente'
  }).ilike('nombre_cliente', '%Fidel Hernández%');
  
  console.log('Update result:', data, error);
}
run();
