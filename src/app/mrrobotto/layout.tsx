// src/app/mrrobotto/layout.tsx
import type { Metadata } from "next";
import { ErudaProvider } from "@/components/ErudaProvider";

export const metadata: Metadata = {
  title: {
    template: "%s | Mr-Robotto",
    default: "Mr-Robotto — Robótica Maker, Kits WRO/SOLACyT y Certificación DC-3",
  },
  description:
    "Plataforma mobile-first de robótica: tienda de componentes y kits para WRO/SOLACyT, tutoriales de módulos para Arduino y cursos premium con Certificación Oficial DC-3 STPS.",
  openGraph: {
    title: "Mr-Robotto — Robótica Maker, Kits WRO/SOLACyT y Certificación DC-3",
    description:
      "Plataforma mobile-first de robótica: tienda de componentes y kits para WRO/SOLACyT, tutoriales de módulos para Arduino y cursos premium con Certificación Oficial DC-3 STPS.",
    siteName: "Páginas Ixa",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mr-Robotto",
  },
};

export default function MrRobottoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-red-600 selection:text-white">
      {/* Proveedor de consola móvil Eruda para depurar en iPhone / Android */}
      <ErudaProvider />

      {/* Contenedor mobile-first idéntico a la arquitectura de Casas Gaby (max-w-2xl, centrado con sombras de app nativa) */}
      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto bg-slate-950 border-x border-slate-900/70 shadow-2xl relative">
        <main className="flex-1 pb-20 safe-area-pb">
          {children}
        </main>
      </div>
    </div>
  );
}
