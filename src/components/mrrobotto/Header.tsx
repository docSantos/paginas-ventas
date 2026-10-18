// src/components/mrrobotto/Header.tsx
"use client";

import Link from "next/link";
import { Bot, ArrowLeft, Layers, ShoppingBag, Award, Sparkles, MessageCircle } from "lucide-react";

export type MrRobottoTabKey = "tienda" | "tutoriales" | "cursos-premium" | "cursos-dc3";

interface HeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Header({ activeTab = "tienda", onTabChange }: HeaderProps) {
  const isTiendaActive = activeTab === "tienda" || activeTab === "reel-tienda";
  const isTutorialesActive = activeTab === "tutoriales";
  const isCursosPremiumActive = activeTab === "cursos-premium";
  const isCursosDC3Active = activeTab === "cursos-dc3" || (activeTab === "cursos" && !isCursosPremiumActive);

  const navItems = [
    {
      id: "tienda",
      label: "Tienda",
      shortLabel: "Tienda",
      icon: ShoppingBag,
      isActive: isTiendaActive,
    },
    {
      id: "tutoriales",
      label: "Tutoriales",
      shortLabel: "Tutoriales",
      icon: Layers,
      isActive: isTutorialesActive,
    },
    {
      id: "cursos-premium",
      label: "Cursos Premium",
      shortLabel: "Premium",
      icon: Sparkles,
      isActive: isCursosPremiumActive,
    },
    {
      id: "cursos-dc3",
      label: "Cursos DC-3",
      shortLabel: "DC-3",
      icon: Award,
      isActive: isCursosDC3Active,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/90 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-13 sm:h-16 gap-2">
          {/* Brand & Hub Link */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              className="text-slate-500 hover:text-slate-900 transition-colors p-1.5 rounded-xl hover:bg-slate-100 flex items-center justify-center"
              title="Volver al Hub principal"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="h-5 w-px bg-slate-200" />

            <Link href="/mrrobotto" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 group-hover:text-red-600 transition-colors whitespace-nowrap">
                Mr-Robotto
              </span>
            </Link>
          </div>

          {/* Acceso rápido móvil: WhatsApp / Soporte Maker */}
          <div className="sm:hidden flex items-center gap-1.5">
            <a
              href="https://wa.me/5217440000000?text=%C2%A1Hola%20Mr-Robotto!%20Necesito%20asesor%C3%ADa%20con%20los%20kits%20o%20cursos."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[11px] font-bold hover:bg-emerald-100 transition-colors shadow-2xs"
              title="Asesoría directa por WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Soporte</span>
            </a>
          </div>

          {/* Navigation Controls (Desktop / Tablet) */}
          <nav className="hidden sm:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const buttonClass = `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                item.isActive
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm shadow-red-500/30"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`;

              if (onTabChange) {
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={buttonClass}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={`/mrrobotto?tab=${item.id}`}
                  className={buttonClass}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Navigation Controls (Mobile Bar: Segmented 4-Column Pill Bar) */}
        <div className="sm:hidden pb-2 pt-0.5 border-t border-slate-100/80">
          <div className="grid grid-cols-4 gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/70 shadow-2xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const mobileBtnClass = `flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] font-bold tracking-tight transition-all text-center min-w-0 ${
                item.isActive
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`;

              if (onTabChange) {
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={mobileBtnClass}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        item.isActive
                          ? "text-white"
                          : item.id === "cursos-premium" || item.id === "cursos-dc3"
                          ? "text-amber-500"
                          : "text-slate-500"
                      }`}
                    />
                    <span className="truncate">{item.shortLabel}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={`/mrrobotto?tab=${item.id}`}
                  className={mobileBtnClass}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      item.isActive
                        ? "text-white"
                        : item.id === "cursos-premium" || item.id === "cursos-dc3"
                        ? "text-amber-500"
                        : "text-slate-500"
                    }`}
                  />
                  <span className="truncate">{item.shortLabel}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
