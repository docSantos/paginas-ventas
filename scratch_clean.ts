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

async function clean() {
  const hoyStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Cancun' });
  console.log('Borrando bloqueos >=', hoyStr, 'de reservas con check_out_real_at NO nulo');
  
  // Get all reservations that checked out
  const { data: reservas, error: errRes } = await supabase.schema('hospedaje').from('reservas').select('id').not('check_out_real_at', 'is', null);
  if (errRes) { console.error('Error fetching reservas:', errRes); return; }
  
  console.log('Reservas con checkout:', reservas.length);
  for (const r of reservas) {
    const { data, error } = await supabase.schema('hospedaje').from('fechas_bloqueadas')
      .delete()
      .eq('reserva_id', r.id)
      .gte('fecha', hoyStr)
      .select();
    if (error) console.error('Error delete', r.id, error.message);
    else if (data && data.length > 0) {
        console.log(`Borrados ${data.length} bloqueos para reserva ${r.id}`);
    }
  }
  
  const { data: endingToday, error: errEnding } = await supabase.schema('hospedaje').from('reservas').select('id, fecha_salida').eq('fecha_salida', hoyStr);
  if (endingToday) {
    for(const r of endingToday) {
      const { data, error } = await supabase.schema('hospedaje').from('fechas_bloqueadas').delete().eq('reserva_id', r.id).gte('fecha', hoyStr).select();
      if (data && data.length > 0) {
          console.log(`Borrados ${data.length} bloqueos extras para reserva terminada hoy ${r.id}`);
      }
    }
  }
  console.log('Cleanup completed');
}
clean();
