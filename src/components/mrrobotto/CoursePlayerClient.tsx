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
    const text = `¡Hola Mr-Robotto! Me interesa inscribirme al curso "${curso.titulo}" con Certificación DC-3 ($${curso.precio} MXN). ¿Me comparten los datos de pago y registro?`;
    window.open(`https://wa.me/5217440000000?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      {/* Breadcrumb Navigation */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <Link href="/mrrobotto" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Mr-Robotto</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-red-400">{curso.categoria}</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-200 font-medium truncate max-w-sm">{curso.titulo}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Progreso:</span>
              <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-amber-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[11px] font-mono font-bold text-amber-400">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
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
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-white">
                  {activeLesson.titulo}
                </h1>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLessonComplete(activeLesson.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      completedLessonIds.includes(activeLesson.id)
                        ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>{completedLessonIds.includes(activeLesson.id) ? "Lección completada" : "Marcar como vista"}</span>
                  </button>

                  <button
                    onClick={handleEnrollWhatsApp}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Inscribirse ($${curso.precio})</span>
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeLesson.resumen}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setBottomTab("resumen")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  bottomTab === "resumen" ? "bg-red-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                Resumen de la Lección
              </button>

              {activeLesson.codigoArduino && (
                <button
                  onClick={() => setBottomTab("codigo")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    bottomTab === "codigo" ? "bg-red-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Código (.ino / C++)</span>
                </button>
              )}

              {activeLesson.pines && activeLesson.pines.length > 0 && (
                <button
                  onClick={() => setBottomTab("pines")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    bottomTab === "pines" ? "bg-red-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Conexión de Pines
                </button>
              )}

              {curso.certificacionDC3.incluida && (
                <button
                  onClick={() => setBottomTab("dc3")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                    bottomTab === "dc3" ? "bg-amber-500 text-slate-950 font-bold" : "text-amber-400 hover:text-white"
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Constancia DC-3 STPS</span>
                </button>
              )}

              <button
                onClick={() => setBottomTab("recursos")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  bottomTab === "recursos" ? "bg-red-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                Recursos y Descargas
              </button>
            </div>

            {bottomTab === "resumen" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-white text-sm">Objetivos Técnicos y Competencias</h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>Comprensión detallada de protocolos y leyes electromagnéticas para evitar colisiones y fallos en competencia.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
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
              <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Acreditación Oficial STPS Formato DC-3</h3>
                    <p className="text-xs text-slate-400">
                      Al concluir todas las lecciones y presentar el proyecto práctico, recibirás tu constancia legal con validez curricular ante la Secretaría del Trabajo y Previsión Social.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Agente Capacitador:</span>
                    <strong className="text-white">{curso.certificacionDC3.agenteCapacitador}</strong>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Horas Acreditadas:</span>
                    <strong className="text-amber-400">{curso.certificacionDC3.horasAcreditadas} horas con valor curricular</strong>
                  </div>
                </div>
              </div>
            )}

            {bottomTab === "recursos" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-white text-sm">Material Descargable</h3>
                {activeLesson.recursos && activeLesson.recursos.length > 0 ? (
                  activeLesson.recursos.map((r, i) => (
                    <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-red-400" />
                        <span className="text-white font-medium">{r.nombre}</span>
                      </div>
                      <a href={r.url} className="px-3 py-1 bg-red-600 text-white rounded text-[11px] font-bold">
                        Descargar
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">Esta lección no incluye descargas externas adicionales.</p>
                )}
              </div>
            )}
          </div>

          {/* RIGHT 1 COL: Syllabus Playlist */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl sticky top-20">
            <div className="p-4 border-b border-slate-800 bg-slate-950/70">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-red-400" />
                  Temario de Clases
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  {completedLessonIds.length} de {totalLessons} vistas
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            <div className="max-h-[580px] overflow-y-auto divide-y divide-slate-800 text-xs">
              {curso.modulos.map((mod) => (
                <div key={mod.id} className="p-3">
                  <p className="font-semibold text-slate-200 text-xs mb-2 truncate">{mod.titulo}</p>
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
                              ? "bg-red-600/20 border border-red-500/50 text-white"
                              : "hover:bg-slate-800/60 text-slate-300 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLessonComplete(lec.id);
                              }}
                              className="text-slate-500 hover:text-emerald-400 shrink-0"
                            >
                              {isDone ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
                            </button>
                            <div className="min-w-0">
                              <p className={`text-xs truncate ${isSelected ? "font-bold text-red-400" : ""}`}>
                                {lec.titulo}
                              </p>
                              <span className="text-[10px] text-slate-500 font-mono">{lec.duracion}</span>
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
