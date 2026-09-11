const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('configuracion').select('*').limit(5);
  console.log("public.configuracion:", data, error);
  
  const { data: cData, error: cErr } = await supabase.schema('central').from('tenants').select('*');
  console.log("central.tenants:", cData, cErr);

  const { data: fData, error: fErr } = await supabase.schema('hospedaje').from('reservas').select('id, nombre_cliente').eq('nombre_cliente', 'Fidel Hernández');
  console.log("Reserva Fidel:", fData, fErr);
}
run();
