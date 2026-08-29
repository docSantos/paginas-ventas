-- Políticas para permitir a usuarios autenticados subir, actualizar y borrar fotos en el bucket 'fotos-casas'
-- IMPORTANTE: Asegúrate de que el bucket se llame exactamente 'fotos-casas' y sea Público.

INSERT INTO storage.buckets (id, name, public) 
VALUES ('fotos-casas', 'fotos-casas', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admin puede subir fotos" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'fotos-casas');

CREATE POLICY "Admin puede actualizar fotos" 
ON storage.objects FOR UPDATE TO authenticated 
USING (bucket_id = 'fotos-casas');

CREATE POLICY "Admin puede eliminar fotos" 
ON storage.objects FOR DELETE TO authenticated 
USING (bucket_id = 'fotos-casas');

CREATE POLICY "Todos pueden ver fotos" 
ON storage.objects FOR SELECT TO public 
USING (bucket_id = 'fotos-casas');
