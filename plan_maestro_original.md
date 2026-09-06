<USER_REQUEST>
Hola. Vamos a construir una web app mobile-first de renta de casas vacacionales en Next.js y Supabase. He preparado el plan maestro de implementación completo. Por favor, analízalo e inicia con la Fase 1 (Configuración de proyecto, componentes base y conexión a Supabase):

# IMPLEMENTATION_PLAN.md
# Proyecto: Web App de Gestión y Renta de Casas Vacacionales (Mobile-First)

## 1. Visión General del Proyecto
Desarrollar una aplicación web responsiva (Mobile-First) bajo la subruta `/casasgaby`, diseñada para la promoción, cotización y gestión de casas vacacionales. La arquitectura debe permitir albergar futuras aplicaciones independientes dentro del mismo repositorio (ej. `/gabycarros`, `/electronica`).

### Stack Tecnológico:
- **Framework:** Next.js (App Router, TypeScript)
- **Estilos:** Tailwind CSS + Lucide Icons + componentes accesibles (shadcn/ui style)
- **Base de Datos & Auth:** Supabase (PostgreSQL + Supabase Auth)
- **Almacenamiento:** Supabase Storage (Bucket para fotos de alta resolución)
- **Integraciones:** Webhook / Widget de Chatbot conectado a n8n

---

## 2. Esquema de Base de Datos y Storage (Supabase)

### A. Storage Bucket
- Nombre: `fotos-casas` (Público para lectura de imágenes, escritura restringida a usuarios autenticados).

### B. Tablas SQL

```sql
-- 1. Tabla de Casas / Propiedades
CREATE TABLE propiedades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio_por_noche DECIMAL(10,2) NOT NULL,
    capacidad_personas INT NOT NULL,
    amenidades TEXT[] DEFAULT '{}',
    fotos TEXT[] DEFAULT '{}',
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tabla de Solicitudes (Generadas por visitantes o chatbot)
CREATE TABLE solicitudes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    propiedad_id UUID REFERENCES propiedades(id) ON DELETE CASCADE,
    nombre_cliente VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(50) NOT NULL,
    fecha_entrada DATE NOT NULL,
    fecha_salida DATE NOT NULL,
    num_huespedes INT DEFAULT 1,
    notas TEXT,
    estado VARCHAR(50) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Aprobada', 'Rechazada')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tabla de Reservas Confirmadas / Bloqueos
CREATE TABLE reservas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    propiedad_id UUID REFERENCES propiedades(id) ON DELETE CASCADE,
    nombre_cliente VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(50) NOT NULL,
    fecha_entrada DATE NOT NULL,
    fecha_salida DATE NOT NULL,
    costo_total DECIMAL(10,2) NOT NULL,
    monto_apartado DECIMAL(10,2) NOT NULL DEFAULT 0,
    estado VARCHAR(50) DEFAULT 'Activa' CHECK (estado IN ('Activa', 'Archivada')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-08-27T13:53:41-05:00.
</ADDITIONAL_METADATA>
<USER_SETTINGS_CHANGE>
The user changed setting `Model Selection` from None to Gemini 3.1 Pro (High). No need to comment on this change if the user doesn't ask about it. If reporting what model you are, please use a human readable name instead of the exact string.
</USER_SETTINGS_CHANGE>