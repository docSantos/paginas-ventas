-- Agregar columnas financieras y logísticas a la tabla solicitudes
ALTER TABLE solicitudes 
ADD COLUMN IF NOT EXISTS noches INT DEFAULT 1,
ADD COLUMN IF NOT EXISTS costo_total DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS monto_apartado DECIMAL(10,2) DEFAULT 0;

-- Modificar política RLS de reservas para permitir que el calendario de clientes lea fechas bloqueadas
DROP POLICY IF EXISTS "Visitantes pueden ver fechas bloqueadas" ON reservas;

CREATE POLICY "Visitantes pueden ver fechas bloqueadas"
    ON reservas FOR SELECT
    TO public
    USING (estado = 'Activa');
