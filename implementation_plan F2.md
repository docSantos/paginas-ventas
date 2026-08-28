# Plan de Implementación - Fase 2: Detalles, Cotizador y Reservas

Este plan detalla la construcción de la Fase 2 para el módulo **Casas Gaby**, centrándose en la experiencia de usuario móvil, la visualización de detalles de las propiedades y el flujo de conversión hacia reservas vía WhatsApp.

---

## 1. Alcance de la Fase 2

1. **Página de Detalle de Propiedad (`/casasgaby/propiedad/[id]`)**:
   - Visualización detallada de una casa vacacional específica.
   - Galería de imágenes tipo carrusel optimizada para gestos táctiles (mobile-first).
   - Ficha técnica completa con amenidades, descripción y reglas/ubicación general.

2. **Cotizador Dinámico y Selector de Fechas**:
   - Formulario para seleccionar Fechas de Entrada y Salida.
   - Contador de huéspedes.
   - Cálculo reactivo del precio total basado en noches y anticipo sugerido.

3. **Flujo de Reserva y Modal de Captura**:
   - Barra inferior fija (Sticky Bottom Bar) exclusiva para la vista de detalle con el precio por noche y botón principal de llamada a la acción.
   - Modal (Dialog) para capturar Nombre, Teléfono y Correo antes de contactar.
   - Generación de enlace de WhatsApp con mensaje pre-llenado con todos los detalles de la cotización.
   - Inserción de la petición en la base de datos Supabase (tabla `solicitudes`) o en memoria si está en modo demo.

---

## 2. Componentes Nuevos y Modificados

### 2.1 Archivos a Crear
- `src/app/casasgaby/propiedad/[id]/page.tsx`: Página Server Component que obtiene los datos de la propiedad (desde Supabase o Mock) y maneja el estado de "404 Not Found" si no existe.
- `src/components/casasgaby/PropertyDetailClient.tsx`: Client Component principal que envolverá la interactividad de la página (carrusel, selector de fechas, modal).
- `src/components/casasgaby/DateRangePicker.tsx`: Componente de selección de fechas (usando inputs nativos de tipo date por simplicidad móvil o un calendario simple).
- `src/components/casasgaby/ReservationModal.tsx`: Modal para la captura de datos del cliente antes de redirigir a WhatsApp.

### 2.2 Archivos a Modificar
- `src/types/casasgaby.ts`: Agregar constante con el número de teléfono de WhatsApp administrador para enviar los mensajes.
- `src/components/ui/dialog.tsx` o similar (se implementará un componente Modal genérico o se reutilizará estado nativo simple para mantenerlo ligero).

---

## 3. Lógica del Cotizador y WhatsApp

**Fórmula de Cotización:**
- `Noches = FechaSalida - FechaEntrada` (Min. 1 noche)
- `Total = Noches * PrecioPorNoche`
- `Anticipo (50%) = Total * 0.50`

**Mensaje de WhatsApp Generado:**
> "¡Hola! Me interesa reservar *[Título de la Casa]* del *[Fecha Check-in]* al *[Fecha Check-out]* ([N] noches) para [N] personas. Total cotizado: *$[Monto]*. ¿Está disponible?"

---

## 4. Open Questions / Decisiones Requeridas

> [!IMPORTANT]
> **Preguntas para el usuario:**
> 1. ¿Deseas un número de WhatsApp específico configurado por ahora, o dejamos un número de prueba (`+520000000000`) que luego puedas cambiar en el código?
> 2. Para el selector de fechas, en móviles es mucho más fluido usar los `<input type="date">` nativos del sistema operativo (iOS/Android). ¿Estás de acuerdo con usar los inputs nativos para garantizar la mejor experiencia móvil?

---

## 5. Plan de Verificación

- [ ] Verificar que la navegación desde la tarjeta del catálogo al detalle de la propiedad sea fluida.
- [ ] Validar que el carrusel de imágenes responda correctamente o muestre placeholder si no hay fotos.
- [ ] Confirmar que el cálculo matemático de noches y precio funcione en tiempo real al cambiar fechas.
- [ ] Comprobar que el registro de la solicitud guarde los datos en consola (o Supabase si ya configuraste `.env.local`).
- [ ] Validar el formato correcto del enlace `wa.me` generado para WhatsApp.
