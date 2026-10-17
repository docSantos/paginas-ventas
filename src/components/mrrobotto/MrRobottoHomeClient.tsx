// src/components/mrrobotto/MrRobottoHomeClient.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { Header, MrRobottoTabKey } from "./Header";
import { ProductReel } from "./ProductReel";
import { DC3Banner } from "./DC3Banner";
import { WROSection } from "./WROSection";
import { ProductCard } from "./ProductCard";
import { TutorialCard } from "./TutorialCard";
import { CourseCard } from "./CourseCard";
import {
  PRODUCTOS_MRROBOTTO,
  TUTORIALES_MODULOS,
  CURSOS_PREMIUM_MRROBOTTO
} from "@/data/mrrobottoData";
import { ProductoRobotica } from "@/types/mrrobotto";
import { coincideBusqueda } from "@/lib/textUtils";
import { BottomNav } from "./BottomNav";
import {
  Bot,
  ShoppingBag,
  Layers,
  Award,
  Trophy,
  Search,
  Filter,
  CheckCircle2,
  X,
  Truck,
  MessageCircle,
  ShieldCheck,
  Zap,
  Sparkles
} from "lucide-react";

export function MrRobottoHomeClient() {
  const [activeTab, setActiveTab] = useState<MrRobottoTabKey>("tienda");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductoRobotica | null>(null);
  const [catProd, setCatProd] = useState<"todos" | "kits" | "stl" | "otros">("todos");
  const [filtroCurso, setFiltroCurso] = useState<"todos" | "docentes" | "kits">("todos");

  // Leer parámetro tab de la URL al cargar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (
        tabParam === "tienda" ||
        tabParam === "tutoriales" ||
        tabParam === "cursos-premium" ||
        tabParam === "cursos-dc3"
      ) {
        setActiveTab(tabParam as MrRobottoTabKey);
      }
    }
  }, []);

  // Filtrado de productos con robustez UTF-8 / Mojibake y categorías de negocio
  const productosFiltrados = useMemo(() => {
    return PRODUCTOS_MRROBOTTO.filter((p) => {
      const esKit =
        p.categoria === "Kits de Robótica (Brazos y Móviles)" ||
        p.categoria === "Kits de Competencia (WRO/SOLACyT)";
      if (catProd === "kits" && !esKit) return false;
      if (catProd === "stl" && !p.esDigital) return false;
      if (catProd === "otros" && (esKit || p.esDigital)) return false;

      return (
        !searchQuery.trim() ||
        coincideBusqueda(p.nombre, searchQuery) ||
        coincideBusqueda(p.subtitulo, searchQuery) ||
        coincideBusqueda(p.categoria, searchQuery)
      );
    });
  }, [searchQuery, catProd]);

  // Filtrado de tutoriales con robustez UTF-8 / Mojibake
  const tutorialesFiltrados = useMemo(() => {
    return TUTORIALES_MODULOS.filter((t) => {
      return (
        !searchQuery.trim() ||
        coincideBusqueda(t.nombre, searchQuery) ||
        coincideBusqueda(t.subtitulo, searchQuery) ||
        coincideBusqueda(t.categoria, searchQuery) ||
        coincideBusqueda(t.chipPrincipal, searchQuery)
      );
    });
  }, [searchQuery]);

  // Filtrado de cursos premium (Masterclasses, Kits, Capacitación Docente)
  const cursosPremiumFiltrados = useMemo(() => {
    return CURSOS_PREMIUM_MRROBOTTO.filter((c) => {
      if (filtroCurso === "docentes" && !c.esCapacitacionDocente) return false;
      if (filtroCurso === "kits" && c.categoria !== "Cursos de Kits") return false;

      return (
        !searchQuery.trim() ||
        coincideBusqueda(c.titulo, searchQuery) ||
        coincideBusqueda(c.descripcionCorta, searchQuery) ||
        coincideBusqueda(c.categoria, searchQuery)
      );
    });
  }, [searchQuery, filtroCurso]);

  // Filtrado exclusivo de cursos con Certificación Oficial DC-3 STPS
  const cursosDC3Filtrados = useMemo(() => {
    return CURSOS_PREMIUM_MRROBOTTO.filter((c) => {
      if (!c.certificacionDC3.incluida) return false;

      return (
        !searchQuery.trim() ||
        coincideBusqueda(c.titulo, searchQuery) ||
        coincideBusqueda(c.descripcionCorta, searchQuery) ||
        coincideBusqueda(c.categoria, searchQuery)
      );
    });
  }, [searchQuery]);

  const handleWhatsAppBuy = (prod: ProductoRobotica) => {
    const text = `¡Hola Mr-Robotto! Me interesa ordenar el "${prod.nombre}" ($${prod.precio} MXN). ¿Tienen stock y entrega inmediata?`;
    window.open(`https://wa.me/5217440000000?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Header con barra de navegación superior (Tienda, Tutoriales, Cursos Premium, Cursos DC-3) */}
      <Header activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as MrRobottoTabKey)} />

      {/* Hero: Primera Impresión & Qué Comunicar Primero */}
      <section className="relative overflow-hidden border-b border-red-950/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-10 sm:py-16 px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold shadow-lg">
            <Bot className="w-4 h-4 text-red-400" />
            <span>MR-ROBOTTO • ROBÓTICA DE COMPETICIÓN & CERTIFICACIÓN TÉCNICA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Robótica Maker, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400">
              Kits WRO/SOLACyT y Cursos DC-3
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            El ecosistema integral para makers, clubes escolares y competidores: tutoriales de hardware con código abierto, tienda de componentes homologados y <strong>certificaciones oficiales con valor laboral STPS (DC-3)</strong>.
          </p>

          {/* 4 Value Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-4xl mx-auto text-left">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-white truncate">Kits WRO & SOLACyT</p>
                <p className="text-[10px] text-slate-400 truncate">Homologados para pista</p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-white truncate">Certificación DC-3</p>
                <p className="text-[10px] text-slate-400 truncate">Validez oficial STPS</p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-white truncate">Envíos Full México</p>
                <p className="text-[10px] text-slate-400 truncate">Stock inmediato</p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-white truncate">Tutoriales Libres</p>
                <p className="text-[10px] text-slate-400 truncate">Pinouts y sketches .ino</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-10">
        {/* REEL DE FOTOS ESTILO MERCADOLIBRE (Visible en Tienda) */}
        {activeTab === "tienda" && (
          <ProductReel
            productos={PRODUCTOS_MRROBOTTO}
            onSelectProduct={(prod) => setSelectedProduct(prod)}
          />
        )}

        {/* SECCIÓN CERTIFICACIÓN DC3 STPS (Visible de forma destacada en Cursos DC-3) */}
        {activeTab === "cursos-dc3" && <DC3Banner />}

        {/* SECCIÓN COMPETICIONES WRO Y SOLACYT (Visible en Tienda) */}
        {activeTab === "tienda" && <WROSection />}

        {/* CONTROLES Y BUSCADOR */}
        <div className="space-y-6 pt-2">
          <div className="flex flex-col gap-3 border-b border-slate-800 pb-5">
            {/* Tabs Selector: 4 Secciones Principales sin scroll horizontal */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 w-full">
              <button
                onClick={() => setActiveTab("tienda")}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === "tienda"
                    ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                <span>Tienda ({PRODUCTOS_MRROBOTTO.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("tutoriales")}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === "tutoriales"
                    ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span>Tutoriales ({TUTORIALES_MODULOS.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("cursos-premium")}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === "cursos-premium"
                    ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Cursos Premium</span>
              </button>

              <button
                onClick={() => setActiveTab("cursos-dc3")}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === "cursos-dc3"
                    ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Cursos DC-3 ({cursosDC3Filtrados.length})</span>
              </button>
            </div>

            {/* Live Search de ancho completo */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  activeTab === "tienda"
                    ? "Buscar kit, modelo STL, sensor, motor..."
                    : activeTab === "tutoriales"
                    ? "Buscar módulo (HC-SR04, DHT11, ESP32...)"
                    : activeTab === "cursos-premium"
                    ? "Buscar curso o capacitación docente..."
                    : "Buscar curso con Certificación DC-3 STPS..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-mono"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* TAB 1: PRODUCTOS DE LA TIENDA */}
          {activeTab === "tienda" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-red-500" />
                    Catálogo de Productos y Componentes Maker
                  </h3>
                  <p className="text-xs text-slate-400">
                    Kits para torneos WRO/SOLACyT, archivos de impresión 3D (.STL) y sensores listos para despacho.
                  </p>
                </div>

                {/* Filtro por Categorías de Negocio */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setCatProd("todos")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      catProd === "todos"
                        ? "bg-red-600 text-white"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    Todos ({PRODUCTOS_MRROBOTTO.length})
                  </button>
                  <button
                    onClick={() => setCatProd("kits")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      catProd === "kits"
                        ? "bg-red-600 text-white"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>🤖</span> Kits de Robótica
                  </button>
                  <button
                    onClick={() => setCatProd("stl")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      catProd === "stl"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>💾</span> Archivos 3D (.STL)
                  </button>
                  <button
                    onClick={() => setCatProd("otros")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      catProd === "otros"
                        ? "bg-red-600 text-white"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    Componentes & Módulos
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {productosFiltrados.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    producto={prod}
                    onSelect={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: TUTORIALES DE MÓDULOS */}
          {activeTab === "tutoriales" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-red-400" />
                    Tutoriales Prácticos de Módulos Electrónicos
                  </h3>
                  <p className="text-xs text-slate-400">
                    Guías paso a paso con tabla de asignación de pines, esquemas de conexión y sketches C++.
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-500 shrink-0">
                  {tutorialesFiltrados.length} guías
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tutorialesFiltrados.map((tut) => (
                  <TutorialCard key={tut.id} tutorial={tut} />
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CURSOS PREMIUM Y CAPACITACIÓN DOCENTE */}
          {activeTab === "cursos-premium" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Cursos Premium, Masterclasses y Capacitación Docente
                  </h3>
                  <p className="text-xs text-slate-400">
                    Aprende el ensamblaje y programación de kits robóticos o certifícate como instructor escolar.
                  </p>
                </div>

                {/* Filtro por Especialidad */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setFiltroCurso("todos")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      filtroCurso === "todos"
                        ? "bg-red-600 text-white"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    Todos ({CURSOS_PREMIUM_MRROBOTTO.length})
                  </button>
                  <button
                    onClick={() => setFiltroCurso("docentes")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      filtroCurso === "docentes"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>🎓</span> Docentes STEAM
                  </button>
                  <button
                    onClick={() => setFiltroCurso("kits")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      filtroCurso === "kits"
                        ? "bg-red-600 text-white"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>🦾</span> Cursos de Kits
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {cursosPremiumFiltrados.map((curso) => (
                  <CourseCard key={curso.id} curso={curso} />
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CURSOS CON CERTIFICACIÓN OFICIAL DC-3 STPS */}
          {activeTab === "cursos-dc3" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    Programas con Constancia Oficial DC-3 STPS
                  </h3>
                  <p className="text-xs text-slate-400">
                    Cursos acreditados legalmente ante la Secretaría del Trabajo y Previsión Social en México.
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-500 shrink-0">
                  {cursosDC3Filtrados.length} programas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {cursosDC3Filtrados.map((curso) => (
                  <CourseCard key={curso.id} curso={curso} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Quick View Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative space-y-5 shadow-2xl">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedProduct.imagenPrincipal}
                alt={selectedProduct.nombre}
                className="w-full sm:w-56 aspect-square object-cover rounded-2xl bg-slate-950 border border-slate-800"
              />

              <div className="space-y-2 flex-1">
                <span className="text-[10px] uppercase font-bold text-red-400 bg-red-950/60 px-2.5 py-0.5 rounded border border-red-900/50">
                  {selectedProduct.categoria}
                </span>

                <h3 className="text-xl font-black text-white">{selectedProduct.nombre}</h3>
                <p className="text-xs text-slate-400">{selectedProduct.subtitulo}</p>

                <div className="pt-2">
                  <span className="text-2xl font-black text-white font-mono">
                    ${selectedProduct.precio.toLocaleString("es-MX")} MXN
                  </span>
                  {selectedProduct.precioOriginal && (
                    <span className="text-xs text-slate-500 line-through font-mono ml-2">
                      ${selectedProduct.precioOriginal}
                    </span>
                  )}
                </div>

                {selectedProduct.esDigital ? (
                  <div className="pt-2 text-xs text-indigo-400 flex items-center gap-1.5">
                    <span>💾</span>
                    <span>Descarga digital instantánea en formatos: {selectedProduct.formatosArchivos?.join(", ")}</span>
                  </div>
                ) : (
                  <div className="pt-2 text-xs text-emerald-400 flex items-center gap-1.5">
                    <Truck className="w-4 h-4" />
                    <span>Envío inmediato a toda la República Mexicana</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
              <h4 className="font-bold text-white text-sm">Descripción del Producto</h4>
              <p className="text-slate-300 leading-relaxed">{selectedProduct.descripcion}</p>

              {selectedProduct.parametrosImpresion && (
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1 text-[11px]">
                  <p className="font-bold text-indigo-300">Parámetros recomendados de impresión 3D:</p>
                  <p className="text-slate-400">
                    Material: <strong>{selectedProduct.parametrosImpresion.material}</strong> • Infill: <strong>{selectedProduct.parametrosImpresion.infill}</strong> • Tiempo estimado: <strong>{selectedProduct.parametrosImpresion.tiempoEstimado}</strong> • Peso: <strong>{selectedProduct.parametrosImpresion.pesoFilamento}</strong>
                  </p>
                </div>
              )}

              {selectedProduct.especificaciones && (
                <div className="space-y-1.5 pt-2">
                  <h5 className="font-bold text-slate-200">Especificaciones Técnicas:</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedProduct.especificaciones.map((esp, i) => (
                      <div key={i} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/60">
                        <span className="text-slate-400 block text-[10px]">{esp.nombre}</span>
                        <span className="font-semibold text-slate-200">{esp.valor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Atención y despacho inmediato por WhatsApp
              </span>

              <button
                onClick={() => handleWhatsAppBuy(selectedProduct)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ordenar por WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navegación inferior fija PWA */}
      <BottomNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as MrRobottoTabKey)} />
    </div>
  );
}
