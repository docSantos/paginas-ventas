// src/app/mrrobotto/page.tsx
import { MrRobottoHomeClient } from "@/components/mrrobotto/MrRobottoHomeClient";

export const metadata = {
  title: "Mr-Robotto — Robótica, Tienda Maker, Cursos DC-3 & WRO",
  description:
    "Plataforma mobile-first de robótica: kits WRO/SOLACyT, brazos robóticos, tienda maker, tutoriales Arduino y cursos con Certificación DC-3.",
  openGraph: {
    title: "Mr-Robotto — Robótica, Tienda Maker, Cursos DC-3 & WRO",
    description:
      "Plataforma mobile-first de robótica: kits WRO/SOLACyT, brazos robóticos, tienda maker, tutoriales Arduino y cursos con Certificación DC-3.",
    siteName: "Páginas Ixa",
  },
};

export default function MrRobottoPage() {
  return <MrRobottoHomeClient />;
}
