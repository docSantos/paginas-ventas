import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      propiedad_id, 
      titulo_propiedad, // Para n8n
      nombre_cliente, 
      email, 
      telefono, 
      fecha_entrada, 
      fecha_salida, 
      num_huespedes,
      noches,
      costo_total,
      monto_apartado,
      servicios_extra
    } = body

    // 1. Guardar en Supabase
    const cookieStore = await cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
        set() {}, remove() {}
      }
    })

    let solicitudId = null

    if (supabaseUrl !== 'your-supabase-project-url') {
      const { data, error } = await supabase.from('solicitudes').insert({
        propiedad_id,
        nombre_cliente,
        email: email || null,
        telefono,
        fecha_entrada,
        fecha_salida,
        num_huespedes: Number(num_huespedes),
        noches: Number(noches),
        costo_total: Number(costo_total),
        monto_apartado: Number(monto_apartado),
        servicios_extra: servicios_extra || [],
        estado: 'Pendiente'
      }).select('id').single()

      if (error) {
        console.error("Error guardando solicitud en Supabase:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      solicitudId = data.id
    }

    // 2. Disparar Webhook a n8n
    // Intentar leer la URL del webhook desde variables de entorno
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    if (n8nWebhookUrl) {
      try {
        await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_solicitud: solicitudId,
            propiedad_id,
            titulo_propiedad,
            nombre_cliente,
            email,
            telefono,
            fecha_entrada,
            fecha_salida,
            num_huespedes,
            noches,
            costo_total,
            monto_apartado,
            servicios_extra,
            timestamp: new Date().toISOString()
          })
        })
      } catch (err) {
        console.error("Error enviando webhook a n8n:", err)
        // No bloqueamos la respuesta al cliente si falla n8n
      }
    }

    return NextResponse.json({ success: true, id: solicitudId })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
