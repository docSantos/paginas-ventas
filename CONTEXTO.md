# 🧠 CASAS GABY - CONTEXTO MAESTRO (BRAIN)

Este documento sirve como el único punto de referencia condensado de arquitectura, lógica de negocio y estado del proyecto. Debe leerse para obtener el contexto inmediato del sistema.

## 🏗️ ARQUITECTURA Y STACK
- **Framework:** Next.js (App Router) con TypeScript (`src/app/casasgaby`).
- **Styling:** Tailwind CSS + UI Components basados en shadcn (en `src/components/ui`).
- **Backend / Auth / BD:** Supabase (Client: `src/lib/supabase/client.ts`, Server: `src/lib/supabase/server.ts`).
- **Arquitectura Multitenant:** Existen esquemas cruzados: `hospedaje` (operaciones de casas) y `central` (transacciones y reglas globales multi-inquilino).

## 📊 MÓDULOS PRINCIPALES
1. **Embudo CRM (Prospectos/Solicitudes):** 
   - Tabla: `hospedaje.solicitudes`. 
   - Lógica: Flujo de ventas visual (Por Contactar -> En Seguimiento -> Cerradas). Bloqueo de cruces de fechas. Contacto One-Click (WhatsApp).
2. **Reservas (Bookings):** 
   - Tabla: `hospedaje.reservas`. 
   - Lógica: Módulo donde un prospecto confirmado se asienta como reserva. Modificación de fechas inmutable (registrada en `historial_modificaciones`).
3. **Operación (In-House):**
   - Panel de control en vivo para recepción. Administra Check-in, Check-out, Check-out Anticipado y liquidación de servicios extras/ajustes.
4. **Finanzas (Libro Mayor):**
   - Tabla: `hospedaje.transacciones`, `hospedaje.comisiones`, `central.transacciones_comisiones`.
   - Lógica: Flujo de caja real. El `totalHistorico` y `ingresosMesActual` no sufren doble deducción de comisiones. Las comisiones y reembolsos se restan estrictamente contra los ingresos brutos cobrados.
5. **Propiedades y Catálogo:**
   - Tabla: `hospedaje.propiedades`, `hospedaje.catalogo_servicios`.

## ⚙️ REGLAS DE ORO DEL CÓDIGO (¡Obligatorias!)
1. **Cero Hardcodeo:** Prohibido multiplicar días de estancia ciegamente en frontend (`precio * 7`). Toda tarifa se calcula dinámicamente consultando la BD y pasando por `src/lib/pricing.ts`.
2. **Robustez de Cadenas (Mojibake):** Los campos libres en base de datos (`concepto`, `categoria`) suelen traer acentos o codificación rota. Toda evaluación condicional sobre estos textos **debe** pasar por `.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()`.
3. **Flujo de Caja Real (Ledger Logic):** Los reembolsos al huésped o pagos a gestores (`tipo === 'egreso'`) se deducen del ingreso bruto. No se inventan deducciones. Todo recae sobre el array de transacciones.
4. **Transparencia en Mutaciones:** Todo llamado a Supabase debe validar `const { data, error }`. En operaciones contables se invoca revalidación masiva: `revalidatePath('/casasgaby/admin/...')`.

## 📌 SITUACIÓN ACTUAL (Últimas implementaciones)
- El historial inmutable de fechas (`historial_modificaciones`) está conectado a los modales de Reservas y Operación.
- Los módulos operativos del Dashboard Admin replican paridad de interfaz visual (Ej. Bloque Detalles de Cliente con banderas de países en WhatsApp).
- La lógica de finanzas (`FinanzasClient.tsx`) calcula y divide correctamente "Ingresos Brutos", "Egresos" y "Neto" usando el historial real de transacciones sin deducciones dobles.

---
**Instrucción al Agente:**
Al iniciar una nueva sesión, leer este archivo `CONTEXTO.md` es suficiente para comprender el sistema base. Puedes ignorar los antiguos archivos `walkthrough_*.md` o `Mapa*.md`.
