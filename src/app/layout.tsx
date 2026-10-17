// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Páginas Ixa",
    default: "Páginas Ixa — Matriz Central de Servicios y Plataformas",
  },
  description: "Páginas Ixa: Plataforma matriz de desarrollo, servicios y comercio digital.",
  openGraph: {
    title: "Páginas Ixa — Matriz Central",
    description: "Plataforma matriz de servicios, comercio digital y aplicaciones tecnológicas.",
    siteName: "Páginas Ixa",
    type: "website",
  },
  formatDetection: {
    telephone: false,
    date: false,
    email: false,
    address: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Páginas Ixa",
  },
};

// Viewport mobile-first: controla el escalado en smartphones
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0d9488", // teal-600
  viewportFit: "cover",
};

import { RegisterSW } from "@/components/RegisterSW";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" suppressHydrationWarning className={`${geistSans.variable} h-full`}>
      <body suppressHydrationWarning className="min-h-full bg-gray-50 antialiased">
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}
