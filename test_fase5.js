const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://pcjkoqxaftgqswblwaov.supabase.co',
  'sb_publishable_Gjcni8_Brjr63SUKu-VzVg_hDbzTz1b'
)

async function test() {
    // 1. Create client
    const { data: cliente, error: e1 } = await supabase.from('clientes').insert({
        nombre_completo: 'Cliente Prueba Fase 5',
        codigo_pais: '+52',
        telefono: '5551234567',
        email: 'test_fase5@casasgaby.com',
        tenant_id: 'casasgaby'
    }).select().single()

    if (e1) {
        console.log("Error creando cliente:", e1)
        // Intentar obtenerlo
        const { data: exCliente } = await supabase.from('clientes').select('*').eq('email', 'test_fase5@casasgaby.com').single()
        if (exCliente) {
            console.log("Cliente ya existía:", exCliente.id)
            var cId = exCliente.id
        } else {
            return
        }
    } else {
        console.log("Cliente creado:", cliente.id)
        var cId = cliente.id
    }

    // 2. Get property
    const { data: prop } = await supabase.from('propiedades').select('id, titulo, precio_por_noche').limit(1).single()
    console.log("Propiedad seleccionada:", prop.titulo, prop.id)

    // 3. Create reservation
    const today = new Date()
    const in3Days = new Date(today)
    in3Days.setDate(in3Days.getDate() + 3)
    const in6Days = new Date(today)
    in6Days.setDate(in6Days.getDate() + 6)

    const tarifa_base = prop.precio_por_noche * 3

    const { data: reserva, error: e3 } = await supabase.from('reservas').insert({
        cliente_id: cId,
        propiedad_id: prop.id,
        tenant_id: 'casasgaby',
        estado: 'Activa',
        fecha_entrada: in3Days.toISOString().split('T')[0],
        fecha_salida: in6Days.toISOString().split('T')[0],
        numero_huespedes: 2,
        tarifa_base: tarifa_base,
        monto_total_acordado: tarifa_base + 800,
        nombre_cliente: 'Cliente Prueba Fase 5'
    }).select().single()

    if (e3) { console.log("Error reserva:", e3); return }
    console.log("Reserva creada:", reserva.id)

    // 4. Create comisiones row
    const { error: ec } = await supabase.from('comisiones').insert({
        reserva_id: reserva.id,
        propiedad_id: prop.id,
        monto_estancia: tarifa_base + 800,
        monto_comision: ((tarifa_base) * 0.025) + (800 * 0.05),
        monto_pagado: 0
    })
    console.log("Comision status:", ec ? ec : 'OK')

    // 5. Add extra service
    const { error: e4 } = await supabase.from('ajustes_reserva').insert({
        reserva_id: reserva.id,
        tipo: 'cargo',
        concepto: 'Traslado Aeropuerto (Prueba)',
        monto: 800,
        porcentaje_comision: 5.00,
        monto_comision: 40.00
    })
    console.log("Servicio extra agregado:", e4 ? e4 : 'OK')

    // 6. Add partial payment
    const { error: e5 } = await supabase.from('transacciones').insert({
        reserva_id: reserva.id,
        cliente_id: cId,
        tenant_id: 'casasgaby',
        tipo: 'ingreso',
        categoria: 'anticipo',
        monto: (tarifa_base + 800) / 2,
        monto_mxn: (tarifa_base + 800) / 2,
        metodo_pago: 'transferencia',
        moneda: 'MXN',
        fecha_pago: today.toISOString()
    })
    console.log("Pago registrado:", e5 ? e5 : 'OK')

    console.log("\\n=== PRUEBA FINALIZADA ===")
    console.log(`ID Reserva: ${reserva.id}`)
    console.log(`ID Cliente: ${cId}`)
}

test()
