CREATE TABLE IF NOT EXISTS configuracion_telefonos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    etiqueta VARCHAR(255) DEFAULT 'WhatsApp',
    telefono VARCHAR(50) NOT NULL,
    activo BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE configuracion_telefonos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Telefonos lectura publica" ON configuracion_telefonos FOR SELECT TO public USING (true);
CREATE POLICY "Telefonos escritura admins" ON configuracion_telefonos FOR ALL TO authenticated USING (true) WITH CHECK (true);
