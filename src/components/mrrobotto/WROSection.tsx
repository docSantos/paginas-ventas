// src/components/mrrobotto/WROSection.tsx
import { Trophy, Clock, CheckCircle2, MessageCircle, FileText, Package, Sparkles } from "lucide-react";
import { BLOQUES_CAPACITACION_MRROBOTTO } from "@/data/mrrobottoData";

export function WROSection() {
  const handleWhatsAppBloque = (titulo: string, horas: number) => {
    const text = `¡Hola Mr-Robotto! Me interesa agendar/cotizar la "${titulo}" (${horas} horas) para mi colegio o club de robótica. ¿Podrían compartirme disponibilidad y cotización con CFDI?`;
    window.open(`https://wa.me/5217440000000?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleWhatsAppPaquete = () => {
    const text = `¡Hola Mr-Robotto! Soy docente/coordinador escolar y quiero cotizar un paquete escolar de kits de robótica con capacitación por horas y factura CFDI.`;
    window.open(`https://wa.me/5217440000000?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xs space-y-6">
      {/* Header Unificado */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[10px] sm:text-xs font-semibold backdrop-blur-sm">
            <Trophy className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span>CAPACITACIÓN TÉCNICA STEAM • ASESORÍA POR BLOQUES DE HORAS</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Capacitación para Docentes, Clubes Escolares & Preparación WRO / SOLACyT
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            <strong className="text-slate-900">¿Eres docente o líder de club de robótica?</strong> Ofrecemos paquetes escolares, factura con CFDI y kits de práctica con descuento por volumen. Asesoramos a colegios, universidades y competidores independientes con hardware homologado, chasis de torneo y código PID optimizado, estructurados mediante <strong className="text-red-600 font-semibold">capacitación técnica por bloques de horas</strong> a la medida de tu equipo.
          </p>
        </div>

        <button
          type="button"
          onClick={handleWhatsAppPaquete}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-red-950/20 w-full sm:w-auto transition-all active:scale-98 shrink-0 text-center"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Cotizar Paquete Escolar</span>
        </button>
      </div>

      {/* Grid de Bloques de Horas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {BLOQUES_CAPACITACION_MRROBOTTO.map((bloque) => (
          <div
            key={bloque.id}
            className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all relative ${
              bloque.destacado
                ? "bg-gradient-to-b from-slate-900 to-slate-950 text-white border-2 border-red-500/80 shadow-lg"
                : "bg-slate-50/90 text-slate-900 border border-slate-200/90 hover:border-slate-300 hover:shadow-xs"
            }`}
          >
            {bloque.destacado && (
              <span className="absolute -top-3 right-4 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Más Solicitado
              </span>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${
                    bloque.destacado
                      ? "bg-red-500/20 text-red-300 border-red-500/40"
                      : bloque.badgeColor
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  {bloque.badge}
                </span>

                <span className={`text-xs font-mono font-bold ${bloque.destacado ? "text-slate-300" : "text-slate-500"}`}>
                  {bloque.horas} Horas
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base sm:text-lg leading-snug">{bloque.titulo}</h3>
                <p className={`text-xs mt-1 ${bloque.destacado ? "text-slate-300" : "text-slate-600"}`}>
                  {bloque.subtitulo}
                </p>
              </div>

              <div className={`p-2.5 rounded-xl text-[11px] leading-relaxed ${bloque.destacado ? "bg-slate-800/80 text-slate-300" : "bg-white border border-slate-200/70 text-slate-600"}`}>
                <strong className={bloque.destacado ? "text-white" : "text-slate-800"}>Dirigido a: </strong>
                {bloque.dirigidoA}
              </div>

              <div className="space-y-1.5 pt-1">
                <p className={`text-[11px] font-bold uppercase tracking-wider ${bloque.destacado ? "text-red-400" : "text-slate-700"}`}>
                  Lo que incluye el bloque:
                </p>
                <ul className="space-y-1.5 text-xs">
                  {bloque.incluye.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          bloque.destacado ? "text-red-400" : "text-emerald-600"
                        }`}
                      />
                      <span className={bloque.destacado ? "text-slate-300" : "text-slate-600"}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleWhatsAppBloque(bloque.titulo, bloque.horas)}
                className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 ${
                  bloque.destacado
                    ? "bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-950/40"
                    : "bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 shadow-2xs"
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Agendar Bloque de {bloque.horas}h</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Banner Institucional con Factura CFDI y Paquetes Escolares */}
      <div className="bg-gradient-to-r from-slate-50 via-red-50/20 to-slate-100 border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 border border-red-200/80 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                Facturación con CFDI & Descuento Institucional por Volumen
              </h4>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Acreditación Fiscal
              </span>
            </div>
            <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed max-w-2xl">
              Emitimos factura formal con CFDI para colegios, prepas y universidades. Paquetes de kits para laboratorio (Robot Otto, Brazos 4/6 GDL con joysticks) con tarifas preferenciales para compras institucionales.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleWhatsAppPaquete}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs border border-slate-300 transition-colors shadow-2xs shrink-0 text-center w-full md:w-auto flex items-center justify-center gap-2"
        >
          <Package className="w-4 h-4 text-red-600" />
          <span>Solicitar Cotización Formal</span>
        </button>
      </div>
    </section>
  );
}

