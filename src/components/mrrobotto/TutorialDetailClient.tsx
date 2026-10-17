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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      {/* Breadcrumb */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <Link href="/mrrobotto" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Mr-Robotto</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-red-400">{tutorial.categoria}</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-200 font-medium truncate max-w-xs">{tutorial.nombre}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded-md transition-colors"
          >
            <Share2 className="w-3 h-3" />
            <span>{copiedLink ? "¡Copiado!" : "Compartir"}</span>
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        {/* Module Header Card */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase font-bold px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                {tutorial.categoria}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Nivel: {tutorial.nivel}
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
                Chip: {tutorial.chipPrincipal}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {tutorial.nombre}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              {tutorial.subtitulo}
            </p>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Voltaje Operativo</span>
                <span className="font-bold text-white text-sm flex items-center gap-1 mt-0.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  {tutorial.voltajeOperacion}
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Protocolo</span>
                <span className="font-bold text-white text-sm flex items-center gap-1 mt-0.5">
                  <Cpu className="w-3.5 h-3.5 text-red-400" />
                  {tutorial.protocolo}
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Tiempo de Práctica</span>
                <span className="font-bold text-white text-sm flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {tutorial.tiempoEstimado}
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Pines de Entrada/Salida</span>
                <span className="font-bold text-white text-sm flex items-center gap-1 mt-0.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  {tutorial.pines.length} conexiones
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Description & Functioning */}
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-red-400" />
            Principio de Funcionamiento y Aplicación Maker
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {tutorial.descripcion}
          </p>

          <div className="pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Especificaciones Técnicas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {tutorial.especificaciones.map((esp, i) => (
                <div key={i} className="flex justify-between py-1.5 px-3 rounded-lg bg-slate-900 border border-slate-800/80">
                  <span className="text-slate-400">{esp.nombre}:</span>
                  <span className="font-semibold text-slate-200">{esp.valor}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab("codigo")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "codigo"
                ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            1. Código Arduino (.ino)
          </button>

          <button
            onClick={() => setActiveTab("conexion")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "conexion"
                ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            2. Diagrama de Pines & Conexiones
          </button>

          <button
            onClick={() => setActiveTab("explicacion")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "explicacion"
                ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            3. Explicación del Sketch
          </button>

          <button
            onClick={() => setActiveTab("troubleshooting")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "troubleshooting"
                ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            4. Solución de Fallos
          </button>
        </div>

        {activeTab === "codigo" && (
          <section className="space-y-4">
            <h3 className="font-bold text-white text-base">Sketch Arduino C++ Listo para Compilar</h3>
            <CodeBlock code={tutorial.codigoArduino} filename={`${tutorial.slug}.ino`} language="arduino c++" />

            {tutorial.librerias.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4" /> Librerías Necesarias en Arduino IDE
                </h4>
                <div className="space-y-2">
                  {tutorial.librerias.map((lib, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                      <span className="font-bold text-white">{lib.nombre}</span>
                      <span className="text-slate-400 ml-2">por {lib.autor}</span>
                      <p className="text-[11px] text-slate-400 mt-1">{lib.instalador}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {activeTab === "conexion" && (
          <section className="space-y-4">
            <h3 className="font-bold text-white text-base">Cableado Físico y Distribución de Señales</h3>
            <PinoutTable pines={tutorial.pines} chipName={tutorial.chipPrincipal} />
          </section>
        )}

        {activeTab === "explicacion" && (
          <section className="space-y-4">
            <h3 className="font-bold text-white text-base">Desglose Paso a Paso del Programa</h3>
            <div className="space-y-3">
              {tutorial.explicacionCodigo.map((item, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-600/30 text-red-300 border border-red-500/30 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm text-white">{item.paso}</h4>
                  </div>
                  <p className="text-xs text-slate-300 pl-8 leading-relaxed">{item.detalle}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "troubleshooting" && (
          <section className="space-y-4">
            <h3 className="font-bold text-white text-base">Diagnóstico y Resolución de Problemas Frecuentes</h3>
            <div className="space-y-3">
              {tutorial.solucionProblemas.map((item, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-amber-300">{item.problema}</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        <strong>Causa común:</strong> {item.causa}
                      </p>
                      <div className="mt-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs text-emerald-400">
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
        <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-900/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-white text-sm">¿Necesitas este componente para tu proyecto?</h4>
            <p className="text-xs text-slate-400">
              Encuéntralo en la tienda de Mr-Robotto con entrega inmediata a todo México.
            </p>
          </div>
          <Link
            href="/mrrobotto"
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 shrink-0"
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
