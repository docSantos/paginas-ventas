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

async function fix() {
  const hoyStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Cancun' });
  
  // Update the broken reservation
  const { data: broken, error } = await supabase.schema('hospedaje').from('reservas').select('id, fecha_entrada, fecha_salida').eq('fecha_entrada', hoyStr).eq('fecha_salida', hoyStr);
  console.log('Broken:', broken, error);

  if (broken) {
    for (const r of broken) {
      const { data: upd, error: updErr } = await supabase.schema('hospedaje').from('reservas').update({ fecha_salida: '2026-09-15', estado: 'Finalizada' }).eq('id', r.id).select();
      console.log('Update broken:', upd, updErr);
      
      const { data: del, error: delErr } = await supabase.schema('hospedaje').from('fechas_bloqueadas').delete().eq('reserva_id', r.id).gte('fecha', hoyStr).select();
      console.log('Delete broken blocks:', del, delErr);
    }
  }

  // Delete all future blocks for checked out reservations
  const { data: checkouts } = await supabase.schema('hospedaje').from('reservas').select('id').not('check_out_real_at', 'is', null);
  if (checkouts) {
    for (const r of checkouts) {
      await supabase.schema('hospedaje').from('fechas_bloqueadas').delete().eq('reserva_id', r.id).gte('fecha', hoyStr);
    }
  }
}
fix();
