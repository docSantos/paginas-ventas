# Mapa1.md: Plan Maestro y Directivas del Agente (Casas Gaby)

---

## PARTE 1: System Prompt del Agente de Ventas (Para n8n)

> Ubicación: Nodo AI Agent / System Message dentro del flujo de n8n.

Eres "Sofía", la Concierge y Asesora de Ventas digital de Casas Gaby, una exclusiva colección de villas y casas vacacionales en el Caribe Mexicano.

TU OBJETIVO PRINCIPAL:
Atender a los turistas con calidez y hospitalidad, responder dudas sobre las propiedades, verificar disponibilidad en tiempo real y cerrar la mayor cantidad de prospectos calificados para que aparten su estancia.

PERSONALIDAD Y TONO:
- Tono cálido, servicial, profesional y entusiasta (vibra de anfitrión caribeño).
- Respuestas concisas, bien estructuradas y fáciles de leer en dispositivos móviles (evita párrafos gigantes).
- Siempre orientada a la acción y al cierre de la reserva.

HERRAMIENTAS A TU DISPOSICIÓN:
1. consultar_propiedades: Obtiene la lista de casas activas, fotos, amenidades y capacidad.
2. verificar_disponibilidad(propiedad_id, fecha_entrada, fecha_salida): Revisa en la base de datos si las fechas están libres.
3. calcular_cotizacion(precio_por_noche, noches): Calcula el total de la estancia y el anticipo requerido (50%).
4. registrar_solicitud(propiedad_id, nombre, telefono, email, fecha_entrada, fecha_salida, num_huespedes): Guarda los datos en el sistema para que la administradora los contacte de inmediato.

FLUJO DE CONVERSACIÓN Y TÉCNICAS DE VENTA:
1. IDENTIFICACIÓN DE NECESIDADES:
   - Si el usuario llega preguntando en general, pregunta: "¿Cuántas personas te acompañan y qué fechas tienes en mente para disfrutar del Caribe?".
2. RECOMENDACIÓN Y VALOR:
   - Presenta la casa adecuada destacando sus amenidades clave (alberca, aire acondicionado, cercanía a la playa).
3. VERIFICACIÓN Y COTIZACIÓN:
   - Consulta disponibilidad con tu herramienta antes de confirmar fechas.
   - Si están disponibles: "¡Excelentes noticias! Esas fechas están libres. La estancia de X noches tiene un total de $Y MXN. Con solo $Z MXN (50%) puedes asegurar tu apartado hoy mismo".
   - Si NO están disponibles: Ofrece fechas alternativas cercanas o sugiérele otra de nuestras casas disponibles.
4. CIERRE (CALL TO ACTION):
   - Nunca termines una respuesta en punto muerto. Pregunta: "¿Te gustaría que bloquee estas fechas a tu nombre antes de que alguien más las gane? Solo compárteme tu nombre completo y número de WhatsApp".
5. REGISTRO Y DESPEDIDA:
   - Una vez obtenidos los datos, ejecuta registrar_solicitud y dile al cliente: "¡Listo, [Nombre]! He registrado tu solicitud de apartado. En unos minutos nuestra administradora te enviará los datos bancarios a tu WhatsApp para formalizar tu reserva. ¡Nos vemos pronto en el paraíso!".

---

## PARTE 2: Plan Maestro de Implementación (Google Antigravity)

# IMPLEMENTATION_PLAN.md
# Proyecto: Web App de Gestión y Renta de Casas Vacacionales (Mobile-First)

## 1. Visión General del Proyecto
Desarrollar una aplicación web responsiva (Mobile-First) bajo la subruta `/casasgaby`, diseñada para la promoción, cotización y gestión de casas vacacionales. La arquitectura debe permitir albergar futuras aplicaciones independientes dentro del mismo repositorio (ej. `/gabycarros`, `/electronica`).

### Stack Tecnológico:
- Framework: Next.js (App Router, TypeScript)
- Estilos: Tailwind CSS + Lucide Icons + componentes accesibles (estilo shadcn/ui)
- Base de Datos & Auth: Supabase (PostgreSQL + Supabase Auth)
- Almacenamiento: Supabase Storage (Bucket para fotos de alta resolución)
- Integraciones: Webhook / Widget de Chatbot conectado a n8n

---

## 2. Esquema de Base de Datos y Storage (Supabase)

### A. Storage Bucket
- Nombre: `fotos-casas` (Público para lectura de imágenes, escritura restringida a usuarios autenticados).

### B. Tablas SQL

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

---

## 3. Estructura de Rutas y Archivos

app/
├── casasgaby/
│   ├── page.tsx                     # Landing pública Mobile-First (Catálogo + Verificador + Chatbot)
│   ├── layout.tsx                   # Layout con Navbar y Footer temático caribeño
│   ├── admin/
│   │   ├── page.tsx                 # Dashboard principal del Administrador
│   │   ├── login/
│   │   │   └── page.tsx             # Pantalla de acceso protegida (Supabase Auth)
│   │   └── propiedades/
│   │       └── page.tsx             # CRUD de casas y subida de fotos a Storage
components/
├── casasgaby/
│   ├── PropertyCard.tsx             # Tarjeta con carrusel táctil de fotos
│   ├── PublicAvailabilityChecker.tsx # Verificador de fechas para turistas
│   ├── BookingRequestModal.tsx      # Formulario modal de solicitud de reserva
│   ├── ChatWidget.tsx               # Widget flotante conectado a n8n
│   ├── AdminDateCollisionChecker.tsx# Formulario de verificación y bloqueo manual
│   ├── AdminCalendarView.tsx        # Calendario con precios y colores alternados
│   ├── RequestsListTable.tsx        # Tabla de solicitudes con botón [Aprobar] / [Rechazar]
│   └── ReservationsDataTable.tsx    # Tabla con Editar, Cancelar, Archivar y Restablecer
lib/
├── supabaseClient.ts                # Inicialización del cliente Supabase
└── utils.ts                         # Helpers de fechas y cálculo de colisiones

---

## 4. Fases de Implementación Paso a Paso

### FASE 1: Configuración Inicial y Conexión Supabase
- Inicializar cliente Supabase (@supabase/supabase-js, @supabase/ssr).
- Configurar variables de entorno (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY).
- Crear funciones auxiliares para validar solapamiento de fechas:
  - Regla de colisión: (EntradaSolicitada < SalidaReserva) AND (SalidaSolicitada > EntradaReserva).

### FASE 2: Módulo de Gestión de Casas y Fotos (Admin)
- Listado de Propiedades: Vista en grid responsivo con switch para activar/desactivar visibilidad pública.
- Subida de Fotos con Supabase Storage:
  - Componente Drag & Drop / Selección desde móvil.
  - Vista previa miniatura con opción de eliminar foto individual.
  - Carga de imágenes al bucket fotos-casas y guardado de las URLs públicas en el array fotos de la tabla propiedades.
- Formulario de Propiedad: Campos para título, descripción, precio por noche, capacidad y selección rápida de amenidades (Alberca, Wifi, A/C, Vista al Mar, etc.).

### FASE 3: Landing Page Pública (Mobile-First)
- Header & Hero: Diseño fresco y moderno con temática vacacional caribeña.
- Catálogo de Propiedades: Carrusel de fotos táctil con swipe para dispositivos móviles.
- Barra Verificadora de Disponibilidad:
  - Selección de Fecha Entrada y Fecha Salida.
  - Consulta reactiva a Supabase.
  - Si está libre: Muestra badge verde con botón "Apartar Estancia" (abre BookingRequestModal).
  - Si está ocupada: Notificación clara sugiriendo cambiar de fechas o elegir otra propiedad activa.
- Chatbot de Ventas: Widget flotante en la esquina inferior derecha con ventana de chat colapsable conectada a webhook.

### FASE 4: Módulo de Bloqueo Manual con Validación de Colisiones (Admin)
- Selector de Casa activa.
- Bloque 1 (Verificador de Fechas):
  - Inputs Fecha Entrada y Fecha Salida + Botón "Verificar Disponibilidad".
- Bloque 2 (Formulario de Captura):
  - Estado Inicial / Ocupado: Formulario en gris (deshabilitado, opacidad 50%).
  - Si hay colisión: Muestra banner rojo de alerta con los datos de la reserva que interfiere (Nombre, Teléfono, Fechas).
  - Si está libre: Se habilita inmediatamente para capturar: Nombre del Huésped, Teléfono, Correo, Costo Total y Anticipo Recibido. Al dar clic en "Confirmar y Bloquear", inserta en la tabla reservas con estado Activa.

### FASE 5: Calendario Visual y Gestión de Reservas (Admin)
- Calendario Mensual Interactivo:
  - Navegación mes por mes con flechas [<-] y [->].
  - Días Libres: Fondo blanco limpio.
  - Días Ocupados: Bloques coloreados con alternancia de tonos.
  - Precios en celda: Mostrar monto total o precio diario dentro del bloque ocupado.
- Bandeja de Solicitudes:
  - Lista de solicitudes recibidas desde web pública o chatbot.
  - Botón [Aprobar y Bloquear] y Botón [Rechazar].
- Tabla de Reservas Activas e Históricas:
  - Columnas: Fechas, Huésped, Teléfono, Total, Apartado, Estado.
  - Botones de acción: Editar, Cancelar, Archivar y Restablecer.

### FASE 6: Integración del Chatbot con n8n
- Crear componente ChatWidget.tsx con avatar de "Sofía".
- Conexión vía webhook POST hacia n8n.
- Respuestas con indicador de escritura.

---

## 5. Criterios de Aceptación y Pruebas
- Mobile Experience: 100% operable a una sola mano en smartphones.
- Seguridad: Lectura pública restringida únicamente a disponibilidad e info general de casas.
- Cero Doble Reserva: Bloqueo estricto a nivel de verificación y base de datos.