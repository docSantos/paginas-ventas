ALTER TABLE reservas ADD COLUMN IF NOT EXISTS tarifa_base NUMERIC(10,2);
UPDATE reservas SET tarifa_base = monto_total_acordado WHERE tarifa_base IS NULL;
ALTER TABLE reservas ALTER COLUMN tarifa_base SET NOT NULL;
