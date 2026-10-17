// src/components/falvolt/BottomNav.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Coffee, ShoppingBag, TrendingUp, MapPin } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onSelectTab?: (tab: string) => void;
}

export function BottomNav({ activeTab, onSelectTab }: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isPreciosPage = pathname?.startsWith('/falvoltcafe/precios');

  const items = [
    { id: 'inicio', label: 'Inicio', icon: Home, href: '/falvoltcafe' },
    { id: 'productos', label: 'Variedades', icon: Coffee, href: '/falvoltcafe?tab=productos' },
    { id: 'comprar', label: 'Comprar', icon: ShoppingBag, highlight: true, href: '/falvoltcafe?tab=comprar' },
    { id: 'mercado', label: 'Precios', icon: TrendingUp, href: '/falvoltcafe/precios', isRoute: true },
    { id: 'contacto', label: 'Ubicación', icon: MapPin, href: '/falvoltcafe?tab=contacto' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-lg border-t border-amber-900/30 safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-2xl mx-auto px-1">
        {items.map(({ id, label, icon: Icon, highlight, href, isRoute }) => {
          const isActive = isPreciosPage ? id === 'mercado' : activeTab === id;

          // Si es la página de precios (/falvoltcafe/precios) o el botón de Precios, usamos navegación real de ruta
          if (isRoute || isPreciosPage) {
            return (
              <Link
                key={id}
                href={href}
                className={`flex flex-col items-center justify-center gap-1 py-1 px-2 flex-1 rounded-xl transition-all ${
                  highlight
                    ? isActive
                      ? 'text-amber-400 font-bold scale-105'
                      : 'text-amber-300 font-semibold'
                    : isActive
                    ? 'text-amber-400 font-medium'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {highlight ? (
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-all ${
                      isActive
                        ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-stone-950 ring-2 ring-amber-400/50'
                        : 'bg-amber-600/80 text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[2.4]" />
                  </div>
                ) : (
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                    }`}
                  />
                )}
                <span className={`text-[10px] tracking-tight leading-none ${highlight ? 'text-amber-300' : ''}`}>
                  {label}
                </span>
              </Link>
            );
          }

          return (
            <button
              key={id}
              onClick={() => {
                if (onSelectTab) {
                  onSelectTab(id);
                } else {
                  router.push(href);
                }
              }}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-2 flex-1 rounded-xl transition-all ${
                highlight
                  ? isActive
                    ? 'text-amber-400 font-bold scale-105'
                    : 'text-amber-300 font-semibold'
                  : isActive
                  ? 'text-amber-400 font-medium'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {highlight ? (
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-all ${
                    isActive
                      ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-stone-950 ring-2 ring-amber-400/50'
                      : 'bg-amber-600/80 text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 stroke-[2.4]" />
                </div>
              ) : (
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
              )}
              <span className={`text-[10px] tracking-tight leading-none ${highlight ? 'text-amber-300' : ''}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
