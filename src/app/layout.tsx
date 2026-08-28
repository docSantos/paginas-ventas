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
    template: "%s | Paginas Gaby",
    default: "Paginas Gaby",
  },
  description: "Plataforma de servicios y renta de casas vacacionales",
};

// Viewport mobile-first: controla el escalado en smartphones
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0d9488", // teal-600
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full bg-gray-50 antialiased">{children}</body>
    </html>
  );
}
