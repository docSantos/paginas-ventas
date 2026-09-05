# Casas Gaby - Plataforma de Gestión de Reservas

Este repositorio contiene el código fuente de **Casas Gaby**, una plataforma web moderna para la cotización de propiedades, reserva de estancias y administración integral de alquileres vacacionales. 

Desarrollada con un enfoque altamente dinámico, esta aplicación permite a los usuarios cotizar su hospedaje en tiempo real, agregar servicios adicionales (tarifas fijas, por día, por trayecto y por kilómetro), y redirigir el flujo final hacia WhatsApp para el cierre. El panel de administración permite aprobar, cancelar y registrar los pagos (anticipos y comisiones) conectándose de manera segura a la base de datos.

---

## 🚀 Stack Tecnológico

- **Framework Front-end / Back-end:** Next.js 14+ (App Router)
- **Lenguaje:** TypeScript
- **Estilos e Interfaz:** Tailwind CSS, Lucide React (Iconos)
- **Base de Datos & Auth:** Supabase (PostgreSQL nativo con Row Level Security)
- **Estructuras Híbridas:** Persistencia avanzada mediante columnas `JSONB` de Postgres para los esquemas dinámicos (servicios extras, transacciones, etc.)

---

## ✨ Características Destacadas

### 1. Motor de Cotización Dinámica (Huésped)
- **Calculadora en tiempo real:** Estima el precio en base a noches seleccionadas y topes de ocupación.
- **Servicios Adicionales (Extras):** Agrega complementos como Renta de Auto o Traslados bajo múltiples modalidades configurables:
  - `por_dia` (limita la cantidad a los días de estancia).
  - `por_trayecto` (ida/vuelta).
  - `por_km` (rutas especiales).
  - `fijo` (pago único por reserva).
- **Notificación por WhatsApp:** Ensambla toda la estructura JSON de la cotización y abre nativamente la app de mensajería con la información del pre-registro lista para enviar.

### 2. Panel Administrativo In-App (Backoffice)
- **Gestión de Solicitudes:** Inbox centralizado con la información enviada por los huéspedes.
- **Conversión a Reserva:** Aprobación de la estadía con un solo clic. El módulo parsea de manera inteligente los servicios adicionales (`JSONB`) para agregarlos automáticamente a la reserva confirmada y su total.
- **Registro de Abonos y Comisiones:** Sistema que divide de forma autónoma la base del hospedaje respecto a los servicios extras, aplicando porcentajes y permitiendo abonos parciales, liquidación de la reserva y devoluciones.

---

## 🛠 Instalación y Despliegue Local

### Requisitos previos
- Node.js (v18+)
- npm / pnpm o yarn
- Proyecto activo en Supabase

### Pasos para iniciar

**1. Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd paginas-ventas
```

**2. Instalar las dependencias**
```bash
npm install
```

**3. Configurar Variables de Entorno**
Renombra o copia el archivo de variables de entorno de ejemplo:
```bash
cp .env.example .env.local
```
Abre `.env.local` y sustituye los valores con los correspondientes a tu proyecto de Supabase. Nunca expongas tu `SUPABASE_SERVICE_ROLE_KEY` en el cliente.

**4. Levantar el Servidor de Desarrollo**
```bash
npm run dev
```
La plataforma estará escuchando en [http://localhost:3000](http://localhost:3000).

---

## 🔒 Auditoría de Seguridad Aplicada
- El archivo `.gitignore` ha sido sanitizado.
- Las variables locales (`.env.local`, `.env`) no son rastreadas por git.
- Las llaves públicas y privadas consumen exclusivamente de `process.env`.
- **JSONB & Postgres:** Se usa Supabase SSR y Policies (RLS) para enmascarar transacciones cuando se requiere protección de filas por Tenant.
