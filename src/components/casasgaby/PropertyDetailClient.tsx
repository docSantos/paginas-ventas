'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { ArrowLeft, Users, CheckCircle2, MessageCircle, AlertCircle, Share2, BedDouble, Send, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { calculateStayTotal } from '@/lib/pricing'
import { formatPrice, formatDateEs } from '@/lib/utils'
import type { Propiedad, Reserva } from '@/types/casasgaby'

interface PropertyDetailClientProps {
  propiedad: Propiedad
  isDemo?: boolean
  reservas?: Pick<Reserva, 'fecha_entrada' | 'fecha_salida'>[]
  adminPhone?: string
}

const AMENIDAD_ICONS: Record<string, string> = {
  'alberca': '🏊',
  'wifi': '📶',
  'cocina': '🍳',
  'estacionamiento': '🚗',
  'bbq': '🍖',
  'asador': '🍖',
  'jacuzzi': '🛁',
  'chimenea': '🔥',
  'terraza': '🌅',
  'smart tv': '📺',
  'aire acondicionado': '❄️',
  'playa': '🏖️'
}

function getAmenidadIcon(amenidad: string): string {
  const key = Object.keys(AMENIDAD_ICONS).find(k =>
    amenidad.toLowerCase().includes(k)
  )
  return key ? AMENIDAD_ICONS[key] : '✨'
}

export function PropertyDetailClient({ propiedad, isDemo = false, reservas = [], adminPhone }: PropertyDetailClientProps) {
  const router = useRouter()
  const [fechaEntrada, setFechaEntrada] = useState('')
  const [fechaSalida, setFechaSalida] = useState('')
  const [huespedes, setHuespedes] = useState(1)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ nombre: '', telefono: '', correo: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorFechas, setErrorFechas] = useState('')

  const cotizacion = useMemo(() => {
    setErrorFechas('')
    if (!fechaEntrada || !fechaSalida) return null
    
    const start = new Date(fechaEntrada)
    const end = new Date(fechaSalida)
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null
    
    const diffTime = end.getTime() - start.getTime()
    const noches = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (noches <= 0) {
      setErrorFechas('La fecha de salida debe ser posterior a la de llegada')
      return null
    }

    // Validación de fechas ocupadas
    const isOccupied = reservas.some(r => {
      const rStart = new Date(r.fecha_entrada).getTime()
      const rEnd = new Date(r.fecha_salida).getTime()
      const s = start.getTime()
      const e = end.getTime()
      // Hay traslape si el inicio deseado es antes del fin de la reserva Y el fin deseado es después del inicio de la reserva
      return (s < rEnd && e > rStart)
    })

    if (isOccupied) {
      setErrorFechas('Las fechas seleccionadas no están disponibles')
      return null
    }

    const { total, breakdown, anticipo } = calculateStayTotal(
      noches, 
      propiedad.precio_por_noche, 
      propiedad.precio_por_semana || undefined, 
      propiedad.precio_por_mes || undefined
    )

    return { noches, total, breakdown, anticipo }
  }, [fechaEntrada, fechaSalida, propiedad.precio_por_noche, propiedad.precio_por_semana, propiedad.precio_por_mes, reservas])

  const handleReservaClick = () => {
    if (!fechaEntrada || !fechaSalida) {
      alert("Por favor selecciona tus fechas de llegada y salida")
      return
    }
    if (errorFechas || !cotizacion) {
      alert("Por favor corrige las fechas antes de continuar")
      return
    }
    setIsModalOpen(true)
  }

  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cotizacion) return
    setIsSubmitting(true)

    try {
      // 1. Guardar solicitud en la API
      await fetch('/api/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propiedad_id: propiedad.id,
          titulo_propiedad: propiedad.titulo,
          nombre_cliente: formData.nombre,
          telefono: `52${formData.telefono}`,
          email: formData.correo,
          fecha_entrada: fechaEntrada,
          fecha_salida: fechaSalida,
          num_huespedes: huespedes,
          noches: cotizacion.noches,
          costo_total: cotizacion.total,
          monto_apartado: cotizacion.anticipo
        })
      })

      // 2. Redirigir a WhatsApp
      const finalAdminPhone = adminPhone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "529981424300"
      const text = `Hola, me interesa revisar disponibilidad para:
*${propiedad.titulo}*

*Mis datos:*
Nombre: ${formData.nombre}
Teléfono: ${formData.telefono}

*Estadía:*
Llegada: ${fechaEntrada}
Salida: ${fechaSalida}
Huéspedes: ${huespedes} (${cotizacion.breakdown})

*Cotización sugerida:*
Total: ${formatPrice(cotizacion.total)}
Anticipo (50%): ${formatPrice(cotizacion.anticipo)}

¿Tienen disponibilidad?`
      
      const whatsappUrl = `https://wa.me/${finalAdminPhone}?text=${encodeURIComponent(text)}`
      window.open(whatsappUrl, '_blank')
      
      setIsModalOpen(false)
    } catch (err) {
      alert('Error al procesar la solicitud')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: propiedad.titulo,
        text: `Mira esta increíble casa vacacional: ${propiedad.titulo}`,
        url: window.location.href,
      }).catch(console.error)
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Enlace copiado al portapapeles")
    }
  }

  const fotoPrincipal = propiedad.fotos?.[0]
  const fotosExtra = propiedad.fotos?.slice(1, 3) || []

  return (
    <div className="bg-white min-h-screen">
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button 
          onClick={() => router.back()} 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button 
          onClick={handleShare}
          className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Share2 className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {isDemo && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 text-center">
          <strong>Modo demo:</strong> Mostrando datos de prueba.
        </div>
      )}

      {/* Galería de fotos (simplificada) */}
      <div className="px-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
          {fotoPrincipal ? (
             <Image src={fotoPrincipal} alt="Foto Principal" fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <BedDouble className="w-12 h-12 mb-2" />
              <span className="text-sm font-medium">Sin foto principal</span>
            </div>
          )}
        </div>
        {fotosExtra.length > 0 && (
          <div className="hidden md:grid grid-rows-2 gap-2">
            {fotosExtra.map((f, i) => (
              <div key={i} className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-100">
                <Image src={f} alt={`Foto ${i+2}`} fill className="object-cover" sizes="50vw" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-2 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
            {propiedad.titulo}
          </h1>
          <div className="flex items-center text-sm text-gray-600 gap-4">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-teal-600" />
              <span>{propiedad.capacidad_personas} huéspedes máx</span>
            </div>
            {propiedad.activa && (
              <div className="flex items-center gap-1.5 text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-medium text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Disponible
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-gray-600 text-sm leading-relaxed">
            {propiedad.descripcion || "Sin descripción detallada disponible."}
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-3 text-gray-900">Lo que ofrece este lugar</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-800 mb-3 text-sm">En la casa</h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                {propiedad.amenidades.map((amenidad) => (
                  <div key={amenidad} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-lg w-6 text-center">{getAmenidadIcon(amenidad)}</span>
                    <span className="truncate">{amenidad}</span>
                  </div>
                ))}
                {propiedad.amenidades.length === 0 && (
                  <p className="text-sm text-gray-500">No hay amenidades privadas listadas.</p>
                )}
              </div>
            </div>

            {propiedad.amenidades_compartidas && propiedad.amenidades_compartidas.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-800 mb-3 text-sm">Áreas compartidas (Fraccionamiento)</h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                  {propiedad.amenidades_compartidas.map((amenidad) => (
                    <div key={`comp-${amenidad}`} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-lg w-6 text-center">{getAmenidadIcon(amenidad)}</span>
                      <span className="truncate">{amenidad}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-3 text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-600" />
            Ubicación
          </h2>
          {propiedad.ubicacion_maps_url ? (
            <a 
              href={propiedad.ubicacion_maps_url} 
              target="_blank" 
              rel="noreferrer"
              className="text-sm text-teal-600 hover:underline mb-3 block flex items-center gap-1"
            >
              Abrir ubicación en Google Maps
            </a>
          ) : (
            <p className="text-sm text-gray-500 mb-3">La ubicación específica se comparte al reservar.</p>
          )}
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

          {reservas.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 text-sm rounded-xl border border-red-100">
              <p className="font-semibold mb-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Fechas ocupadas:</p>
                <ul className="list-disc pl-5 space-y-0.5 text-xs">
                  {reservas.map((r, i) => (
                    <li key={i}>{formatDateEs(r.fecha_entrada)} al {formatDateEs(r.fecha_salida)}</li>
                  ))}
                </ul>
            </div>
          )}

          {cotizacion && !errorFechas && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-gray-600 text-sm mb-2">
                <span>{cotizacion.breakdown}</span>
                <span>{formatPrice(cotizacion.total)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-lg">
                <span>Total estimado</span>
                <span>{formatPrice(cotizacion.total)}</span>
              </div>
              <p className="text-xs text-teal-700 mt-1 font-medium bg-teal-50 inline-block px-2 py-1 rounded-md">
                Anticipo para reservar: {formatPrice(cotizacion.anticipo)} (50%)
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] flex items-center justify-between z-40 max-w-2xl mx-auto shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col">
          <span className="font-bold text-lg text-gray-900 leading-none">{formatPrice(propiedad.precio_por_noche)}</span>
          <span className="text-xs text-gray-500 mt-1">/ noche base</span>
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
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Teléfono (WhatsApp)
                </label>
                <div className="relative flex items-center w-full">
                  <div className="absolute left-3 flex items-center gap-1.5 text-gray-500 font-medium select-none pointer-events-none">
                    <span className="text-lg leading-none">🇲🇽</span>
                    <span>+52</span>
                  </div>
                  <Input 
                    type="tel" 
                    required 
                    maxLength={10}
                    placeholder="1234567890"
                    className="pl-[4.5rem]"
                    value={formData.telefono}
                    onChange={e => setFormData({...formData, telefono: e.target.value.replace(/\D/g,'')})}
                  />
                </div>
              </div>
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
