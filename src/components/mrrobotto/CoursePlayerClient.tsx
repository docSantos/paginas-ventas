// src/components/mrrobotto/CoursePlayerClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { CursoPremium, LeccionVideo } from "@/types/mrrobotto";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { VideoPlayerMock } from "./VideoPlayerMock";
import { CodeBlock } from "./CodeBlock";
import { PinoutTable } from "./PinoutTable";
import {
  ArrowLeft,
  ChevronRight,
  BookOpen,
  CheckCircle,
  PlayCircle,
  Clock,
  Download,
  Award,
  ShieldCheck,
  FileText,
  Star,
  CheckCircle2,
  Lock,
  MessageCircle
} from "lucide-react";

interface CoursePlayerClientProps {
  curso: CursoPremium;
}

export function CoursePlayerClient({ curso }: CoursePlayerClientProps) {
  const [activeLesson, setActiveLesson] = useState<LeccionVideo>(
    curso.modulos[0]?.lecciones[0] || {
      id: "lec-default",
      titulo: "Introducción",
      duracion: "10:00",
      resumen: "Bienvenido al curso",
      esGratis: true
    }
  );

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(["lec-dc3-1-1", "lec-wro-1-1"]);
  const [bottomTab, setBottomTab] = useState<"resumen" | "codigo" | "pines" | "dc3" | "recursos">("resumen");

  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessonIds((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const totalLessons = curso.modulos.reduce((acc, m) => acc + m.lecciones.length, 0);
  const progressPercent = Math.round((completedLessonIds.length / (totalLessons || 1)) * 100);

  const handleEnrollWhatsApp = () => {
    const text = curso.certificacionDC3.incluida
      ? `¡Hola Mr-Robotto! Me interesa inscribirme al "${curso.titulo}" con Certificación Oficial DC-3 STPS vía certimexico.com ($${curso.precio} MXN). ¿Me comparten los datos de pago y registro?`
      : `¡Hola Mr-Robotto! Me interesa inscribirme al "${curso.titulo}" ($${curso.precio} MXN). ¿Me comparten los datos de pago y acceso a la plataforma?`;
    window.open(`https://wa.me/5217440000000?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-rose-600 selection:text-white">
      <Header />

      {/* Breadcrumb Navigation */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <Link href="/mrrobotto" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Mr-Robotto</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-red-600 font-medium">{curso.categoria}</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-800 font-medium truncate max-w-sm">{curso.titulo}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[11px] text-slate-500">Progreso:</span>
              <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[11px] font-mono font-bold text-amber-600">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-32 sm:pb-20 md:pb-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* LEFT 2 COLS: Video Player & Tabs */}
          <div className="lg:col-span-2 space-y-6">
            <VideoPlayerMock
              title={activeLesson.titulo}
              duration={activeLesson.duracion}
              videoUrl={activeLesson.videoUrl}
              isCompleted={completedLessonIds.includes(activeLesson.id)}
              onLessonComplete={() => toggleLessonComplete(activeLesson.id)}
              hasDC3Badge={curso.certificacionDC3.incluida}
            />

            {/* Lesson Title & Enrolling Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                  {activeLesson.titulo}
                </h1>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLessonComplete(activeLesson.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      completedLessonIds.includes(activeLesson.id)
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{completedLessonIds.includes(activeLesson.id) ? "Lección completada" : "Marcar como vista"}</span>
                  </button>

                  <button
                    onClick={handleEnrollWhatsApp}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/20 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Inscribirse (${curso.precio})</span>
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeLesson.resumen}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setBottomTab("resumen")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  bottomTab === "resumen" ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Resumen de la Lección
              </button>

              {activeLesson.codigoArduino && (
                <button
                  onClick={() => setBottomTab("codigo")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    bottomTab === "codigo" ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Código (.ino / C++)</span>
                </button>
              )}

              {activeLesson.pines && activeLesson.pines.length > 0 && (
                <button
                  onClick={() => setBottomTab("pines")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    bottomTab === "pines" ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Conexión de Pines
                </button>
              )}

              {curso.certificacionDC3.incluida && (
                <button
                  onClick={() => setBottomTab("dc3")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                    bottomTab === "dc3" ? "bg-amber-500 text-slate-950 font-bold shadow-xs" : "text-amber-700 hover:text-amber-900 hover:bg-amber-50"
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Constancia DC-3 STPS</span>
                </button>
              )}

              <button
                onClick={() => setBottomTab("recursos")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  bottomTab === "recursos" ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Recursos y Descargas
              </button>
            </div>

            {bottomTab === "resumen" && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-xs">
                <h3 className="font-bold text-slate-900 text-sm">Objetivos Técnicos y Competencias</h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>Comprensión detallada de protocolos y leyes electromagnéticas para evitar colisiones y fallos en competencia.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>Implementación de código limpio en C++ con estructura modular sin llamadas bloqueantes.</span>
                  </li>
                </ul>
              </div>
            )}

            {bottomTab === "codigo" && activeLesson.codigoArduino && (
              <div>
                <CodeBlock code={activeLesson.codigoArduino} filename={`clase_${activeLesson.id}.ino`} />
              </div>
            )}

            {bottomTab === "pines" && activeLesson.pines && (
              <div>
                <PinoutTable pines={activeLesson.pines} />
              </div>
            )}

            {bottomTab === "dc3" && (
              <div className="bg-gradient-to-br from-amber-50/70 via-white to-slate-50 border border-amber-200/90 rounded-2xl p-5 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 border border-amber-300 flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Acreditación Oficial STPS Formato DC-3</h3>
                      <p className="text-xs text-slate-600">
                        La evaluación y emisión de tu constancia legal con validez curricular ante la STPS se realiza a través de{" "}
                        <a
                          href={curso.certificacionDC3.plataformaCertificadoraUrl || "https://certimexico.com"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-amber-700 underline hover:text-amber-900"
                        >
                          {curso.certificacionDC3.plataformaCertificadoraNombre || "certimexico.com"}
                        </a>.
                      </p>
                    </div>
                  </div>

                  <a
                    href={curso.certificacionDC3.plataformaCertificadoraUrl || "https://certimexico.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs text-center shrink-0 shadow-xs transition-all"
                  >
                    Ir a {curso.certificacionDC3.plataformaCertificadoraNombre || "certimexico.com"} ↗
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div className="bg-white p-3 rounded-xl border border-amber-200/70 shadow-2xs">
                    <span className="text-slate-500 block text-[10px]">Plataforma y Agente Capacitador:</span>
                    <strong className="text-slate-900">{curso.certificacionDC3.agenteCapacitador}</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-200/70 shadow-2xs">
                    <span className="text-slate-500 block text-[10px]">Horas Acreditadas:</span>
                    <strong className="text-amber-700 font-bold">{curso.certificacionDC3.horasAcreditadas} horas con valor curricular</strong>
                  </div>
                </div>
              </div>
            )}

            {bottomTab === "recursos" && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-xs">
                <h3 className="font-bold text-slate-900 text-sm">Material Descargable</h3>
                {activeLesson.recursos && activeLesson.recursos.length > 0 ? (
                  activeLesson.recursos.map((r, i) => (
                    <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-red-600" />
                        <span className="text-slate-800 font-medium">{r.nombre}</span>
                      </div>
                      <a href={r.url} className="px-3 py-1 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg text-[11px] font-bold shadow-xs">
                        Descargar
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Esta lección no incluye descargas externas adicionales.</p>
                )}
              </div>
            )}
          </div>

          {/* RIGHT 1 COL: Syllabus Playlist */}
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm sticky top-20">
            <div className="p-4 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-red-600" />
                  Temario de Clases
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  {completedLessonIds.length} de {totalLessons} vistas
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            <div className="max-h-[580px] overflow-y-auto divide-y divide-slate-100 text-xs">
              {curso.modulos.map((mod) => (
                <div key={mod.id} className="p-3">
                  <p className="font-semibold text-slate-800 text-xs mb-2 truncate">{mod.titulo}</p>
                  <div className="space-y-1.5">
                    {mod.lecciones.map((lec) => {
                      const isSelected = activeLesson.id === lec.id;
                      const isDone = completedLessonIds.includes(lec.id);

                      return (
                        <div
                          key={lec.id}
                          onClick={() => setActiveLesson(lec)}
                          className={`w-full text-left p-2 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                            isSelected
                              ? "bg-red-50/90 border border-red-200 text-slate-900"
                              : "hover:bg-slate-50 text-slate-600 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLessonComplete(lec.id);
                              }}
                              className="text-slate-400 hover:text-emerald-600 shrink-0"
                            >
                              {isDone ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <div className="w-4 h-4 rounded-full border border-slate-300" />}
                            </button>
                            <div className="min-w-0">
                              <p className={`text-xs truncate ${isSelected ? "font-bold text-red-600" : ""}`}>
                                {lec.titulo}
                              </p>
                              <span className="text-[10px] text-slate-400 font-mono">{lec.duracion}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Navegación inferior fija PWA */}
      <BottomNav />
    </div>
  );
}
