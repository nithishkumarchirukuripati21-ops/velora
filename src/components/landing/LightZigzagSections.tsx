'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Keyboard,
  ShieldCheck,
  Zap,
  Sliders,
  Eye,
  Crosshair,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Cpu,
  Layers,
  ArrowRight,
  Check,
  X,
  Play,
  Pause,
} from 'lucide-react';

// Refined smooth spring entrance per user specification
const entranceAnimation = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

export function LightZigzagSections() {
  // ─── Card 1: Live Animated Keyboard Focus Tracer ───
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isTrapSimulated, setIsTrapSimulated] = useState<boolean>(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  const tracerSteps = [
    { id: 'addr', name: 'Address Bar', desc: 'http://localhost:3000' },
    { id: 'modal', name: 'Modal Window', desc: 'div#modal-root' },
    { id: 'email', name: 'Input: Email', desc: 'input#user-email' },
    { id: 'trap', name: '[Loop Alert: Unhandled Escape]', desc: 'Cyclic Tab Trap' },
  ];

  // Cycles automatically every 2.5 seconds as requested
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % tracerSteps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, tracerSteps.length]);

  // ─── Card 2: Sub-Pixel Luminance Real-time Reticle Glide ───
  const [isScrimActive, setIsScrimActive] = useState<boolean>(false);
  const [reticlePhase, setReticlePhase] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const reticleInterval = setInterval(() => {
      setReticlePhase((prev) => (prev === 'light' ? 'dark' : 'light'));
    }, 3200);
    return () => clearInterval(reticleInterval);
  }, []);

  const measuredRatio = isScrimActive ? '9.2:1' : reticlePhase === 'light' ? '3.2:1' : '4.8:1';
  const isContrastPass = isScrimActive || reticlePhase === 'dark';

  // ─── Card 3: Gemini 3-Key Failover Mesh with 429 Simulation ───
  const [activeNode, setActiveNode] = useState<'alpha' | 'beta' | 'gamma'>('alpha');
  const [is429Active, setIs429Active] = useState<boolean>(false);

  useEffect(() => {
    // Subtle auto-failover pulse every 6 seconds to show active mesh
    const failoverTimer = setInterval(() => {
      setIs429Active(true);
      setActiveNode('beta');
      setTimeout(() => {
        setIs429Active(false);
        setActiveNode('alpha');
      }, 2600);
    }, 7500);
    return () => clearInterval(failoverTimer);
  }, []);

  const manualTrigger429 = () => {
    setIs429Active(true);
    setActiveNode('beta');
    setTimeout(() => {
      setIs429Active(false);
      setActiveNode('alpha');
    }, 2800);
  };

  // ─── Card 4: Typewriter Cryptographic SHA-256 Stream & Approval ───
  const fullHash = 'sha256:7f83b165c92b8d4e9124a91f34e207b99c8f0012';
  const [displayedHash, setDisplayedHash] = useState<string>('sha256:');
  const [isApproved, setIsApproved] = useState<boolean>(true);
  const [isRetesting, setIsRetesting] = useState<boolean>(false);

  useEffect(() => {
    let charIdx = 7;
    const interval = setInterval(() => {
      if (charIdx <= fullHash.length) {
        setDisplayedHash(fullHash.slice(0, charIdx));
        charIdx++;
      } else {
        clearInterval(interval);
      }
    }, 45);
    return () => clearInterval(interval);
  }, []);

  const handleRetestClick = () => {
    setIsRetesting(true);
    setTimeout(() => {
      setIsRetesting(false);
    }, 1200);
  };

  return (
    <div
      className="bg-slate-50/50 text-slate-900 selection:bg-cyan-500/20 selection:text-cyan-700 font-sans relative overflow-hidden"
    >
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: Left: Text | Right: Live Keyboard Focus Tracer
          ───────────────────────────────────────────────────────────── */}
      <section id="runtime-flaw" className="relative w-full py-24 lg:py-32 bg-transparent border-t border-slate-100">
        {/* Soft Ambient Radial Glow Behind Card */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column (Text) */}
          <motion.div {...entranceAnimation} className="lg:col-span-6 flex flex-col items-start text-left">
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-mono font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              [01 // DYNAMIC RUNTIME TRAVERSAL]
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] mb-6">
              Catch Keyboard Traps Before Your Users Do.
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
              Static code checkers read plain HTML and miss runtime modal loops. VELORA injects synthetic keyboard events into live web pages, tracing cyclic Tab flows and unhandled Escape listeners in real time.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 font-mono text-xs">
              <span className="px-3.5 py-2 rounded-xl bg-white/90 border border-slate-200/90 text-slate-700 font-semibold flex items-center gap-1.5 shadow-2xs">
                <Check className="w-3.5 h-3.5 text-cyan-600" /> Simulated Tab Traversal
              </span>
              <span className="px-3.5 py-2 rounded-xl bg-white/90 border border-slate-200/90 text-slate-700 font-semibold flex items-center gap-1.5 shadow-2xs">
                <Check className="w-3.5 h-3.5 text-cyan-600" /> Modal Focus Escaping
              </span>
              <span className="px-3.5 py-2 rounded-xl bg-white/90 border border-slate-200/90 text-slate-700 font-semibold flex items-center gap-1.5 shadow-2xs">
                <Check className="w-3.5 h-3.5 text-cyan-600" /> Zero False-Passes
              </span>
            </div>
          </motion.div>

          {/* Right Column: Live Animated Interactive Card */}
          <motion.div {...entranceAnimation} className="lg:col-span-6 w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-xl border border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(6,182,212,0.12)] transition-all duration-300 rounded-3xl p-6 sm:p-7 relative overflow-hidden">
              {/* Card Header & Controls */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shadow-2xs">
                    <Keyboard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      LIVE KEYBOARD FOCUS TRACER
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Sequential Key Event Stream (2.5s Cycle)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTrapSimulated((prev) => !prev)}
                    className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border transition-all ${
                      isTrapSimulated
                        ? 'bg-rose-50 border-rose-200 text-rose-700'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}
                  >
                    {isTrapSimulated ? 'Trap: ACTIVE' : 'Trap: REMEDIATED'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAutoPlaying((prev) => !prev)}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                    title={isAutoPlaying ? 'Pause Cycle' : 'Resume Cycle'}
                  >
                    {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-cyan-600" />}
                  </button>
                </div>
              </div>

              {/* Breadcrumb Keystroke Tracer (Highlighted Step) */}
              <div className="py-4 flex flex-wrap items-center justify-between gap-1 text-[11px] font-mono text-slate-500 border-b border-slate-100">
                {tracerSteps.map((step, idx) => (
                  <React.Fragment key={step.id}>
                    <span
                      className={`px-2.5 py-1 rounded-lg border transition-all duration-300 font-bold ${
                        activeStep === idx
                          ? 'bg-cyan-50 border-cyan-400 text-cyan-700 shadow-[0_0_12px_rgba(6,182,212,0.25)] scale-105'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      {step.name}
                    </span>
                    {idx < tracerSteps.length - 1 && <span className="text-slate-300">→</span>}
                  </React.Fragment>
                ))}
              </div>

              {/* Interactive Modal Preview with Cycling Focus Ring */}
              <div className="mt-5 p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 relative">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 text-xs">
                  <span className="font-bold text-slate-800">Sign-in Dialog Box</span>
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${
                      activeStep === 1
                        ? 'ring-2 ring-cyan-500 bg-cyan-100 text-cyan-800 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                        : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    ✕
                  </span>
                </div>

                <div className="py-3.5 space-y-2.5">
                  <div>
                    <span className="block text-[10px] font-mono text-slate-500 mb-1">
                      Account Email
                    </span>
                    <div
                      className={`w-full px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                        activeStep === 2
                          ? 'bg-white ring-2 ring-cyan-500 border-cyan-500 text-slate-900 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                          : 'bg-white border border-slate-200 text-slate-400'
                      }`}
                    >
                      alex.developer@velora.io
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-end gap-2">
                    <div className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-500 bg-white border border-slate-200">
                      Cancel
                    </div>
                    <div className="px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-xs">
                      Continue
                    </div>
                  </div>
                </div>

                {/* Animated Red Pulse Loop Detection Pill */}
                <div
                  className={`mt-2 p-2.5 rounded-xl border text-[11px] font-mono flex items-center justify-between transition-all ${
                    isTrapSimulated
                      ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-[0_0_12px_rgba(239,68,68,0.2)] animate-pulse'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5 font-bold">
                    {isTrapSimulated ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                    {isTrapSimulated
                      ? 'Loop Detected: Tab cannot exit container'
                      : 'Escape Key Disarmed Focus Trap'}
                  </span>
                  <span className="text-[10px] font-bold uppercase">
                    {isTrapSimulated ? 'WCAG 2.1.2 FAIL' : 'PASS'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: Left: Sub-Pixel Luminance Visual | Right: Text
          ───────────────────────────────────────────────────────────── */}
      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: Left: Visual (Sub-Pixel Luminance) | Right: Text
          ───────────────────────────────────────────────────────────── */}
      <section id="verification-pipeline" className="relative w-full py-24 lg:py-32 bg-transparent border-t border-slate-100">
        {/* Soft Ambient Radial Glow Behind Card */}
        <div className="absolute top-1/2 left-10 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Card (Photographic Asset with Gliding Reticle) */}
          <motion.div {...entranceAnimation} className="lg:col-span-6 w-full flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="w-full max-w-xl border border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(6,182,212,0.12)] transition-all duration-300 rounded-3xl p-6 sm:p-7 relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shadow-2xs">
                    <Crosshair className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      CANVAS LUMINANCE RETICLE
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Sub-pixel Cluster Sampling Over Photography
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsScrimActive((prev) => !prev)}
                  className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                    isScrimActive
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-cyan-50 border-cyan-200 text-cyan-700'
                  }`}
                >
                  {isScrimActive ? 'Scrim: ACTIVE (rgba 0.7)' : 'Deploy Dark Scrim'}
                </button>
              </div>

              {/* Photographic Card Asset with Dynamic Gliding Crosshair */}
              <div className="mt-5 rounded-2xl overflow-hidden border border-slate-200 relative aspect-[16/9] flex items-center justify-center p-6 bg-slate-900 shadow-inner group">
                {/* Embedded Photorealistic Modern Architecture SVG Pattern */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                  style={{
                    backgroundImage:
                      'radial-gradient(ellipse at top left, #38bdf8 0%, #1e3a8a 50%, #0f172a 100%)',
                  }}
                >
                  {/* Subtle glass building grid texture */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:32px_32px]" />
                </div>

                {/* Dark Scrim Overlay if Active */}
                {isScrimActive && (
                  <div className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-300" />
                )}

                {/* Animated Gliding Target Crosshair Reticle */}
                <motion.div
                  animate={{
                    x: reticlePhase === 'light' ? [0, 60, 0] : [60, -40, 60],
                    y: reticlePhase === 'light' ? [0, 25, 0] : [25, -15, 25],
                  }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-8 left-12 z-20 pointer-events-none flex items-center gap-2"
                >
                  <div className="w-7 h-7 rounded-full border-2 border-cyan-400 bg-cyan-400/20 flex items-center justify-center shadow-[0_0_15px_#22d3ee]">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <div className="bg-slate-950/90 text-white font-mono text-[9px] px-2 py-0.5 rounded border border-cyan-500/40 backdrop-blur-md whitespace-nowrap shadow-md">
                    <span>Luminance: {reticlePhase === 'light' ? 'L=0.74' : 'L=0.18'}</span>
                  </div>
                </motion.div>

                {/* Real Text Over Imagery */}
                <div className="relative z-10 text-center space-y-1 select-none">
                  <h4
                    className={`text-xl sm:text-2xl font-black transition-colors ${
                      isScrimActive ? 'text-white' : 'text-slate-100 drop-shadow-sm'
                    }`}
                  >
                    Enterprise AI Governance
                  </h4>
                  <p
                    className={`text-xs font-medium transition-colors ${
                      isScrimActive ? 'text-slate-200' : 'text-slate-300'
                    }`}
                  >
                    High-precision sub-pixel photometric sampling
                  </p>
                </div>
              </div>

              {/* Mathematical Formula Callout & Contrast Readout */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600 font-semibold">W3C PHOTOMETRIC FORMULA:</span>
                  <span className="text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                    (L₁ + 0.05) / (L₂ + 0.05)
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-600 font-medium">
                    Live Contrast Readout:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black font-mono text-slate-900">
                      {measuredRatio}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        isContrastPass
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {isContrastPass ? 'PASS (AA ≥ 4.5:1)' : 'FAIL (< 4.5:1 AA)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Content / Text */}
          <motion.div {...entranceAnimation} className="lg:col-span-6 flex flex-col items-start text-left order-1 lg:order-2">
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-mono font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              [02 // SUB-PIXEL PHOTOMETRIC ANALYSIS]
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] mb-6">
              True Color Contrast Over Dynamic Imagery.
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
              Traditional linters inspect static CSS properties and fail when text sits over responsive photography, gradients, or video canvases. VELORA rasterizes actual underlying pixels to compute deterministic relative luminance.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 font-mono text-xs">
              <span className="px-3.5 py-2 rounded-xl bg-white/90 border border-slate-200/90 text-slate-700 font-semibold flex items-center gap-1.5 shadow-2xs">
                <Check className="w-3.5 h-3.5 text-cyan-600" /> Canvas Pixel Sampling
              </span>
              <span className="px-3.5 py-2 rounded-xl bg-white/90 border border-slate-200/90 text-slate-700 font-semibold flex items-center gap-1.5 shadow-2xs">
                <Check className="w-3.5 h-3.5 text-cyan-600" /> Mathematical W3C Formula
              </span>
              <span className="px-3.5 py-2 rounded-xl bg-white/90 border border-slate-200/90 text-slate-700 font-semibold flex items-center gap-1.5 shadow-2xs">
                <Check className="w-3.5 h-3.5 text-cyan-600" /> Real-Device Rendered DOM
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: Left: Text | Right: Multi-Model Gemini Failover Mesh
          ───────────────────────────────────────────────────────────── */}
      <section id="telemetry-feed" className="relative w-full py-24 lg:py-32 bg-transparent border-t border-slate-100">
        {/* Soft Ambient Radial Glow Behind Card */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column (Text) */}
          <motion.div {...entranceAnimation} className="lg:col-span-6 flex flex-col items-start text-left">
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-mono font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              [03 // RESILIENT AI SYNTHESIS]
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] mb-6">
              Automated Code Patches, Powered by Multi-Key Gemini Failover.
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
              Raw violations are synthesized by Google Gemini into exact, copy-paste code remediation diffs. Backed by an intelligent 3-key rotation pool with rate-limit cooldowns, ensuring non-stop audit pipeline uptime.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 font-mono text-xs">
              <span className="px-3.5 py-2 rounded-xl bg-white/90 border border-slate-200/90 text-slate-700 font-semibold flex items-center gap-1.5 shadow-2xs">
                <Check className="w-3.5 h-3.5 text-cyan-600" /> Zero Downtime Architecture
              </span>
              <span className="px-3.5 py-2 rounded-xl bg-white/90 border border-slate-200/90 text-slate-700 font-semibold flex items-center gap-1.5 shadow-2xs">
                <Check className="w-3.5 h-3.5 text-cyan-600" /> Production AST Diffs
              </span>
              <span className="px-3.5 py-2 rounded-xl bg-white/90 border border-slate-200/90 text-slate-700 font-semibold flex items-center gap-1.5 shadow-2xs">
                <Check className="w-3.5 h-3.5 text-cyan-600" /> Continuous Rate-Limit Shield
              </span>
            </div>
          </motion.div>

          {/* Right Column: Visual Card with Animated Power Conduits & Diff */}
          <motion.div {...entranceAnimation} className="lg:col-span-6 w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-xl border border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(6,182,212,0.12)] transition-all duration-300 rounded-3xl p-6 sm:p-7 relative overflow-hidden space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shadow-2xs">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      GEMINI 3-KEY FAILOVER MESH
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Zero-Loss Automatic 429 Rotation
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={manualTrigger429}
                  className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                >
                  {is429Active ? '429 ROTATION ACTIVE (12ms)' : 'Simulate 429 Limit'}
                </button>
              </div>

              {/* 3 Node Diagram with Animated SVG Connecting Conduits */}
              <div className="relative pt-2 pb-1">
                {/* SVG Power Conduits Behind Nodes */}
                <svg className="absolute inset-x-8 top-1/2 -translate-y-1/2 w-[calc(100%-64px)] h-4 pointer-events-none -z-5 overflow-visible">
                  <line
                    x1="15%"
                    y1="50%"
                    x2="85%"
                    y2="50%"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                    className="animate-conduit"
                  />
                </svg>

                <div className="grid grid-cols-3 gap-3 font-mono text-xs relative z-10">
                  {/* Node Alpha */}
                  <div
                    className={`p-3 rounded-2xl border text-center transition-all duration-300 ${
                      activeNode === 'alpha' && !is429Active
                        ? 'bg-cyan-50 border-cyan-400 text-cyan-900 shadow-xs ring-2 ring-cyan-400/20'
                        : 'bg-rose-50 border-rose-300 text-rose-800'
                    }`}
                  >
                    <span className="text-[9px] block text-slate-400">NODE 1</span>
                    <span className="text-xs font-bold block mt-0.5">Key Alpha</span>
                    <span className="text-[9px] font-bold block mt-1">
                      {is429Active ? (
                        <span className="text-rose-600 font-extrabold">429 Rate Limit</span>
                      ) : (
                        <span className="text-emerald-600">● Active: 100%</span>
                      )}
                    </span>
                  </div>

                  {/* Node Beta */}
                  <div
                    className={`p-3 rounded-2xl border text-center transition-all duration-300 ${
                      activeNode === 'beta' || is429Active
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-xs ring-2 ring-emerald-400/30'
                        : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    <span className="text-[9px] block text-slate-400">NODE 2</span>
                    <span className="text-xs font-bold block mt-0.5">Key Beta</span>
                    <span className="text-[9px] font-bold block mt-1">
                      {is429Active ? (
                        <span className="text-emerald-700 font-extrabold animate-pulse">
                          Active Failover: 12ms
                        </span>
                      ) : (
                        <span className="text-slate-400">Warm Standby</span>
                      )}
                    </span>
                  </div>

                  {/* Node Gamma */}
                  <div className="p-3 rounded-2xl border text-center bg-white border-slate-200 text-slate-500">
                    <span className="text-[9px] block text-slate-400">NODE 3</span>
                    <span className="text-xs font-bold block mt-0.5">Key Gamma</span>
                    <span className="text-[9px] font-bold text-indigo-600 block mt-1">
                      Failover Shield
                    </span>
                  </div>
                </div>
              </div>

              {/* Code Patch Diff with Clean Syntax Highlighting */}
              <div className="rounded-2xl bg-slate-900 p-4 font-mono text-xs text-slate-200 space-y-2 shadow-inner">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    AI REMEDIATION DIFF (SYNTACTIC AST PATCH)
                  </span>
                  <span className="text-cyan-400 font-bold">Google Gemini 1.5 Flash</span>
                </div>
                <div className="space-y-1.5 pt-1 text-[11px]">
                  <div className="p-2 rounded-lg bg-rose-950/70 text-rose-300 border border-rose-900/40 line-through decoration-rose-400">
                    - &lt;div role=&quot;button&quot; onClick=&#123;submit&#125;&gt;Confirm Action&lt;/div&gt;
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-950/70 text-emerald-300 border border-emerald-900/40 font-semibold">
                    + &lt;button type=&quot;button&quot; aria-label=&quot;Submit Form&quot; tabIndex=&#123;0&#125;&gt;Confirm Action&lt;/button&gt;
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: Left: Cryptographic Verification | Right: Text
          ───────────────────────────────────────────────────────────── */}
      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: Left: Cryptographic Verification | Right: Text
          ───────────────────────────────────────────────────────────── */}
      <section id="sandbox-preview" className="relative w-full py-24 lg:py-32 bg-transparent border-t border-slate-100">
        {/* Soft Ambient Radial Glow Behind Card */}
        <div className="absolute top-1/2 left-10 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Card (Linear-Grade Ledger) */}
          <motion.div {...entranceAnimation} className="lg:col-span-6 w-full flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="w-full max-w-xl border border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(6,182,212,0.12)] transition-all duration-300 rounded-3xl p-6 sm:p-7 relative overflow-hidden space-y-5">
              {/* Ledger Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shadow-2xs">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      CRYPTOGRAPHIC EVIDENCE LEDGER
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Deterministic SHA-256 Signatures
                    </span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold transition-all border ${
                    isApproved
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xs'
                      : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}
                >
                  {isApproved ? 'VERIFIED ON REMOTE DOM' : 'PENDING APPROVAL'}
                </span>
              </div>

              {/* Typewriter Character-by-Character SHA-256 Hash Stream */}
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                  <span>IMMUTABLE AUDIT TRAIL HASH:</span>
                  <span className="text-cyan-700 font-bold">SHA-256 (64-BYTE DIGEST)</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 text-cyan-300 border border-slate-800 break-all select-all font-bold tracking-wider relative flex items-center shadow-inner">
                  <span>{displayedHash}</span>
                  {displayedHash.length < fullHash.length && (
                    <span className="w-2 h-4 bg-cyan-400 animate-pulse ml-0.5 inline-block" />
                  )}
                </div>
              </div>

              {/* Human Approval Switch & Live Server Retest */}
              <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Human-in-the-Loop Sign-off
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Requires explicit engineer confirmation
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsApproved((prev) => !prev)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                      isApproved
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isApproved ? '✓ APPROVED' : 'PENDING REVIEW'}
                  </button>

                  <button
                    type="button"
                    onClick={handleRetestClick}
                    className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className={`w-3 h-3 ${isRetesting ? 'animate-spin text-cyan-600' : ''}`} />
                    <span>{isRetesting ? 'CHECKING...' : 'RE-TEST'}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Content / Text */}
          <motion.div {...entranceAnimation} className="lg:col-span-6 flex flex-col items-start text-left order-1 lg:order-2">
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-mono font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              [04 // CLOSED-LOOP VERIFICATION]
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] mb-6">
              Deterministic Re-Testing. No Blind Approvals.
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
              Remediations aren't marked resolved until our verification engine re-inspects the live target URL. Every state transition is cryptographically signed and tracked with traceable evidence.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 font-mono text-xs">
              <span className="px-3.5 py-2 rounded-xl bg-white/90 border border-slate-200/90 text-slate-700 font-semibold flex items-center gap-1.5 shadow-2xs">
                <Check className="w-3.5 h-3.5 text-cyan-600" /> SHA-256 Audit Signatures
              </span>
              <span className="px-3.5 py-2 rounded-xl bg-white/90 border border-slate-200/90 text-slate-700 font-semibold flex items-center gap-1.5 shadow-2xs">
                <Check className="w-3.5 h-3.5 text-cyan-600" /> Human-in-the-Loop Sign-off
              </span>
              <span className="px-3.5 py-2 rounded-xl bg-white/90 border border-slate-200/90 text-slate-700 font-semibold flex items-center gap-1.5 shadow-2xs">
                <Check className="w-3.5 h-3.5 text-cyan-600" /> Live DOM Regression Retest
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: Unified Light-Mode CTA Banner & Clean Minimal Footer
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <motion.div
          {...entranceAnimation}
          className="relative bg-gradient-to-b from-white via-slate-50/80 to-white border border-slate-200/90 rounded-3xl p-10 sm:p-14 text-center shadow-lg shadow-cyan-500/5 overflow-hidden"
        >
          {/* Subtle top cyan ambient glow line */}
          <div className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

          {/* Micro Telemetry Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-mono font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            CONTINUOUS ACCESSIBILITY INTELLIGENCE
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 max-w-2xl mx-auto leading-tight">
            Start Auditing with Autonomous Precision.
          </h2>

          <p className="mt-4 text-base text-slate-600 max-w-xl mx-auto font-normal leading-relaxed">
            Experience continuous accessibility intelligence designed for modern web engineering teams.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <span>Launch Console</span>
              <span className="text-cyan-200 font-bold">↗</span>
            </Link>

            <Link
              href="/sandbox"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-cyan-400/50 shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-cyan-600" />
              <span>Explore Live Demo</span>
            </Link>
          </div>

          {/* Verification Badges */}
          <div className="mt-10 pt-8 border-t border-slate-200/70 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-600" />
              WCAG 2.1 & 2.2 AA Certified
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Live DOM Inspection
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Google Gemini Failover Mesh
            </span>
          </div>
        </motion.div>
      </section>

      {/* Clean Minimal Light Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Status Indicator */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-cyan-400 font-black text-xs shadow-xs">
                V
              </div>
              <span className="font-extrabold text-slate-900 text-sm tracking-tight">VELORA</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[11px] font-mono text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981] animate-pulse" />
              <span>All Systems Verified Operational</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6 font-semibold">
            <Link href="/new-audit" className="hover:text-blue-600 transition-colors">
              New Audit
            </Link>
            <Link href="/sandbox" className="hover:text-blue-600 transition-colors">
              Demo Sandbox
            </Link>
            <Link href="/reports" className="hover:text-blue-600 transition-colors">
              Reports
            </Link>
            <Link href="/settings" className="hover:text-blue-600 transition-colors">
              Settings
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              GitHub
            </a>
          </div>

          {/* Copyright */}
          <div className="text-[11px] font-mono text-slate-400">
            © 2026 VELORA. One Standard. Every User.
          </div>
        </div>
      </footer>
    </div>
  );
}
