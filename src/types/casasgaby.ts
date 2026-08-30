import type { Database } from './database'

// Tipos base de las tablas de Supabase
export type Propiedad = Database['public']['Tables']['propiedades']['Row'] & {
  precio_por_semana?: number | null
  precio_por_mes?: number | null
  amenidades_compartidas?: string[] | null
  ubicacion_maps_url?: string | null
}
export type PropiedadInsert = Database['public']['Tables']['propiedades']['Insert'] & {
  precio_por_semana?: number | null
  precio_por_mes?: number | null
  amenidades_compartidas?: string[] | null
  ubicacion_maps_url?: string | null
}
export type PropiedadUpdate = Database['public']['Tables']['propiedades']['Update'] & {
  precio_por_semana?: number | null
  precio_por_mes?: number | null
  amenidades_compartidas?: string[] | null
  ubicacion_maps_url?: string | null
}

export type Solicitud = Database['public']['Tables']['solicitudes']['Row'] & {
  noches?: number | null
  costo_total?: number | null
  monto_apartado?: number | null
}
export type SolicitudInsert = Database['public']['Tables']['solicitudes']['Insert'] & {
  noches?: number | null
  costo_total?: number | null
  monto_apartado?: number | null
}
export type SolicitudUpdate = Database['public']['Tables']['solicitudes']['Update'] & {
  noches?: number | null
  costo_total?: number | null
  monto_apartado?: number | null
}

export type Reserva = Database['public']['Tables']['reservas']['Row']
export type ReservaInsert = Database['public']['Tables']['reservas']['Insert']

export type EstadoSolicitud = 'Pendiente' | 'Aprobada' | 'Rechazada'
export type EstadoReserva = 'Activa' | 'Archivada'

export const ADMIN_WHATSAPP = '521234567890'

export const MOCK_PROPIEDADES: Propiedad[] = [
  {
    id: 'mock-1',
    titulo: 'Quinta Maretta: Casa Gaby',
    descripcion: 'Hermosa casa en fraccionamiento privado, zona muy segura. Ideal para familias que buscan relajarse en un entorno de paz. A tan solo 10 minutos de la playa principal.',
    precio_por_noche: 1500,
    precio_por_semana: 7000,
    precio_por_mes: 20000,
    capacidad_personas: 8,
    amenidades: ['Alberca', 'WiFi', 'Aire acondicionado', 'Cocina equipada', 'Estacionamiento', 'BBQ', 'Smart TV', 'Acceso a playa'],
    fotos: [],
    activa: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    titulo: 'Villa Puesta del Sol',
    descripcion: 'Lujosa villa con amplio jardín y alberca climatizada. Ideal para eventos familiares y escapadas románticas.',
    precio_por_noche: 4200,
    precio_por_semana: 25000,
    precio_por_mes: null,
    capacidad_personas: 12,
    amenidades: ['Alberca climatizada', 'Jacuzzi', 'WiFi', 'Aire acondicionado', 'Cocina gourmet', 'Estacionamiento doble', 'Terraza'],
    fotos: [],
    activa: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    titulo: 'Cabaña Montaña Verde',
    descripcion: 'Acogedora cabaña rodeada de naturaleza. Perfecta para quienes buscan desconectarse y reconectarse con el entorno natural.',
    precio_por_noche: 1800,
    precio_por_semana: 10000,
    precio_por_mes: 28000,
    capacidad_personas: 6,
    amenidades: ['WiFi', 'Chimenea', 'Cocina equipada', 'Estacionamiento', 'Terraza con vista a la montaña', 'Asador'],
    fotos: [],
    activa: true,
    created_at: new Date().toISOString(),
  },
]
