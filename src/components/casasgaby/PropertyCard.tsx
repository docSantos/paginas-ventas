// src/components/casasgaby/PropertyCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Users, BedDouble, Wifi } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import type { Propiedad } from '@/types/casasgaby'

interface PropertyCardProps {
  propiedad: Propiedad
}

// Íconos de amenidades populares
const AMENIDAD_ICONS: Record<string, string> = {
  'alberca': '🏊',
  'wifi': '📶',
  'cocina': '🍳',
  'estacionamiento': '🚗',
  'bbq': '🔥',
  'jacuzzi': '🛁',
  'chimenea': '🪵',
  'terraza': '🌿',
}

function getAmenidadIcon(amenidad: string): string {
  const key = Object.keys(AMENIDAD_ICONS).find(k =>
    amenidad.toLowerCase().includes(k)
  )
  return key ? AMENIDAD_ICONS[key] : '✓'
}

export function PropertyCard({ propiedad }: PropertyCardProps) {
  const fotoUrl = propiedad.fotos?.[0] ?? null
  const amenidadesPreview = propiedad.amenidades.slice(0, 3)

  return (
    <Card className="group transition-shadow hover:shadow-md">
      {/* Imagen */}
      <div className="relative h-48 bg-gradient-to-br from-teal-100 to-teal-200 overflow-hidden">
        {fotoUrl ? (
          <Image
            src={fotoUrl}
            alt={propiedad.titulo}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-teal-400">
            <BedDouble className="w-12 h-12 mb-2" />
            <span className="text-xs font-medium">Sin foto aún</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant="default" className="bg-teal-600 text-white shadow-sm">
            {formatPrice(propiedad.precio_por_noche)}/noche
          </Badge>
        </div>
      </div>

      <CardContent className="pt-3">
        {/* Título */}
        <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-1">
          {propiedad.titulo}
        </h3>

        {/* Descripción */}
        {propiedad.descripcion && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {propiedad.descripcion}
          </p>
        )}

        {/* Capacidad */}
        <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-600">
          <Users className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Hasta {propiedad.capacidad_personas} personas</span>
        </div>

        {/* Amenidades preview */}
        {amenidadesPreview.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {amenidadesPreview.map((a) => (
              <span key={a} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {getAmenidadIcon(a)} {a}
              </span>
            ))}
            {propiedad.amenidades.length > 3 && (
              <span className="text-xs text-gray-400 py-0.5">
                +{propiedad.amenidades.length - 3} más
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Link href={`/casasgaby/propiedad/${propiedad.id}`} className="block">
            <Button className="w-full" size="md">
              Ver disponibilidad
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
