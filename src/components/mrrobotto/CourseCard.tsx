// src/components/mrrobotto/CourseCard.tsx
import Link from "next/link";
import { CursoPremium } from "@/types/mrrobotto";
import { PlayCircle, Clock, BookOpen, Star, ArrowRight, Award, ShieldCheck } from "lucide-react";

interface CourseCardProps {
  curso: CursoPremium;
}

export function CourseCard({ curso }: CourseCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Portada */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={curso.portada}
          alt={curso.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-red-600/95 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <PlayCircle className="w-7 h-7" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded-full bg-slate-950/80 text-white backdrop-blur-md border border-white/10">
              {curso.categoria}
            </span>
            {curso.esCapacitacionDocente && (
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/40 shadow">
                🎓 Docente STEAM
              </span>
            )}
          </div>

          {curso.certificacionDC3.incluida && (
            <div className="flex items-center gap-1 bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow shrink-0">
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
          <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold mb-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span>{curso.calificacion}</span>
            <span className="text-slate-400 text-[10px] font-normal">• Nivel {curso.nivel}</span>
          </div>

          <h3 className="font-bold text-base text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
            {curso.titulo}
          </h3>

          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {curso.descripcionCorta}
          </p>
        </div>

        {/* Instructor & Pricing */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={curso.instructor.avatar}
              alt={curso.instructor.nombre}
              className="w-7 h-7 rounded-full object-cover border border-slate-200"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">{curso.instructor.nombre}</p>
              <p className="text-[10px] text-slate-500 truncate">{curso.instructor.rol.split("/")[0]}</p>
            </div>
          </div>

          <div className="text-right">
            {curso.precioOriginal && (
              <span className="text-[10px] text-slate-400 line-through font-mono block">
                ${curso.precioOriginal}
              </span>
            )}
            <span className="text-base font-black text-slate-900 font-mono">
              ${curso.precio}{" "}
              <span className="text-[10px] text-slate-500 font-normal">MXN</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-slate-50/80 px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {curso.certificacionDC3.incluida ? (
          <a
            href={curso.certificacionDC3.plataformaCertificadoraUrl || "https://certimexico.com"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[11px] font-bold text-amber-800 hover:text-amber-950 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300/80 flex items-center gap-1 transition-colors"
            title="Certificación oficial realizada en certimexico.com"
          >
            <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>DC-3 vía {curso.certificacionDC3.plataformaCertificadoraNombre || "certimexico.com"}</span>
          </a>
        ) : (
          <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Incluye Diploma
          </span>
        )}

        <Link
          href={`/mrrobotto/cursos/${curso.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 group-hover:text-red-700 transition-colors shrink-0"
        >
          <span>Ver Temario</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
