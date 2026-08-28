// src/app/page.tsx
// Hub principal — portal de acceso a los módulos de la plataforma
import Link from "next/link";
import { Home, Car, Zap } from "lucide-react";

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
    href: "/gabycarros",
    icon: Car,
    title: "Gaby Carros",
    description: "Próximamente: venta y renta de vehículos.",
    color: "bg-blue-600",
    bgLight: "bg-blue-50",
    textColor: "text-blue-700",
    available: false,
  },
  {
    href: "/electronica",
    icon: Zap,
    title: "Electrónica",
    description: "Próximamente: catálogo de productos electrónicos.",
    color: "bg-purple-600",
    bgLight: "bg-purple-50",
    textColor: "text-purple-700",
    available: false,
  },
];

export default function HubPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido a <span className="text-teal-600">Paginas Gaby</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">Selecciona un módulo para continuar</p>
      </div>

      {/* Módulos */}
      <div className="flex-1 px-4 py-6 space-y-4 max-w-lg mx-auto w-full">
        {modules.map(({ href, icon: Icon, title, description, color, bgLight, textColor, available }) => (
          <div key={href} className="relative">
            {available ? (
              <Link href={href} className="block group">
                <div className={`rounded-2xl p-4 border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow flex items-start gap-4`}>
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
              <div className={`rounded-2xl p-4 border border-dashed border-gray-200 ${bgLight} flex items-start gap-4 opacity-60`}>
                <div className={`${color} rounded-xl p-3 shrink-0 opacity-40`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className={`font-semibold text-base ${textColor}`}>{title}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{description}</p>
                </div>
                <span className="ml-auto text-xs bg-gray-200 text-gray-500 rounded-full px-2 py-0.5 shrink-0">Pronto</span>
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
