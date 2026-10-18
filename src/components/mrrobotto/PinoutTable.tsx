// src/components/mrrobotto/PinoutTable.tsx
import { PinConexion } from "@/types/mrrobotto";
import { ArrowRightLeft, ShieldAlert } from "lucide-react";

interface PinoutTableProps {
  pines: PinConexion[];
  chipName?: string;
}

const COLOR_MAP: Record<string, string> = {
  Rojo: "bg-red-500",
  Negro: "bg-neutral-800",
  Azul: "bg-blue-500",
  Amarillo: "bg-yellow-400",
  Verde: "bg-emerald-500",
  Naranja: "bg-orange-500",
  Blanco: "bg-slate-200 border border-slate-400",
};

export function PinoutTable({ pines, chipName = "Módulo" }: PinoutTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-xs my-4">
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-red-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Tabla de Conexionado y Asignación de Pines
          </h4>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">
          {pines.length} conexiones requeridas
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/90 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3 font-semibold">Pin {chipName}</th>
              <th className="py-2.5 px-3 font-semibold">Pin en Arduino</th>
              <th className="py-2.5 px-3 font-semibold">Color Sugerido</th>
              <th className="py-2.5 px-3 font-semibold">Tipo de Señal</th>
              <th className="py-2.5 px-3 font-semibold">Notas Técnicas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans text-slate-700">
            {pines.map((pin, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2.5 px-3 font-mono font-bold text-red-600">
                  {pin.pinModulo}
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                  {pin.pinArduino}
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-3 h-3 rounded-full shrink-0 shadow-xs ${
                        COLOR_MAP[pin.colorCable] || "bg-slate-400"
                      }`}
                    />
                    <span className="text-[11px] text-slate-500">{pin.colorCable}</span>
                  </div>
                </td>
                <td className="py-2.5 px-3">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    {pin.tipoSenal}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-[11px] text-slate-500 max-w-xs">
                  {pin.nota}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 border-t border-amber-200/80 px-4 py-2.5 flex items-start gap-2 text-[11px] text-amber-900">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
        <span>
          <strong>Atención de Seguridad:</strong> Verifica que la polaridad de alimentación (VCC a 5V/3.3V y GND a tierra) esté correcta antes de conectar el microcontrolador al puerto USB para evitar daños por sobretensión o corto.
        </span>
      </div>
    </div>
  );
}
