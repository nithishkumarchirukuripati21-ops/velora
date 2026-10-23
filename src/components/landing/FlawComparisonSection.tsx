'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Keyboard,
  Layers,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Play,
  Pause,
  CornerDownLeft,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';

export function FlawComparisonSection() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isTrapActive, setIsTrapActive] = useState<boolean>(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  // Modal elements in sequence
  const elements = [
    { id: 'close-btn', label: 'Close Button [×]', type: 'button' },
    { id: 'input-name', label: 'Billing Name Input', type: 'input' },
    { id: 'input-email', label: 'Work Email Input', type: 'input' },
    { id: 'submit-btn', label: 'Confirm Payment', type: 'button' },
  ];

  // Auto-advance loop simulating Tab keystrokes
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (isTrapActive) {
          // If trapped: cycles 0 -> 1 -> 2 -> 3 -> then gets stuck or drops focus to body
          return (prev + 1) % elements.length;
        } else {
          // Velora remediated loop: smooth cycling with escape listener
          return (prev + 1) % elements.length;
        }
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isTrapActive, elements.length]);

  return (
    <section id="runtime-flaw" className="relative py-28 bg-[#030712] text-slate-100 overflow-hidden">
      {/* Background Cybernetic Grid & Ambient Spotlights */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            THE RUNTIME DIMENSION
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            The 3-Dimensional Flaw in Modern Frontends
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
            Static AST parsers inspect dead HTML strings. Real accessibility only exists inside the live, dynamic event loop where keyboards traverse, focus stacks nest, and backgrounds render.
          </p>
        </motion.div>

        {/* Dual Interactive Terminals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-12">
          {/* LEFT TERMINAL: Legacy Syntax Parsers */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-rose-500/30 bg-slate-950/90 backdrop-blur-xl p-6 sm:p-7 shadow-[0_0_40px_rgba(244,63,94,0.08)] flex flex-col justify-between"
          >
            <div>
              {/* Terminal Titlebar */}
              <div className="flex items-center justify-between pb-4 border-b border-rose-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_8px_#f43f5e]" />
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <span className="ml-2 font-mono text-xs text-rose-400 font-bold tracking-wider">
                    PARSER_FAIL // STATIC_AST_SCANNER_v2.4
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-rose-950/70 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded">
                  SYNTAX BLIND
                </span>
              </div>

              {/* Code Snippet Under Inspection */}
              <div className="mt-5 p-4 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs text-slate-300 space-y-1.5">
                <div className="text-slate-500">// Static check: AST parser marks clean</div>
                <div className="text-rose-400 font-medium">
                  &lt;<span className="text-pink-400">div</span> <span className="text-amber-300">class</span>=<span className="text-emerald-300">&quot;btn-payment&quot;</span> <span className="text-cyan-300">onClick</span>=&#123;openCheckout&#125;&gt;
                </div>
                <div className="pl-4 text-slate-200">Submit Payment</div>
                <div className="text-rose-400 font-medium">&lt;/<span className="text-pink-400">div</span>&gt;</div>
              </div>

              {/* Static Analysis Diagnostic Log */}
              <div className="mt-5 space-y-3 font-mono text-xs">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 text-rose-200">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-rose-300">Missed Runtime Barriers: 67%</span>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                      Parser reports 0 errors because HTML tags are structurally valid. Blind to missing <code className="text-rose-300 font-mono">tabIndex</code>, keydown handlers, and accessibility trees.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300">Unconstrained Focus Leak</span>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                      Modal opens without focus isolation. Blind keyboard users Tab straight out into background obscured DOM elements.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Alert Banner */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">RUNTIME CONFIDENCE:</span>
              <span className="text-rose-400 font-bold bg-rose-950/60 px-2.5 py-1 rounded border border-rose-500/30">
                CRITICAL BLINDSPOT DETECTED
              </span>
            </div>
          </motion.div>

          {/* RIGHT TERMINAL: Velora Autonomous Engine */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-cyan-500/40 bg-slate-950/90 backdrop-blur-xl p-6 sm:p-7 shadow-[0_0_40px_rgba(6,182,212,0.12)] flex flex-col justify-between"
          >
            <div>
              {/* Terminal Titlebar */}
              <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <span className="ml-2 font-mono text-xs text-cyan-300 font-bold tracking-wider">
                    VELORA_CORE // RUNTIME_DOM_ENGINE_v4.2
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  RUNTIME ACTIVE
                </span>
              </div>

              {/* Live Keyboard Tracer Visualization */}
              <div className="mt-5 p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 font-mono text-xs text-slate-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-cyan-400 pb-1 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Keyboard className="w-3.5 h-3.5" /> LIVE KEYBOARD FOCUS TRACER
                  </span>
                  <span className="text-emerald-400 font-semibold">12-CYCLE DETERMINED</span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">FOCUS STACK:</span>
                    <span className="text-slate-400">[document.activeElement]</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-cyan-500/20 text-[11px] flex items-center gap-2 text-cyan-300">
                    <span className="text-slate-500">→</span>
                    <span className="text-white font-bold">{elements[activeStep]?.label}</span>
                    <span className="text-xs text-cyan-400">({elements[activeStep]?.id})</span>
                  </div>
                </div>
              </div>

              {/* Real-Time Telemetry & Synthesis Evidence */}
              <div className="mt-5 space-y-3 font-mono text-xs">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-cyan-950/20 border border-cyan-900/40 text-cyan-200">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-cyan-300">Trapped Focus Barrier Disarmed</span>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                      Velora agent automatically binds dynamic Escape hook & bounds Tab navigation strictly within the active dialog container.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-emerald-200">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-300">Autonomous AST Remediation Ready</span>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                      Synthesized semantic <code className="text-emerald-300 font-mono">&lt;button type=&quot;button&quot;&gt;</code> with ARIA attributes and zero runtime overhead.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status Banner */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">WCAG 2.2 AA VERIFICATION:</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% RUNTIME PROBED
              </span>
            </div>
          </motion.div>
        </div>

        {/* LIVE SIMULATION CARD: Keystroke Bounce & Focus Ring Demo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/95 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          {/* Subtle accent border glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          {/* Simulation Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold">
                  INTERACTIVE SIMULATOR
                </span>
                <span className="text-slate-400 text-xs font-mono">
                  Runtime Keystroke Tracer Cycle
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Modal Focus Trap & Navigation Loop
              </h3>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsTrapActive((prev) => !prev)}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all border ${
                  isTrapActive
                    ? 'bg-rose-950/60 border-rose-500/40 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                    : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                }`}
              >
                {isTrapActive ? 'SIMULATING: BROKEN TRAP' : 'SIMULATING: VELORA REMEDIATED'}
              </button>

              <button
                type="button"
                onClick={() => setIsAutoPlaying((prev) => !prev)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                title={isAutoPlaying ? 'Pause Cycle' : 'Play Cycle'}
              >
                {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-cyan-400" />}
              </button>
            </div>
          </div>

          {/* Simulated Keystroke Tracer Ribbon */}
          <div className="py-4 flex flex-wrap items-center justify-center gap-2 font-mono text-xs text-slate-400">
            <span className="text-slate-500">KEYSTROKE STREAM:</span>
            {elements.map((el, idx) => (
              <React.Fragment key={el.id}>
                <span
                  className={`px-2.5 py-1 rounded-lg border transition-all duration-300 font-bold ${
                    activeStep === idx
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  [TAB] {el.id}
                </span>
                {idx < elements.length - 1 && <span className="text-slate-600">→</span>}
              </React.Fragment>
            ))}
            <span className="text-slate-600">→</span>
            <span
              className={`px-2.5 py-1 rounded-lg border text-[11px] ${
                !isTrapActive
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
              }`}
            >
              {!isTrapActive ? '[ESC] SAFE RETURN' : '[TRAP: NO ESCAPE]'}
            </span>
          </div>

          {/* Mock Interactive Dialog Window */}
          <div className="mt-4 p-6 sm:p-8 max-w-lg mx-auto rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl relative">
            {/* Modal Dialog Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h4 className="text-base font-bold text-white">Confirm Subscription</h4>
                <p className="text-xs text-slate-400">Interactive live sandbox modal</p>
              </div>
              <button
                type="button"
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                  activeStep === 0
                    ? 'ring-2 ring-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                ✕
              </button>
            </div>

            {/* Modal Inputs */}
            <div className="py-4 space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Full Name
                </label>
                <div
                  className={`w-full px-3 py-2 rounded-xl bg-slate-900 text-xs font-mono transition-all ${
                    activeStep === 1
                      ? 'ring-2 ring-cyan-400 bg-slate-900 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'border border-slate-800 text-slate-500'
                  }`}
                >
                  Jane Doe
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Company Email
                </label>
                <div
                  className={`w-full px-3 py-2 rounded-xl bg-slate-900 text-xs font-mono transition-all ${
                    activeStep === 2
                      ? 'ring-2 ring-cyan-400 bg-slate-900 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'border border-slate-800 text-slate-500'
                  }`}
                >
                  jane@enterprise.corp
                </div>
              </div>
            </div>

            {/* Modal Footer Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-400"
              >
                Cancel
              </button>
              <button
                type="button"
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeStep === 3
                    ? 'ring-2 ring-cyan-400 bg-cyan-500 text-slate-950 font-black shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                    : 'bg-blue-600 text-white hover:bg-blue-500'
                }`}
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
