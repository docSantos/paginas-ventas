-- Migración para alinear el estado de solicitudes con el nuevo CRM Multietapa (Sprint 7.5)
-- Esquema: hospedaje
-- Tabla: solicitudes

-- 1. Eliminar la restricción (check constraint) antigua que limitaba a Pendiente/Aprobada/Rechazada
ALTER TABLE hospedaje.solicitudes 
DROP CONSTRAINT IF EXISTS solicitudes_estado_check;

-- 2. Aplicar la nueva restricción permitiendo los estados ágiles
ALTER TABLE hospedaje.solicitudes 
ADD CONSTRAINT solicitudes_estado_check 
CHECK (estado IN ('por_contactar', 'en_seguimiento', 'confirmada', 'descartada'));

-- NOTA: Si en la base de datos aún existen solicitudes antiguas con estado 'Pendiente', 'Aprobada' o 'Rechazada', 
-- es recomendable migrarlas a la nueva nomenclatura antes de aplicar el ADD CONSTRAINT, o incluirlas en el CHECK temporalmente.
-- Por ejemplo, si se desea normalizar la data existente, correr primero:
-- UPDATE hospedaje.solicitudes SET estado = 'por_contactar' WHERE estado = 'Pendiente' OR estado = 'nueva';
-- UPDATE hospedaje.solicitudes SET estado = 'confirmada' WHERE estado = 'Aprobada';
-- UPDATE hospedaje.solicitudes SET estado = 'descartada' WHERE estado = 'Rechazada';
