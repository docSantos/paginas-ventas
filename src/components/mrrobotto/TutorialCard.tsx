// src/components/mrrobotto/TutorialCard.tsx
import Link from "next/link";
import { TutorialModulo } from "@/types/mrrobotto";
import { Cpu, Zap, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { getTutorialCategoryTheme } from "@/lib/mrrobottoThemes";

interface TutorialCardProps {
  tutorial: TutorialModulo;
}

export function TutorialCard({ tutorial }: TutorialCardProps) {
  const theme = getTutorialCategoryTheme(tutorial);

  return (
    <div
      style={{
        backgroundColor: theme.bgHex,
        borderColor: theme.borderHex,
      }}
      className="border-2 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group"
    >
      <div
        style={{ backgroundColor: theme.bgHex }}
        className="p-5 flex-1 flex flex-col"
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${theme.badge}`}
          >
            {tutorial.categoria}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{tutorial.tiempoEstimado}</span>
          </div>
        </div>

        <h3 className={`font-bold text-base text-slate-900 group-hover:${theme.accentText} transition-colors line-clamp-1`}>
          {tutorial.nombre}
        </h3>

        <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
          {tutorial.subtitulo}
        </p>

        <div
          style={{ borderTopColor: theme.borderHex }}
          className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t text-[11px]"
        >
          <div className="flex items-center gap-1.5 text-slate-700">
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">
              Voltaje: <strong className="text-slate-900">{tutorial.voltajeOperacion}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <Cpu className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span className="truncate font-medium">{tutorial.protocolo}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-600 mt-3 pt-2">
          <span>{tutorial.pines.length} Pines de Conexión</span>
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Sketch C++ Incluido
          </span>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.55)",
          borderTopColor: theme.borderHex,
        }}
        className="px-5 py-3 border-t flex items-center justify-between backdrop-blur-2xs"
      >
        <span className="text-xs font-medium text-slate-600">
          Nivel: <strong className="text-slate-900">{tutorial.nivel}</strong>
        </span>

        <Link
          href={`/mrrobotto/tutoriales/${tutorial.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors"
        >
          <span>Ver Tutorial & Código</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
