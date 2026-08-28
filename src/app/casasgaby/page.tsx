// src/app/casasgaby/page.tsx
// Catálogo principal de casas vacacionales
// Server Component — obtiene propiedades desde Supabase (o usa mock data en modo demo)
import { PropertyCard } from "@/components/casasgaby/PropertyCard";
import { PropertyCardSkeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import { MOCK_PROPIEDADES } from "@/types/casasgaby";
import type { Propiedad } from "@/types/casasgaby";
import { Search } from "lucide-react";

export const metadata = {
  title: "Catálogo de Casas",
};

async function getPropiedades(): Promise<{ data: Propiedad[]; isDemo: boolean }> {
  if (!isSupabaseConfigured()) {
    return { data: MOCK_PROPIEDADES, isDemo: true };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("propiedades")
      .select("*")
      .eq("activa", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error.message);
      return { data: MOCK_PROPIEDADES, isDemo: true };
    }

    return { data: data ?? [], isDemo: false };
  } catch {
    return { data: MOCK_PROPIEDADES, isDemo: true };
  }
}

function CatalogoSkeleton() {
  return (
    <div className="grid gap-4 px-4">
      {[1, 2, 3].map((i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

async function CatalogoContent() {
  const { data: propiedades, isDemo } = await getPropiedades();

  return (
    <div className="space-y-4">
      {/* Banner modo demo */}
      {isDemo && (
        <div className="mx-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          <strong>Modo demo:</strong> Configura tus credenciales de Supabase en{" "}
          <code className="bg-amber-100 px-1 rounded">.env.local</code> para usar datos reales.
        </div>
      )}

      {propiedades.length === 0 ? (
        <div className="mx-4 text-center py-16 text-gray-500">
          <div className="text-4xl mb-3">🏠</div>
          <p className="font-medium">No hay casas disponibles</p>
          <p className="text-sm mt-1">Vuelve pronto, estamos agregando nuevas propiedades.</p>
        </div>
      ) : (
        <div className="grid gap-4 px-4">
          {propiedades.map((propiedad) => (
            <PropertyCard key={propiedad.id} propiedad={propiedad} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CasasGabyPage() {
  return (
    <div className="space-y-4 py-4">
      {/* Barra de búsqueda (visual — funcional en Fase 2) */}
      <div className="px-4">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 h-11 text-gray-400 cursor-pointer hover:bg-gray-200 transition-colors">
          <Search className="w-4 h-4 shrink-0" />
          <span className="text-sm">Buscar casas disponibles...</span>
        </div>
      </div>

      {/* Encabezado de sección */}
      <div className="px-4">
        <h2 className="text-lg font-bold text-gray-900">Casas disponibles</h2>
        <p className="text-sm text-gray-500">Elige la casa perfecta para tus vacaciones</p>
      </div>

      {/* Catálogo con Suspense para carga progresiva */}
      <Suspense fallback={<CatalogoSkeleton />}>
        <CatalogoContent />
      </Suspense>
    </div>
  );
}
