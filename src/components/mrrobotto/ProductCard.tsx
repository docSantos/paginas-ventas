// src/components/mrrobotto/ProductCard.tsx
import { ProductoRobotica } from "@/types/mrrobotto";
import { Star, Truck, MessageCircle } from "lucide-react";
import { getProductCategoryTheme } from "@/lib/mrrobottoThemes";

interface ProductCardProps {
  producto: ProductoRobotica;
  onSelect?: (prod: ProductoRobotica) => void;
}

export function ProductCard({ producto, onSelect }: ProductCardProps) {
  const theme = getProductCategoryTheme(producto);

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = producto.esProximamente
      ? `¡Hola Mr-Robotto! Quiero registrarme en la Lista de Espera VIP para el próximo lanzamiento: "${producto.nombre}". ¿Me avisan en cuanto esté disponible?`
      : `¡Hola Mr-Robotto! Me interesa comprar el "${producto.nombre}" ($${producto.precio} MXN). ¿Tienen entrega disponible?`;
    window.open(`https://wa.me/5217440000000?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div
      onClick={() => onSelect && onSelect(producto)}
      style={{
        backgroundColor: theme.bgHex,
        borderColor: theme.borderHex,
      }}
      className={`border-2 hover:shadow-lg rounded-2xl overflow-hidden shadow-xs transition-all duration-300 flex flex-col group cursor-pointer`}
    >
      {/* Product Image */}
      <div
        style={{
          backgroundColor: theme.imageBgHex,
          borderBottomColor: theme.borderHex,
        }}
        className="relative aspect-square w-full overflow-hidden border-b"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={producto.imagenPrincipal}
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            const fallback = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80";
            if (target.src !== fallback) {
              target.src = fallback;
            }
          }}
        />

        {producto.badge && (
          <span
            className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm tracking-wide ${
              producto.esProximamente
                ? "bg-amber-400 text-slate-950 border border-amber-500"
                : "bg-gradient-to-r from-red-600 to-rose-600 text-white"
            }`}
          >
            {producto.badge}
          </span>
        )}

        {producto.esDigital ? (
          <span className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-md border border-indigo-200 text-indigo-700 text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
            <span className="text-[11px]">💾</span> DESCARGA .STL
          </span>
        ) : producto.envioGratis ? (
          <span className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-md border border-emerald-200 text-emerald-700 text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
            <Truck className="w-3 h-3 text-emerald-600" /> FULL GRATIS
          </span>
        ) : null}
      </div>

      {/* Info Body */}
      <div
        style={{ backgroundColor: theme.bgHex }}
        className="p-4 flex-1 flex flex-col justify-between space-y-3"
      >
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.badge} truncate max-w-[170px]`}
            >
              {producto.categoria}
            </span>
            <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{producto.calificacion}</span>
            </div>
          </div>

          <h3 className={`font-bold text-sm text-slate-900 group-hover:${theme.accentText} transition-colors line-clamp-2 leading-snug`}>
            {producto.nombre}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
            {producto.subtitulo}
          </p>
        </div>

        {/* Price & Action */}
        <div
          style={{ borderTopColor: theme.borderHex }}
          className="pt-3 border-t flex items-center justify-between"
        >
          <div>
            {producto.precioOriginal && (
              <span className="text-[11px] text-slate-400 line-through font-mono block">
                ${producto.precioOriginal}
              </span>
            )}
            <span className="text-lg font-black text-slate-900 font-mono">
              ${producto.precio.toLocaleString("es-MX")}{" "}
              <span className="text-[10px] font-normal text-slate-500">MXN</span>
            </span>
          </div>

          <button
            onClick={handleWhatsApp}
            className={`p-2.5 rounded-xl text-white shadow-sm transition-all active:scale-95 ${
              producto.esProximamente
                ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-amber-500/20"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20"
            }`}
            title={producto.esProximamente ? "Apartar en Lista VIP" : "Pedir por WhatsApp"}
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
