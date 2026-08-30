### Fase 3: Panel de Administración y Gestión (`/casasgaby/admin`)

1. **Autenticación y Seguridad (Supabase Auth):**
   - Vista de inicio de sesión (`/casasgaby/admin/login`) con correo/contraseña o Magic Link.
   - Middleware / protección de rutas para restringir el acceso a `/casasgaby/admin/*` exclusivamente a usuarios administradores autenticados.
   - Manejo de sesión activa y botón de cierre de sesión (Logout).

2. **Gestión de Propiedades (CRUD):**
   - **Dashboard / Listado:** Tabla o tarjetas de administración con todas las propiedades (activas e inactivas), precio, capacidad y accesos directos de acción (Editar / Pausar / Eliminar).
   - **Formulario de Creación y Edición (`/casasgaby/admin/propiedades/nueva` y `.../[id]/editar`):**
     - Campos: Título, descripción, precio por noche, capacidad máxima de huéspedes.
     - Selector múltiple de amenidades con checkboxes / tags (WiFi, alberca, aire acondicionado, BBQ, etc.).
     - Switch de estado: Activa / Oculta del catálogo público.

3. **Subida y Gestión de Fotos (Supabase Storage):**
   - Componente de subida de imágenes arrastrar y soltar (Drag & Drop) y selector de archivos.
   - Carga directa de imágenes al bucket `fotos-casas` de Supabase Storage.
   - Generación y almacenamiento de URLs públicas en el array `fotos` de la tabla `propiedades`.
   - Previsualización en miniatura con opción de reordenar y eliminar fotos.

4. **Gestión de Solicitudes y Calendario de Reservas:**
   - **Bandeja de Solicitudes:** Vista de leads entrantes desde la web/WhatsApp con estado (`Pendiente`, `Aprobada`, `Rechazada`).
   - Acciones rápidas: Botón para aprobar solicitud (convirtiéndola en reserva activa) o rechazarla.
   - **Calendario / Bloqueo de Fechas:** Visualizador de fechas ocupadas por casa con opción de bloquear días manualmente por mantenimiento o apartado externo.
