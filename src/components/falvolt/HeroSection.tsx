// src/components/falvolt/HeroSection.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingBag, MessageCircle, MapPin, Sparkles, Award } from 'lucide-react';
import { FALVOLT_CONFIG } from '@/data/falvoltData';

interface HeroSectionProps {
  onOrderClick: () => void;
}

export function HeroSection({ onOrderClick }: HeroSectionProps) {
  const whatsappHeroUrl = `${FALVOLT_CONFIG.whatsappBaseUrl}?text=${encodeURIComponent(
    '¡Hola Café FAL-VOLT! Me interesa conocer más sobre su café de la Sierra de Tapachula y realizar un pedido.'
  )}`;

  return (
    <section className="relative overflow-hidden bg-stone-950 text-white rounded-b-3xl border-b border-amber-900/40 shadow-xl">
      {/* Background Image with Dark & Warm Coffee Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/falvolt/hero-tapachula.webp"
          alt="Sierra de Tapachula, Chiapas"
          fill
          priority
          className="object-cover object-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-900/40" />
      </div>

      <div className="relative z-10 px-5 pt-8 pb-10 flex flex-col items-center text-center max-w-lg mx-auto">
        {/* Badge Chiapas */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide backdrop-blur-sm mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Auténtico de la Sierra de Chiapas</span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-amber-50 leading-tight">
          CAFÉ <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">FAL-VOLT</span>
        </h1>

        {/* Tagline */}
        <p className="mt-3 text-base sm:text-lg text-amber-100/90 font-light max-w-sm leading-relaxed">
          El pulso de la Sierra de Tapachula en cada taza.
        </p>

        {/* Sub-description */}
        <p className="mt-2 text-xs sm:text-sm text-stone-300 max-w-xs font-normal">
          Mezcla Selecta Marago-Árabe cultivada a más de 1,300 msnm con tostado maestro artesanal.
        </p>

        {/* CTA Buttons */}
        <div className="mt-6 w-full flex flex-col sm:flex-row gap-2.5 justify-center">
          <button
            onClick={onOrderClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-bold text-sm shadow-lg shadow-amber-900/40 transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Comprar Café Online</span>
          </button>

          <a
            href={whatsappHeroUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-stone-900/80 hover:bg-stone-800 border border-amber-500/30 text-amber-200 font-medium text-sm transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Pedir por WhatsApp</span>
          </a>
        </div>

        {/* Location chip */}
        <div className="mt-4 flex items-center justify-center">
          <a
            href={FALVOLT_CONFIG.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-300 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Tapachula, Chiapas • Ver en Google Maps</span>
          </a>
        </div>

        {/* Quick Highlights Strip */}
        <div className="mt-7 w-full grid grid-cols-3 gap-2 pt-6 border-t border-stone-800/80">
          <div className="flex flex-col items-center p-2 rounded-xl bg-stone-900/60 border border-stone-800">
            <span className="text-amber-400 font-serif font-bold text-base">1,350m</span>
            <span className="text-[10px] text-stone-400 uppercase tracking-wider font-medium mt-0.5">
              Estricta Altura
            </span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl bg-stone-900/60 border border-stone-800">
            <span className="text-amber-400 font-serif font-bold text-base">Marago</span>
            <span className="text-[10px] text-stone-400 uppercase tracking-wider font-medium mt-0.5">
              Grano Elefante
            </span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl bg-stone-900/60 border border-stone-800">
            <span className="text-amber-400 font-serif font-bold text-base">Artesanal</span>
            <span className="text-[10px] text-stone-400 uppercase tracking-wider font-medium mt-0.5">
              Tueste Medio
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
