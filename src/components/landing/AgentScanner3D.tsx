'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Terminal,
  Activity,
  Scan,
  RotateCw,
  Eye,
  Sliders,
  ExternalLink,
} from 'lucide-react';

export function AgentScanner3D() {
  const [activeMode, setActiveMode] = useState<'all' | 'tc1' | 'tc2' | 'tc3'>('all');
  const [isScanning, setIsScanning] = useState(true);

  return (
    <div className="relative w-full max-w-xl mx-auto perspective-1000 select-none">
      {/* Outer Glow Halo behind scanner container */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 via-cyan-500/15 to-indigo-600/20 rounded-3xl blur-2xl -z-10" />

      {/* Main 3D Glassmorphic Viewport Frame */}
      <div className="relative rounded-3xl border border-slate-700/60 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 shadow-2xl overflow-hidden p-5 sm:p-6 text-white transform-style-3d">
        {/* Top Header Bar of Scanner */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <Scan className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold tracking-wider text-slate-200">
                  VELORA NEURAL DOM INSPECTOR
                </span>
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px] font-mono px-1.5 py-0.2 rounded">
                  v2.2-LIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Simulation Depth: 50 stops • Viewport: 1440×900
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsScanning((prev) => !prev)}
              className="text-[10px] font-mono font-semibold px-2 py-1 rounded-lg border border-slate-700 hover:border-slate-500 bg-slate-800/80 text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Activity className={`w-3 h-3 ${isScanning ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{isScanning ? 'PAUSE SCAN' : 'RESUME SCAN'}</span>
            </button>
          </div>
        </div>

        {/* 3D Viewport Simulation Area */}
        <div className="relative h-[340px] sm:h-[370px] w-full my-4 rounded-2xl bg-[#070d1e] border border-slate-800/80 overflow-hidden flex items-center justify-center">
          {/* Cybernetic Grid Background */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.15) 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Central Radial Cyan Spotlight */}
          <div className="absolute w-72 h-72 rounded-full bg-radial from-cyan-500/10 via-blue-600/5 to-transparent blur-xl pointer-events-none" />

          {/* Laser Scanning Sweep Beam */}
          {isScanning && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scanner-sweep pointer-events-none z-20">
              <div className="w-full h-8 -mt-4 bg-gradient-to-b from-cyan-400/15 to-transparent blur-xs pointer-events-none" />
            </div>
          )}

          {/* CENTRAL AGENT CORE WITH ORBITAL RINGS */}
          <div className="relative flex items-center justify-center">
            {/* Outer Orbital Ring 1 */}
            <div className="absolute w-56 h-56 rounded-full border border-dashed border-cyan-500/30 animate-orbit-cw pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_#60a5fa]" />
            </div>

            {/* Inner Orbital Ring 2 */}
            <div className="absolute w-40 h-40 rounded-full border border-dotted border-blue-400/40 animate-orbit-ccw pointer-events-none">
              <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
            </div>

            {/* Glowing Agent Core Sphere */}
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 flex items-center justify-center animate-pulse-core z-10 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-center">
                <Cpu className="w-5 h-5 text-cyan-300 mb-0.5" />
                <span className="text-[8px] font-mono font-bold text-cyan-200 uppercase tracking-tighter">
                  AGENT AI
                </span>
              </div>
            </div>
          </div>

          {/* FLOATING HUD CARDS (Positioned around core in 3D depth) */}

          {/* 1. Focus Visible Pass Card (Top-Left) */}
          <div
            className={`absolute top-4 left-3 sm:left-4 z-20 max-w-[210px] sm:max-w-[230px] rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2.5 shadow-lg animate-float-gentle transition-all ${
              activeMode === 'tc2' || activeMode === 'all'
                ? 'opacity-100 scale-100 ring-2 ring-emerald-500/40'
                : 'opacity-40 scale-95'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[9px] font-mono font-bold text-slate-400 truncate">
                button#cta-launch
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[8px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>PASS</span>
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-200 leading-tight">
              WCAG 2.4.7 Focus Visible
            </p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-blue-600 ring-2 ring-cyan-400 ring-offset-1 ring-offset-slate-900" />
              <code className="text-[9px] font-mono text-cyan-300 truncate">
                outline: 2px solid #2563eb
              </code>
            </div>
          </div>

          {/* 2. Focus Trap Detected Card (Bottom-Left) */}
          <div
            className={`absolute bottom-4 left-3 sm:left-4 z-20 max-w-[220px] sm:max-w-[240px] rounded-xl bg-slate-900/90 backdrop-blur-md border border-rose-500/40 p-2.5 shadow-lg animate-float-reverse transition-all ${
              activeMode === 'tc1' || activeMode === 'all'
                ? 'opacity-100 scale-100 ring-2 ring-rose-500/40'
                : 'opacity-40 scale-95'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[9px] font-mono font-bold text-rose-300 truncate">
                div#interactive-modal
              </span>
              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[8px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                <AlertTriangle className="w-2.5 h-2.5" />
                <span>TRAP</span>
              </span>
            </div>
            <p className="text-[10px] font-semibold text-white leading-tight">
              WCAG 2.1.2 No Keyboard Trap
            </p>
            <div className="mt-1 bg-black/50 p-1.5 rounded font-mono text-[9px] text-rose-300 border border-rose-500/20 flex items-center justify-between">
              <span>Tab loop: 12 cycles</span>
              <span className="text-slate-400">Esc: Blocked</span>
            </div>
          </div>

          {/* 3. Sub-pixel Photo Contrast Card (Right) */}
          <div
            className={`absolute top-12 right-3 sm:right-4 z-20 max-w-[200px] sm:max-w-[220px] rounded-xl bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 p-2.5 shadow-lg animate-float-gentle transition-all ${
              activeMode === 'tc3' || activeMode === 'all'
                ? 'opacity-100 scale-100 ring-2 ring-cyan-500/40'
                : 'opacity-40 scale-95'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[9px] font-mono font-bold text-slate-400 truncate">
                p.photo-overlay
              </span>
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[8px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                <ShieldCheck className="w-2.5 h-2.5" />
                <span>AA VERIFIED</span>
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-200 leading-tight">
              WCAG 1.4.3 Sub-Pixel Sampling
            </p>
            <div className="mt-1 flex items-center justify-between text-[9px] font-mono">
              <span className="text-slate-400">Underlying L2: 0.08</span>
              <span className="text-cyan-400 font-bold">10.4:1 Scrim</span>
            </div>
          </div>
        </div>

        {/* Interactive Mode Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mr-1">
              Inspect Barrier:
            </span>
            <button
              type="button"
              onClick={() => setActiveMode('all')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                activeMode === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              All Signals
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('tc1')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                activeMode === 'tc1'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              TC1 (Modal Trap)
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('tc2')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                activeMode === 'tc2'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              TC2 (Focus Ring)
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('tc3')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                activeMode === 'tc3'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              TC3 (Contrast)
            </button>
          </div>
        </div>

        {/* Telemetry Status Bar */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-bold">Agent Active</span>
            <span>•</span>
            <span>Latency: 18ms</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Playwright Subagent</span>
            <span>•</span>
            <span className="text-cyan-400 font-bold">0 False Positives</span>
          </div>
        </div>
      </div>
    </div>
  );
}
