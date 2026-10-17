// src/components/mrrobotto/DC3Banner.tsx
import { Award, ShieldCheck, FileCheck, CheckCircle2, Building2, GraduationCap } from "lucide-react";
import { CERTIFICACION_DC3_GLOBAL } from "@/data/mrrobottoData";

export function DC3Banner() {
  return (
    <section className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Background seal effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Information */}
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>VALIDEZ LABORAL Y CURRICULAR FEDERAL • STPS MÉXICO</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Cursos Técnicos con <span className="text-amber-400">Certificación Oficial DC-3</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Nuestros cursos premium incluyen la emisión de la <strong>Constancia de Competencias o Habilidades Laborales (Formato DC-3)</strong> avalada por un Agente Capacitador Externo con registro ante la Secretaría del Trabajo y Previsión Social (STPS).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            {CERTIFICACION_DC3_GLOBAL.beneficios.map((ben, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 text-[11px] leading-relaxed">{ben}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Digital Credential Mockup */}
        <div className="lg:col-span-4 bg-slate-950 border border-amber-500/40 rounded-2xl p-5 shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Acreditación STPS</p>
                <p className="text-xs font-mono font-bold text-white">FORMATO DC-3</p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
              40 Horas
            </span>
          </div>

          <div className="space-y-2 text-[11px] font-mono">
            <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[9px]">CLAVE DE REGISTRO:</span>
              <span className="text-amber-300 font-bold">{CERTIFICACION_DC3_GLOBAL.claveRegistroSTPS}</span>
            </div>
            <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[9px]">ÁREA DE COMPETENCIA:</span>
              <span className="text-slate-200">Robótica & Sistemas Embebidos</span>
            </div>
            <div className="bg-slate-900/90 p-2 rounded border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Verificación QR Digital</span>
              <span className="text-emerald-400 font-bold">✓ VÁLIDO</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 text-center mt-3">
            Emitido conforme a la Ley Federal del Trabajo (Art. 153-V)
          </p>
        </div>
      </div>
    </section>
  );
}
