// src/components/falvolt/LocationSection.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { FALVOLT_CONFIG } from '@/data/falvoltData';
import { MapPin, Navigation, Phone, MessageCircle, Clock, ShieldCheck } from 'lucide-react';

export function LocationSection() {
  const whatsappWholesaleUrl = `${FALVOLT_CONFIG.whatsappBaseUrl}?text=${encodeURIComponent(
    '¡Hola Café FAL-VOLT! Me comunico para cotizar mayoreo para cafetería / negocio.'
  )}`;

  return (
    <section className="px-4 py-8 max-w-2xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
          Encuéntranos
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
          De Tapachula a tu Taza
        </h2>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Visítanos en Tapachula o solicita tu envío con entrega el mismo día en la ciudad.
        </p>
      </div>

      {/* Tarjeta de Ubicación con Google Maps */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        {/* Banner visual con logo o mapa */}
        <div className="relative h-44 bg-gradient-to-r from-stone-900 to-amber-950 p-6 flex flex-col justify-end text-white overflow-hidden">
          <div className="absolute top-4 right-4 opacity-20">
            <MapPin className="w-32 h-32 text-amber-400 -mr-8 -mt-8" />
          </div>
          <div className="relative z-10 space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
              Punto de Origen
            </span>
            <h3 className="font-serif font-bold text-xl text-white">
              Tapachula, Chiapas
            </h3>
            <p className="text-xs text-stone-300">
              Corazón cafetalero del Soconusco y Sierra Madre de Chiapas
            </p>
          </div>
        </div>

        {/* Detalles y Enlaces */}
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Dirección
              </h4>
              <p className="text-sm text-stone-600 mt-0.5">
                {FALVOLT_CONFIG.address}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Atención y Pedidos
              </h4>
              <p className="text-sm text-stone-600 mt-0.5 font-medium">
                {FALVOLT_CONFIG.phoneFormatted}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Horario de Atención
              </h4>
              <p className="text-sm text-stone-600 mt-0.5">
                Lunes a Sábado: 8:00 AM – 7:00 PM
              </p>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={FALVOLT_CONFIG.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm active:scale-95"
            >
              <Navigation className="w-4 h-4" />
              <span>Abrir en Google Maps</span>
            </a>

            <a
              href={whatsappWholesaleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Cotizar Mayoreo Cafeterías</span>
            </a>
          </div>
        </div>
      </div>

      {/* Garantía de Calidad Chiapas */}
      <div className="rounded-2xl p-4 bg-stone-100 border border-stone-200 flex items-center gap-3 text-xs text-stone-600">
        <ShieldCheck className="w-6 h-6 text-amber-700 shrink-0" />
        <p>
          Garantía de frescura: Nuestro café se tuesta en lotes continuos reducidos para asegurar que recibas un producto con menos de 15 días de tostado.
        </p>
      </div>

      {/* Footer */}
      <footer className="pt-6 pb-2 text-center text-xs text-stone-500 space-y-1">
        <p className="font-serif font-semibold text-stone-700">
          CAFÉ FAL-VOLT &copy; 2026
        </p>
        <p className="text-[11px] text-stone-400">
          Sierra de Tapachula, Chiapas, México. Calidad de exportación y tostado maestro.
        </p>
      </footer>
    </section>
  );
}
