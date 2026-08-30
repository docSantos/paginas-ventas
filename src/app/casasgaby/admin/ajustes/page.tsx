'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Telefono {
  id: string
  etiqueta: string
  telefono: string
  activo: boolean
}

export default function AjustesClient() {
  const [telefonos, setTelefonos] = useState<Telefono[]>([])
  const [nuevoNumero, setNuevoNumero] = useState('')
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  const loadConfig = async () => {
    const db = supabase as any
    const { data, error } = await db
      .from('configuracion_telefonos')
      .select('*')
      .order('created_at', { ascending: true })
      
    if (data) {
      setTelefonos(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadConfig()
  }, [])

  const addNumber = async () => {
    if (nuevoNumero.length !== 10) return
    const fullNumber = `52${nuevoNumero}`
    
    // Check if already exists
    if (telefonos.some(t => t.telefono === fullNumber)) return

    setSaving(true)
    const db = supabase as any
    const isFirst = telefonos.length === 0

    const { error } = await db
      .from('configuracion_telefonos')
      .insert({
        etiqueta: nuevaEtiqueta || 'WhatsApp',
        telefono: fullNumber,
        activo: isFirst
      })
      
    setNuevoNumero('')
    setNuevaEtiqueta('')
    await loadConfig()
    setSaving(false)
  }

  const removeNumber = async (id: string) => {
    setSaving(true)
    const db = supabase as any
    await db.from('configuracion_telefonos').delete().eq('id', id)
    
    // If we deleted the active one, make another one active if exists
    const deletedWasActive = telefonos.find(t => t.id === id)?.activo
    const remaining = telefonos.filter(t => t.id !== id)
    
    if (deletedWasActive && remaining.length > 0) {
      await db.from('configuracion_telefonos').update({ activo: true }).eq('id', remaining[0].id)
    }
    
    await loadConfig()
    setSaving(false)
  }

  const setActivo = async (id: string) => {
    setSaving(true)
    const db = supabase as any
    
    // Set all to false
    await db.from('configuracion_telefonos').update({ activo: false }).neq('id', id)
    // Set selected to true
    await db.from('configuracion_telefonos').update({ activo: true }).eq('id', id)
    
    await loadConfig()
    setSaving(false)
  }

  if (loading) return <div>Cargando ajustes...</div>

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ajustes Generales</h1>
        <p className="text-gray-500 mt-1">Configura las variables globales de Casas Gaby.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Phone className="w-5 h-5 text-teal-600" />
          Números de WhatsApp
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Agrega los números telefónicos a los que quieres que lleguen las solicitudes de reserva. Selecciona uno para activarlo en la página pública.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Input 
            placeholder="Etiqueta (ej. Ventas, Soporte)"
            value={nuevaEtiqueta}
            onChange={e => setNuevaEtiqueta(e.target.value)}
            className="w-full sm:max-w-[200px]"
            maxLength={30}
          />
          <div className="relative flex items-center w-full sm:max-w-[240px]">
            <div className="absolute left-3 flex items-center gap-1.5 text-gray-500 font-medium select-none pointer-events-none">
              <span className="text-lg leading-none">🇲🇽</span>
              <span>+52</span>
            </div>
            <Input 
              placeholder="1234567890"
              className="pl-[4.5rem]"
              maxLength={10}
              value={nuevoNumero}
              onChange={e => setNuevoNumero(e.target.value.replace(/\D/g,''))}
            />
          </div>
          <Button onClick={addNumber} disabled={nuevoNumero.length !== 10 || saving} className="shrink-0 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" /> Agregar
          </Button>
        </div>

        <div className="space-y-3">
          {telefonos.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">No hay números configurados.</p>
          )}
          {telefonos.map(tel => (
            <div key={tel.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border gap-3 ${tel.activo ? 'border-teal-500 bg-teal-50' : 'border-gray-200'}`}>
              <label className="flex items-center gap-3 cursor-pointer grow">
                <input 
                  type="radio" 
                  name="active_wa"
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  checked={tel.activo}
                  onChange={() => setActivo(tel.id)}
                  disabled={saving}
                />
                <div>
                  <div className="font-medium text-gray-900">
                    🇲🇽 +52 {tel.telefono.startsWith('52') ? tel.telefono.slice(2) : tel.telefono}
                  </div>
                  {tel.etiqueta && <div className="text-xs text-gray-500">{tel.etiqueta}</div>}
                </div>
                {tel.activo && <span className="text-[10px] sm:text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold uppercase ml-auto sm:ml-2">Activo</span>}
              </label>
              <button 
                onClick={() => removeNumber(tel.id)}
                disabled={saving}
                className="text-gray-400 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition-colors self-end sm:self-auto"
                title="Eliminar número"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
