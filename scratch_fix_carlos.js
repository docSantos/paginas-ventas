
const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf-8');
const lines = envFile.split('\n');
const env = {};
lines.forEach(l => {
  const parts = l.split('=');
  if (parts.length > 1) {
    const k = parts[0].trim();
    const v = parts.slice(1).join('=').trim().replace(/'/g, '').replace(/"/g, '');
    env[k] = v;
  }
});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['NEXT_PUBLIC_SUPABASE_ANON_KEY']);

async function run() {
  const carlosId = '44aa1065-397f-48d2-a927-1790661924e4';
  const carlosNuevaTarifa = 8000;
  const carlosNuevoTotal = 10300;
  const carlosComisionBase = 8000 * 0.025; // 200
  const carlosComisionExtras = 2300 * 0.05; // 115
  const carlosComisionTotal = carlosComisionBase + carlosComisionExtras; // 315
  
  await supabase.schema('hospedaje').from('reservas').update({
    tarifa_base: carlosNuevaTarifa,
    monto_total_acordado: carlosNuevoTotal,
    costo_total: carlosNuevoTotal,
    monto_comision: carlosComisionTotal,
    fecha_entrada: '2026-10-04',
    fecha_salida: '2026-10-12'
  }).eq('id', carlosId);
  
  await supabase.schema('hospedaje').from('comisiones').update({ 
    monto_estancia: carlosNuevoTotal, 
    monto_comision: carlosComisionTotal,
    saldo_pendiente: Math.max(0, carlosComisionTotal - 0) // if monto_pagado is 0
  }).eq('reserva_id', carlosId);
  
  await supabase.schema('central').from('transacciones_comisiones').update({ 
    monto_total: carlosNuevoTotal, 
    monto_comision: carlosComisionTotal 
  }).eq('referencia_id', carlosId);

  // FIX FECHAS BLOQUEADAS
  await supabase.schema('hospedaje').from('fechas_bloqueadas').delete().eq('reserva_id', carlosId);
  const nuevasFechas = [];
  const d = new Date('2026-10-04T12:00:00');
  const endDate = new Date('2026-10-12T12:00:00');
  while (d < endDate) {
    nuevasFechas.push(d.toISOString().split('T')[0]);
    d.setDate(d.getDate() + 1);
  }
  await supabase.schema('hospedaje').from('fechas_bloqueadas').insert(
    nuevasFechas.map(f => ({ propiedad_id: 'e4999a0e-a607-4e63-bb81-a9dd603952ba', reserva_id: carlosId, fecha: f }))
  );
  console.log('Carlos Mendoza DB Fix Applied!');
}
run();

