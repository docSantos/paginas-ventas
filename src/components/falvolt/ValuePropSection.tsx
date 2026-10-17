// src/components/falvolt/ValuePropSection.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { VALUE_PROPOSITIONS } from '@/data/falvoltData';
import { Mountain, Flame, Sparkles, Store } from 'lucide-react';

const iconMap = {
  Mountain,
  Flame,
  Sparkles,
  Store,
};

export function ValuePropSection() {
  return (
    <section className="px-4 py-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
          Tradición Chiapaneca
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
          Mezcla Selecta Marago-Árabe
        </h2>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Un perfil de taza exclusivo para paladares exigentes, nacido en la Sierra Madre de Chiapas y tostado con maestría.
        </p>
      </div>

      {/* Grid de Propuestas de Valor con fotos originales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {VALUE_PROPOSITIONS.map((item) => {
          const Icon = iconMap[item.iconName as keyof typeof iconMap] || Sparkles;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Image preview */}
              <div className="relative h-44 w-full bg-stone-900 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 320px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/90 backdrop-blur-sm text-stone-950 flex items-center justify-center font-bold">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-white drop-shadow-md">
                    {item.subtitle}
                  </span>
                </div>
              </div>

              {/* Text Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature banner */}
      <div className="rounded-2xl p-5 bg-gradient-to-r from-stone-900 to-amber-950 text-amber-50 border border-amber-800/40 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
          <Sparkles className="w-6 h-6 text-amber-400" />
        </div>
        <div className="space-y-0.5 min-w-0">
          <h4 className="font-serif font-bold text-sm text-amber-200">
            ¿Por qué Maragojipe?
          </h4>
          <p className="text-xs text-stone-300 leading-snug">
            Conocido como el &quot;grano elefante&quot;, es una mutación botánica nacida en Brasil que en el microclima de Tapachula produce una taza con cuerpo cremoso, acidez limpia y notas a chocolate fino.
          </p>
        </div>
      </div>
    </section>
  );
}
