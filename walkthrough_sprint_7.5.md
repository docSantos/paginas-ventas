# 🎯 Walkthrough Operativo: Sprint 7.5 (CRM Ágil)

Este documento detalla el recorrido operativo verificado tras el despliegue del Sprint 7.5 en Casas Gaby.

## a) Flujo de Prospectos (De la Web al CRM)
Cuando un usuario llena el formulario público de cotización, la solicitud ya no contamina el inventario de estancias confirmadas.
Ahora, la data aterriza exclusivamente en la tabla `hospedaje.solicitudes` y se renderiza en la nueva vista dedicada **Embudo CRM / Prospectos**. Este entorno proporciona a los agentes de venta una visibilidad limpia de todos los leads entrantes.

## b) Transición Fluida y Contacto One-Click (WhatsApp)
El tablero de prospectos opera bajo un sistema de 3 columnas (Por Contactar, En Seguimiento, Cerradas).
- Al ingresar un prospecto, se aloja en `Por Contactar`.
- El agente dispone de un botón directo de acción: **WhatsApp → Seguimiento**, el cual abre la API de WhatsApp con un mensaje pre-llenado saludando al cliente por su nombre y referenciando sus fechas.
- Al hacer clic en dicho botón, el sistema avanza automáticamente (y de manera silenciosa en el backend) la tarjeta hacia la etapa `En Seguimiento`.
- Las tarjetas pueden transicionarse libremente mediante su dropdown selector gracias a la liberación del check constraint de la base de datos.

## c) Cierre Financiero Atómico (Modal y Libro Mayor)
Cuando la venta es exitosa, el gestor presiona **Confirmar Reserva**.
- Se despliega un modal financiero avanzado que permite capturar el anticipo.
- Soporta conversión de divisas en tiempo real: al elegir USD, se ingresa la tasa de cambio del momento (ej. 16.00) y calcula el anticipo exacto sugerido.
- Cuenta con un **Catálogo de Servicios Acordeón** sin scrollbars intrusivos, que despliega los extras disponibles, calculando reactivamente el costo (ej. Renta Auto x Días, o Traslados por Trayecto).
- Al guardar, la operación es **atómica**: la solicitud pasa a `confirmada` (Cerradas), se inyecta la reserva formal en el inventario hotelero, y el ingreso se asienta irreversiblemente en `hospedaje.transacciones` para verse reflejado en el Libro Mayor global.

## d) Visualización de Estancias y Blindaje contra Colisiones
Para prevenir "overbookings" humanos:
- Mientras la tarjeta permanece en seguimiento, el CRM cruza iterativamente las fechas solicitadas del prospecto contra todo el calendario de reservas formalmente aprobadas.
- Si detecta un cruce real, alerta visualmente con un banner rojo (**Fechas ya no disponibles**).
- El algoritmo ha sido calibrado con matemática estricta (`<` y `>`) sobre formato `YYYY-MM-DD`, logrando que un check-out a las 11:00 AM y un check-in a las 3:00 PM del mismo día **no** detonen falsos positivos.
- Las solicitudes en etapa `Cerradas` ignoran inteligentemente esta validación para ahorrar procesamiento y evitar ruido visual.
