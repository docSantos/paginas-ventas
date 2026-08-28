'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Users, BedDouble, Info, Check, Send, MessageCircle, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { formatPrice, calcularNoches, cn } from '@/lib/utils'
import { ADMIN_WHATSAPP } from '@/types/casasgaby'
import type { Propiedad } from '@/types/casasgaby'

const AMENIDAD_ICONS: Record<string, string> = {
  'alberca': '🏊', 'wifi': '📶', 'aire acondicionado': '❄️', 'cocina': '🍳', 
  'estacionamiento': '🚗', 'bbq': '🔥', 'asador': '🔥', 'jacuzzi': '🛁', 
  'chimenea': '🪵', 'terraza': '🌿', 'smart tv': '📺', 'playa': '🏖️'
}

function getAmenidadIcon(amenidad: string): string {
  const key = Object.keys(AMENIDAD_ICONS).find(k => amenidad.toLowerCase().includes(k))
  return key ? AMENIDAD_ICONS[key] : '✨'
}

// Fechas bloqueadas simuladas para demostración
const FECHAS_BLOQUEADAS = [
  { inicio: '2026-09-05', fin: '2026-09-10' }
]

function isFechasSolapadas(entrada: string, salida: string) {
  const checkIn = new Date(entrada).getTime()
  const checkOut = new Date(salida).getTime()

  for (const bloque of FECHAS_BLOQUEADAS) {
    const blockStart = new Date(bloque.inicio).getTime()
    const blockEnd = new Date(bloque.fin).getTime()
    // Si alguna fecha se cruza
    if (checkIn <= blockEnd && checkOut >= blockStart) {
      return true
    }
  }
  return false
}

interface PropertyDetailClientProps {
  propiedad: Propiedad
  isDemo: boolean
}

export function PropertyDetailClient({ propiedad, isDemo }: PropertyDetailClientProps) {
  const router = useRouter()
  const fotoUrl = propiedad.fotos?.[0] ?? null
  
  const [fechaEntrada, setFechaEntrada] = useState<string>('')
  const [fechaSalida, setFechaSalida] = useState<string>('')
  const [huespedes, setHuespedes] = useState<number>(2)
  const [noches, setNoches] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  const [errorFechas, setErrorFechas] = useState<string>('')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ nombre: '', telefono: '', correo: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setErrorFechas('')
    if (fechaEntrada && fechaSalida) {
      if (new Date(fechaSalida) <= new Date(fechaEntrada)) {
        setErrorFechas('La fecha de salida debe ser posterior a la llegada.')
        setNoches(0)
        setTotal(0)
        return
      }

      if (isFechasSolapadas(fechaEntrada, fechaSalida)) {
        setErrorFechas('Las fechas seleccionadas no están disponibles (Ej. 5 al 10 sep 2026).')
        setNoches(0)
        setTotal(0)
        return
      }

      const n = calcularNoches(fechaEntrada, fechaSalida)
      if (n > 0) {
        setNoches(n)
        setTotal(n * propiedad.precio_por_noche)
      } else {
        setNoches(0)
        setTotal(0)
      }
    } else {
      setNoches(0)
      setTotal(0)
    }
  }, [fechaEntrada, fechaSalida, propiedad.precio_por_noche])

  const handleReservaClick = () => {
    if (!fechaEntrada || !fechaSalida) {
      alert("Por favor selecciona las fechas de tu estadía antes de reservar.")
      return
    }
    if (errorFechas) {
      alert("Corrige las fechas seleccionadas.")
      return
    }
    if (noches <= 0) {
      alert("La fecha de salida debe ser posterior a la de entrada.")
      return
    }
    if (huespedes > propiedad.capacidad_personas) {
      alert(`La capacidad máxima es de ${propiedad.capacidad_personas} personas.`)
      return
    }
    setIsModalOpen(true)
  }

  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!isDemo) {
       // TODO: Insert into Supabase table 'solicitudes'
    } else {
       await new Promise(r => setTimeout(r, 800))
    }

    const anticipo = total * 0.50
    const mensaje = `¡Hola! Me interesa reservar *${propiedad.titulo}* del *${fechaEntrada}* al *${fechaSalida}* (${noches} noches) para ${huespedes} personas.\n\n💰 *Cotización estimada:*\nTotal: ${formatPrice(total)}\nAnticipo sugerido (50%): ${formatPrice(anticipo)}\n\nMi nombre es ${formData.nombre}. ¿Está disponible la casa para estas fechas?`

    const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(mensaje)}`
    
    setIsSubmitting(false)
    setIsModalOpen(false)
    window.open(url, '_blank')
  }

  return (
    <div className="bg-white min-h-screen pb-28">
      <div className="absolute top-4 left-4 z-10">
        <button 
          onClick={() => router.back()}
          className="bg-white/90 backdrop-blur p-2 rounded-full shadow-sm text-gray-700 hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="relative h-[35vh] min-h-[250px] bg-teal-100 w-full overflow-hidden">
        {fotoUrl ? (
          <Image
            src={fotoUrl}
            alt={propiedad.titulo}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-teal-400">
            <BedDouble className="w-16 h-16" />
          </div>
        )}
      </div>

      <div className="px-5 py-6 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {propiedad.titulo}
          </h1>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-teal-600" />
              <span>Hasta {propiedad.capacidad_personas} huéspedes</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-2 text-gray-900">Acerca de esta casa</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {propiedad.descripcion || "Sin descripción detallada disponible."}
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-3 text-gray-900">Lo que ofrece este lugar</h2>
          <div className="grid grid-cols-2 gap-y-3 gap-x-2">
            {propiedad.amenidades.map((amenidad) => (
              <div key={amenidad} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-lg w-6 text-center">{getAmenidadIcon(amenidad)}</span>
                <span className="truncate">{amenidad}</span>
              </div>
            ))}
            {propiedad.amenidades.length === 0 && (
              <p className="text-sm text-gray-500">No hay amenidades listadas.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-3 text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-600" />
            Ubicación
          </h2>
          <a 
            href="https://maps.app.goo.gl/ZQLDjaYdrezsHpFL8" 
            target="_blank" 
            rel="noreferrer"
            className="text-sm text-teal-600 hover:underline mb-3 block flex items-center gap-1"
          >
            Quinta Maretta, Puerto Morelos, Q.R. (Ver en Google Maps)
          </a>
          <div className="w-full h-48 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
            <iframe 
              src="https://www.google.com/maps?q=Quinta+Maretta,+Puerto+Morelos,+Quintana+Roo&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de ubicación"
            ></iframe>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-lg mb-3 text-gray-900">Cotiza tu estadía</h2>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Input 
              type="date" 
              label="Llegada" 
              value={fechaEntrada}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFechaEntrada(e.target.value)}
            />
            <Input 
              type="date" 
              label="Salida"
              value={fechaSalida}
              min={fechaEntrada || new Date().toISOString().split('T')[0]}
              onChange={(e) => setFechaSalida(e.target.value)}
            />
          </div>

          {errorFechas && (
            <div className="mb-4 p-2.5 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2 border border-red-100">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{errorFechas}</p>
            </div>
          )}
          
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Huéspedes (Máx. {propiedad.capacidad_personas})
            </label>
            <div className="flex items-center gap-4">
              <button 
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-xl text-gray-600 bg-white"
                onClick={() => setHuespedes(Math.max(1, huespedes - 1))}
              >-</button>
              <span className="font-medium text-lg w-4 text-center">{huespedes}</span>
              <button 
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-xl text-gray-600 bg-white"
                onClick={() => setHuespedes(Math.min(propiedad.capacidad_personas, huespedes + 1))}
              >+</button>
            </div>
          </div>

          {noches > 0 && !errorFechas && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-gray-600 text-sm mb-2">
                <span>{formatPrice(propiedad.precio_por_noche)} × {noches} noches</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-lg">
                <span>Total estimado</span>
                <span>{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-teal-700 mt-1 font-medium bg-teal-50 inline-block px-2 py-1 rounded-md">
                Anticipo para reservar: {formatPrice(total * 0.50)} (50%)
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] flex items-center justify-between z-40 max-w-2xl mx-auto shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col">
          <span className="font-bold text-lg text-gray-900 leading-none">{formatPrice(propiedad.precio_por_noche)}</span>
          <span className="text-xs text-gray-500 mt-1">/ noche</span>
        </div>
        <Button 
          onClick={handleReservaClick} 
          className="px-6 shadow-md bg-[#25D366] hover:bg-[#1ebd5c] active:bg-[#1a9a4b] text-white"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Reservar
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogHeader>
          <DialogTitle>Solicitar Reserva</DialogTitle>
          <DialogClose onClick={() => setIsModalOpen(false)} />
        </DialogHeader>
        <DialogContent>
          <p className="text-sm text-gray-600 mb-4">
            Ingresa tus datos para enviarle los detalles a Casas Gaby por WhatsApp.
          </p>
          <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
            <Input 
              label="Nombre completo" 
              required 
              placeholder="Ej. Juan Pérez"
              value={formData.nombre}
              onChange={e => setFormData({...formData, nombre: e.target.value})}
            />
            <Input 
              label="Teléfono" 
              type="tel" 
              required 
              placeholder="Tu número de celular"
              value={formData.telefono}
              onChange={e => setFormData({...formData, telefono: e.target.value})}
            />
            <Input 
              label="Correo electrónico (opcional)" 
              type="email" 
              placeholder="tucorreo@ejemplo.com"
              value={formData.correo}
              onChange={e => setFormData({...formData, correo: e.target.value})}
            />
            
            <Button type="submit" className="w-full mt-2 bg-[#25D366] hover:bg-[#1ebd5c] text-white" isLoading={isSubmitting}>
              <Send className="w-4 h-4 mr-2" />
              Enviar solicitud por WhatsApp
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
