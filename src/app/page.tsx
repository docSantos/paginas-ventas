// src/app/page.tsx
// Hub principal — portal de acceso a los módulos de la plataforma
import Link from "next/link";
import { Home, Car, Coffee, Truck, Cpu, LayoutDashboard } from "lucide-react";

const modules = [
  {
    href: "/casasgaby",
    icon: Home,
    title: "Casas Gaby",
    description: "Renta de casas vacacionales. Consulta disponibilidad, tarifas y realiza tu reserva.",
    color: "bg-teal-600",
    bgLight: "bg-teal-50",
    textColor: "text-teal-700",
    available: true,
  },
  {
    href: "/carrosgaby",
    icon: Car,
    title: "Carros Gaby",
    description: "Próximamente: catálogo de vehículos nuevos y seminuevos (Bestune / JIM).",
    color: "bg-blue-600",
    bgLight: "bg-blue-50",
    textColor: "text-blue-700",
    available: false,
  },
  {
    href: "/falvoltcafe",
    icon: Coffee,
    title: "FalVolt Café",
    description: "Próximamente: café de especialidad, bebidas, granos selectos y café molido.",
    color: "bg-amber-600",
    bgLight: "bg-amber-50",
    textColor: "text-amber-800",
    available: false,
  },
  {
    href: "/bretema",
    icon: Truck,
    title: "Brétema Servicios",
    description: "Próximamente: lavado técnico y sanitización normalizada de camiones y trailers.",
    color: "bg-emerald-600",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-700",
    available: false,
  },
  {
    href: "/ezelektronik",
    icon: Cpu,
    title: "EZ Elektronik",
    description: "Próximamente: proyectos maker, componentes electrónicos y desarrollo mecatrónico.",
    color: "bg-purple-600",
    bgLight: "bg-purple-50",
    textColor: "text-purple-700",
    available: false,
  },
  {
    href: "/central",
    icon: LayoutDashboard,
    title: "Consola Central",
    description: "Próximamente: métricas transversales, configuración global y ecosistema.",
    color: "bg-slate-700",
    bgLight: "bg-slate-50",
    textColor: "text-slate-800",
    available: false,
  },
];

export default function HubPage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50/40">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido a <span className="text-teal-600">Paginas IXA</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">Selecciona un módulo para continuar</p>
      </div>

      {/* Módulos */}
      <div className="flex-1 px-4 py-6 space-y-3.5 max-w-lg mx-auto w-full">
        {modules.map(({ href, icon: Icon, title, description, color, bgLight, textColor, available }) => (
          <div key={href} className="relative">
            {available ? (
              <Link href={href} className="block group">
                <div className="rounded-2xl p-4 border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                  <div className={`${color} rounded-xl p-3 shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h2 className={`font-semibold text-base ${textColor}`}>{title}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{description}</p>
                  </div>
                  <span className="ml-auto text-gray-400 group-hover:text-gray-600 text-lg">›</span>
                </div>
              </Link>
            ) : (
              <div className={`rounded-2xl p-4 border border-dashed border-gray-200 ${bgLight} flex items-start gap-4 opacity-75`}>
                <div className={`${color} rounded-xl p-3 shrink-0 opacity-50`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className={`font-semibold text-base ${textColor}`}>{title}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{description}</p>
                </div>
                <span className="ml-auto text-xs bg-gray-200 text-gray-600 rounded-full px-2.5 py-0.5 font-medium shrink-0">
                  Pronto
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <footer className="text-center text-xs text-gray-400 py-4">
        © {new Date().getFullYear()} Paginas Gaby
      </footer>
    </main>
  );
}