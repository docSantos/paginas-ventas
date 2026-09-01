-- 1. Evitar montos negativos en la tabla de comisiones
ALTER TABLE comisiones 
DROP CONSTRAINT IF EXISTS check_monto_positivo_comision,
ADD CONSTRAINT check_monto_positivo_comision 
CHECK (monto_estancia >= 0 AND monto_comision >= 0 AND monto_pagado >= 0);

-- 2. Evitar abonos negativos en pagos_reservas
ALTER TABLE pagos_reservas 
DROP CONSTRAINT IF EXISTS check_monto_pago_positivo,
ADD CONSTRAINT check_monto_pago_positivo 
CHECK (monto > 0 AND monto_equivalente_mxn > 0);
