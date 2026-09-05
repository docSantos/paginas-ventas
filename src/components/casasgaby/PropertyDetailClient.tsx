'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ArrowLeft, Users, CheckCircle2, MessageCircle, AlertCircle, Share2, BedDouble, Send, MapPin, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { calculateStayTotal } from '@/lib/pricing'
import { COUNTRIES } from '@/lib/countries'
import { formatPrice, formatDateEs, formatPhone, isPhoneValid } from '@/lib/utils'
import type { Propiedad, Reserva } from '@/types/casasgaby'

interface PropertyDetailClientProps {
  propiedad: Propiedad
  isDemo?: boolean
  reservas?: Pick<Reserva, 'fecha_entrada' | 'fecha_salida'>[]
  adminPhone?: string
  servicios?: any[]
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

export function PropertyDetailClient({ propiedad, isDemo = false, reservas = [], adminPhone, servicios = [] }: PropertyDetailClientProps) {
  console.log('Servicios recibidos en cliente:', servicios);
  const router = useRouter()
  const [fechaEntrada, setFechaEntrada] = useState('')
  const [fechaSalida, setFechaSalida] = useState('')
  const [huespedes, setHuespedes] = useState(1)
  const [selectedExtras, setSelectedExtras] = useState<Record<string, any>>({})
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ nombre: '', telefono: '', correo: '' })
  const [lada, setLada] = useState('52')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)
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

    let extrasTotal = 0;
    Object.keys(selectedExtras).forEach(servId => {
      const serv = servicios.find((s: any) => s.id === servId);
      const val = selectedExtras[servId];
      if (serv && val && val.activo) {
        if (serv.tipo_tarifa === 'por_dia') {
          extrasTotal += Number(serv.precio_base) * (val.qty || 1);
        } else if (serv.tipo_tarifa === 'por_trayecto') {
          let count = 0;
          if (val.ida) count++;
          if (val.vuelta) count++;
          extrasTotal += Number(serv.precio_base) * count;
        } else {
          extrasTotal += Number(serv.precio_base);
        }
      }
    });

    const { total, breakdown, anticipo } = calculateStayTotal(
      noches, 
      propiedad.precio_por_noche, 
      propiedad.precio_por_semana || undefined, 
      propiedad.precio_por_mes || undefined
    )

    const finalTotal = total + extrasTotal;
    const finalAnticipo = finalTotal / 2;

    return { noches, total: finalTotal, breakdown, anticipo: finalAnticipo, extrasTotal }
  }, [fechaEntrada, fechaSalida, propiedad.precio_por_noche, propiedad.precio_por_semana, propiedad.precio_por_mes, reservas, selectedExtras, servicios])

  const handleReservaClick = () => {
    if (!fechaEntrada || !fechaSalida) {
      alert("Por favor selecciona tus fechas de llegada y salida")
      return
    }
    if (errorFechas || !cotizacion) {
      alert("Las fechas seleccionadas no están disponibles. Por favor consulta el recuadro de 'Fechas ocupadas' y elige otro período.")
      return
    }
    setIsModalOpen(true)
  }

  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!cotizacion) return
    setIsSubmitting(true)

    const serviciosExtraPayload = Object.keys(selectedExtras)
      .filter(id => selectedExtras[id]?.activo)
      .map(id => {
        const s = servicios.find((x: any) => x.id === id);
        if (!s) return null;
        const val = selectedExtras[id];
        let finalQty = 1;
        let finalName = s.nombre;
        if (s.tipo_tarifa === 'por_dia') {
          finalQty = val.qty || 1;
        } else if (s.tipo_tarifa === 'por_trayecto') {
          finalQty = (val.ida ? 1 : 0) + (val.vuelta ? 1 : 0);
          if (finalQty === 0) return null;
          if (val.ida && val.vuelta) finalName += ' (Ida y Vuelta)';
          else if (val.ida) finalName += ' (Ida)';
          else if (val.vuelta) finalName += ' (Vuelta)';
        }
        return {
          id,
          qty: finalQty,
          nombre: finalName,
          precio_base: s.precio_base,
          tipo_tarifa: s.tipo_tarifa
        }
      }).filter(Boolean);

    try {
      // 1. Guardar solicitud en la API
      console.log('PAYLOAD A ENVIAR:', {
          propiedad_id: propiedad.id,
          titulo_propiedad: propiedad.titulo,
          nombre_cliente: formData.nombre,
          telefono: `${lada}${formData.telefono.replace(/\D/g, '')}`,
          email: formData.correo,
          fecha_entrada: fechaEntrada,
          fecha_salida: fechaSalida,
          num_huespedes: huespedes,
          noches: cotizacion.noches,
          costo_total: cotizacion.total,
          monto_apartado: cotizacion.anticipo,
          servicios_extra: serviciosExtraPayload
        });
        await fetch('/api/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propiedad_id: propiedad.id,
          titulo_propiedad: propiedad.titulo,
          nombre_cliente: formData.nombre,
          telefono: `${lada}${formData.telefono.replace(/\D/g, '')}`,
          email: formData.correo,
          fecha_entrada: fechaEntrada,
          fecha_salida: fechaSalida,
          num_huespedes: huespedes,
          noches: cotizacion.noches,
          costo_total: cotizacion.total,
          monto_apartado: cotizacion.anticipo,
            servicios_extra: serviciosExtraPayload
        })
      })

      // 2. Redirigir a WhatsApp
      const finalAdminPhone = adminPhone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "529981424300"
      const text = `Hola, me interesa revisar disponibilidad para:
*${propiedad.titulo}*

*Mis datos:*
Nombre: ${formData.nombre}
Teléfono: +${lada} ${formData.telefono}

*Estadía:*
Llegada: ${fechaEntrada}
Salida: ${fechaSalida}
Huéspedes: ${huespedes} (${cotizacion.breakdown})
  ${serviciosExtraPayload.length > 0 ? `\n  *Servicios Extra:*\n  ${serviciosExtraPayload.map((s: any) => `- ${s.nombre} (x${s.qty})`).join('\n  ')}\n` : ''}
  *Cotización sugerida:*
Total: ${formatPrice(cotizacion.total)}
Anticipo (50%): ${formatPrice(cotizacion.anticipo)}

¿Tienen disponibilidad?`
      
      const whatsappUrl = `https://wa.me/${finalAdminPhone}?text=${encodeURIComponent(text)}`
      window.open(whatsappUrl, '_blank')
      
      setIsModalOpen(false)
      setShowSuccessBanner(true)
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

        {showSuccessBanner ? (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-emerald-100 text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">¡Solicitud Enviada con Éxito!</h3>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                Se ha abierto WhatsApp para continuar tu confirmación. Además, hemos registrado tu solicitud en el sistema y te atenderemos enseguida.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setFechaEntrada('')
                  setFechaSalida('')
                  setHuespedes(1)
                  setSelectedExtras({})
                  setFormData({ nombre: '', telefono: '', correo: '' })
                  setShowSuccessBanner(false)
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition"
              >
                Cotizar una nueva solicitud
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-lg mb-3 text-gray-900">Cotiza tu estadía</h2>
          
          {/* 1. Inputs de Fechas */}
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
          
          {/* 2. Fechas Ocupadas */}
          {reservas && reservas.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 text-sm rounded-xl border border-red-100">
              <p className="font-semibold mb-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Fechas ocupadas:</p>
                <ul className="list-disc pl-5 space-y-0.5 text-xs">
                  {reservas.map((r: any, i: number) => (
                    <li key={i}>{formatDateEs(r.fecha_entrada)} al {formatDateEs(r.fecha_salida)}</li>
                  ))}
                </ul>
            </div>
          )}

          {/* 3. Selector de Huéspedes */}
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

          {/* 4. Servicios Extra */}
          {servicios && servicios.length > 0 && (
            <div className="mb-4 pt-4 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Personaliza tu estancia con servicios extra
              </label>
              <div className="space-y-3">
                {servicios.map((serv: any) => {
                  const state = selectedExtras[serv.id] || {};
                  const isSelected = !!state.activo;
                  
                  return (
                    <div key={serv.id} className={`p-3 border rounded-xl flex flex-col gap-3 transition-colors ${isSelected ? 'bg-teal-50 border-teal-200' : 'bg-white border-gray-200'}`}>
                      <div className="flex items-start gap-3">
                        {serv.tipo_tarifa !== 'por_trayecto' && (
                          <input 
                            type="checkbox"
                            className="mt-1 rounded text-teal-600 focus:ring-teal-500"
                            checked={isSelected}
                            onChange={(e) => {
                              setSelectedExtras((prev: any) => ({
                                ...prev,
                                [serv.id]: { 
                                  ...prev[serv.id], 
                                  activo: e.target.checked,
                                  qty: e.target.checked ? Math.max(1, prev[serv.id]?.qty || 1) : 0
                                }
                              }))
                            }}
                          />
                        )}
                                                <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{serv.nombre}</p>
                          <p className="text-xs text-gray-500">
                            {serv.tipo_tarifa === 'por_dia' ? 'Por día' : 
                             (serv.tipo_tarifa === 'por_trayecto' ? 'Por trayecto' : 
                             (serv.tipo_tarifa === 'por_km' ? 'Saliendo de Puerto Morelos. Ref: Pto Morelos - Xcaret aprox. 43 km (a cotizar según destino final).' : 'Pago único'))}
                          </p>
                        </div>
                        <div className="text-right">
                          {serv.tipo_tarifa === 'por_km' ? (
                             <>
                               <p className="text-sm font-semibold text-teal-700">Desde {formatPrice(serv.precio_base)}</p>
                               <p className="text-[10px] text-gray-400">/ km</p>
                             </>
                          ) : (
                             <>
                               <p className="text-sm font-semibold text-teal-700">+{formatPrice(serv.precio_base)}</p>
                               <p className="text-[10px] text-gray-400">
                                 {serv.tipo_tarifa === 'por_dia' ? 'x día' : (serv.tipo_tarifa === 'por_trayecto' ? 'c/u' : 'Total')}
                               </p>
                             </>
                          )}
                        </div>
                      </div>
                      
                      {/* Controles para por_dia */}
                      {isSelected && serv.tipo_tarifa === 'por_dia' && (
                        <div className="ml-7 flex items-center justify-between gap-3 bg-white p-2 rounded-lg border border-teal-100">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-medium text-gray-700">Días de renta:</span>
                            <div className="flex items-center gap-2">
                              <button type="button" className="w-7 h-7 rounded-md border border-gray-300 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100" onClick={() => setSelectedExtras((prev: any) => ({...prev, [serv.id]: { ...prev[serv.id], qty: Math.max(1, (prev[serv.id]?.qty || 1) - 1)}}))}>-</button>
                              <span className="text-sm font-bold w-4 text-center">{state.qty || 1}</span>
                              <button type="button" className="w-7 h-7 rounded-md border border-gray-300 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100" onClick={() => setSelectedExtras((prev: any) => ({...prev, [serv.id]: { ...prev[serv.id], qty: Math.min(cotizacion?.noches || 1, (prev[serv.id]?.qty || 1) + 1)}}))}>+</button>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-teal-800">
                            Subtotal: {formatPrice(Number(serv.precio_base) * (state.qty || 1))}
                          </span>
                        </div>
                      )}

                      {/* Controles para por_trayecto */}
                      {serv.tipo_tarifa === 'por_trayecto' && (
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200">
                            <input 
                              type="checkbox"
                              className="rounded text-teal-600 focus:ring-teal-500"
                              checked={!!state.ida}
                              onChange={(e) => {
                                const newVal = e.target.checked;
                                setSelectedExtras((prev: any) => {
                                  const old = prev[serv.id] || {};
                                  const isAnyActive = newVal || old.vuelta;
                                  return {
                                    ...prev,
                                    [serv.id]: { ...old, ida: newVal, activo: isAnyActive }
                                  }
                                })
                              }}
                            />
                            Ida (Aeropuerto / Origen &rarr; Casa)
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200">
                            <input 
                              type="checkbox"
                              className="rounded text-teal-600 focus:ring-teal-500"
                              checked={!!state.vuelta}
                              onChange={(e) => {
                                const newVal = e.target.checked;
                                setSelectedExtras((prev: any) => {
                                  const old = prev[serv.id] || {};
                                  const isAnyActive = old.ida || newVal;
                                  return {
                                    ...prev,
                                    [serv.id]: { ...old, vuelta: newVal, activo: isAnyActive }
                                  }
                                })
                              }}
                            />
                            Vuelta (Casa &rarr; Aeropuerto / Destino)
                          </label>
                          {isSelected && (
                             <div className="text-right mt-1">
                                <span className="text-xs font-semibold text-teal-800">
                                  Subtotal: {formatPrice(Number(serv.precio_base) * ((state.ida ? 1 : 0) + (state.vuelta ? 1 : 0)))}
                                </span>
                             </div>
                          )}
                        </div>
                      )}

                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 5. Resumen Financiero */}
          {cotizacion && !errorFechas && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-gray-600 text-sm mb-2">
                <span>{cotizacion.breakdown}</span>
                <span>{formatPrice(cotizacion.total - cotizacion.extrasTotal)}</span>
              </div>
              {cotizacion.extrasTotal > 0 && (
                <div className="flex justify-between text-teal-700 text-sm mb-2">
                  <span>Servicios extra</span>
                  <span>+{formatPrice(cotizacion.extrasTotal)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 text-lg border-t border-gray-100 pt-2 mt-1">
                <span>Total estimado</span>
                <span>{formatPrice(cotizacion.total)}</span>
              </div>
              <p className="text-xs text-teal-700 mt-2 font-medium bg-teal-50 inline-block px-2 py-1 rounded-md">
                Anticipo para reservar: {formatPrice(cotizacion.anticipo)} (50%)
              </p>
            </div>
          )}
        </div>
        )}
      </div>

      {!showSuccessBanner && (
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
        )}

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
                  <div className="flex w-full">
                    <select
                      className="h-11 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 px-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 max-w-[120px]"
                      value={lada}
                      onChange={(e) => {
                        const newLada = e.target.value
                        setLada(newLada)
                        setFormData(prev => ({ ...prev, telefono: formatPhone(prev.telefono, newLada) }))
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
                      type="tel" 
                      required 
                      placeholder="1234567890"
                      className="rounded-l-none pl-3"
                      value={formData.telefono}
                      onChange={e => setFormData({...formData, telefono: formatPhone(e.target.value, lada)})}
                    />
                  </div>
                  {formData.telefono.length > 0 && !isPhoneValid(formData.telefono, lada) && (
                    <p className="text-xs text-red-500">Ingresa un número válido ({lada === '52' || lada === '1' ? '10' : '8-15'} dígitos)</p>
                  )}
                </div>
            <Input 
              label="Correo electrónico (opcional)" 
              type="email" 
              placeholder="tucorreo@ejemplo.com"
              value={formData.correo}
              onChange={e => setFormData({...formData, correo: e.target.value})}
            />
            
            <Button 
                type="submit" 
                className="w-full mt-2 bg-[#25D366] hover:bg-[#1ebd5c] text-white" 
                isLoading={isSubmitting}
                disabled={!isPhoneValid(formData.telefono, lada)}
              >
              <Send className="w-4 h-4 mr-2" />
              Enviar solicitud por WhatsApp
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
