// src/app/falvoltcafe/layout.tsx
import type { Metadata } from 'next';
import { ErudaProvider } from '@/components/ErudaProvider';

export const metadata: Metadata = {
  title: {
    template: '%s | Café FAL-VOLT',
    default: 'Café FAL-VOLT — Sierra de Tapachula, Chiapas',
  },
  description:
    'Café de estricta altura de la Sierra de Tapachula, Chiapas. Mezcla selecta Marago-Árabe con tostado maestro. Venta al menudeo y mayoreo para cafeterías.',
  keywords: [
    'café chiapas',
    'café fal-volt',
    'café tapachula',
    'marago arabe',
    'café maragojipe',
    'café de altura',
    'comprar café de grano',
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Café FAL-VOLT',
  },
};

export default function FalVoltLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-900 text-stone-900 flex flex-col antialiased selection:bg-amber-600 selection:text-white">
      {/* Depuración móvil en dispositivos físicos */}
      <ErudaProvider />

      {/* Contenedor mobile-first idéntico a Casas Gaby (max-w-2xl, centrado con sombras de app nativa) */}
      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto bg-stone-50 border-x border-stone-800/40 shadow-2xl relative">
        {children}
      </div>
    </div>
  );
}
