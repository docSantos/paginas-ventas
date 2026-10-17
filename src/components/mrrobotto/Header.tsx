// src/components/mrrobotto/Header.tsx
"use client";

import Link from "next/link";
import { Bot, ArrowLeft, Layers, ShoppingBag, Award, Sparkles } from "lucide-react";

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
      icon: ShoppingBag,
      isActive: isTiendaActive,
    },
    {
      id: "tutoriales",
      label: "Tutoriales",
      icon: Layers,
      isActive: isTutorialesActive,
    },
    {
      id: "cursos-premium",
      label: "Cursos Premium",
      icon: Sparkles,
      isActive: isCursosPremiumActive,
    },
    {
      id: "cursos-dc3",
      label: "Cursos DC-3",
      icon: Award,
      isActive: isCursosDC3Active,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-red-900/30 text-white shadow-xl">
      <div className="max-w-2xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Brand & Hub Link */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-900 flex items-center justify-center"
              title="Volver al Hub principal"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="h-5 w-px bg-slate-800" />

            <Link href="/mrrobotto" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-950/50 group-hover:scale-105 transition-transform shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-red-400 transition-colors whitespace-nowrap">
                Mr-Robotto
              </span>
            </Link>
          </div>

          {/* Navigation Controls (Desktop / Tablet) */}
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              if (onTabChange) {
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                      item.isActive
                        ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                        : "text-slate-300 hover:text-white hover:bg-slate-900"
                    }`}
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
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                    item.isActive
                      ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                      : "text-slate-300 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Navigation Controls (Mobile Bar: Horizontally scrollable row) */}
        <div className="sm:hidden pb-2.5 pt-0.5 overflow-x-auto no-scrollbar scrollbar-none flex items-center gap-1.5 border-t border-slate-900/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (onTabChange) {
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                    item.isActive
                      ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                      : "text-slate-300 bg-slate-900/60 border border-slate-800/80 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                href={`/mrrobotto?tab=${item.id}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  item.isActive
                    ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                    : "text-slate-300 bg-slate-900/60 border border-slate-800/80 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
