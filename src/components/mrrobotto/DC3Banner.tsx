// src/components/mrrobotto/DC3Banner.tsx
import { Award, ShieldCheck, CheckCircle2, ExternalLink, Globe } from "lucide-react";
import { CERTIFICACION_DC3_GLOBAL } from "@/data/mrrobottoData";

export function DC3Banner() {
  const certUrl = CERTIFICACION_DC3_GLOBAL.plataformaCertificadoraUrl || "https://certimexico.com";
  const certName = CERTIFICACION_DC3_GLOBAL.plataformaCertificadoraNombre || "certimexico.com";

  return (
    <section className="bg-gradient-to-br from-amber-50/70 via-white to-slate-50 border border-amber-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xs relative overflow-hidden">
      {/* Background seal effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
        {/* Left Information */}
        <div className="lg:col-span-8 space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-[10px] sm:text-xs font-semibold backdrop-blur-sm">
              <Award className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">VALIDEZ LABORAL Y CURRICULAR FEDERAL • STPS MÉXICO</span>
            </div>

            <a
              href={certUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-amber-300 text-[10px] sm:text-xs font-bold transition-all shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Certificación realizada en {certName}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Diseño Electrónico Profesional con{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-700">
              Certificación Oficial DC-3
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Nuestros programas especializados en{" "}
            <strong className="text-slate-900">Altium Designer</strong> y{" "}
            <strong className="text-slate-900">KiCad + Inteligencia Artificial</strong>{" "}
            incluyen la evaluación y emisión de la{" "}
            <strong className="text-slate-900">
              Constancia de Competencias o Habilidades Laborales (Formato DC-3)
            </strong>{" "}
            ante la Secretaría del Trabajo y Previsión Social (STPS), gestionada y realizada directamente a través de la plataforma certificadora{" "}
            <a
              href={certUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-amber-700 underline decoration-amber-400 hover:text-amber-900 transition-colors"
            >
              {certName}
            </a>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1 text-xs">
            {CERTIFICACION_DC3_GLOBAL.beneficios.map((ben, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-white/95 p-2.5 sm:p-3 rounded-xl border border-amber-200/70 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="text-slate-700 text-[11px] leading-relaxed">{ben}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Digital Credential Mockup */}
        <div className="lg:col-span-4 bg-white border-2 border-amber-300/80 rounded-2xl p-4 sm:p-5 shadow-md relative backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500">Acreditación Oficial STPS</p>
                <p className="text-xs font-mono font-bold text-slate-900">FORMATO DC-3 • {certName.toUpperCase()}</p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded font-bold">
              {CERTIFICACION_DC3_GLOBAL.horasAcreditadas} Horas
            </span>
          </div>

          <div className="space-y-2 text-[11px] font-mono">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-slate-400 block text-[9px]">PLATAFORMA CERTIFICADORA:</span>
              <a
                href={certUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 font-bold hover:underline flex items-center justify-between"
              >
                <span>{certUrl}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-slate-400 block text-[9px]">ESPECIALIDADES DC-3:</span>
              <span className="text-slate-800 font-semibold font-sans">Altium Designer & KiCad + IA</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <span className="text-slate-500 font-sans">Validez Curricular STPS</span>
              <span className="text-emerald-700 font-bold font-sans">✓ VERIFICADO</span>
            </div>
          </div>

          <a
            href={certUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Globe className="w-4 h-4" />
            <span>Ir a {certName}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <p className="text-[10px] text-slate-400 text-center font-mono">
            Emitido conforme a la Ley Federal del Trabajo (Art. 153-V)
          </p>
        </div>
      </div>
    </section>
  );
}
