// src/components/mrrobotto/ProductReel.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { ProductoRobotica } from "@/types/mrrobotto";
import {
  MessageCircle,
  Eye,
  Truck,
  Star,
  Flame,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play
} from "lucide-react";

interface ProductReelProps {
  productos: ProductoRobotica[];
  onSelectProduct?: (prod: ProductoRobotica) => void;
}

export function ProductReel({ productos, onSelectProduct }: ProductReelProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Soporte de gestos táctiles (Swipe izquierda / derecha en móviles)
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-rotación automática cada 3.5 segundos estilo Facebook Reels
  useEffect(() => {
    if (!isAutoPlaying || productos.length <= 1) return;

    const timer = setInterval(() => {
      setSelectedIdx((prev) => (prev + 1) % productos.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [isAutoPlaying, productos.length]);

  // Centrar automáticamente la minitarjeta activa en la tira horizontal ÚNICAMENTE dentro del contenedor, sin mover la ventana del usuario
  useEffect(() => {
    const activeEl = cardRefs.current[selectedIdx];
    const container = scrollContainerRef.current;
    if (activeEl && container) {
      const containerRect = container.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      const targetScrollLeft =
        container.scrollLeft +
        (elRect.left - containerRect.left) -
        container.clientWidth / 2 +
        elRect.width / 2;

      container.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth",
      });
    }
  }, [selectedIdx]);

  const currentProd = productos[selectedIdx] || productos[0];

  const scrollNext = () => {
    setSelectedIdx((prev) => (prev + 1) % productos.length);
  };

  const scrollPrev = () => {
    setSelectedIdx((prev) => (prev - 1 + productos.length) % productos.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsAutoPlaying(false);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;

    if (isLeftSwipe) {
      scrollNext();
    } else if (isRightSwipe) {
      scrollPrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
    // Reanudar auto-play tras 4 segundos de inactividad
    setTimeout(() => setIsAutoPlaying(true), 4000);
  };

  const handleWhatsAppBuy = (prod: ProductoRobotica, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const text = prod.esProximamente
      ? `¡Hola Mr-Robotto! Quiero registrarme en la Lista de Espera VIP para el próximo lanzamiento: "${prod.nombre}". ¿Me avisan en cuanto esté disponible?`
      : `¡Hola Mr-Robotto! Me interesa comprar el "${prod.nombre}" ($${prod.precio.toLocaleString("es-MX")} MXN). ¿Tienen disponibilidad y entrega inmediata?`;
    window.open(`https://wa.me/5217440000000?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div
      className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-2xl ring-1 ring-white/20 relative overflow-hidden transition-all text-left w-full touch-pan-y"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header del Reel: compacto y responsive en móviles */}
      <div className="flex items-center justify-between gap-1.5 pb-2.5 mb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[10px] sm:text-[11px] font-bold shrink-0">
            <Flame className="w-3 h-3 text-red-600 animate-pulse shrink-0" />
            <span className="truncate max-w-[130px] sm:max-w-none">KITS DESTACADOS</span>
          </span>
          <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono shrink-0">
            ({selectedIdx + 1}/{productos.length})
          </span>
        </div>

        {/* Controles de reproducción manual y pausa */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsAutoPlaying((prev) => !prev)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors flex items-center justify-center active:scale-95 touch-manipulation"
            title={isAutoPlaying ? "Pausar auto-cambio" : "Reanudar auto-cambio"}
            aria-label={isAutoPlaying ? "Pausar" : "Reproducir"}
          >
            {isAutoPlaying ? <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-600" />}
          </button>

          <button
            onClick={scrollPrev}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200/80 flex items-center justify-center active:scale-95 touch-manipulation"
            aria-label="Producto anterior"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={scrollNext}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200/80 flex items-center justify-center active:scale-95 touch-manipulation"
            aria-label="Siguiente producto"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tarjeta de Producto Activo estilo Facebook Reel (Image 1): 100% Horizontal & Responsive */}
      <div
        onClick={() => onSelectProduct?.(currentProd)}
        className="bg-slate-50/90 hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-3 sm:p-4 md:p-5 cursor-pointer transition-all duration-300 group shadow-2xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            {/* Imagen del Producto con badges */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 aspect-square rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0 shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentProd.imagenPrincipal}
                alt={currentProd.nombre}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80";
                }}
              />

              {currentProd.envioGratis && (
                <span className="absolute bottom-1 left-1 bg-white/95 text-emerald-700 text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-0.5 shadow-2xs">
                  <Truck className="w-2.5 h-2.5 text-emerald-600 shrink-0" /> Full
                </span>
              )}
            </div>

            {/* Información del Producto */}
            <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                {currentProd.badge && (
                  <span
                    className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs truncate ${
                      currentProd.esProximamente
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "bg-gradient-to-r from-red-600 to-rose-600 text-white"
                    }`}
                  >
                    {currentProd.badge}
                  </span>
                )}
                <div className="flex items-center gap-0.5 text-amber-500 text-[11px] sm:text-xs font-semibold shrink-0">
                  <Star className="w-3 h-3 fill-amber-500" />
                  <span>{currentProd.calificacion}</span>
                </div>
              </div>

              <h3 className="font-bold text-xs sm:text-sm md:text-base text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                {currentProd.nombre}
              </h3>

              <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 pt-0.5">
                <span className="text-sm sm:text-base md:text-lg font-black text-slate-900 font-mono">
                  ${currentProd.precio.toLocaleString("es-MX")}{" "}
                  <span className="text-[10px] font-semibold text-slate-500 font-sans">MXN</span>
                </span>
                {currentProd.precioOriginal && (
                  <span className="text-[11px] text-slate-400 line-through font-mono">
                    ${currentProd.precioOriginal.toLocaleString("es-MX")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Acciones directas (WhatsApp + Ficha): adaptables tanto en mobile como en desktop */}
          <div className="flex sm:flex-col items-center sm:items-stretch gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/70 sm:w-44 md:w-48">
            <button
              onClick={(e) => handleWhatsAppBuy(currentProd, e)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-xs transition-all active:scale-98 touch-manipulation"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white shrink-0" />
              <span className="truncate">
                {currentProd.esProximamente ? "Apartar en WhatsApp" : "Pedir por WhatsApp"}
              </span>
            </button>

            {onSelectProduct && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProduct(currentProd);
                }}
                className="flex items-center justify-center gap-1 py-2 px-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors active:scale-98 shadow-2xs touch-manipulation"
              >
                <Eye className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Ficha rápida</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Puntos de Paginación estilo Facebook Reels (Image 1) */}
      <div className="flex items-center justify-center gap-1.5 pt-2.5 pb-1.5">
        {productos.map((_, i) => (
          <button
            key={i}
            onClick={() => setSelectedIdx(i)}
            className={`transition-all rounded-full touch-manipulation ${
              i === selectedIdx
                ? "w-5 h-1.5 bg-red-600 shadow-2xs"
                : "w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400"
            }`}
            aria-label={`Ir al producto ${i + 1}`}
          />
        ))}
      </div>

      {/* Tira horizontal de minitarjetas (lo que el usuario encerró en amarillo en Image 3) */}
      <div className="pt-1.5 border-t border-slate-100">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 scrollbar-none pt-1 touch-pan-x touch-scroll"
        >
          {productos.map((prod, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <button
                key={prod.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                onClick={() => setSelectedIdx(idx)}
                className={`shrink-0 flex items-center gap-2 p-1.5 sm:p-2 rounded-xl text-left transition-all border touch-manipulation ${
                  isSelected
                    ? "bg-white border-red-600 shadow-xs ring-2 ring-red-500/20"
                    : "bg-slate-50/90 border-slate-200/80 hover:bg-white text-slate-700 opacity-80 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={prod.imagenPrincipal}
                  alt={prod.nombre}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80";
                  }}
                />
                <div className="w-24 sm:w-32 min-w-0">
                  <p className="text-[10px] sm:text-[11px] font-bold text-slate-900 truncate">{prod.nombre}</p>
                  <p className="text-[10px] sm:text-[11px] font-mono font-extrabold text-red-600">
                    ${prod.precio.toLocaleString("es-MX")} MXN
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
