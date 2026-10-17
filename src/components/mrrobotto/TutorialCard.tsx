// src/components/mrrobotto/TutorialCard.tsx
import Link from "next/link";
import { TutorialModulo } from "@/types/mrrobotto";
import { Cpu, Zap, Clock, ArrowRight, CheckCircle2 } from "lucide-react";

interface TutorialCardProps {
  tutorial: TutorialModulo;
}

export function TutorialCard({ tutorial }: TutorialCardProps) {
  const getBadgeColor = (cat: string) => {
    switch (cat) {
      case "Sensores":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "Displays":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Motores y Actuadores":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "Comunicación":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default:
        return "bg-red-500/10 text-red-400 border-red-500/20";
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm hover:shadow-xl hover:border-red-500/40 transition-all flex flex-col overflow-hidden group">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full border ${getBadgeColor(tutorial.categoria)}`}>
            {tutorial.categoria}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{tutorial.tiempoEstimado}</span>
          </div>
        </div>

        <h3 className="font-bold text-base text-white group-hover:text-red-400 transition-colors line-clamp-1">
          {tutorial.nombre}
        </h3>

        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {tutorial.subtitulo}
        </p>

        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Voltaje: <strong>{tutorial.voltajeOperacion}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="truncate">{tutorial.protocolo}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2">
          <span>{tutorial.pines.length} Pines de Conexión</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Sketch C++ Incluido
          </span>
        </div>
      </div>

      <div className="bg-slate-950/60 px-5 py-3 border-t border-slate-800 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">
          Nivel: <strong className="text-slate-200">{tutorial.nivel}</strong>
        </span>

        <Link
          href={`/mrrobotto/tutoriales/${tutorial.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 group-hover:text-red-300 transition-colors"
        >
          <span>Ver Tutorial & Código</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
