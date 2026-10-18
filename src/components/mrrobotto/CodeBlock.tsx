// src/components/mrrobotto/CodeBlock.tsx
"use client";

import { useState } from "react";
import { Check, Copy, Download, Terminal } from "lucide-react";

interface CodeBlockProps {
  code: string;
  filename?: string;
  language?: string;
}

export function CodeBlock({ code, filename = "sketch.ino", language = "arduino" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar al portapapeles:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-300 bg-slate-950 text-slate-100 shadow-md my-4">
      {/* Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 text-xs">
        <div className="flex items-center gap-2 text-neutral-300">
          <Terminal className="w-4 h-4 text-rose-400" />
          <span className="font-mono font-medium text-neutral-200">{filename}</span>
          <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded-full font-mono uppercase">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors text-[11px]"
            title="Descargar archivo .ino"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Descargar .ino</span>
          </button>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all text-[11px] ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-sm"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Código</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Text */}
      <div className="p-4 overflow-x-auto text-[13px] font-mono leading-relaxed bg-[#0c0e12] text-neutral-200 selection:bg-rose-600 selection:text-white">
        <pre className="whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>

      <div className="px-4 py-2 bg-neutral-900/60 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex items-center justify-between">
        <span>💡 Sketch listo para compilar en <strong>Arduino IDE 2.x</strong> o simulador Wokwi.</span>
        <span className="hidden md:inline text-neutral-500 font-mono">{code.split("\n").length} líneas</span>
      </div>
    </div>
  );
}
