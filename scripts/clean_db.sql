-- Script de limpieza para Producción (Módulo Casas Gaby / Páginas IXA)
-- IMPORTANTE: Ejecutar en el SQL Editor de Supabase (Dashboard -> SQL Editor)
--
-- Este script vacía las tablas operativas de prueba,
-- pero CONSERVA catálogos (propiedades, tarifas) y cuentas (auth.users).
-- El modificador CASCADE se asegura de arrastrar dependencias de llaves foráneas.

TRUNCATE TABLE 
  hospedaje.transacciones,
  hospedaje.comisiones,
  hospedaje.ajustes_reserva,
  hospedaje.reservas,
  hospedaje.solicitudes,
  hospedaje.clientes
CASCADE;

-- Opcional: Reiniciar secuencias si se tuvieran IDs autoincrementales numéricos (no aplica para UUIDs)
-- RESTART IDENTITY CASCADE;

-- Verificación de tablas limpias:
-- SELECT count(*) FROM hospedaje.transacciones;
-- SELECT count(*) FROM hospedaje.reservas;
