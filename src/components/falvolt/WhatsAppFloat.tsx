// src/components/falvolt/WhatsAppFloat.tsx
'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { FALVOLT_CONFIG } from '@/data/falvoltData';

export function WhatsAppFloat() {
  const whatsappUrl = `${FALVOLT_CONFIG.whatsappBaseUrl}?text=${encodeURIComponent(
    '¡Hola Café FAL-VOLT! Me interesa consultar información y realizar un pedido de café.'
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar a Café FAL-VOLT por WhatsApp"
      className="fixed bottom-20 right-4 z-40 w-13 h-13 p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-950/30 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
    >
      {/* Glow pulse */}
      <span className="absolute -inset-0.5 rounded-full bg-emerald-400 opacity-40 animate-ping pointer-events-none" />
      <MessageCircle className="w-6 h-6 stroke-[2.2] relative z-10" />
    </a>
  );
}
