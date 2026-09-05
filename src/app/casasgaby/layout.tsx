import type { Metadata } from "next";
import { Header } from "@/components/casasgaby/Header";
import { BottomNav } from "@/components/casasgaby/BottomNav";
import { ChatWidget } from "@/components/casasgaby/ChatWidget";
import { createClient } from '@/lib/supabase/server';
import { MaintenanceView } from '@/components/MaintenanceView';

export const metadata: Metadata = {
  title: {
    template: "%s | Casas Gaby",
    default: "Casas Gaby — Renta de casas vacacionales",
  },
  description:
    "Casas vacacionales en renta. Encuentra el lugar perfecto para tus vacaciones con Casas Gaby.",
};

export default async function CasasGabyLayout({ children }: LayoutProps<"/casasgaby">) {
  const supabase = await createClient();
  const { data: tenant } = await supabase.schema('hospedaje').from('tenants_config').select('activo').eq('id', 'casasgaby').maybeSingle() as { data: any };
  
  if (tenant && tenant.activo === false) {
    return (
      <div className="flex flex-col min-h-screen max-w-2xl mx-auto bg-white shadow-sm relative">
        <MaintenanceView />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen max-w-2xl mx-auto bg-white shadow-sm relative">
      {/* Top header */}
      <Header />

      {/* Área de contenido principal */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Widget Flotante del Chat */}
      <ChatWidget />

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}
