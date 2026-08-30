'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, ArrowLeft, Loader2 } from 'lucide-react'
import type { Propiedad } from '@/types/casasgaby'
import { saveProperty } from '../actions'
import { ImageUploader } from '@/components/casasgaby/admin/ImageUploader'

const TODAS_AMENIDADES = [
  'WiFi', 'Alberca', 'Alberca climatizada', 'Aire acondicionado', 
  'Cocina equipada', 'Cocina gourmet', 'Estacionamiento', 
  'Estacionamiento doble', 'BBQ', 'Asador', 'Jacuzzi', 
  'Chimenea', 'Terraza', 'Smart TV', 'Acceso a playa'
]

export function PropertyForm({ initialData }: { initialData?: Propiedad }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    titulo: initialData?.titulo || '',
    descripcion: initialData?.descripcion || '',
    precio_por_noche: initialData?.precio_por_noche || '',
    precio_por_semana: initialData?.precio_por_semana || '',
    precio_por_mes: initialData?.precio_por_mes || '',
    capacidad_personas: initialData?.capacidad_personas || '',
    activa: initialData ? initialData.activa : true,
    amenidades: initialData?.amenidades || [] as string[],
    amenidades_compartidas: initialData?.amenidades_compartidas || [] as string[],
    ubicacion_maps_url: initialData?.ubicacion_maps_url || '',
    fotos: initialData?.fotos || [] as string[]
  })

  const toggleAmenidad = (amenidad: string, type: 'privadas' | 'compartidas' = 'privadas') => {
    if (type === 'privadas') {
      setFormData(prev => {
        const exists = prev.amenidades.includes(amenidad)
        if (exists) return { ...prev, amenidades: prev.amenidades.filter(a => a !== amenidad) }
        return { ...prev, amenidades: [...prev.amenidades, amenidad] }
      })
    } else {
      setFormData(prev => {
        const exists = prev.amenidades_compartidas.includes(amenidad)
        if (exists) return { ...prev, amenidades_compartidas: prev.amenidades_compartidas.filter(a => a !== amenidad) }
        return { ...prev, amenidades_compartidas: [...prev.amenidades_compartidas, amenidad] }
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const dataToSave = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        precio_por_noche: Number(formData.precio_por_noche),
        precio_por_semana: formData.precio_por_semana ? Number(formData.precio_por_semana) : null,
        precio_por_mes: formData.precio_por_mes ? Number(formData.precio_por_mes) : null,
        capacidad_personas: Number(formData.capacidad_personas),
        activa: formData.activa,
        amenidades: formData.amenidades,
        amenidades_compartidas: formData.amenidades_compartidas,
        ubicacion_maps_url: formData.ubicacion_maps_url ? formData.ubicacion_maps_url : null,
        fotos: formData.fotos
      }
      
      await saveProperty(dataToSave, initialData?.id)
      router.push('/casasgaby/admin')
    } catch (e: any) {
      alert("Error al guardar: " + e.message)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl pb-24">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Información Básica</h3>
        
        <div className="space-y-4">
          <Input 
            label="Título de la Propiedad" 
            required 
            value={formData.titulo}
            onChange={e => setFormData({...formData, titulo: e.target.value})}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
            <textarea 
              className="w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3 border"
              rows={4}
              required
              value={formData.descripcion}
              onChange={e => setFormData({...formData, descripcion: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Capacidad (Personas)" 
              type="number" 
              required 
              min={1}
              value={formData.capacidad_personas}
              onChange={e => setFormData({...formData, capacidad_personas: e.target.value})}
            />
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded text-teal-600 focus:ring-teal-500 w-5 h-5"
                  checked={formData.activa}
                  onChange={e => setFormData({...formData, activa: e.target.checked})}
                />
                <span className="text-sm font-medium text-gray-900">Activa (Visible al público)</span>
              </label>
            </div>
          </div>
          
          <Input 
            label="Ubicación (Enlace de Google Maps)" 
            type="url"
            placeholder="Ej: https://maps.app.goo.gl/..."
            value={formData.ubicacion_maps_url}
            onChange={e => setFormData({...formData, ubicacion_maps_url: e.target.value})}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Tarifas y Precios (MXN)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input 
            label="Precio por Noche *" 
            type="number" 
            required 
            min={1}
            value={formData.precio_por_noche}
            onChange={e => setFormData({...formData, precio_por_noche: e.target.value})}
          />
          <Input 
            label="Precio por Semana (Opcional)" 
            type="number"
            value={formData.precio_por_semana}
            onChange={e => setFormData({...formData, precio_por_semana: e.target.value})}
          />
          <Input 
            label="Precio por Mes (Opcional)" 
            type="number"
            value={formData.precio_por_mes}
            onChange={e => setFormData({...formData, precio_por_mes: e.target.value})}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Amenidades en Casa (Privadas)</h3>
        <div className="flex flex-wrap gap-2">
          {TODAS_AMENIDADES.map(amenidad => {
            const isSelected = formData.amenidades.includes(amenidad)
            return (
              <button
                key={amenidad}
                type="button"
                onClick={() => toggleAmenidad(amenidad, 'privadas')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  isSelected 
                    ? 'bg-teal-100 border-teal-200 text-teal-800' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {amenidad}
              </button>
            )
          })}
        </div>

        <h3 className="text-lg font-bold text-gray-900 border-b pb-2 pt-4">Amenidades Compartidas (Fraccionamiento)</h3>
        <div className="flex flex-wrap gap-2">
          {TODAS_AMENIDADES.map(amenidad => {
            const isSelected = formData.amenidades_compartidas.includes(amenidad)
            return (
              <button
                key={amenidad}
                type="button"
                onClick={() => toggleAmenidad(amenidad, 'compartidas')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  isSelected 
                    ? 'bg-blue-100 border-blue-200 text-blue-800' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {amenidad}
              </button>
            )
          })}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Fotos de la Casa</h3>
        <ImageUploader 
          initialFotos={formData.fotos} 
          onChange={(newFotos) => setFormData(prev => ({...prev, fotos: newFotos}))}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-teal-600 hover:bg-teal-700 text-white min-w-32">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Guardar Casa</>}
        </Button>
      </div>
    </form>
  )
}
