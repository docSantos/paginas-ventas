import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function cleanData() {
  console.log('Iniciando purga de datos de prueba en esquema hospedaje...')

  // Dado que queremos evitar problemas de Foreign Keys, podemos usar un bloque RPC o simplemente borrar en orden
  // Para evitar errores si no tenemos RPC o SQL directo desde el cliente Rest, borraremos en orden reverso de FKs
  
  const tables = [
    'transacciones',
    'comisiones',
    'solicitudes',
    'ajustes_reserva',
    'reservas',
    'clientes'
  ]

  for (const table of tables) {
    try {
      // Borramos todo filtrando por algo que siempre sea true, ej. id no nulo
      const { data, error } = await supabase.schema('hospedaje').from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (error) {
        console.error(`Error purgando ${table}:`, error.message)
      } else {
        console.log(`Tabla ${table} purgada exitosamente.`)
      }
    } catch (e: any) {
      console.error(`Error en tabla ${table}: ${e.message}`)
    }
  }
  
  console.log('Proceso finalizado. Las tablas catálogos y perfiles se mantuvieron intactas.')
}

cleanData()
