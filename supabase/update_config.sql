CREATE TABLE IF NOT EXISTS configuracion (
    key VARCHAR(50) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Habilitar RLS
ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;

-- Lectura pblica para que el cliente sepa a dnde redirigir el WhatsApp
CREATE POLICY "Configuracion lectura publica"
    ON configuracion FOR SELECT
    TO public
    USING (true);

-- Escritura solo para admins
CREATE POLICY "Configuracion escritura admins"
    ON configuracion FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Insertar valor inicial vaco
INSERT INTO configuracion (key, value)
VALUES ('whatsapp_numbers', '{"numbers": [], "active": null}'::jsonb)
ON CONFLICT (key) DO NOTHING;
