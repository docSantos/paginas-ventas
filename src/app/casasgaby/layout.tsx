// src/app/casasgaby/layout.tsx
// Layout específico del módulo Casas Gaby:
// - Header fijo en la parte superior
// - BottomNav fijo en la parte inferior
// - El contenido principal tiene padding para no quedar oculto bajo las navs
import type { Metadata } from "next";
import { Header } from "@/components/casasgaby/Header";
import { BottomNav } from "@/components/casasgaby/BottomNav";

export const metadata: Metadata = {
  title: {
    template: "%s | Casas Gaby",
    default: "Casas Gaby — Renta de casas vacacionales",
  },
  description:
    "Casas vacacionales en renta. Encuentra el lugar perfecto para tus vacaciones con Casas Gaby.",
};

export default function CasasGabyLayout({ children }: LayoutProps<"/casasgaby">) {
  return (
    <div className="flex flex-col min-h-screen max-w-2xl mx-auto bg-white shadow-sm">
      {/* Top header — height: 56px (h-14) */}
      <Header />

      {/* Área de contenido principal:
          - pt-0 porque el header es sticky (no afecta el flow)
          - pb-20 para que el BottomNav (h-16 = 64px) no tape el contenido */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom navigation — fixed, fuera del flow */}
      <BottomNav />
    </div>
  );
}
