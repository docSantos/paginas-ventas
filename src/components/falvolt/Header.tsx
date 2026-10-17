// src/components/falvolt/Header.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coffee, MapPin, ShoppingBag, ArrowLeft, TrendingUp } from 'lucide-react';
import { FALVOLT_CONFIG } from '@/data/falvoltData';

interface HeaderProps {
  onOrderClick?: () => void;
  onBackClick?: () => void;
  onLogoClick?: () => void;
  isSubView?: boolean;
  cartCount?: number;
}

export function Header({
  onOrderClick,
  onBackClick,
  onLogoClick,
  isSubView = false,
  cartCount = 0,
}: HeaderProps) {
  const pathname = usePathname();
  const isPreciosPage = pathname?.startsWith('/falvoltcafe/precios');

  return (
    <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-amber-900/30 text-amber-50 safe-area-pt">
      <div className="flex items-center justify-between h-14 px-3.5 max-w-2xl mx-auto">
        {/* Left: Back button + Logo */}
        <div className="flex items-center gap-2">
          {isPreciosPage ? (
            <Link
              href="/falvoltcafe"
              aria-label="Volver a Café Fal-Volt"
              title="Volver a Café Fal-Volt"
              className="h-8 px-2.5 rounded-lg bg-stone-900 border border-stone-800 flex items-center gap-1.5 text-xs font-medium text-amber-200 hover:text-amber-100 hover:bg-stone-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span className="hidden xs:inline">Volver</span>
            </Link>
          ) : isSubView && onBackClick ? (
            <button
              onClick={onBackClick}
              aria-label="Volver al inicio de Café Fal-Volt"
              title="Volver al inicio de Café Fal-Volt"
              className="h-8 px-2.5 rounded-lg bg-stone-900 border border-stone-800 flex items-center gap-1.5 text-xs font-medium text-amber-200 hover:text-amber-100 hover:bg-stone-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span className="hidden xs:inline">Inicio</span>
            </button>
          ) : (
            <Link
              href="/"
              aria-label="Volver al portal central"
              title="Ir al portal central"
              className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-200/80 hover:text-amber-100 hover:bg-stone-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}

          <Link
            href="/falvoltcafe"
            onClick={onLogoClick}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-inner shadow-amber-400/30 shrink-0">
              <Coffee className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xs sm:text-sm tracking-wider text-amber-100 leading-none">
                CAFÉ FAL-VOLT
              </span>
              <span className="text-[9px] text-amber-400/80 tracking-widest font-semibold uppercase leading-none mt-0.5">
                Sierra de Tapachula
              </span>
            </div>
          </Link>
        </div>

        {/* Right actions: Market Page Link + Maps + Comprar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {!isPreciosPage && (
            <Link
              href="/falvoltcafe/precios"
              title="Abrir página de Monitoreo de Precios en Bolsa NY y Tapachula"
              className="hidden xs:flex items-center gap-1 px-2 py-1 rounded-lg bg-stone-900 border border-stone-800 text-[11px] text-amber-300 hover:text-amber-100 hover:bg-stone-800 transition-colors"
            >
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>292¢/lb</span>
            </Link>
          )}

          <a
            href={FALVOLT_CONFIG.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ver ubicación en Google Maps"
            className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400 hover:text-amber-300 hover:bg-stone-800 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
          </a>

          {onOrderClick ? (
            <button
              onClick={onOrderClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-xs shadow-sm transition-all active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Comprar</span>
              {cartCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-amber-950 text-[10px] font-bold rounded-full border border-amber-400/30">
                  {cartCount}
                </span>
              )}
            </button>
          ) : (
            <Link
              href="/falvoltcafe?tab=comprar"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-xs shadow-sm transition-all active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Comprar</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
