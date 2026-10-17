// src/components/mrrobotto/ProductReel.tsx
"use client";

import { useState } from "react";
import { ProductoRobotica } from "@/types/mrrobotto";
import {
  Zap,
  Truck,
  Star,
  Flame,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Eye,
  CheckCircle2,
  ShieldCheck
} from "lucide-react";

interface ProductReelProps {
  productos: ProductoRobotica[];
  onSelectProduct?: (prod: ProductoRobotica) => void;
}

export function ProductReel({ productos, onSelectProduct }: ProductReelProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const scrollNext = () => {
    setSelectedIdx((prev) => (prev + 1) % productos.length);
  };

  const scrollPrev = () => {
    setSelectedIdx((prev) => (prev - 1 + productos.length) % productos.length);
  };

  const currentProd = productos[selectedIdx] || productos[0];

  const handleWhatsAppBuy = (prod: ProductoRobotica) => {
    const text = `¡Hola Mr-Robotto! Me interesa comprar el "${prod.nombre}" ($${prod.precio} MXN). ¿Tienen disponibilidad y tiempo de entrega?`;
    window.open(`https://wa.me/5217440000000?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-red-950/30 border border-red-900/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Glow decorative element */}
      <div className="absolute top-0 right-10 w-72 h-72 bg-red-600/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Reel Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 border-b border-slate-800/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold mb-1.5">
            <Flame className="w-3.5 h-3.5 text-red-500 animate-bounce" />
            <span>REEL DE OFERTAS & KITS DESTACADOS • ESTILO MERCADOLIBRE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Componentes y Kits de Robótica en Tendencia
          </h2>
          <p className="text-xs text-slate-400">
            Envíos a todo México • Homologados para torneos WRO / SOLACyT • Stock garantizado
          </p>
        </div>

        {/* Carousel arrows */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={scrollPrev}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700 shadow-sm"
            aria-label="Producto anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-semibold text-slate-400 px-1">
            {selectedIdx + 1} / {productos.length}
          </span>
          <button
            onClick={scrollNext}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700 shadow-sm"
            aria-label="Siguiente producto"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Featured Product Banner (Hero Reel Style) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6">
        {/* Photo Box */}
        <div className="md:col-span-5 relative aspect-square sm:aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentProd.imagenPrincipal}
            alt={currentProd.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Reel Badges Over Image */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {currentProd.badge && (
              <span className="bg-red-600 text-white text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-md shadow-md tracking-wider">
                {currentProd.badge}
              </span>
            )}
            {currentProd.precioOriginal && (
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded shadow">
                AHORRA {Math.round(((currentProd.precioOriginal - currentProd.precio) / currentProd.precioOriginal) * 100)}%
              </span>
            )}
          </div>

          {currentProd.envioGratis && (
            <div className="absolute bottom-3 left-3 bg-emerald-600/95 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1 backdrop-blur-sm">
              <Truck className="w-3.5 h-3.5" />
              <span>ENVÍO FULL GRATIS</span>
            </div>
          )}
        </div>

        {/* Product Details & Purchase Trigger */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[10px] uppercase font-bold text-red-400 bg-red-950/60 border border-red-900/50 px-2 py-0.5 rounded">
              {currentProd.categoria}
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{currentProd.calificacion}</span>
              <span className="text-slate-500 text-[11px]">({currentProd.reviewsCount} ventas verificadas)</span>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
            {currentProd.nombre}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
            {currentProd.descripcion}
          </p>

          {/* Price Block estilo MercadoLibre */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-baseline gap-3">
            {currentProd.precioOriginal && (
              <span className="text-sm line-through text-slate-500 font-mono">
                ${currentProd.precioOriginal.toLocaleString("es-MX")} MXN
              </span>
            )}
            <span className="text-3xl font-black text-white tracking-tight">
              ${currentProd.precio.toLocaleString("es-MX")}{" "}
              <span className="text-sm font-semibold text-slate-400">MXN</span>
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              Disponibles: {currentProd.stock} unidades listas para despacho
            </span>
          </div>

          {/* Quick Specs Pills */}
          <div className="flex flex-wrap gap-2 text-[11px]">
            {currentProd.compatibilidad.slice(0, 3).map((comp, idx) => (
              <span key={idx} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                ✓ {comp}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => handleWhatsAppBuy(currentProd)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.02]"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Pedir por WhatsApp</span>
            </button>

            {onSelectProduct && (
              <button
                onClick={() => onSelectProduct(currentProd)}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                <Eye className="w-4 h-4 text-purple-400" />
                <span>Ver Ficha Técnica</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Horizontal Mini-Thumbnails Reel Selector */}
      <div className="flex items-center gap-2.5 mt-4 overflow-x-auto pb-2 scrollbar-none pt-2 touch-pan-x touch-scroll">
        {productos.map((prod, idx) => {
          const isSelected = idx === selectedIdx;
          return (
            <button
              key={prod.id}
              onClick={() => setSelectedIdx(idx)}
              className={`shrink-0 flex items-center gap-2 p-2 rounded-xl text-left transition-all border ${
                isSelected
                  ? "bg-slate-900 border-red-500 shadow-md ring-1 ring-red-500"
                  : "bg-slate-950/60 border-slate-800 hover:bg-slate-900/80 opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={prod.imagenPrincipal}
                alt={prod.nombre}
                className="w-12 h-12 rounded-lg object-cover bg-slate-900"
              />
              <div className="w-32 min-w-0">
                <p className="text-[11px] font-bold text-white truncate">{prod.nombre}</p>
                <p className="text-[11px] font-mono font-extrabold text-red-400">
                  ${prod.precio.toLocaleString("es-MX")} MXN
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
