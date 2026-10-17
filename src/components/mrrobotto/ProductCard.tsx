// src/components/mrrobotto/ProductCard.tsx
import { ProductoRobotica } from "@/types/mrrobotto";
import { Star, Truck, ShoppingCart, MessageCircle, Eye } from "lucide-react";

interface ProductCardProps {
  producto: ProductoRobotica;
  onSelect?: (prod: ProductoRobotica) => void;
}

export function ProductCard({ producto, onSelect }: ProductCardProps) {
  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `¡Hola Mr-Robotto! Me interesa comprar el "${producto.nombre}" ($${producto.precio} MXN). ¿Tienen entrega disponible?`;
    window.open(`https://wa.me/5217440000000?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div
      onClick={() => onSelect && onSelect(producto)}
      className="bg-slate-900 border border-slate-800 hover:border-red-500/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col group cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={producto.imagenPrincipal}
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {producto.badge && (
          <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] uppercase font-black px-2 py-0.5 rounded shadow">
            {producto.badge}
          </span>
        )}

        {producto.esDigital ? (
          <span className="absolute bottom-2.5 left-2.5 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
            <span className="text-[11px]">💾</span> DESCARGA .STL
          </span>
        ) : producto.envioGratis ? (
          <span className="absolute bottom-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
            <Truck className="w-3 h-3" /> FULL
          </span>
        ) : null}
      </div>

      {/* Info Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase text-red-400 truncate max-w-[150px]">
              {producto.categoria}
            </span>
            <div className="flex items-center gap-1 text-amber-400 text-[11px] font-bold">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{producto.calificacion}</span>
            </div>
          </div>

          <h3 className="font-bold text-sm text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
            {producto.nombre}
          </h3>

          <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
            {producto.subtitulo}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div>
            {producto.precioOriginal && (
              <span className="text-[11px] text-slate-500 line-through font-mono block">
                ${producto.precioOriginal}
              </span>
            )}
            <span className="text-lg font-black text-white font-mono">
              ${producto.precio.toLocaleString("es-MX")}{" "}
              <span className="text-[10px] font-normal text-slate-400">MXN</span>
            </span>
          </div>

          <button
            onClick={handleWhatsApp}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors"
            title="Pedir por WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
