// src/components/mrrobotto/WROSection.tsx
import Link from "next/link";
import { Trophy, Flag, Cpu, Target, Award, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

export function WROSection() {
  const torneos = [
    {
      nombre: "World Robot Olympiad (WRO)",
      categoria: "RoboMission (Junior & Senior)",
      reglaClave: "Autonomía 100%, dimensiones 25x25x25 cm, reto sorpresa en vivo.",
      kitRecomendado: "Kit RoboRunner V3 ESP32",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40"
    },
    {
      nombre: "SOLACyT Infomatrix & RoboMatrix",
      categoria: "Seguidor de Línea & Mini Sumo",
      reglaClave: "Mini Sumo: 10x10 cm, máx 500g. Seguidor: control PID en pista de lona.",
      kitRecomendado: "Chasis CNC Mini Sumo Aluminio",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40"
    },
    {
      nombre: "Ferias Estatales de Ciencias & Hackathones",
      categoria: "Prototipos Tecnológicos Embebidos",
      reglaClave: "Impacto social, telemetría IoT y documentación técnica formal.",
      kitRecomendado: "Kit Master 37 Sensores",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
    }
  ];

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold mb-2">
            <Trophy className="w-3.5 h-3.5 text-red-400" />
            <span>DIVISIÓN OLÍMPICA • ROBÓTICA DE COMPETICIÓN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Preparación para WRO México & Torneos SOLACyT
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Asesoramos a clubes escolares, universidades y competidores independientes con hardware homologado, chasis de torneo y código PID optimizado.
          </p>
        </div>

        <Link
          href="/mrrobotto/cursos/preparacion-olimpiadas-wro-solacyt"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-950/50 self-start sm:self-center transition-all hover:scale-105"
        >
          <Award className="w-4 h-4" />
          <span>Ver Masterclass Olímpica</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {torneos.map((torneo, idx) => (
          <div
            key={idx}
            className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border inline-block ${torneo.badgeColor}`}>
                {torneo.nombre}
              </span>
              <h3 className="font-extrabold text-base text-white">{torneo.categoria}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong>Reglamento:</strong> {torneo.reglaClave}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500">Kit Sugerido:</span>
              <span className="font-bold text-red-400 text-[11px]">{torneo.kitRecomendado}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-red-950/30 to-slate-950 border border-red-900/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center shrink-0">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white">¿Eres docente o líder de club de robótica?</h4>
            <p className="text-slate-400 text-[11px]">
              Ofrecemos paquetes escolares, factura con CFDI y kits de práctica con descuento por volumen.
            </p>
          </div>
        </div>
        <a
          href="https://wa.me/5217440000000?text=Hola%20Mr-Robotto,%20quisiera%20información%20sobre%20paquetes%20de%20kits%20para%20club%20de%20robótica%20WRO/SOLACyT"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors shrink-0"
        >
          Cotizar Paquete Escolar
        </a>
      </div>
    </section>
  );
}
