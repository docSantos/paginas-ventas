# Walkthrough — Fase 1: Configuración, Supabase y Componentes Base ✅

## Resultado del Build

```
▲ Next.js 16.3.3 (webpack)
✓ Compiled successfully in 9.6s
✓ TypeScript: 0 errores
✓ Rutas generadas: / y /casasgaby
```

---

## Archivos Creados

### 🗄️ Base de Datos
| Archivo | Descripción |
|---|---|
| [`supabase/schema.sql`](file:///c:/Users/PcKon/Documents/paginas-ventas/supabase/schema.sql) | DDL completo: tablas `propiedades`, `solicitudes`, `reservas` + RLS + seed data (3 casas demo) |
| [`.env.example`](file:///c:/Users/PcKon/Documents/paginas-ventas/.env.example) | Plantilla de variables de entorno |
| [`.env.local`](file:///c:/Users/PcKon/Documents/paginas-ventas/.env.local) | Variables locales (rellenar con credenciales reales) |

### 🔌 Integración Supabase
| Archivo | Descripción |
|---|---|
| [`src/lib/supabase/client.ts`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/lib/supabase/client.ts) | Cliente para Client Components (`createBrowserClient`) |
| [`src/lib/supabase/server.ts`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/lib/supabase/server.ts) | Cliente para Server Components + `isSupabaseConfigured()` |

### 🏷️ Tipos TypeScript
| Archivo | Descripción |
|---|---|
| [`src/types/database.ts`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/types/database.ts) | Tipos `Row`, `Insert`, `Update` para las 3 tablas |
| [`src/types/casasgaby.ts`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/types/casasgaby.ts) | Aliases de dominio + `MOCK_PROPIEDADES` para modo demo |

### 🎨 Componentes UI Base
| Archivo | Props principales |
|---|---|
| [`src/components/ui/button.tsx`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/components/ui/button.tsx) | `variant`, `size`, `isLoading` |
| [`src/components/ui/card.tsx`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/components/ui/card.tsx) | `Card`, `CardHeader`, `CardContent`, `CardFooter`, `CardTitle` |
| [`src/components/ui/badge.tsx`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/components/ui/badge.tsx) | `variant`: default, success, warning, danger, info, outline |
| [`src/components/ui/input.tsx`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/components/ui/input.tsx) | `label`, `error`, `helperText` + accesible |
| [`src/components/ui/skeleton.tsx`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/components/ui/skeleton.tsx) | `Skeleton` + `PropertyCardSkeleton` |
| [`src/lib/utils.ts`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/lib/utils.ts) | `cn()`, `formatPrice()`, `formatDate()`, `calcularNoches()` |

### 📱 Componentes Casas Gaby (Mobile-First)
| Archivo | Descripción |
|---|---|
| [`src/components/casasgaby/Header.tsx`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/components/casasgaby/Header.tsx) | Top navbar sticky con logo y menú desplegable |
| [`src/components/casasgaby/BottomNav.tsx`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/components/casasgaby/BottomNav.tsx) | Barra de navegación inferior fija con 4 tabs (Inicio, Buscar, Reservas, Admin) |
| [`src/components/casasgaby/PropertyCard.tsx`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/components/casasgaby/PropertyCard.tsx) | Tarjeta de propiedad con foto, precio, amenidades, capacidad y CTA |

### 🗂️ Layout y Páginas
| Archivo | Descripción |
|---|---|
| [`src/app/layout.tsx`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/app/layout.tsx) | Root layout con fuente Geist, viewport mobile optimizado, `themeColor` teal |
| [`src/app/page.tsx`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/app/page.tsx) | Hub portal con tarjetas de acceso a módulos (Casas, Carros, Electrónica) |
| [`src/app/casasgaby/layout.tsx`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/app/casasgaby/layout.tsx) | Layout específico: Header + contenido con `pb-20` + BottomNav fixed |
| [`src/app/casasgaby/page.tsx`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/app/casasgaby/page.tsx) | Catálogo con buscador (visual), Suspense, modo demo automático |

---

## Decisiones Técnicas Importantes

### Tailwind v3 + Webpack (no Turbopack)
Tailwind CSS v4 y Turbopack tienen incompatibilidades de parseo de CSS en esta versión de Next.js 16. Se optó por **Tailwind CSS v3 con Webpack** como bundler (`--webpack`), que es 100% estable. El servidor de desarrollo también usa webpack para consistencia.

> **Nota para Fase 2**: Cuando Turbopack soporte completamente Tailwind v4, se puede migrar eliminando `--webpack` de los scripts.

### Modo Demo Automático
Si las variables de entorno de Supabase no están configuradas (o tienen los valores de ejemplo), la app **detecta automáticamente** y muestra datos mock con un banner de aviso. No necesitas conectar Supabase para ver la interfaz funcionando.

### Arquitectura Multi-App
La estructura modular permite agregar `/gabycarros` y `/electronica` como nuevos módulos sin tocar `/casasgaby`. Cada módulo tiene su propio `layout.tsx` en `src/app/[modulo]/`.

---

## Paso Siguiente: Conectar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** y pega el contenido de [`supabase/schema.sql`](file:///c:/Users/PcKon/Documents/paginas-ventas/supabase/schema.sql)
3. Copia tus credenciales de **Project Settings → API** en [`.env.local`](file:///c:/Users/PcKon/Documents/paginas-ventas/.env.local):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   ```
4. Crea el bucket `fotos-casas` en **Storage** (público)
5. Ejecuta `npm run dev` y visita `http://localhost:3000`

---

## Para arrancar el servidor de desarrollo

```bash
npm run dev
# → http://localhost:3000        (Hub portal)
# → http://localhost:3000/casasgaby  (Catálogo de casas)
```
