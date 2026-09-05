-- migrations/001_multi_schema_migration.sql

-- 1. Crear esquemas
CREATE SCHEMA IF NOT EXISTS hospedaje;
CREATE SCHEMA IF NOT EXISTS autolavado;
CREATE SCHEMA IF NOT EXISTS tienda_cafe;
CREATE SCHEMA IF NOT EXISTS central;

-- 2. Mover tablas, vistas y funciones de public a hospedaje (explicitamente)
DO $$ 
DECLARE
    t_name text;
    v_name text;
    f_name text;
BEGIN
    -- Mover todas las tablas
    FOR t_name IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(t_name) || ' SET SCHEMA hospedaje;';
    END LOOP;

    -- Mover todas las vistas
    FOR v_name IN SELECT viewname FROM pg_views WHERE schemaname = 'public' LOOP
        EXECUTE 'ALTER VIEW public.' || quote_ident(v_name) || ' SET SCHEMA hospedaje;';
    END LOOP;
END $$;

-- 3. Permisos y privilegios (Crítico para que PostgREST/Supabase API funcione)
-- Otorgar USAGE en esquemas
GRANT USAGE ON SCHEMA hospedaje TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA autolavado TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA tienda_cafe TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA central TO anon, authenticated, service_role;

-- Otorgar ALL PRIVILEGES sobre tablas actuales en los esquemas
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA hospedaje TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA hospedaje TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA hospedaje TO anon, authenticated, service_role;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA central TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA central TO anon, authenticated, service_role;

-- Configurar ALTER DEFAULT PRIVILEGES
ALTER DEFAULT PRIVILEGES IN SCHEMA hospedaje GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA hospedaje GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA hospedaje GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA autolavado GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA autolavado GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA tienda_cafe GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA tienda_cafe GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA central GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA central GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- 4. Creación de la tabla unificada en central
CREATE TABLE IF NOT EXISTS central.transacciones_comisiones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    tenant_id TEXT NOT NULL,
    origen_modulo TEXT NOT NULL,
    referencia_id TEXT NOT NULL,
    concepto TEXT,
    monto_total NUMERIC NOT NULL,
    porcentaje_comision NUMERIC NOT NULL,
    monto_comision NUMERIC NOT NULL,
    estado TEXT DEFAULT 'pendiente'
);

-- Permisos para la tabla de central
GRANT ALL ON central.transacciones_comisiones TO anon, authenticated, service_role;
