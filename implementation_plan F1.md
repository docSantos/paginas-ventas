# Plan de Implementación - Fase 1: Configuración, Supabase y Componentes Base

Construcción de la web app mobile-first de renta y gestión de casas vacacionales (**Casas Gaby**) sobre Next.js (App Router) y Supabase, con arquitectura modular multi-app para soportar futuras ramas (`/casasgaby`, `/gabycarros`, `/electronica`).

---

## 1. Alcance de la Fase 1

En esta primera fase sentaremos las bases sólidas del proyecto:
1. **Inicialización del Proyecto Next.js**: App Router, TypeScript, Tailwind CSS, estructura `src/`.
2. **Conexión e Integración con Supabase**:
   - Clientes Supabase para Browser (`createBrowserClient`) y Server Components / Server Actions (`createServerClient` vía `@supabase/ssr`).
   - Tipos TypeScript para el modelo de datos (`Propiedad`, `Solicitud`, `Reserva`).
   - Archivo SQL con el esquema completo (`supabase/schema.sql`), políticas RLS (Row Level Security) y datos de prueba (seed data).
   - Configuración de variables de entorno (`.env.example` y `.env.local`).
3. **Estructura Modular Multi-App**:
   - Ruta principal `/casasgaby` con su layout propio, diseño mobile-first, barra de navegación superior y barra de navegación inferior fija (bottom navigation) optimizada para smartphones.
   - Ruta raíz `/` con hub de accesos a los módulos.
4. **Sistema de Diseño y Componentes Base**:
   - Componentes accesibles y estilizados: `Button`, `Card`, `Badge`, `Input`, `Dialog/Modal`, `Calendar/DateInput`, `Skeleton`.
   - Utilidades de estilos (`cn` con `clsx` y `tailwind-merge`).
   - Mock data / Fallback inteligente para visualizar la interfaz inmediatamente incluso antes de conectar las credenciales reales de Supabase.

---

## 2. Esquema de Base de Datos (Supabase)

Se implementará el script SQL en `supabase/schema.sql` con las 3 tablas solicitadas:
- `propiedades`: Catálogo de casas, fotos, capacidad, precio por noche, amenidades.
- `solicitudes`: Peticiones de reserva de clientes y chatbot n8n.
- `reservas`: Calendario de reservas confirmadas y bloqueos de fechas.
- Configuración del bucket `fotos-casas` con acceso público para lectura.

---

## 3. Estructura de Archivos Propuesta

```
paginas-ventas/
├── .env.example
├── .env.local
├── supabase/
│   └── schema.sql                # DDL SQL, RLS y Seed Data
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout con fuentes y viewport mobile
│   │   ├── page.tsx              # Portal / Hub principal
│   │   └── casasgaby/
│   │       ├── layout.tsx        # Layout específico Casas Gaby (Nav móvil, footer)
│   │       └── page.tsx          # Home / Catálogo inicial de Casas Gaby
│   ├── components/
│   │   ├── ui/                   # Button, Card, Badge, Input, Modal, etc.
│   │   ├── casasgaby/
│   │   │   ├── Header.tsx        # Top navbar mobile-first
│   │   │   ├── BottomNav.tsx     # Barra de navegación inferior móvil
│   │   │   └── PropertyCard.tsx  # Tarjeta de casa vacacional
│   ├── lib/
│   │   ├── utils.ts              # cn helper
│   │   └── supabase/
│   │       ├── client.ts         # Supabase browser client
│   │       └── server.ts         # Supabase server client
│   └── types/
│       ├── database.ts           # Definición de tipos de Supabase
│       └── casasgaby.ts          # Interfaces de dominio
```

---

## 4. Plan de Verificación

### Pruebas de Funcionamiento:
1. **Compilación y Build**: Verificar que `npm run build` y `npm run lint` ejecuten sin errores de TypeScript ni de paquetes.
2. **Servidor de Desarrollo**: Levantar el servidor en `http://localhost:3000` y comprobar la navegación en `/` y `/casasgaby`.
3. **Verificación Mobile-First**: Comprobar respuesta en viewports móviles (375px - 430px) y desktop.
4. **Diagnóstico Supabase**: Pantalla de estado de conexión en `/casasgaby` que informe si las variables `.env.local` están configuradas o si se encuentra en modo demo.

---

¿Deseas que procedamos con la ejecución de la Fase 1?
