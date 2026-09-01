-- 1. Ampliar los estados permitidos en comisiones
ALTER TABLE comisiones 
DROP CONSTRAINT IF EXISTS comisiones_estado_pago_check;

ALTER TABLE comisiones
ADD CONSTRAINT comisiones_estado_pago_check
CHECK (estado_pago IN ('pendiente', 'parcial', 'liquidado', 'cancelada', 'cancelada_con_saldo_a_favor'));
