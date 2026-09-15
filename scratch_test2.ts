import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
let SUPABASE_URL = '';
let SUPABASE_KEY = '';

envFile.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) SUPABASE_URL = line.split('=')[1].trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) SUPABASE_KEY = line.split('=')[1].trim();
});

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  const { data: reservas, error } = await supabase.schema('hospedaje').from('reservas').select('*');
  console.log('Reservas:', reservas?.map(r => ({ id: r.id, prop: r.propiedad_id, start: r.fecha_entrada, end: r.fecha_salida, status: r.estado })));
  
  // also get fechas_bloqueadas using the API route since anon role couldn't read it
}
test();
