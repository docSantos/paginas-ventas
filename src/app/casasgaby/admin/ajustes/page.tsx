'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import PhoneInputField from '@/components/PhoneInputField'
import { crearServicio, actualizarServicio, eliminarServicio } from '@/app/casasgaby/admin/actions'
import { Edit2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatPrice } from '@/lib/utils'
import { Plus, Trash2, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { COUNTRIES } from '@/lib/countries'
import { formatPhone, isPhoneValid, formatPhoneWithFlag } from '@/lib/utils'

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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  
  const [servicios, setServicios] = useState<any[]>([])
  const [modalServicio, setModalServicio] = useState<{ open: boolean, servicio: any | null }>({ open: false, servicio: null })
  const [servNombre, setServNombre] = useState('')
  const [servDesc, setServDesc] = useState('')
  const [servPrecio, setServPrecio] = useState('')
  const [servTipo, setServTipo] = useState('fijo')
  
  const loadServicios = async () => {
    const db = supabase as any
    const { data } = await db.from('catalogo_servicios').select('*').eq('tenant_id', 'casasgaby').order('created_at', { ascending: true })
    if (data) setServicios(data)
  }

  useEffect(() => {
    loadServicios()
  }, [])

  const handleSaveServicio = async () => {
    try {
      setSaving(true)
      if (modalServicio.servicio) {
        await actualizarServicio(modalServicio.servicio.id, {
          nombre: servNombre,
          descripcion: servDesc,
          precio_base: Number(servPrecio),
          tipo_tarifa: servTipo
        })
      } else {
        await crearServicio(servNombre, servDesc, Number(servPrecio), servTipo, true)
      }
      setModalServicio({ open: false, servicio: null })
      await loadServicios()
    } catch(e: any) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleServicio = async (id: string, activo: boolean) => {
    try {
      setSaving(true)
      await actualizarServicio(id, { activo })
      await loadServicios()
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteServicio = async (id: string) => {
    if (!confirm('¿Eliminar servicio?')) return
    try {
      setSaving(true)
      await eliminarServicio(id)
      await loadServicios()
    } finally {
      setSaving(false)
    }
  }

  const openServicioModal = (s: any = null) => {
    if (s) {
      setServNombre(s.nombre)
      setServDesc(s.descripcion || '')
      setServPrecio(String(s.precio_base))
      setServTipo(s.tipo_tarifa)
      setModalServicio({ open: true, servicio: s })
    } else {
      setServNombre('')
      setServDesc('')
      setServPrecio('')
      setServTipo('fijo')
      setModalServicio({ open: true, servicio: null })
    }
  }

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
    const rawNumber = nuevoNumero.replace(/\D/g, '')
    if (rawNumber.length < 10) return
    const fullNumber = rawNumber
    
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
            <div className="w-full sm:max-w-[280px]"><PhoneInputField value={nuevoNumero} onChange={setNuevoNumero} /></div>
            <Button onClick={addNumber} disabled={nuevoNumero.replace(/\D/g, "").length < 10 || saving} className="shrink-0 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Agregar
            </Button>
          </div>
          {nuevoNumero.length > 0 && nuevoNumero.replace(/\D/g, '').length < 10 && (
              <p className="text-xs text-red-500 mt-2">Ingresa un número válido (mínimo 10 dígitos)</p>
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
                    {formatPhoneWithFlag(tel.telefono)}
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

      {/* SECCIÓN SERVICIOS ESPECIALES */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">Catálogo de Servicios</h2>
            <p className="text-sm text-gray-600 mt-1">Gestiona servicios adicionales para agregar como cargos a las reservas.</p>
          </div>
          <Button onClick={() => openServicioModal()}>+ Agregar Servicio</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3">Servicio</th>
                <th className="px-4 py-3">Tarifa</th>
                <th className="px-4 py-3">Precio Base</th>
                <th className="px-4 py-3 text-center">% Comisión</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {servicios.length === 0 && (
                <tr><td colSpan={6} className="text-center py-4 text-gray-500">No hay servicios</td></tr>
              )}
              {servicios.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{s.nombre}</div>
                    <div className="text-xs text-gray-500">{s.descripcion}</div>
                  </td>
                  <td className="px-4 py-3 capitalize">{s.tipo_tarifa.replace('_', ' ')}</td>
                  <td className="px-4 py-3">{formatPrice(s.precio_base)}</td>
                  <td className="px-4 py-3 text-center font-medium text-purple-600">{s.porcentaje_comision ?? 5}%</td>
                  <td className="px-4 py-3 text-center">
                    <button 
                      onClick={() => toggleServicio(s.id, !s.activo)}
                      className={`px-2 py-0.5 rounded text-xs font-bold uppercase transition-colors ${s.activo ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      {s.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <button onClick={() => openServicioModal(s)} className="text-gray-400 hover:text-blue-600 p-1"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteServicio(s.id)} className="text-gray-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL SERVICIO */}
      <Dialog open={modalServicio.open} onOpenChange={o => setModalServicio(p => ({...p, open: o}))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalServicio.servicio ? 'Editar Servicio' : 'Nuevo Servicio'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium block mb-1">Nombre del Servicio</label>
              <Input value={servNombre} onChange={e => setServNombre(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Descripción</label>
              <Input value={servDesc} onChange={e => setServDesc(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Precio Base</label>
                <Input type="number" min="0" step="any" onKeyDown={e => e.key === '-' && e.preventDefault()} value={servPrecio} onChange={e => setServPrecio(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Tipo de Tarifa</label>
                <select className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm" value={servTipo} onChange={e => setServTipo(e.target.value)}>
                  <option value="fijo">Fijo</option>
                  <option value="por_dia">Por Día / Cantidad</option>
                  <option value="por_km">Por Km</option>
                  <option value="negociable">Negociable</option>
                </select>
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 mt-2">
              <span className="text-sm font-medium text-purple-900 block mb-0.5">Comisión de servicio 5%</span>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setModalServicio(p => ({...p, open: false}))} className="flex-1">Cancelar</Button>
              <Button onClick={handleSaveServicio} className="flex-1" disabled={saving}>Guardar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      </div>
    </div>
  )
}
