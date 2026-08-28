// src/types/casasgaby.ts
// Interfaces de dominio para el módulo Casas Gaby
// Derivadas de los tipos de base de datos para uso conveniente en componentes

import type { Database } from './database'

// Tipos base de las tablas de Supabase
export type Propiedad = Database['public']['Tables']['propiedades']['Row']
export type PropiedadInsert = Database['public']['Tables']['propiedades']['Insert']
export type PropiedadUpdate = Database['public']['Tables']['propiedades']['Update']

export type Solicitud = Database['public']['Tables']['solicitudes']['Row']
export type SolicitudInsert = Database['public']['Tables']['solicitudes']['Insert']

export type Reserva = Database['public']['Tables']['reservas']['Row']
export type ReservaInsert = Database['public']['Tables']['reservas']['Insert']

// Estados disponibles
export type EstadoSolicitud = 'Pendiente' | 'Aprobada' | 'Rechazada'
export type EstadoReserva = 'Activa' | 'Archivada'

// Datos de prueba / mock para modo demo (cuando Supabase no está configurado)
export const MOCK_PROPIEDADES: Propiedad[] = [
  {
    id: 'mock-1',
    titulo: 'Casa Brisa del Mar',
    descripcion: 'Hermosa casa frente al mar con vista panorámica al océano. Perfecta para familias que buscan descanso y tranquilidad. A 5 minutos caminando de la playa principal.',
    precio_por_noche: 2500,
    capacidad_personas: 8,
    amenidades: ['Alberca privada', 'WiFi', 'Aire acondicionado', 'Cocina equipada', 'Estacionamiento', 'BBQ', 'Smart TV'],
    fotos: [],
    activa: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    titulo: 'Villa Puesta del Sol',
    descripcion: 'Lujosa villa con amplio jardín y alberca climatizada. Ideal para eventos familiares y escapadas románticas.',
    precio_por_noche: 4200,
    capacidad_personas: 12,
    amenidades: ['Alberca climatizada', 'Jacuzzi', 'WiFi', 'Cocina gourmet', 'Estacionamiento doble', 'Terraza'],
    fotos: [],
    activa: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    titulo: 'Cabaña Montaña Verde',
    descripcion: 'Acogedora cabaña rodeada de naturaleza. Perfecta para quienes buscan desconectarse y reconectarse con el entorno natural.',
    precio_por_noche: 1800,
    capacidad_personas: 6,
    amenidades: ['WiFi', 'Chimenea', 'Cocina equipada', 'Estacionamiento', 'Terraza con vista a la montaña'],
    fotos: [],
    activa: true,
    created_at: new Date().toISOString(),
  },
]
