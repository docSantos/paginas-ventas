// src/components/mrrobotto/CourseCard.tsx
import Link from "next/link";
import { CursoPremium } from "@/types/mrrobotto";
import { PlayCircle, Clock, BookOpen, Star, ArrowRight, Award, ShieldCheck } from "lucide-react";

interface CourseCardProps {
  curso: CursoPremium;
}

export function CourseCard({ curso }: CourseCardProps) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm hover:shadow-xl hover:border-red-500/50 transition-all flex flex-col overflow-hidden group">
      {/* Portada */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={curso.portada}
          alt={curso.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <PlayCircle className="w-7 h-7" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-600/90 text-white backdrop-blur-sm">
              {curso.categoria}
            </span>
            {curso.esCapacitacionDocente && (
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-600 text-white shadow">
                🎓 Docente STEAM
              </span>
            )}
          </div>

          {curso.certificacionDC3.incluida && (
            <div className="flex items-center gap-1 bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black shadow shrink-0">
              <Award className="w-3 h-3" />
              <span>DC-3 STPS ({curso.certificacionDC3.horasAcreditadas}h)</span>
            </div>
          )}
        </div>

        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3 text-red-400" />
            {curso.duracionTotal}
          </span>
          <span className="flex items-center gap-1 font-mono">
            <BookOpen className="w-3 h-3 text-red-400" />
            {curso.totalLecciones} Lecciones
          </span>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mb-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{curso.calificacion}</span>
            <span className="text-slate-500 text-[10px] font-normal">• Nivel {curso.nivel}</span>
          </div>

          <h3 className="font-extrabold text-base text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
            {curso.titulo}
          </h3>

          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {curso.descripcionCorta}
          </p>
        </div>

        {/* Instructor & Pricing */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={curso.instructor.avatar}
              alt={curso.instructor.nombre}
              className="w-7 h-7 rounded-full object-cover border border-red-500/40"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{curso.instructor.nombre}</p>
              <p className="text-[10px] text-slate-500 truncate">{curso.instructor.rol.split("/")[0]}</p>
            </div>
          </div>

          <div className="text-right">
            {curso.precioOriginal && (
              <span className="text-[10px] text-slate-500 line-through font-mono block">
                ${curso.precioOriginal}
              </span>
            )}
            <span className="text-base font-black text-white font-mono">
              ${curso.precio}{" "}
              <span className="text-[10px] text-slate-400 font-normal">MXN</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-slate-950/60 px-5 py-3 border-t border-slate-800 flex items-center justify-between">
        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Incluye Certificado
        </span>

        <Link
          href={`/mrrobotto/cursos/${curso.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 group-hover:text-red-300 transition-colors"
        >
          <span>Ver Temario & Clases</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
