# Fase 5: CRM de Clientes y Sistema de Comisiones Dedicado

Esta fase integra la gestión formal de clientes (CRM) y el sistema avanzado de liquidación de comisiones haciendo uso de las tablas `comisiones` y `clientes` con sus esquemas exactos.

## 1. Sistema de Comisiones (Tabla Dedicada)
- **Aprobación de Reserva:** En el método `aprobarSolicitud`, se insertará el cálculo de comisión en la tabla `comisiones` mapeando los campos oficiales:
  - `reserva_id`, `propiedad_id`, `monto_estancia`
  - `porcentaje_comision` (2.5%) y `monto_comision`
  - `estado_pago`: `'pendiente'`
  - `fecha_reserva`
- **Liquidación de Comisión:** Nueva acción `registrarPagoComisionTabla` que reciba el monto y método de pago (`metodo_pago_comision`), actualice `monto_pagado` y si el monto liquidado es igual al total, cambie el `estado_pago` a `'liquidado'` y asigne la `fecha_liquidacion`.
- **Módulo de Finanzas:** Nueva pestaña de Liquidación de Comisiones con tabla interactiva y Modal para saldar saldos.

## 2. Directorio CRM de Clientes
- Dentro de `aprobarSolicitud`, usaremos un **Upsert** hacia la tabla `clientes` gracias al *CONSTRAINT* `cliente_telefono_unique (codigo_pais, telefono)`.
  - **Nuevo cliente:** Se inserta con `total_estancias = 1`, su nombre, email, teléfono, lada (`codigo_pais`) y `total_generado_mxn`.
  - **Cliente existente:** Se incrementa su `total_estancias`, se suma el nuevo `total_generado_mxn` y se actualiza `ultima_estancia`.
- **Nuevo Panel de Clientes:** Página interactiva en `/casasgaby/admin/clientes` con buscador y tarjetas detalladas mostrando LTV (Lifetime Value).

## 3. Navegación
- Se añadirá el botón **"Clientes"** con el ícono de `Users` en la barra inferior de administración.
