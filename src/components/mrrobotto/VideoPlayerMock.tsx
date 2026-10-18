// src/components/mrrobotto/VideoPlayerMock.tsx
"use client";

import { useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  CheckCircle,
  Award
} from "lucide-react";

interface VideoPlayerMockProps {
  title: string;
  duration?: string;
  videoUrl?: string;
  onLessonComplete?: () => void;
  isCompleted?: boolean;
  hasDC3Badge?: boolean;
}

export function VideoPlayerMock({
  title,
  duration = "15:00",
  videoUrl,
  onLessonComplete,
  isCompleted = false,
  hasDC3Badge = true
}: VideoPlayerMockProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(25);
  const [speed, setSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-300 shadow-md relative group">
      {/* Video Screen */}
      <div className="relative aspect-video w-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 flex items-center justify-center select-none overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Video Header Overlay */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-700/60 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-medium text-neutral-200 truncate max-w-xs sm:max-w-md">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {hasDC3Badge && (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                <Award className="w-3 h-3 text-amber-400" /> Acreditado DC-3
              </span>
            )}
            {isCompleted ? (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                <CheckCircle className="w-3.5 h-3.5" />
                Completada
              </span>
            ) : onLessonComplete ? (
              <button
                onClick={onLessonComplete}
                className="bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-md transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Marcar vista
              </button>
            ) : null}
          </div>
        </div>

        {/* Center Play Button */}
        <button
          onClick={togglePlay}
          className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-950/60 hover:scale-105 transition-all"
        >
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>

        {/* Watermark */}
        <div className="absolute bottom-16 right-4 text-right pointer-events-none opacity-40 hidden sm:block">
          <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">Mr-Robotto Academy</p>
          <p className="text-xs font-mono text-rose-300">1080p 60fps • Masterclass</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-neutral-900/95 border-t border-neutral-800 p-3 sm:px-4 text-neutral-200">
        <div className="relative mb-2 flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-rose-500 hover:h-2 transition-all"
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="p-1 rounded hover:bg-neutral-800 text-neutral-200">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button onClick={() => setProgress(0)} className="p-1 rounded hover:bg-neutral-800 text-neutral-400">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setIsMuted(!isMuted)} className="p-1 rounded hover:bg-neutral-800 text-neutral-400">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <span className="font-mono text-[11px] text-neutral-400">03:45 / {duration}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2 py-1 rounded bg-neutral-800 text-neutral-300 font-mono text-[11px]"
              >
                {speed}x
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-8 right-0 bg-neutral-800 border border-neutral-700 rounded-xl py-1 z-30 min-w-[70px] shadow-xl">
                  {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSpeed(s); setShowSpeedMenu(false); }}
                      className="block w-full text-left px-3 py-1 text-[11px] hover:bg-rose-600 hover:text-white"
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="p-1 rounded hover:bg-neutral-800 text-neutral-400">
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
