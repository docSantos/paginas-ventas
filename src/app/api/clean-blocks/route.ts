import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const supabase = await createClient();
  const db = supabase as any;
  const hoyStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Cancun' });
  
  // 1. Clean checked out
  const { data: reservas } = await db.schema('hospedaje').from('reservas').select('id, fecha_entrada, fecha_salida').not('check_out_real_at', 'is', null);
  let msg = [];
  if (reservas) {
    for (const r of reservas) {
      await db.schema('hospedaje').from('fechas_bloqueadas').delete().eq('reserva_id', r.id);
      msg.push(`Cleaned checkout blocks for ${r.id}`);
      
      // Also update estado to Completada if it's not
      await db.schema('hospedaje').from('reservas').update({ estado: 'Completada' }).eq('id', r.id);
      msg.push(`Set Completada for ${r.id}`);
    }
  }

  // Also manually fix Carlos Mendoza if not caught above
  await db.schema('hospedaje').from('reservas').update({ estado: 'Completada' }).eq('id', '44aa1065-397f-48d2-a927-1790661924e4');
  await db.schema('hospedaje').from('fechas_bloqueadas').delete().eq('reserva_id', '44aa1065-397f-48d2-a927-1790661924e4');

  // Also clean anything >= today for all Finalizada
  const { data: finalizadas } = await db.schema('hospedaje').from('reservas').select('id').eq('estado', 'Finalizada');
  if (finalizadas) {
    for (const r of finalizadas) {
      await db.schema('hospedaje').from('fechas_bloqueadas').delete().eq('reserva_id', r.id).gte('fecha', hoyStr);
    }
  }

  revalidatePath('/');
  revalidatePath('/casasgaby');
  
  return Response.json({ success: true, msg });
}
