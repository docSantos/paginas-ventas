// src/components/mrrobotto/BottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, BookOpen, Award, Sparkles, Home } from "lucide-react";

interface BottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/mrrobotto";

  const handleTabClick = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isTiendaActive = activeTab === "tienda" || activeTab === "reel-tienda";
  const isTutorialesActive = activeTab === "tutoriales";
  const isCursosPremiumActive = activeTab === "cursos-premium";
  const isCursosDC3Active = activeTab === "cursos-dc3" || (activeTab === "cursos" && !isCursosPremiumActive);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-2xl mx-auto px-1 sm:px-2">
        {/* Tab 1: Tienda */}
        {isHomePage && onTabChange ? (
          <button
            onClick={() => handleTabClick("tienda")}
            className={`flex flex-col items-center justify-center gap-1 px-1.5 py-1 rounded-xl transition-all flex-1 min-w-0 ${
              isTiendaActive
                ? "text-red-500 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShoppingBag className={`w-5 h-5 ${isTiendaActive ? "stroke-[2.5px]" : ""}`} />
            <span className="text-[10px] tracking-tight truncate">Tienda</span>
          </button>
        ) : (
          <Link
            href="/mrrobotto?tab=tienda"
            className="flex flex-col items-center justify-center gap-1 px-1.5 py-1 rounded-xl transition-all flex-1 min-w-0 text-slate-400 hover:text-slate-200"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] tracking-tight truncate">Tienda</span>
          </Link>
        )}

        {/* Tab 2: Tutoriales */}
        {isHomePage && onTabChange ? (
          <button
            onClick={() => handleTabClick("tutoriales")}
            className={`flex flex-col items-center justify-center gap-1 px-1.5 py-1 rounded-xl transition-all flex-1 min-w-0 ${
              isTutorialesActive
                ? "text-red-500 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className={`w-5 h-5 ${isTutorialesActive ? "stroke-[2.5px]" : ""}`} />
            <span className="text-[10px] tracking-tight truncate">Tutoriales</span>
          </button>
        ) : (
          <Link
            href="/mrrobotto?tab=tutoriales"
            className="flex flex-col items-center justify-center gap-1 px-1.5 py-1 rounded-xl transition-all flex-1 min-w-0 text-slate-400 hover:text-slate-200"
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] tracking-tight truncate">Tutoriales</span>
          </Link>
        )}

        {/* Tab 3: Cursos Premium */}
        {isHomePage && onTabChange ? (
          <button
            onClick={() => handleTabClick("cursos-premium")}
            className={`flex flex-col items-center justify-center gap-1 px-1.5 py-1 rounded-xl transition-all flex-1 min-w-0 ${
              isCursosPremiumActive
                ? "text-red-500 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className={`w-5 h-5 ${isCursosPremiumActive ? "stroke-[2.5px] text-amber-400" : ""}`} />
            <span className="text-[10px] tracking-tight truncate">C. Premium</span>
          </button>
        ) : (
          <Link
            href="/mrrobotto?tab=cursos-premium"
            className="flex flex-col items-center justify-center gap-1 px-1.5 py-1 rounded-xl transition-all flex-1 min-w-0 text-slate-400 hover:text-slate-200"
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] tracking-tight truncate">C. Premium</span>
          </Link>
        )}

        {/* Tab 4: Cursos DC-3 */}
        {isHomePage && onTabChange ? (
          <button
            onClick={() => handleTabClick("cursos-dc3")}
            className={`flex flex-col items-center justify-center gap-1 px-1.5 py-1 rounded-xl transition-all flex-1 min-w-0 ${
              isCursosDC3Active
                ? "text-amber-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Award className={`w-5 h-5 ${isCursosDC3Active ? "stroke-[2.5px]" : ""}`} />
            <span className="text-[10px] tracking-tight truncate">Cursos DC-3</span>
          </button>
        ) : (
          <Link
            href="/mrrobotto?tab=cursos-dc3"
            className="flex flex-col items-center justify-center gap-1 px-1.5 py-1 rounded-xl transition-all flex-1 min-w-0 text-slate-400 hover:text-slate-200"
          >
            <Award className="w-5 h-5" />
            <span className="text-[10px] tracking-tight truncate">Cursos DC-3</span>
          </Link>
        )}

        {/* Tab 5: Hub */}
        <Link
          href="/"
          className="flex flex-col items-center justify-center gap-1 px-1.5 py-1 rounded-xl transition-all flex-1 min-w-0 text-slate-400 hover:text-white"
          title="Ir al Hub general"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight truncate">Hub</span>
        </Link>
      </div>
    </nav>
  );
}
