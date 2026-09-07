const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load environment variables from .env.local manually
const envContent = fs.readFileSync('.env.local', 'utf-8');
const envConfig = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envConfig[match[1].trim()] = match[2].trim().replace(/^['"](.*)['"]$/, '$1');
  }
});

const supabaseUrl = envConfig['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envConfig['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Iniciando purga de datos...");
  // Borrado en orden inverso de dependencias para evitar error de FKs (Restrict)
  const tables = [
    'transacciones',
    'comisiones',
    'ajustes_reserva',
    'reservas',
    'solicitudes',
    'clientes'
  ];

  for (const table of tables) {
    console.log(`Purgando hospedaje.${table}...`);
    // Delete all records where id is not null (which is all records)
    const { error } = await supabase.schema('hospedaje').from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) {
      console.error(`Error purgando ${table}:`, error.message);
    } else {
      console.log(`OK: ${table} vaciada.`);
    }
  }
  
  console.log("Proceso finalizado con exito.");
}

run();
