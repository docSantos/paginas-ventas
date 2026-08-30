'use client'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import type { Propiedad } from '@/types/casasgaby'
import { togglePropertyStatus, deleteProperty } from './actions'

export function PropertyListClient({ propiedades }: { propiedades: Propiedad[] }) {
  const router = useRouter()

  const handleToggleStatus = async (id: string, activa: boolean) => {
    try {
      await togglePropertyStatus(id, activa)
    } catch (e: any) {
      alert("Error al cambiar estado: " + e.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) return
    try {
      await deleteProperty(id)
    } catch (e: any) {
      alert("Error al eliminar: " + e.message)
    }
  }

  if (propiedades.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No hay propiedades registradas.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {propiedades.map(p => (
        <div key={p.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="h-40 bg-gray-100 relative">
            {p.fotos?.[0] ? (
              <img src={p.fotos[0]} alt={p.titulo} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">Sin foto</div>
            )}
            <div className="absolute top-2 right-2">
              <span className={`px-2 py-1 text-xs font-bold rounded-md ${p.activa ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                {p.activa ? 'Activa' : 'Oculta'}
              </span>
            </div>
          </div>
          <div className="p-4 flex-1">
            <h3 className="font-bold text-gray-900 leading-tight mb-1 line-clamp-2">{p.titulo}</h3>
            <p className="text-sm text-gray-500 mb-4">{formatPrice(p.precio_por_noche)} / noche</p>
            
            <div className="flex items-center gap-2 mt-auto">
              <Button 
                variant="outline" 
                className="flex-1 text-sm h-9"
                onClick={() => router.push(`/casasgaby/admin/propiedades/${p.id}/editar`)}
              >
                <Edit className="w-4 h-4 mr-2" /> Editar
              </Button>
              <Button 
                variant="outline" 
                className="w-9 h-9 p-0"
                title={p.activa ? "Ocultar del catálogo" : "Mostrar en catálogo"}
                onClick={() => handleToggleStatus(p.id, p.activa)}
              >
                {p.activa ? <EyeOff className="w-4 h-4 text-gray-600" /> : <Eye className="w-4 h-4 text-green-600" />}
              </Button>
              <Button 
                variant="outline" 
                className="w-9 h-9 p-0 hover:bg-red-50 hover:text-red-600"
                onClick={() => handleDelete(p.id)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
