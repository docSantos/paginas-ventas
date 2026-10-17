// src/app/falvoltcafe/precios/page.tsx
import type { Metadata } from 'next';
import { Header } from '@/components/falvolt/Header';
import { MarketPricesSection } from '@/components/falvolt/MarketPricesSection';
import { WhatsAppFloat } from '@/components/falvolt/WhatsAppFloat';
import { BottomNav } from '@/components/falvolt/BottomNav';

export const metadata: Metadata = {
  title: 'Monitor de Precios y Cosecha',
  description:
    'Historial de precios de café en la Sierra de Tapachula, calendario estacional de cosecha y simulador de costos en tiempo real.',
};

export default function FalVoltPreciosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header fijo con botón Volver hacia /falvoltcafe */}
      <Header />

      {/* Contenido de la página de Precios y Mercado */}
      <main className="flex-1 pb-24">
        <MarketPricesSection />
      </main>

      {/* Botón flotante de WhatsApp */}
      <WhatsAppFloat />

      {/* Barra de navegación inferior mobile-first */}
      <BottomNav activeTab="mercado" />
    </div>
  );
}
