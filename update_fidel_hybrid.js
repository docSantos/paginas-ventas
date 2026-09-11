const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const [, url] = env.match(/NEXT_PUBLIC_SUPABASE_URL=([^\r\n]+)/) || [];
const [, key] = env.match(/SUPABASE_SERVICE_ROLE_KEY=([^\r\n]+)/) || env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=([^\r\n]+)/) || [];

const supabase = createClient(url, key);

async function run() {
  const { data: reservas } = await supabase.schema('hospedaje').from('reservas').select('id, nombre_cliente, monto_total_acordado, tarifa_base').ilike('nombre_cliente', '%Fidel Hernández%');
  
  if (reservas && reservas.length > 0) {
    const r = reservas[0];
    const total = Number(r.monto_total_acordado) || 20500;
    const baseHospedaje = 4500; // As per instructions "Subtotal Hospedaje: $4,500"
    const extras = total - baseHospedaje; // 16000
    
    const pComisionHospedaje = 15.00;
    const pComisionExtras = 5.00;
    
    const comisionHospedaje = baseHospedaje * (pComisionHospedaje / 100); // 675
    const comisionExtrasCalc = extras * (pComisionExtras / 100); // 800
    const totalComision = comisionHospedaje + comisionExtrasCalc; // 1475
    
    // Update reserva
    const { error: updErr } = await supabase.schema('hospedaje').from('reservas').update({
      tarifa_base: baseHospedaje,
      porcentaje_comision: pComisionHospedaje,
      monto_comision: totalComision,
      comision_pagada: 0,
      estado_comision: 'pendiente'
    }).eq('id', r.id);
    
    console.log('Update reserva:', updErr || 'Success');
    
    // Insert into central
    const { error: insErr } = await supabase.schema('central').from('transacciones_comisiones').insert({
      tenant_id: 'casasgaby',
      origen_modulo: 'hospedaje',
      referencia_id: r.id,
      concepto: `Comisión Reserva - ${r.nombre_cliente}`,
      monto_total: total,
      porcentaje_comision: pComisionHospedaje,
      monto_comision: totalComision,
      estado: 'pendiente'
    });
    
    console.log('Insert central:', insErr || 'Success');
  }
}
run();
