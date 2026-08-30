'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { COUNTRIES } from '@/lib/countries'
import { formatPhone, isPhoneValid } from '@/lib/utils'

interface Telefono {
  id: string
  etiqueta: string
  telefono: string
  activo: boolean
}

const getPhoneDisplay = (phone: string) => {
  const sortedCountries = [...COUNTRIES]
    .filter(c => c.code !== 'separator')
    .sort((a, b) => b.code.length - a.code.length)
  
  const country = sortedCountries.find(c => phone.startsWith(c.code))
  
  if (country) {
    return `${country.flag} +${country.code} ${phone.slice(country.code.length)}`
  }
  return `+${phone}`
}

export default function AjustesClient() {
  const [telefonos, setTelefonos] = useState<Telefono[]>([])
  const [nuevoNumero, setNuevoNumero] = useState('')
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('')
  const [lada, setLada] = useState('52')
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
    if (!isPhoneValid(nuevoNumero, lada)) return
    
    const cleanNumber = nuevoNumero.replace(/\D/g, '')
    const fullNumber = `${lada}${cleanNumber}`
    
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

          <div className="flex flex-col sm:flex-row gap-3">
            <Input 
              placeholder="Etiqueta (ej. Ventas, Recepción)"
              value={nuevaEtiqueta}
              onChange={e => setNuevaEtiqueta(e.target.value)}
              className="w-full sm:max-w-[200px]"
            />
            <div className="flex w-full sm:max-w-[280px]">
              <select
                className="h-11 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 px-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 max-w-[120px]"
                value={lada}
                onChange={(e) => {
                  const newLada = e.target.value
                  setLada(newLada)
                  setNuevoNumero(formatPhone(nuevoNumero, newLada))
                }}
              >
                {COUNTRIES.map((country, idx) => (
                  country.code === 'separator' ? (
                    <option key={`sep-${idx}`} disabled>──────────</option>
                  ) : (
                    <option key={`${country.code}-${country.name}`} value={country.code}>
                      {country.flag} +{country.code} ({country.name})
                    </option>
                  )
                ))}
              </select>
              <Input 
                placeholder="1234567890"
                className="rounded-l-none pl-3"
                value={nuevoNumero}
                onChange={e => setNuevoNumero(formatPhone(e.target.value, lada))}
              />
            </div>
            <Button onClick={addNumber} disabled={!isPhoneValid(nuevoNumero, lada) || saving} className="shrink-0 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Agregar
            </Button>
          </div>
          {nuevoNumero.length > 0 && !isPhoneValid(nuevoNumero, lada) && (
            <p className="text-xs text-red-500 mt-2">Ingresa un número válido ({lada === '52' || lada === '1' ? '10' : '8-15'} dígitos)</p>
          )}

        <div className="space-y-3 mt-6">
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
                    {getPhoneDisplay(tel.telefono)}
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
