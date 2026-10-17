// src/components/falvolt/ProductsSection.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { CoffeeProduct } from '@/types/falvolt';
import { FALVOLT_PRODUCTS } from '@/data/falvoltData';
import { Coffee, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface ProductsSectionProps {
  onSelectProductToOrder: (productId: string, presentationId?: string) => void;
}

export function ProductsSection({ onSelectProductToOrder }: ProductsSectionProps) {
  return (
    <section className="px-4 py-8 max-w-2xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
          Catálogo Artesanal
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
          Nuestras Presentaciones
        </h2>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Café recién tostado en grano o con la molienda exacta para tu cafetera favorita.
        </p>
      </div>

      {/* Product Cards */}
      <div className="space-y-4">
        {FALVOLT_PRODUCTS.map((product) => {
          const startingPrice = Math.min(...product.presentations.map((p) => p.price));

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row"
            >
              {/* Product Image & Badges */}
              <div className="relative sm:w-48 h-56 sm:h-auto bg-stone-100 shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 100vw, 200px"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-950/80 backdrop-blur-sm text-amber-300 text-[10px] font-semibold border border-amber-500/30">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    {product.roast}
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif font-bold text-lg text-stone-900 leading-tight">
                      {product.name}
                    </h3>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-stone-500 block leading-none">Desde</span>
                      <span className="font-serif font-bold text-base text-amber-700">
                        ${startingPrice} <span className="text-xs font-normal text-stone-500">MXN</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-amber-800">
                    {product.tagline}
                  </p>

                  <p className="text-xs text-stone-600 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Tasting notes chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {product.notes.map((note, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200/60 text-amber-900 text-[11px] font-medium"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Available sizes & action button */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1 text-[11px] text-stone-500">
                    <Coffee className="w-3.5 h-3.5 text-stone-400" />
                    <span>
                      {product.presentations.map((p) => p.weightGrams >= 1000 ? `${p.weightGrams / 1000}kg` : `${p.weightGrams}g`).join(' • ')}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectProductToOrder(product.id)}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs transition-colors shadow-sm active:scale-95"
                  >
                    <span>Configurar y Pedir</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
