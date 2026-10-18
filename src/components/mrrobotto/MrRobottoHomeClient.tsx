// src/components/mrrobotto/MrRobottoHomeClient.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
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
import { getProductCategoryTheme, getTutorialCategoryTheme } from "@/lib/mrrobottoThemes";
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
  Sparkles,
  LayoutGrid,
  List,
  Eye,
  ArrowRight,
  Star,
  Cpu,
  Clock,
  BookOpen
} from "lucide-react";

export function MrRobottoHomeClient() {
  const [activeTab, setActiveTab] = useState<MrRobottoTabKey>("tienda");
  const [vistaModo, setVistaModo] = useState<"galeria" | "lista">("galeria");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductoRobotica | null>(null);
  const [catProd, setCatProd] = useState<"todos" | "kits" | "stl" | "otros">("todos");
  const [filtroCurso, setFiltroCurso] = useState<"todos" | "diseno" | "kits">("todos");

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

  // Filtrado de cursos premium (Masterclasses Maker sin DC-3 a precio accesible)
  const cursosPremiumFiltrados = useMemo(() => {
    return CURSOS_PREMIUM_MRROBOTTO.filter((c) => {
      // En Cursos Premium NO van los de DC-3
      if (c.certificacionDC3.incluida) return false;

      if (filtroCurso === "diseno" && c.categoria !== "Diseño Electrónico & PCB") return false;
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

  // Productos para el Reel interactivo: Shark X garantizado como producto destacado #1, seguido por kits y módulos estrella
  const productosReel = useMemo(() => {
    return PRODUCTOS_MRROBOTTO.filter((p) => p.destacadoReel);
  }, []);

  // Total de elementos activos según la sección seleccionada para el contador del Catálogo
  const totalItemsActivos = useMemo(() => {
    switch (activeTab) {
      case "tienda":
        return productosFiltrados.length;
      case "tutoriales":
        return tutorialesFiltrados.length;
      case "cursos-premium":
        return cursosPremiumFiltrados.length;
      case "cursos-dc3":
        return cursosDC3Filtrados.length;
      default:
        return 0;
    }
  }, [activeTab, productosFiltrados.length, tutorialesFiltrados.length, cursosPremiumFiltrados.length, cursosDC3Filtrados.length]);

  const handleWhatsAppBuy = (prod: ProductoRobotica) => {
    const text = prod.esProximamente
      ? `¡Hola Mr-Robotto! Quiero unirme a la Lista VIP / Preventa de "${prod.nombre}" ($${prod.precio} MXN). ¿Cuándo sale el primer lote?`
      : `¡Hola Mr-Robotto! Me interesa ordenar el "${prod.nombre}" ($${prod.precio} MXN). ¿Tienen stock y entrega inmediata?`;
    window.open(`https://wa.me/5217440000000?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Header con barra de navegación superior (Tienda, Tutoriales, Cursos Premium, Cursos DC-3) */}
      <Header activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as MrRobottoTabKey)} />

      {/* Hero: Solo visible en la sección de Tienda (Estilo Fal-Volt con fondo oscuro mitad y mitad luminoso) */}
      {activeTab === "tienda" && (
        <section className="relative overflow-hidden bg-[#090d16] text-white rounded-b-3xl sm:rounded-b-[2.5rem] border-b border-slate-800/80 shadow-2xl py-8 sm:py-12 px-3 sm:px-6">
          {/* Fondo estilo Fal-Volt: Mitad y Mitad más luminoso y nítido */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
            {/* Grid 50% y 50% exacto en todo el ancho de la sección */}
            <div className="absolute inset-0 grid grid-cols-2">
              {/* Mitad Izquierda (50%): Arduino Ventuno Q */}
              <div className="relative h-full w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/mrrobotto/hero-arduino-ventuno-dark.webp"
                  alt="Arduino Ventuno Q - Edge AI SBC"
                  className="w-full h-full object-cover object-center opacity-85 sm:opacity-90 scale-105 transition-transform duration-1000"
                />
                {/* Resplandor ambiental cian/teal para Arduino */}
                <div className="absolute inset-0 bg-teal-500/15 mix-blend-screen" />
                {/* Gradiente de viñeta lateral izquierda suave */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/25 via-transparent to-slate-950/40" />
                
                {/* Chip identificador */}
                <div className="absolute bottom-3 left-4 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/85 border border-teal-400/40 text-teal-300 text-[10px] font-mono backdrop-blur-md shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  <span>ARDUINO VENTUNO Q</span>
                </div>
              </div>

              {/* Mitad Derecha (50%): ESP32-S3 DevKit */}
              <div className="relative h-full w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/mrrobotto/hero-esp32-s3-dark.webp"
                  alt="ESP32-S3 DevKit Dual-Core"
                  className="w-full h-full object-cover object-center opacity-85 sm:opacity-90 scale-105 transition-transform duration-1000"
                />
                {/* Resplandor ambiental carmesí para ESP32 */}
                <div className="absolute inset-0 bg-red-500/15 mix-blend-screen" />
                {/* Gradiente de viñeta lateral derecha suave */}
                <div className="absolute inset-0 bg-gradient-to-l from-slate-950/25 via-transparent to-slate-950/40" />

                {/* Chip identificador */}
                <div className="absolute bottom-3 right-4 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/85 border border-red-400/40 text-rose-300 text-[10px] font-mono backdrop-blur-md shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  <span>ESP32-S3 DUAL-CORE</span>
                </div>
              </div>
            </div>

            {/* Capas suaves de transparencia: mantienen legibilidad sin apagar las placas */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/25 to-slate-900/15" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950/50" />
            
            {/* Halo sutil central detrás del texto para máxima legibilidad tipográfica */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-slate-950/50 blur-[70px] rounded-full" />
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4 sm:space-y-6">
            <div className="max-w-2xl mx-auto space-y-2.5 sm:space-y-3">
              {/* Arriba de la línea azul: Badge, Título y Subtítulo */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/40 text-red-300 text-[10px] sm:text-xs font-semibold backdrop-blur-md shadow-xs max-w-full">
                <Bot className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="truncate">MR-ROBOTTO • ROBÓTICA DE COMPETICIÓN & CERTIFICACIÓN</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-[1.2] drop-shadow-sm">
                Robótica Maker, <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400">
                  Kits WRO/SOLACyT y Cursos DC-3
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed drop-shadow-xs">
                El ecosistema integral para makers, clubes escolares y competidores: tutoriales de hardware con código abierto, tienda de componentes homologados y <strong className="text-white">certificaciones oficiales STPS (DC-3) vía certimexico.com</strong>.
              </p>
            </div>

            {/* Debajo de la línea azul: Reel automático estilo Facebook con tira de minitarjetas (Image 1 + Image 3) */}
            <div className="pt-2 sm:pt-3 text-left max-w-4xl mx-auto w-full">
              <ProductReel
                productos={productosReel}
                onSelectProduct={(prod) => setSelectedProduct(prod)}
              />
            </div>
          </div>
        </section>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-5 sm:pt-8 pb-32 sm:pb-20 md:pb-12 flex-1 w-full space-y-6 sm:space-y-8">
        {/* SECCIÓN CERTIFICACIÓN DC3 STPS (Visible de forma destacada en Cursos DC-3) */}
        {activeTab === "cursos-dc3" && <DC3Banner />}

        {/* CONTROLES Y BUSCADOR INTERMEDIO: CATÁLOGO + VISTA GALERÍA / LISTA */}
        <div className="space-y-6 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
            {/* Título Catálogo y Selector de Modo (Galería / Lista) */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 text-white flex items-center justify-center shadow-sm shadow-red-500/20 shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none">
                      Catálogo
                    </h2>
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      {totalItemsActivos} {activeTab === "tienda" ? "productos" : activeTab === "tutoriales" ? "guías" : "cursos"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {activeTab === "tienda" && "Robots 4/6 GDL con doble joystick o Visión IA, Otto y Gabinete Escualo"}
                    {activeTab === "tutoriales" && "Guías técnicas, pinouts y esquemas de conexión"}
                    {activeTab === "cursos-premium" && "Cursos prácticos de autoestudio maker a precio accesible (sin arancel de certificación STPS)"}
                    {activeTab === "cursos-dc3" && "Cursos de Diseño Electrónico con acreditación oficial DC-3 STPS vía certimexico.com"}
                  </p>
                </div>
              </div>

              <div className="h-7 w-px bg-slate-200 hidden sm:block" />

              {/* Selector Modo Galería vs Lista */}
              <div className="inline-flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setVistaModo("galeria")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    vistaModo === "galeria"
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/60 font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="Modo Galería (Cuadrícula)"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-red-600" />
                  <span>Galería</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVistaModo("lista")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    vistaModo === "lista"
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/60 font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="Modo Lista (Fila detallada)"
                >
                  <List className="w-3.5 h-3.5 text-red-600" />
                  <span>Lista</span>
                </button>
              </div>
            </div>

            {/* Live Search */}
            <div className="relative w-full sm:w-72 md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  activeTab === "tienda"
                    ? "Buscar kit, modelo STL, sensor..."
                    : activeTab === "tutoriales"
                    ? "Buscar módulo (HC-SR04, ESP32...)"
                    : activeTab === "cursos-premium"
                    ? "Buscar curso o capacitación..."
                    : "Buscar curso con DC-3 STPS..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-9 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-mono"
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
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-red-600" />
                    Catálogo de Productos y Componentes Maker
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kits para torneos WRO/SOLACyT, archivos de impresión 3D (.STL) y sensores listos para despacho.
                  </p>
                </div>

                {/* Filtro por Categorías de Negocio */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setCatProd("todos")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      catProd === "todos"
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm"
                    }`}
                  >
                    Todos ({PRODUCTOS_MRROBOTTO.length})
                  </button>
                  <button
                    onClick={() => setCatProd("kits")}
                    style={catProd === "kits" ? undefined : { backgroundColor: "#FFE4E8", borderColor: "#FDA4AF" }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                      catProd === "kits"
                        ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm border-transparent"
                        : "text-rose-900 shadow-sm"
                    }`}
                  >
                    <span>🤖</span> Kits de Robótica
                  </button>
                  <button
                    onClick={() => setCatProd("stl")}
                    style={catProd === "stl" ? undefined : { backgroundColor: "#EDE9FE", borderColor: "#C7D2FE" }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                      catProd === "stl"
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm border-transparent"
                        : "text-indigo-900 shadow-sm"
                    }`}
                  >
                    <span>💾</span> Archivos 3D (.STL)
                  </button>
                  <button
                    onClick={() => setCatProd("otros")}
                    style={catProd === "otros" ? undefined : { backgroundColor: "#CCFBF1", borderColor: "#5EEAD4" }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                      catProd === "otros"
                        ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm border-transparent"
                        : "text-teal-900 shadow-sm"
                    }`}
                  >
                    <span>⚡</span> Componentes & Módulos
                  </button>
                </div>
              </div>

              {vistaModo === "galeria" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {productosFiltrados.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      producto={prod}
                      onSelect={(p) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {productosFiltrados.map((prod) => {
                    const theme = getProductCategoryTheme(prod);
                    return (
                      <div
                        key={prod.id}
                        onClick={() => setSelectedProduct(prod)}
                        style={{
                          backgroundColor: theme.bgHex,
                          borderColor: theme.borderHex,
                        }}
                        className={`border-2 hover:shadow-md rounded-2xl p-3 sm:p-4 shadow-2xs transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 group cursor-pointer`}
                      >
                        <div className={`relative w-full sm:w-28 md:w-32 h-36 sm:h-28 md:h-32 rounded-xl overflow-hidden ${theme.imageWrapper} border shrink-0`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={prod.imagenPrincipal}
                            alt={prod.nombre}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80";
                            }}
                          />
                          {prod.badge && (
                            <span className="absolute top-1.5 left-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                              {prod.badge}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1.5 w-full">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.badge}`}>
                              {prod.categoria}
                            </span>
                            {prod.esDigital ? (
                              <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60 flex items-center gap-1">
                                💾 Archivo .STL
                              </span>
                            ) : prod.envioGratis ? (
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                                <Truck className="w-3 h-3 text-emerald-600" /> Envío Gratis
                              </span>
                            ) : null}
                            <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold ml-auto sm:ml-0">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{prod.calificacion.toFixed(1)}</span>
                              <span className="text-slate-400 text-[11px] font-normal">({prod.reviewsCount})</span>
                            </div>
                          </div>

                          <h4 className={`text-sm sm:text-base font-bold text-slate-900 group-hover:${theme.accentText} transition-colors line-clamp-1`}>
                            {prod.nombre}
                          </h4>

                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {prod.subtitulo}
                          </p>

                          {prod.especificaciones && prod.especificaciones.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {prod.especificaciones.slice(0, 3).map((esp, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] font-medium text-slate-600 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200/70"
                                >
                                  <strong className="text-slate-800">{esp.nombre}:</strong> {esp.valor}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className={`flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 ${theme.divider}`}>
                          <div className="text-left sm:text-right">
                            <span className="text-base sm:text-lg font-black text-slate-900 font-mono block">
                              ${prod.precio.toLocaleString("es-MX")} MXN
                            </span>
                            {prod.precioOriginal && (
                              <span className="text-[11px] text-slate-400 line-through font-mono">
                                ${prod.precioOriginal.toLocaleString("es-MX")} MXN
                              </span>
                            )}
                            <span className={`text-[10px] font-medium block ${prod.esProximamente ? "text-amber-600 font-bold" : "text-emerald-600"}`}>
                              {prod.esProximamente
                                ? "Próximamente · Lista VIP"
                                : prod.stock > 0
                                ? `${prod.stock} disponibles`
                                : "Bajo pedido"}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProduct(prod);
                              }}
                              className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 transition-colors border border-slate-200/80 shadow-2xs"
                              title="Ver ficha técnica completa"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWhatsAppBuy(prod);
                              }}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-semibold shadow-xs hover:shadow transition-all ${
                                prod.esProximamente
                                  ? "bg-gradient-to-r from-amber-500 to-orange-600"
                                  : "bg-gradient-to-r from-emerald-600 to-teal-600"
                              }`}
                              title={prod.esProximamente ? "Apartar en Lista VIP por WhatsApp" : "Pedir por WhatsApp"}
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span className="hidden md:inline">{prod.esProximamente ? "Apartar" : "WhatsApp"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TUTORIALES DE MÓDULOS */}
          {activeTab === "tutoriales" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-red-600" />
                    Tutoriales Prácticos de Módulos Electrónicos
                  </h3>
                  <p className="text-xs text-slate-500">
                    Guías paso a paso con tabla de asignación de pines, esquemas de conexión y sketches C++.
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-500 shrink-0">
                  {tutorialesFiltrados.length} guías
                </span>
              </div>

              {vistaModo === "galeria" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {tutorialesFiltrados.map((tut) => (
                    <TutorialCard key={tut.id} tutorial={tut} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {tutorialesFiltrados.map((tut) => {
                    const theme = getTutorialCategoryTheme(tut);
                    return (
                      <Link
                        key={tut.id}
                        href={`/mrrobotto/tutoriales/${tut.slug}`}
                        style={{
                          backgroundColor: theme.bgHex,
                          borderColor: theme.borderHex,
                        }}
                        className="border-2 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group block"
                      >
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-2xs ${theme.badge}`}
                            >
                              {tut.categoria}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-700 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200">
                              {tut.chipPrincipal}
                            </span>
                            <span className="text-[10px] font-mono text-slate-600">
                              ⏱ {tut.tiempoEstimado}
                            </span>
                          </div>

                          <h4 className={`text-sm sm:text-base font-bold text-slate-900 group-hover:${theme.accentText} transition-colors`}>
                            {tut.nombre}
                          </h4>

                          <p className="text-xs text-slate-600 line-clamp-1 leading-relaxed">
                            {tut.subtitulo}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-700">
                            <span className="flex items-center gap-1 font-mono">
                              <Zap className="w-3.5 h-3.5 text-amber-500" />
                              Voltaje: {tut.voltajeOperacion}
                            </span>
                            <span className="flex items-center gap-1 font-mono">
                              <Cpu className="w-3.5 h-3.5 text-red-600" />
                              Protocolo: {tut.protocolo}
                            </span>
                            <span className="text-emerald-700 font-medium">
                              ✓ {tut.pines.length} pines mapeados
                            </span>
                          </div>
                        </div>

                        <div
                          style={{ borderTopColor: theme.borderHex }}
                          className="flex items-center justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0"
                        >
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-red-600 group-hover:translate-x-1 transition-all">
                            <span>Ver Tutorial</span>
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CURSOS PREMIUM Y MASTERCLASSES MAKER (SIN DC-3) */}
          {activeTab === "cursos-premium" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Cursos Premium & Masterclasses Maker (Sin DC-3)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Aprende diseño de circuitos con Altium, KiCad + IA y ensamble de kits a tu propio ritmo con tarifas accesibles de autoestudio.
                  </p>
                </div>

                {/* Filtro por Especialidad */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setFiltroCurso("todos")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      filtroCurso === "todos"
                        ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm"
                        : "bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm"
                    }`}
                  >
                    Todos ({cursosPremiumFiltrados.length})
                  </button>
                  <button
                    onClick={() => setFiltroCurso("diseno")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      filtroCurso === "diseno"
                        ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm"
                        : "bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm"
                    }`}
                  >
                    <span>⚡</span> Diseño Electrónico Maker
                  </button>
                  <button
                    onClick={() => setFiltroCurso("kits")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      filtroCurso === "kits"
                        ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm"
                        : "bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm"
                    }`}
                  >
                    <span>🦾</span> Cursos de Kits
                  </button>
                </div>
              </div>

              {vistaModo === "galeria" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {cursosPremiumFiltrados.map((curso) => (
                    <CourseCard key={curso.id} curso={curso} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {cursosPremiumFiltrados.map((curso) => (
                    <Link
                      key={curso.id}
                      href={`/mrrobotto/cursos/${curso.slug}`}
                      className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-3 sm:p-4 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 group block"
                    >
                      <div className="relative w-full sm:w-36 md:w-44 aspect-video sm:aspect-auto sm:h-28 rounded-xl overflow-hidden bg-slate-950 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={curso.portada}
                          alt={curso.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        <span className="absolute bottom-1.5 left-2 text-[10px] font-mono text-slate-300">
                          {curso.duracionTotal}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1.5 w-full">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200/60">
                            {curso.categoria}
                          </span>
                          {curso.esCapacitacionDocente && (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                              🎓 Docente STEAM
                            </span>
                          )}
                          {curso.certificacionDC3.incluida && (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 flex items-center gap-1">
                              <Award className="w-3 h-3 text-amber-600" /> DC-3 STPS vía {curso.certificacionDC3.plataformaCertificadoraNombre || "certimexico.com"}
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                          {curso.titulo}
                        </h4>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {curso.descripcionCorta}
                        </p>

                        <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                          <span>Instructor: <strong className="text-slate-800">{curso.instructor.nombre}</strong></span>
                          <span>•</span>
                          <span>{curso.totalLecciones} Lecciones</span>
                          <span>•</span>
                          <span className="capitalize">{curso.nivel}</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          <span className="text-base sm:text-lg font-black text-slate-900 font-mono block">
                            ${curso.precio.toLocaleString("es-MX")} MXN
                          </span>
                          {curso.precioOriginal && (
                            <span className="text-[11px] text-slate-400 line-through font-mono">
                              ${curso.precioOriginal.toLocaleString("es-MX")} MXN
                            </span>
                          )}
                        </div>

                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 group-hover:translate-x-1 transition-transform">
                          <span>Ver Programa</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* SECCIÓN CAPACITACIÓN PARA DOCENTES, CLUBES Y PREPARACIÓN WRO/SOLACYT (Al final de cursos premium) */}
              <div className="pt-4 sm:pt-6">
                <WROSection />
              </div>
            </div>
          )}

          {/* TAB 4: CURSOS CON CERTIFICACIÓN OFICIAL DC-3 STPS */}
          {activeTab === "cursos-dc3" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    Cursos de Diseño Electrónico con Constancia DC-3 STPS (Altium & KiCad + IA)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Programas acreditados legalmente ante la STPS en México. Evaluación y emisión oficial de constancia DC-3 realizada en{" "}
                    <a
                      href="https://certimexico.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:text-amber-700 font-bold underline decoration-amber-400/70 underline-offset-2"
                    >
                      certimexico.com
                    </a>
                    .
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-500 shrink-0">
                  {cursosDC3Filtrados.length} programas
                </span>
              </div>

              {vistaModo === "galeria" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {cursosDC3Filtrados.map((curso) => (
                    <CourseCard key={curso.id} curso={curso} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {cursosDC3Filtrados.map((curso) => (
                    <Link
                      key={curso.id}
                      href={`/mrrobotto/cursos/${curso.slug}`}
                      className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-3 sm:p-4 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 group block"
                    >
                      <div className="relative w-full sm:w-36 md:w-44 aspect-video sm:aspect-auto sm:h-28 rounded-xl overflow-hidden bg-slate-950 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={curso.portada}
                          alt={curso.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        <span className="absolute bottom-1.5 left-2 text-[10px] font-mono text-slate-300">
                          {curso.duracionTotal}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1.5 w-full">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200/60">
                            {curso.categoria}
                          </span>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 flex items-center gap-1">
                            <Award className="w-3 h-3 text-amber-600" /> Constancia DC-3 STPS vía {curso.certificacionDC3.plataformaCertificadoraNombre || "certimexico.com"} ({curso.certificacionDC3.horasAcreditadas} Horas)
                          </span>
                        </div>

                        <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                          {curso.titulo}
                        </h4>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {curso.descripcionCorta}
                        </p>

                        <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                          <span>Instructor: <strong className="text-slate-800">{curso.instructor.nombre}</strong></span>
                          <span>•</span>
                          <span>{curso.totalLecciones} Lecciones</span>
                          <span>•</span>
                          <span className="capitalize">{curso.nivel}</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          <span className="text-base sm:text-lg font-black text-slate-900 font-mono block">
                            ${curso.precio.toLocaleString("es-MX")} MXN
                          </span>
                          {curso.precioOriginal && (
                            <span className="text-[11px] text-slate-400 line-through font-mono">
                              ${curso.precioOriginal.toLocaleString("es-MX")} MXN
                            </span>
                          )}
                        </div>

                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 group-hover:translate-x-1 transition-transform">
                          <span>Ver Programa</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {/* Espaciador de seguridad para evitar que la barra inferior móvil tape el contenido */}
        <div className="h-10 md:hidden" aria-hidden="true" />
      </main>

      {/* Quick View Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative space-y-5 shadow-2xl">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedProduct.imagenPrincipal}
                alt={selectedProduct.nombre}
                className="w-full sm:w-56 aspect-square object-cover rounded-2xl bg-slate-50 border border-slate-200"
              />

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                    {selectedProduct.categoria}
                  </span>
                  {selectedProduct.esProximamente && (
                    <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                      ⏳ Próximamente · Preventa VIP
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{selectedProduct.nombre}</h3>
                <p className="text-xs text-slate-500">{selectedProduct.subtitulo}</p>

                <div className="pt-2">
                  <span className="text-2xl font-black text-slate-900 font-mono">
                    ${selectedProduct.precio.toLocaleString("es-MX")} MXN
                  </span>
                  {selectedProduct.precioOriginal && (
                    <span className="text-xs text-slate-400 line-through font-mono ml-2">
                      ${selectedProduct.precioOriginal}
                    </span>
                  )}
                </div>

                {selectedProduct.esDigital ? (
                  <div className="pt-2 text-xs text-indigo-600 flex items-center gap-1.5 font-medium">
                    <span>💾</span>
                    <span>Descarga digital instantánea en formatos: {selectedProduct.formatosArchivos?.join(", ")}</span>
                  </div>
                ) : selectedProduct.esProximamente ? (
                  <div className="pt-2 text-xs text-amber-700 flex items-center gap-1.5 font-medium">
                    <span>⏳</span>
                    <span>En fase final de validación — Aparta tu lugar en la Lista VIP por WhatsApp</span>
                  </div>
                ) : (
                  <div className="pt-2 text-xs text-emerald-600 flex items-center gap-1.5 font-medium">
                    <Truck className="w-4 h-4" />
                    <span>Envío inmediato a toda la República Mexicana</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <h4 className="font-bold text-slate-900 text-sm">Descripción del Producto</h4>
              <p className="text-slate-600 leading-relaxed">{selectedProduct.descripcion}</p>

              {selectedProduct.parametrosImpresion && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                  <p className="font-bold text-indigo-700">Parámetros recomendados de impresión 3D:</p>
                  <p className="text-slate-600">
                    Material: <strong>{selectedProduct.parametrosImpresion.material}</strong> • Infill: <strong>{selectedProduct.parametrosImpresion.infill}</strong> • Tiempo estimado: <strong>{selectedProduct.parametrosImpresion.tiempoEstimado}</strong> • Peso: <strong>{selectedProduct.parametrosImpresion.pesoFilamento}</strong>
                  </p>
                </div>
              )}

              {selectedProduct.especificaciones && (
                <div className="space-y-1.5 pt-2">
                  <h5 className="font-bold text-slate-900">Especificaciones Técnicas:</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedProduct.especificaciones.map((esp, i) => (
                      <div key={i} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                        <span className="text-slate-400 block text-[10px]">{esp.nombre}</span>
                        <span className="font-semibold text-slate-800">{esp.valor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <span className="text-[11px] sm:text-xs text-slate-500 text-center sm:text-left">
                {selectedProduct.esProximamente
                  ? "Únete a la lista de espera prioritaria sin costo por WhatsApp"
                  : "Atención y despacho inmediato por WhatsApp"}
              </span>

              <button
                onClick={() => handleWhatsAppBuy(selectedProduct)}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 ${
                  selectedProduct.esProximamente
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-amber-500/20"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20"
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>{selectedProduct.esProximamente ? "Apartar en Lista VIP por WhatsApp" : "Ordenar por WhatsApp"}</span>
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
