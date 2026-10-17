// src/components/falvolt/FalVoltHomeClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { HeroSection } from './HeroSection';
import { ValuePropSection } from './ValuePropSection';
import { ProductsSection } from './ProductsSection';
import { OrderCoffeeSection } from './OrderCoffeeSection';
import { LocationSection } from './LocationSection';
import { WhatsAppFloat } from './WhatsAppFloat';
import { TrendingUp, ArrowRight } from 'lucide-react';

export function FalVoltHomeClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [selectedProductId, setSelectedProductId] = useState<string>('falvolt-marago-arabe');

  // Sincronizar con parámetro ?tab=... en la URL y con el botón Atrás del navegador (popstate)
  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['inicio', 'productos', 'comprar', 'contacto'].includes(tabParam)) {
        setActiveTab(tabParam);
      } else {
        setActiveTab('inicio');
      }
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const handleOrderClick = (productId?: string) => {
    if (productId) {
      setSelectedProductId(productId);
    }
    setActiveTab('comprar');
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab: 'comprar' }, '', '/falvoltcafe?tab=comprar');
    }
    setTimeout(() => {
      const orderElement = document.getElementById('comprar-cafe');
      if (orderElement) {
        orderElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleTabSelect = (tab: string) => {
    if (tab === 'mercado') {
      router.push('/falvoltcafe/precios');
      return;
    }

    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const nextUrl = tab === 'inicio' ? '/falvoltcafe' : `/falvoltcafe?tab=${tab}`;
      window.history.pushState({ tab }, '', nextUrl);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header fijo con navegación inteligente de retroceso */}
      <Header
        onOrderClick={() => handleOrderClick()}
        isSubView={activeTab !== 'inicio'}
        onBackClick={() => handleTabSelect('inicio')}
        onLogoClick={() => handleTabSelect('inicio')}
      />

      {/* Contenido principal según Tab */}
      <main className="flex-1 pb-24">
        {activeTab === 'inicio' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <HeroSection onOrderClick={() => handleOrderClick()} />

            {/* Enlace directo a la página dedicada /falvoltcafe/precios */}
            <div className="px-4 max-w-2xl mx-auto -mt-2">
              <Link
                href="/falvoltcafe/precios"
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-850 to-amber-950 text-white border border-amber-800/40 shadow-sm flex items-center justify-between text-left group hover:border-amber-600/60 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif font-bold text-xs sm:text-sm text-amber-100">
                        Monitor de Precios & Cosecha
                      </span>
                      <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded">
                        Bolsa NY: 292¢
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-300 leading-tight">
                      Consulta la época óptima para comprar café en la Sierra de Tapachula y cotizaciones históricas.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
              </Link>
            </div>

            <ValuePropSection />
            <ProductsSection onSelectProductToOrder={handleOrderClick} />
            <OrderCoffeeSection selectedProductId={selectedProductId} />
            <LocationSection />
          </div>
        )}

        {activeTab === 'productos' && (
          <div className="space-y-4 animate-in fade-in duration-200 pt-3">
            <ProductsSection onSelectProductToOrder={handleOrderClick} />
            <OrderCoffeeSection selectedProductId={selectedProductId} />
          </div>
        )}

        {activeTab === 'comprar' && (
          <div className="space-y-4 animate-in fade-in duration-200 pt-3">
            <OrderCoffeeSection selectedProductId={selectedProductId} />
            <ProductsSection onSelectProductToOrder={handleOrderClick} />
          </div>
        )}

        {activeTab === 'contacto' && (
          <div className="space-y-4 animate-in fade-in duration-200 pt-3">
            <LocationSection />
          </div>
        )}
      </main>

      {/* Botón flotante de WhatsApp */}
      <WhatsAppFloat />

      {/* Barra de navegación inferior mobile-first */}
      <BottomNav activeTab={activeTab} onSelectTab={handleTabSelect} />
    </div>
  );
}
