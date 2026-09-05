-- ============================================================
-- Casas Gaby - Esquema de Base de Datos Supabase
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Extensión para generar UUIDs (ya habilitada por defecto en Supabase)
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Storage: Bucket para fotos de casas
-- ============================================================
-- Nota: Crear manualmente en Supabase Storage o via API:
-- Bucket ID: fotos-casas
-- Public: true (acceso público para lectura)

-- ============================================================
-- Tabla 1: Propiedades (Catálogo de casas)
-- ============================================================
CREATE TABLE IF NOT EXISTS propiedades (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo              VARCHAR(255) NOT NULL,
    descripcion         TEXT,
    precio_por_noche    DECIMAL(10,2) NOT NULL,
    capacidad_personas  INT NOT NULL,
    amenidades          TEXT[] DEFAULT '{}',
    fotos               TEXT[] DEFAULT '{}',
    activa              BOOLEAN DEFAULT true,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================================
-- Tabla 2: Solicitudes (Peticiones de clientes / chatbot n8n)
-- ============================================================
CREATE TABLE IF NOT EXISTS solicitudes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    propiedad_id    UUID REFERENCES propiedades(id) ON DELETE CASCADE,
    nombre_cliente  VARCHAR(255) NOT NULL,
    email           VARCHAR(255),
    telefono        VARCHAR(50) NOT NULL,
    fecha_entrada   DATE NOT NULL,
    fecha_salida    DATE NOT NULL,
    num_huespedes   INT DEFAULT 1,
    notas           TEXT,
    estado          VARCHAR(50) DEFAULT 'Pendiente'
                    CHECK (estado IN ('Pendiente', 'Aprobada', 'Rechazada')),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================================
-- Tabla 3: Reservas confirmadas y bloqueos de fechas
-- ============================================================
CREATE TABLE IF NOT EXISTS reservas (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    propiedad_id     UUID REFERENCES propiedades(id) ON DELETE CASCADE,
    nombre_cliente   VARCHAR(255) NOT NULL,
    email            VARCHAR(255),
    telefono         VARCHAR(50) NOT NULL,
    fecha_entrada    DATE NOT NULL,
    fecha_salida     DATE NOT NULL,
    costo_total      DECIMAL(10,2) NOT NULL,
    monto_apartado   DECIMAL(10,2) NOT NULL DEFAULT 0,
    estado           VARCHAR(50) DEFAULT 'Activa'
                     CHECK (estado IN ('Activa', 'Archivada')),
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE propiedades ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitudes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas     ENABLE ROW LEVEL SECURITY;

-- Propiedades: acceso público para lectura, escritura solo autenticados
CREATE POLICY "Propiedades visibles públicamente"
    ON propiedades FOR SELECT
    USING (activa = true);

CREATE POLICY "Admins pueden gestionar propiedades"
    ON propiedades FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Solicitudes: cualquiera puede insertar (chatbot/visitantes), admins pueden leer/gestionar
CREATE POLICY "Visitantes pueden crear solicitudes"
    ON solicitudes FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Admins pueden gestionar solicitudes"
    ON solicitudes FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Reservas: solo admins autenticados
CREATE POLICY "Admins pueden gestionar reservas"
    ON reservas FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================================
-- Datos de prueba (Seed Data)
-- ============================================================

INSERT INTO propiedades (titulo, descripcion, precio_por_noche, capacidad_personas, amenidades, fotos, activa)
VALUES
(
    'Casa Brisa del Mar',
    'Hermosa casa frente al mar con vista panorámica al océano. Perfecta para familias que buscan descanso y tranquilidad. A 5 minutos caminando de la playa principal.',
    2500.00,
    8,
    ARRAY['Alberca privada', 'WiFi', 'Aire acondicionado', 'Cocina equipada', 'Estacionamiento', 'BBQ', 'Smart TV', 'Acceso a playa'],
    ARRAY[],
    true
),
(
    'Villa Puesta del Sol',
    'Lujosa villa con amplio jardín y alberca climatizada. Ideal para eventos familiares y escapadas románticas. Cuenta con todas las comodidades del hogar y más.',
    4200.00,
    12,
    ARRAY['Alberca climatizada', 'Jacuzzi', 'WiFi', 'Aire acondicionado', 'Cocina gourmet', 'Estacionamiento doble', 'Terraza', 'Área de juegos'],
    ARRAY[],
    true
),
(
    'Cabaña Montaña Verde',
    'Acogedora cabaña rodeada de naturaleza. Perfecta para quienes buscan desconectarse y reconectarse con el entorno natural. Senderos y vistas espectaculares.',
    1800.00,
    6,
    ARRAY['WiFi', 'Chimenea', 'Cocina equipada', 'Estacionamiento', 'Terraza con vista a la montaña', 'Asador'],
    ARRAY[],
    true
);
