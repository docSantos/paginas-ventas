-- 1. Políticas de Seguridad (RLS) para permitir al Administrador editar
-- Permitir a usuarios autenticados insertar, actualizar y eliminar propiedades
CREATE POLICY "Admin puede insertar propiedades" ON propiedades FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin puede actualizar propiedades" ON propiedades FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin puede eliminar propiedades" ON propiedades FOR DELETE TO authenticated USING (true);

-- Permitir a usuarios autenticados leer y gestionar solicitudes
CREATE POLICY "Admin puede leer solicitudes" ON solicitudes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin puede actualizar solicitudes" ON solicitudes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin puede eliminar solicitudes" ON solicitudes FOR DELETE TO authenticated USING (true);

-- Permitir a usuarios autenticados gestionar reservas
CREATE POLICY "Admin puede leer reservas" ON reservas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin puede insertar reservas" ON reservas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin puede actualizar reservas" ON reservas FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin puede eliminar reservas" ON reservas FOR DELETE TO authenticated USING (true);

-- 2. Actualizar manualmente la casa (Brisa del Mar -> Quinta Maretta)
UPDATE propiedades 
SET 
  titulo = 'Quinta Maretta: Casa Gaby',
  descripcion = 'Hermosa casa en fraccionamiento privado, zona muy segura. Ideal para familias que buscan relajarse en un entorno de paz. A tan solo 10 minutos de la playa principal.',
  amenidades = ARRAY['Alberca', 'WiFi', 'Aire acondicionado', 'Cocina equipada', 'Estacionamiento', 'BBQ', 'Smart TV', 'Acceso a playa'],
  precio_por_noche = 1500,
  precio_por_semana = 7000,
  precio_por_mes = 20000
WHERE titulo = 'Casa Brisa del Mar';
