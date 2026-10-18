// src/components/mrrobotto/TutorialDetailClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { TutorialModulo } from "@/types/mrrobotto";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { CodeBlock } from "./CodeBlock";
import { PinoutTable } from "./PinoutTable";
import {
  ArrowLeft,
  Zap,
  Cpu,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Share2,
  Layers,
  ChevronRight,
  Wrench,
  ShoppingBag
} from "lucide-react";

interface TutorialDetailClientProps {
  tutorial: TutorialModulo;
}

export function TutorialDetailClient({ tutorial }: TutorialDetailClientProps) {
  const [activeTab, setActiveTab] = useState<"codigo" | "conexion" | "explicacion" | "troubleshooting">("codigo");
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-rose-600 selection:text-white">
      <Header />

      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <Link href="/mrrobotto" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Mr-Robotto</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-red-600 font-medium">{tutorial.categoria}</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-800 font-medium truncate max-w-xs">{tutorial.nombre}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl transition-colors shadow-2xs"
          >
            <Share2 className="w-3 h-3" />
            <span>{copiedLink ? "¡Copiado!" : "Compartir"}</span>
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-32 sm:pb-20 md:pb-12 flex-1 w-full space-y-8">
        {/* Module Header Card */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 blur-[90px] rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase font-semibold px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                {tutorial.categoria}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Nivel: {tutorial.nivel}
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Chip: {tutorial.chipPrincipal}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {tutorial.nombre}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              {tutorial.subtitulo}
            </p>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block text-[11px]">Voltaje Operativo</span>
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1 mt-0.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  {tutorial.voltajeOperacion}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block text-[11px]">Protocolo</span>
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1 mt-0.5">
                  <Cpu className="w-3.5 h-3.5 text-red-600" />
                  {tutorial.protocolo}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block text-[11px]">Tiempo de Práctica</span>
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  {tutorial.tiempoEstimado}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block text-[11px]">Pines de Entrada/Salida</span>
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1 mt-0.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  {tutorial.pines.length} conexiones
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Description & Functioning */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-red-600" />
            Principio de Funcionamiento y Aplicación Maker
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {tutorial.descripcion}
          </p>

          <div className="pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Especificaciones Técnicas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {tutorial.especificaciones.map((esp, i) => (
                <div key={i} className="flex justify-between py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-500">{esp.nombre}:</span>
                  <span className="font-semibold text-slate-800">{esp.valor}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("codigo")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "codigo"
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            1. Código Arduino (.ino)
          </button>

          <button
            onClick={() => setActiveTab("conexion")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "conexion"
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            2. Diagrama de Pines & Conexiones
          </button>

          <button
            onClick={() => setActiveTab("explicacion")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "explicacion"
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            3. Explicación del Sketch
          </button>

          <button
            onClick={() => setActiveTab("troubleshooting")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "troubleshooting"
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            4. Solución de Fallos
          </button>
        </div>

        {activeTab === "codigo" && (
          <section className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Sketch Arduino C++ Listo para Compilar</h3>
            <CodeBlock code={tutorial.codigoArduino} filename={`${tutorial.slug}.ino`} language="arduino c++" />

            {tutorial.librerias.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4" /> Librerías Necesarias en Arduino IDE
                </h4>
                <div className="space-y-2">
                  {tutorial.librerias.map((lib, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                      <span className="font-bold text-slate-900">{lib.nombre}</span>
                      <span className="text-slate-500 ml-2">por {lib.autor}</span>
                      <p className="text-[11px] text-slate-600 mt-1">{lib.instalador}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {activeTab === "conexion" && (
          <section className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Cableado Físico y Distribución de Señales</h3>
            <PinoutTable pines={tutorial.pines} chipName={tutorial.chipPrincipal} />
          </section>
        )}

        {activeTab === "explicacion" && (
          <section className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Desglose Paso a Paso del Programa</h3>
            <div className="space-y-3">
              {tutorial.explicacionCodigo.map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200/90 rounded-xl p-4 space-y-1 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-50 text-red-700 border border-red-200 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{item.paso}</h4>
                  </div>
                  <p className="text-xs text-slate-600 pl-8 leading-relaxed">{item.detalle}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "troubleshooting" && (
          <section className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Diagnóstico y Resolución de Problemas Frecuentes</h3>
            <div className="space-y-3">
              {tutorial.solucionProblemas.map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-2 shadow-xs">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-amber-900">{item.problema}</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        <strong>Causa común:</strong> {item.causa}
                      </p>
                      <div className="mt-2 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 text-xs text-emerald-800">
                        <strong>Solución:</strong> {item.solucion}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Banner to Buy the sensor or explore courses */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200/90 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">¿Necesitas este componente para tu proyecto?</h4>
            <p className="text-xs text-slate-600">
              Encuéntralo en la tienda de Mr-Robotto con entrega inmediata a todo México.
            </p>
          </div>
          <Link
            href="/mrrobotto"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-red-950/20 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Ver Tienda de Componentes</span>
          </Link>
        </div>
      </main>

      {/* Navegación inferior fija PWA */}
      <BottomNav />
    </div>
  );
}
