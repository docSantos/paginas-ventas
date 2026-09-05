// src/types/database.ts
// Tipos TypeScript generados del esquema de Supabase

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  central: {
    Tables: {
      transacciones_comisiones: {
        Row: {
          id: string
          created_at: string
          tenant_id: string
          origen_modulo: string
          referencia_id: string
          concepto: string | null
          monto_total: number
          porcentaje_comision: number
          monto_comision: number
          estado: string
        }
        Insert: any
        Update: any
      }
    }
  },
  hospedaje: {
    Tables: {
      propiedades: {
        Row: {
          id: string
          titulo: string
          descripcion: string | null
          precio_por_noche: number
          capacidad_personas: number
          amenidades: string[]
          fotos: string[]
          activa: boolean
          created_at: string
        }
        Insert: {
          id?: string
          titulo: string
          descripcion?: string | null
          precio_por_noche: number
          capacidad_personas: number
          amenidades?: string[]
          fotos?: string[]
          activa?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          descripcion?: string | null
          precio_por_noche?: number
          capacidad_personas?: number
          amenidades?: string[]
          fotos?: string[]
          activa?: boolean
          created_at?: string
        }
      }
      solicitudes: {
        Row: {
          id: string
          propiedad_id: string | null
          nombre_cliente: string
          email: string | null
          telefono: string
          fecha_entrada: string
          fecha_salida: string
          num_huespedes: number
          notas: string | null
          estado: 'Pendiente' | 'Aprobada' | 'Rechazada'
          created_at: string
        }
        Insert: {
          id?: string
          propiedad_id?: string | null
          nombre_cliente: string
          email?: string | null
          telefono: string
          fecha_entrada: string
          fecha_salida: string
          num_huespedes?: number
          notas?: string | null
          estado?: 'Pendiente' | 'Aprobada' | 'Rechazada'
          created_at?: string
        }
        Update: {
          id?: string
          propiedad_id?: string | null
          nombre_cliente?: string
          email?: string | null
          telefono?: string
          fecha_entrada?: string
          fecha_salida?: string
          num_huespedes?: number
          notas?: string | null
          estado?: 'Pendiente' | 'Aprobada' | 'Rechazada'
          created_at?: string
        }
      }
      reservas: {
        Row: {
          id: string
          propiedad_id: string | null
          nombre_cliente: string
          email: string | null
          telefono: string
          fecha_entrada: string
          fecha_salida: string
          costo_total: number
          monto_apartado: number
          estado: 'Activa' | 'Archivada'
          created_at: string
        }
        Insert: {
          id?: string
          propiedad_id?: string | null
          nombre_cliente: string
          email?: string | null
          telefono: string
          fecha_entrada: string
          fecha_salida: string
          costo_total: number
          monto_apartado?: number
          estado?: 'Activa' | 'Archivada'
          created_at?: string
        }
        Update: {
          id?: string
          propiedad_id?: string | null
          nombre_cliente?: string
          email?: string | null
          telefono?: string
          fecha_entrada?: string
          fecha_salida?: string
          costo_total?: number
          monto_apartado?: number
          estado?: 'Activa' | 'Archivada'
          created_at?: string
        }
      }
    }
  }
}
