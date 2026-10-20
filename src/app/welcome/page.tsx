'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  Scale,
  Eye,
  Repeat,
  History,
  Lock,
  ExternalLink,
  ChevronRight,
  Terminal,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  GitBranch,
  X,
  FileText,
  MousePointer,
  Keyboard,
  Globe,
  Radio,
  Share2,
  Mail,
  Check,
} from 'lucide-react';

export default function VeloraElectricCobaltLanding() {
  const [hoveredLetter, setHoveredLetter] = useState<number | null>(null);
  const [contrastMode, setContrastMode] = useState<'fail' | 'pass'>('fail');
  const [activeTabSeq, setActiveTabSeq] = useState<number>(1);
  const [activeTestbed, setActiveTestbed] = useState<'w3' | 'hn' | 'sandbox'>('w3');

  // Keystroke tab tracer auto-advance for vivid interactivity
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTabSeq((prev) => (prev % 4) + 1);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const brandLetters = ['V', 'E', 'L', 'O', 'R', 'A'];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0B132B] selection:bg-[#00D2FF]/20 selection:text-[#1D4ED8] antialiased font-sans relative overflow-x-hidden">
      {/* ─────────────────────────────────────────────────────────────
          UPPER PERIPHERY: ICE-BLUE AMBIENT LIGHTING
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-[#38BDF8]/12 via-[#1D4ED8]/6 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[-100px] left-[15%] w-[450px] h-[450px] bg-[#00D2FF]/8 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[-100px] right-[15%] w-[450px] h-[450px] bg-[#2563EB]/8 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* ─────────────────────────────────────────────────────────────
          BACKGROUND ZERO-GRAVITY AMBIENT PARTICLES (CONTINUOUS DRIFT)
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-5">
        {/* Hexagonal Shield 1 */}
        <div
          className="absolute left-[8%] animate-drift-slow"
          style={{ animationDelay: '0s', top: '5%' }}
        >
          <svg className="w-9 h-9 text-[#00D2FF]/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
          </svg>
        </div>

        {/* Hexagonal Shield 2 */}
        <div
          className="absolute left-[45%] animate-drift-medium"
          style={{ animationDelay: '3s', top: '-40px' }}
        >
          <svg className="w-7 h-7 text-[#2563EB]/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
          </svg>
        </div>

        {/* Hexagonal Shield 3 */}
        <div
          className="absolute right-[12%] animate-drift-slow"
          style={{ animationDelay: '5s', top: '15%' }}
        >
          <svg className="w-10 h-10 text-[#00D2FF]/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
          </svg>
        </div>

        {/* Soft Azure Light-Speck 1 */}
        <div
          className="absolute left-[24%] w-2 h-2 rounded-full bg-[#00D2FF]/40 blur-xs animate-drift-fast"
          style={{ animationDelay: '1.5s', top: '-10px' }}
        />
        {/* Soft Azure Light-Speck 2 */}
        <div
          className="absolute right-[32%] w-2.5 h-2.5 rounded-full bg-[#2563EB]/35 blur-xs animate-drift-medium"
          style={{ animationDelay: '4s', top: '-20px' }}
        />
        {/* Soft Azure Light-Speck 3 */}
        <div
          className="absolute left-[65%] w-1.5 h-1.5 rounded-full bg-[#38BDF8]/40 blur-xs animate-drift-slow"
          style={{ animationDelay: '2s', top: '8%' }}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. TOP NAVIGATION DOCK (FLOATING GLASS ISLAND — NO AUTH)
          ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-6 z-50 px-4 sm:px-6">
        <nav className="max-w-4xl mx-auto backdrop-blur-md bg-white/85 border border-slate-200/80 shadow-[0_4px_25px_rgba(29,78,216,0.06)] rounded-full px-5 sm:px-7 py-3 flex items-center justify-between transition-all">
          {/* Left: Brand Lockup */}
          <Link href="/welcome" className="flex items-center gap-2.5 group">
            {/* Glowing VELORA Geometric Shield/Apex Emblem */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1D4ED8] via-[#2563EB] to-[#00D2FF] p-0.5 shadow-[0_0_15px_rgba(0,210,255,0.4)] group-hover:shadow-[0_0_20px_rgba(0,210,255,0.7)] transition-all">
              <div className="w-full h-full bg-[#0B132B] rounded-full flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-[#00D2FF] fill-none stroke-current stroke-[2.6] stroke-linecap-round stroke-linejoin-round"
                >
                  <path d="M12 3L4 9v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V9l-8-6z" />
                  <path d="M9.5 12l2 2 3-3" strokeWidth="2.8" />
                </svg>
              </div>
            </div>
            <span className="font-extrabold tracking-tight text-base text-[#0B132B] group-hover:text-[#2563EB] transition-colors">
              VELORA
            </span>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a
              href="#the-blackspot"
              className="hover:text-[#2563EB] transition-colors hover:-translate-y-0.5 inline-block"
            >
              The Blackspot
            </a>
            <a
              href="#how-it-works"
              className="hover:text-[#2563EB] transition-colors hover:-translate-y-0.5 inline-block"
            >
              How It Works
            </a>
            <a
              href="#capabilities"
              className="hover:text-[#2563EB] transition-colors hover:-translate-y-0.5 inline-block"
            >
              Capabilities
            </a>
            <a
              href="#live-testbed"
              className="hover:text-[#2563EB] transition-colors hover:-translate-y-0.5 inline-block"
            >
              Live Testbed
            </a>
          </div>

          {/* Right Action: Single Primary Pill Button (NO SIGN IN / SIGN UP) */}
          <Link
            href="/new-audit"
            className="group inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] shadow-[0_4px_16px_rgba(37,99,235,0.35)] hover:shadow-[0_6px_22px_rgba(0,210,255,0.45)] transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>Enter Velora</span>
            <span className="text-[#00D2FF] group-hover:translate-x-0.5 transition-transform">↗</span>
          </Link>
        </nav>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. HERO SECTION (SYMMETRICALLY CENTERED HERO & 3D AUDITOR AGENT)
          ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-110px)] flex flex-col justify-center items-center py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center justify-center my-auto">
          {/* ─────────────────────────────────────────────────────────
              HERO LEFT: ARCHITECTURAL WORDMARK & DIRECT ACTION
              ───────────────────────────────────────────────────────── */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-7 text-center lg:text-left">
            {/* Massive Authoritative VELORA Architectural Wordmark */}
            <div className="relative inline-block">
              <h1 className="text-7xl sm:text-8xl xl:text-9xl font-black tracking-tight text-[#0B132B] select-none flex items-center justify-center lg:justify-start gap-1 sm:gap-1.5 md:gap-2">
                {brandLetters.map((char, index) => (
                  <span
                    key={index}
                    onMouseEnter={() => setHoveredLetter(index)}
                    onMouseLeave={() => setHoveredLetter(null)}
                    className={`inline-block transition-all duration-200 cursor-default font-black ${
                      hoveredLetter === index
                        ? 'text-[#00D2FF] -translate-y-3 drop-shadow-[0_0_30px_rgba(0,210,255,0.95)]'
                        : 'text-[#0B132B] translate-y-0'
                    }`}
                  >
                    {char}
                  </span>
                ))}
              </h1>
            </div>

            {/* Tagline: Directly Underneath in One Crisp Line */}
            <div className="pt-0.5">
              <p className="text-xs sm:text-sm font-extrabold tracking-[0.28em] text-[#0B132B]/85 uppercase font-mono">
                ONE STANDARD. EVERY USER.
              </p>
            </div>

            {/* Hero CTA Button: Generously Spaced (36px gap), Solid Cobalt Blue with Cyan Glow */}
            <div className="pt-4">
              <Link
                href="/new-audit"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] shadow-[0_10px_25px_rgba(0,210,255,0.25)] hover:shadow-[0_14px_36px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <span>Enter Velora</span>
                <span className="text-[#00D2FF] font-black">→</span>
              </Link>
            </div>

            {/* Minimalist Micro Trust Indicators */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-[11px] font-semibold text-slate-500 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] shadow-[0_0_8px_#00D2FF]" />
                WCAG 2.2 AA Benchmark
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                Live DOM Runtime
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />
                Zero Phantom Data
              </span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              HERO RIGHT: 3D AUTONOMOUS ACCESSIBILITY AUDITOR ROBOT
              ───────────────────────────────────────────────────────── */}
          <div className="lg:col-span-6 flex items-center justify-center perspective-1000 relative">
            {/* Zero-gravity Suspended 3D Auditor Agent Container */}
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center animate-robot-float transform-style-3d">
              {/* Concentric Holographic Audit Orbital Rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Ring 1 (AST Rules Check Orbit) */}
                <div className="w-[340px] h-[340px] sm:w-[360px] sm:h-[360px] rounded-full border border-[#00D2FF]/40 border-dashed animate-orbit-ring-1 shadow-[0_0_20px_rgba(0,210,255,0.2)]" />
                {/* Ring 2 (Keyboard Traversal Analysis Orbit) */}
                <div className="w-[400px] h-[400px] sm:w-[420px] sm:h-[420px] rounded-full border border-[#2563EB]/40 animate-orbit-ring-2 shadow-[0_0_25px_rgba(37,99,235,0.2)]" />
              </div>

              {/* Holographic Downward Inspection Beam & Grid */}
              <div className="absolute bottom-4 w-64 h-36 bg-gradient-to-b from-[#00D2FF]/25 via-[#2563EB]/10 to-transparent blur-md clip-trapezoid pointer-events-none animate-inspection-beam" />
              <div className="absolute bottom-0 w-72 h-14 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00D2FF]/30 via-slate-100/10 to-transparent rounded-full blur-sm -z-5" />

              {/* 3D AUDITOR ROBOT BODY */}
              <div className="relative z-10 w-60 sm:w-64 h-72 rounded-3xl bg-gradient-to-b from-white via-slate-50 to-slate-100 border border-slate-200/90 shadow-[0_25px_60px_rgba(29,78,216,0.18),0_0_0_1px_rgba(0,210,255,0.3)] p-5 flex flex-col items-center justify-between backdrop-blur-md">
                {/* Robot Head Apex Antenna */}
                <div className="absolute -top-3 w-8 h-3 rounded-t-full bg-gradient-to-r from-[#2563EB] to-[#00D2FF] shadow-[0_0_12px_#00D2FF]" />

                {/* Status Indicator */}
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-500 pb-2 border-b border-slate-200/80">
                  <span className="flex items-center gap-1.5 text-[#2563EB] font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#00D2FF] shadow-[0_0_8px_#00D2FF] animate-ping" />
                    AUTONOMOUS DROID
                  </span>
                  <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold">
                    WCAG 2.2 ACTIVE
                  </span>
                </div>

                {/* Auditor Optical Visor / Core Eye (Glowing Horizontal Lens) */}
                <div className="w-full my-auto space-y-3">
                  <div className="relative w-full h-14 rounded-2xl bg-[#0B132B] border-2 border-slate-800 p-2 flex items-center justify-center overflow-hidden shadow-inner">
                    {/* Pulsing Cyan Optical Visor Lens */}
                    <div className="w-44 sm:w-48 h-5 rounded-full bg-gradient-to-r from-[#2563EB] via-[#00D2FF] to-[#2563EB] animate-visor-pulse shadow-[0_0_25px_#00D2FF] flex items-center justify-center">
                      <div className="w-6 h-3 rounded-full bg-white blur-xs" />
                    </div>
                    {/* Horizontal Scanline Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_51%)] bg-[length:100%_4px] pointer-events-none opacity-40" />
                  </div>

                  {/* Neural Engine Core Matrix */}
                  <div className="bg-white/80 rounded-xl p-2 border border-slate-200 shadow-xs flex items-center justify-around text-center font-mono">
                    <div>
                      <span className="text-[9px] text-slate-400 block">AST CHECK</span>
                      <span className="text-xs font-bold text-[#2563EB]">100% PARSED</span>
                    </div>
                    <div className="w-px h-6 bg-slate-200" />
                    <div>
                      <span className="text-[9px] text-slate-400 block">KEYBOARD TAB</span>
                      <span className="text-xs font-bold text-[#00D2FF]">SEQUENCING</span>
                    </div>
                    <div className="w-px h-6 bg-slate-200" />
                    <div>
                      <span className="text-[9px] text-slate-400 block">PIXEL METER</span>
                      <span className="text-xs font-bold text-[#0B132B]">SUB-PIXEL</span>
                    </div>
                  </div>
                </div>

                {/* Base Emitter Vent */}
                <div className="w-full flex items-center justify-center gap-1 pt-2 border-t border-slate-200/80">
                  <div className="w-3 h-1 rounded-full bg-[#00D2FF]/60" />
                  <div className="w-8 h-1.5 rounded-full bg-[#2563EB]" />
                  <div className="w-3 h-1 rounded-full bg-[#00D2FF]/60" />
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────
                  3 SYMMETRICALLY PULLED-IN TELEMETRY EVIDENCE CHIPS
                  ───────────────────────────────────────────────────── */}
              {/* Chip 1: Focus Trap (TC1) - Framing Top-Left Shoulder */}
              <div className="absolute -top-2 left-0 sm:left-2 z-20 animate-chip-1">
                <div className="backdrop-blur-md bg-white/95 border border-slate-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.08)] rounded-2xl px-3.5 py-2 flex items-center gap-2 hover:shadow-lg transition-shadow cursor-default">
                  <div className="w-6 h-6 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 text-[11px] shadow-xs">
                    ⌨️
                  </div>
                  <div className="font-mono text-left">
                    <span className="text-[9px] text-slate-400 block font-semibold leading-none">
                      TC1: KEYBOARD MODAL
                    </span>
                    <span className="text-[11px] font-bold text-[#0B132B]">
                      Focus Trap: <strong className="text-amber-600 font-extrabold">Esc Disarmed</strong>
                    </span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" title="Verified Disarmed" />
                </div>
              </div>

              {/* Chip 2: Photo Contrast (TC3) - Framing Top-Right Shoulder */}
              <div className="absolute -top-1 right-0 sm:right-2 z-20 animate-chip-2">
                <div className="backdrop-blur-md bg-white/95 border border-slate-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.08)] rounded-2xl px-3.5 py-2 flex items-center gap-2 hover:shadow-lg transition-shadow cursor-default">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] text-[11px] shadow-xs">
                    🔍
                  </div>
                  <div className="font-mono text-left">
                    <span className="text-[9px] text-slate-400 block font-semibold leading-none">
                      TC3: LUMINANCE SAMPLER
                    </span>
                    <span className="text-[11px] font-bold text-[#0B132B]">
                      Contrast: <strong className="text-[#00D2FF] font-extrabold">4.5:1 AA</strong>
                    </span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#00D2FF] shadow-[0_0_6px_#00D2FF]" />
                </div>
              </div>

              {/* Chip 3: Dual Engine Verification (TC2 & TC4) - Framing Bottom Center/Right */}
              <div className="absolute -bottom-4 right-2 sm:right-4 z-20 animate-chip-3">
                <div className="backdrop-blur-md bg-white/95 border border-slate-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.08)] rounded-2xl px-3.5 py-2 flex items-center gap-2 hover:shadow-lg transition-shadow cursor-default">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-[#2563EB] text-[11px] shadow-xs">
                    🤖
                  </div>
                  <div className="font-mono text-left">
                    <span className="text-[9px] text-slate-400 block font-semibold leading-none">
                      TC2 & TC4: DUAL ENGINE
                    </span>
                    <span className="text-[11px] font-bold text-[#0B132B]">
                      Playwright + axe-core Verified
                    </span>
                  </div>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50 shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. CENTERED ANCHOR: SCROLL TO EXPLORE INDICATOR */}
        <div className="w-full flex justify-center pt-8 pb-2">
          <a
            href="#the-blackspot"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-mono font-bold tracking-wider text-slate-600 bg-white border border-slate-200/90 shadow-xs hover:border-[#2563EB]/40 hover:text-[#2563EB] transition-all hover:translate-y-0.5"
          >
            <span>SCROLL TO EXPLORE</span>
            <span className="text-[#2563EB]">↓</span>
          </a>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION: THE AUDITING GAP (SPLIT COMPARISON — NO GREEN)
          ───────────────────────────────────────────────────────────── */}
      <section id="the-blackspot" className="py-24 sm:py-28 bg-[#F8FAFC] border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/20 px-3 py-1 rounded-full mb-3">
              ● THE AUDITING GAP
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B132B] tracking-tight">
              Static Syntax Linters Don't Live in the Real World.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2.5 max-w-xl mx-auto font-normal leading-relaxed">
              Traditional automated tools check HTML tags in isolation. Real users navigate dynamic modals, complex photography, and custom keyboard controls.
            </p>
          </div>

          {/* Two Side-by-Side Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Card 1: THE FRAGILE MODEL (Rigid Syntax Scanners) */}
            <div className="rounded-3xl border border-rose-200 bg-white p-7 sm:p-9 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-rose-100">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-50 text-rose-700 px-3 py-0.5 rounded-full border border-rose-200">
                      THE FRAGILE MODEL
                    </span>
                    <h3 className="text-xl font-bold text-[#0B132B] mt-2">
                      Rigid Syntax Scanners
                    </h3>
                    <p className="text-xs text-slate-500 font-normal">
                      AST & regex checks operating in a vacuum
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <X className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </div>

                <div className="space-y-4 py-6">
                  {/* Failure Item 1 */}
                  <div className="rounded-2xl bg-rose-50/50 border border-rose-100 p-4">
                    <div className="flex items-center justify-between text-xs font-bold text-rose-800 mb-1">
                      <span>Blind to Keyboard Focus Traps (WCAG 2.1.2)</span>
                      <span className="text-[10px] bg-rose-100 px-2 py-0.5 rounded font-mono">MISSED</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      Cannot simulate Tab sequences. Users get trapped inside open modal dialogs with no registered Escape key listeners.
                    </p>
                  </div>

                  {/* Failure Item 2 */}
                  <div className="rounded-2xl bg-rose-50/50 border border-rose-100 p-4">
                    <div className="flex items-center justify-between text-xs font-bold text-rose-800 mb-1">
                      <span>False Pass on Unsemantic &lt;div&gt; (WCAG 2.1.1)</span>
                      <span className="text-[10px] bg-rose-100 px-2 py-0.5 rounded font-mono">FALSE PASS</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      Passes clean HTML syntax, completely ignoring that custom action buttons lack tabindex="0" and keyboard activation handlers.
                    </p>
                  </div>

                  {/* Failure Item 3 */}
                  <div className="rounded-2xl bg-rose-50/50 border border-rose-100 p-4">
                    <div className="flex items-center justify-between text-xs font-bold text-rose-800 mb-1">
                      <span>Blind to Canvas & Photo Contrast (WCAG 1.4.3)</span>
                      <span className="text-[10px] bg-rose-100 px-2 py-0.5 rounded font-mono">MISSED</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      Reads CSS container background properties but cannot sample rendered bitmap luminance under text bounding boxes.
                    </p>
                  </div>

                  {/* Failure Item 4 */}
                  <div className="rounded-2xl bg-rose-50/50 border border-rose-100 p-4">
                    <div className="flex items-center justify-between text-xs font-bold text-rose-800 mb-1">
                      <span>Ticket Closed Without Verification</span>
                      <span className="text-[10px] bg-rose-100 px-2 py-0.5 rounded font-mono">UNVERIFIED</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      Assumes code commits fixed the issue without re-spawning an auditor subagent to test the live rendered DOM.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-rose-100 text-xs font-mono text-rose-600">
                Misses up to 60% of real-world keyboard and sensory barriers.
              </div>
            </div>

            {/* Card 2: THE CLOSED-LOOP MODEL (Velora Autonomous Agent Engine — NO GREEN) */}
            <div className="rounded-3xl border border-[#2563EB]/40 bg-white p-7 sm:p-9 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-blue-100">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#2563EB]/10 text-[#2563EB] px-3 py-0.5 rounded-full border border-[#2563EB]/20">
                      THE CLOSED-LOOP MODEL
                    </span>
                    <h3 className="text-xl font-bold text-[#0B132B] mt-2">
                      Velora Autonomous Agent Engine
                    </h3>
                    <p className="text-xs text-slate-500 font-normal">
                      Live DOM traversal, simulated input, and cryptographic proof
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 stroke-[2.8]" />
                  </div>
                </div>

                <div className="space-y-4 py-6">
                  {/* Verified Item 1 */}
                  <div className="rounded-2xl bg-slate-50/80 border border-slate-200/90 p-4">
                    <div className="flex items-center justify-between text-xs font-bold text-[#2563EB] mb-1">
                      <span>Simulated Keyboard Tab Traversal</span>
                      <span className="text-[10px] bg-[#2563EB]/10 text-[#2563EB] px-2 py-0.5 rounded font-mono font-bold">
                        VERIFIED LIVE
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      Executes real Tab/Shift-Tab keypress sequences, detects cyclic modal focus loops, and verifies Escape key traps.
                    </p>
                  </div>

                  {/* Verified Item 2 */}
                  <div className="rounded-2xl bg-slate-50/80 border border-slate-200/90 p-4">
                    <div className="flex items-center justify-between text-xs font-bold text-[#2563EB] mb-1">
                      <span>Sub-pixel Photo Luminance Sampling</span>
                      <span className="text-[10px] bg-[#00D2FF]/15 text-[#0B132B] px-2 py-0.5 rounded font-mono font-bold">
                        TRUE CONTRAST
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      Samples underlying rendered photo pixels directly under text bounding boxes, calculating true contrast against the 4.5:1 AA standard.
                    </p>
                  </div>

                  {/* Verified Item 3 */}
                  <div className="rounded-2xl bg-slate-50/80 border border-slate-200/90 p-4">
                    <div className="flex items-center justify-between text-xs font-bold text-[#2563EB] mb-1">
                      <span>Human-in-the-Loop Sign-off Gate</span>
                      <span className="text-[10px] bg-[#0B132B] text-[#00D2FF] px-2 py-0.5 rounded font-mono font-bold">
                        CRYPTOGRAPHIC
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      Execution pauses before commit. Displays Proposed Destination and SHA-256 hashes. No issue logs without human approval.
                    </p>
                  </div>

                  {/* Verified Item 4 */}
                  <div className="rounded-2xl bg-slate-50/80 border border-slate-200/90 p-4">
                    <div className="flex items-center justify-between text-xs font-bold text-[#2563EB] mb-1">
                      <span>Continuous Retest Verification</span>
                      <span className="text-[10px] bg-[#2563EB]/10 text-[#2563EB] px-2 py-0.5 rounded font-mono font-bold">
                        VERIFIED FIXED
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      Subagent re-inspects live DOM upon fix deployment, producing side-by-side Before/After diffs and closing issues only when passing.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-blue-100 flex items-center justify-between text-xs font-mono font-bold text-[#2563EB]">
                <span>Result: 100% Verifiable Compliance</span>
                <Link href="/sandbox" className="hover:underline flex items-center gap-1">
                  <span>Explore in Sandbox</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION: THE 4-PILLAR WORKFLOW (HORIZONTAL GLASS CARDS)
          ───────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/20 px-3 py-1 rounded-full mb-3">
              ● THE 4-PILLAR WORKFLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B132B] tracking-tight">
              Not Just a Scanner. A Closed-Loop System.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2.5 max-w-xl mx-auto font-normal leading-relaxed">
              Every audit transitions dynamically from live ingest to cryptographic commit and autonomous re-testing.
            </p>
          </div>

          {/* 4 Horizontal Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-sm hover:shadow-xl hover:border-[#2563EB]/50 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded-full">
                    #1 INGEST
                  </span>
                  <Globe className="w-5 h-5 text-slate-400" />
                </div>
                <h3 className="text-base font-bold text-[#0B132B] mb-2">
                  Live Scope Reality
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Normalizes public URLs and sets strict WCAG 2.2 criteria with zero phantom startup data.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-slate-100 text-[10px] font-mono text-slate-400">
                Phase 01: Detail Collection
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-sm hover:shadow-xl hover:border-[#00D2FF]/50 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-[#00D2FF] bg-[#00D2FF]/10 px-2.5 py-1 rounded-full">
                    #2 PLANNING
                  </span>
                  <Cpu className="w-5 h-5 text-slate-400" />
                </div>
                <h3 className="text-base font-bold text-[#0B132B] mb-2">
                  Dynamic Agent Planning
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Decomposes the audit into parallel Cheerio DOM scraping and Playwright keyboard navigation.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-slate-100 text-[10px] font-mono text-slate-400">
                Phase 02: Execution Path
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-sm hover:shadow-xl hover:border-[#2563EB]/50 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded-full">
                    #3 LEDGER
                  </span>
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <h3 className="text-base font-bold text-[#0B132B] mb-2">
                  Cryptographic Ledger
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Captures element bounding boxes and attaches SHA-256 evidence signatures under human gate.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-slate-100 text-[10px] font-mono text-slate-400">
                Phase 04: Human Gate
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-sm hover:shadow-xl hover:border-[#00D2FF]/50 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-[#00D2FF] bg-[#00D2FF]/10 px-2.5 py-1 rounded-full">
                    #4 RETEST
                  </span>
                  <RotateCcw className="w-5 h-5 text-slate-400" />
                </div>
                <h3 className="text-base font-bold text-[#0B132B] mb-2">
                  Self-Healing Re-test
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Automatically verifies deployed fixes, closing issues only when the live DOM passes.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-slate-100 text-[10px] font-mono text-slate-400">
                Phase 05: Verification
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION: CAPABILITIES (2x2 ARCHITECTURAL GRID — NO GREEN)
          ───────────────────────────────────────────────────────────── */}
      <section id="capabilities" className="py-24 sm:py-28 bg-[#F8FAFC] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/20 px-3 py-1 rounded-full mb-3">
              ● CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B132B] tracking-tight">
              Engineered for Verifiable Compliance
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2.5 max-w-xl mx-auto font-normal leading-relaxed">
              Deep architectural tools designed specifically to resolve disagreements and eliminate false positives.
            </p>
          </div>

          {/* 2x2 Feature Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Capability 1: Static Linter Override */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-8 shadow-sm hover:shadow-xl transition-all duration-300 space-y-5 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center mb-4">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#0B132B] mb-1.5">
                  Automated Tool Pass Override (TC2)
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  When static linters pass syntax checks on custom interactive elements, our simulated keyboard agent attempts real navigation. If unreachable via Tab, the pass is overridden and logged as a failure.
                </p>
              </div>

              {/* Interactive Widget Box */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-[10px] text-slate-400">
                  <span>DISAGREEMENT ARBITRATION RULE</span>
                  <span className="text-[#2563EB] font-bold bg-[#2563EB]/10 px-2 py-0.5 rounded">
                    WCAG 2.1.1
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                  <span className="text-slate-500">Static Linter: <strong className="text-slate-700">PASS</strong></span>
                  <span className="text-slate-400">vs</span>
                  <span className="text-slate-500">Keyboard Agent: <strong className="text-[#2563EB]">FAIL</strong></span>
                </div>
                <div className="bg-white border border-blue-200 p-2 rounded-xl text-[#2563EB] text-[11px] font-sans font-medium">
                  Disagreement Resolved: Automated pass overridden. Logged as Failure.
                </div>
              </div>
            </div>

            {/* Capability 2: Photo Luminance Sampling */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-8 shadow-sm hover:shadow-xl transition-all duration-300 space-y-5 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#00D2FF]/10 text-[#00D2FF] flex items-center justify-center mb-4">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#0B132B] mb-1.5">
                  Sub-pixel Photo Luminance Sampling (TC3)
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Instead of inspecting container CSS properties, Velora renders canvas pixels under the text bounding box to calculate relative luminance against actual underlying photography.
                </p>
              </div>

              {/* Interactive Widget Box */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-[10px] text-slate-400">
                  <span>LUMINANCE FORMULA ENGINE</span>
                  <span className="text-[#00D2FF] font-bold bg-[#0B132B] px-2 py-0.5 rounded text-[10px]">
                    WCAG 1.4.3
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                  Formula: (L₁ + 0.05) / (L₂ + 0.05) = 2.3:1 (Below 4.5:1 AA Standard)
                </div>
                <div className="text-[10px] text-slate-400">
                  Remediation: Injects semi-transparent dark scrim layer (Calculated Ratio: 8.6:1).
                </div>
              </div>
            </div>

            {/* Capability 3: Cyclic Focus Trap Tracer */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-8 shadow-sm hover:shadow-xl transition-all duration-300 space-y-5 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center mb-4">
                  <Keyboard className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#0B132B] mb-1.5">
                  Cyclic Focus Trap Keystroke Tracer (TC1)
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Simulates full browser Tab cycles through complex dialogue trees. Detects cyclic modal loops where focus is trapped without an active Escape key listener.
                </p>
              </div>

              {/* Interactive Widget Box */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-[10px] text-slate-400">
                  <span>PLAYWRIGHT TRACER TELEMETRY</span>
                  <span className="text-[#2563EB] font-bold bg-[#2563EB]/10 px-2 py-0.5 rounded">
                    WCAG 2.1.2
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span>Loop Count: 12 Iterations</span>
                  <span className="text-rose-600 font-bold">Focus Trap Detected</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Proof: Esc key event listener missing on document modal subtree.
                </div>
              </div>
            </div>

            {/* Capability 4: Deterministic Regression Engine */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-8 shadow-sm hover:shadow-xl transition-all duration-300 space-y-5 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#00D2FF]/10 text-[#00D2FF] flex items-center justify-center mb-4">
                  <History className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#0B132B] mb-1.5">
                  Deterministic Retest Verification
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  When fixes are applied, Velora automatically triggers a retest verification subagent. Side-by-side Before/After diffs prove that the live rendered DOM truly conforms.
                </p>
              </div>

              {/* Interactive Widget Box */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-[10px] text-slate-400">
                  <span>STATE TRANSITION ENGINE</span>
                  <span className="text-[#00D2FF] font-bold bg-[#0B132B] px-2 py-0.5 rounded">
                    IMMUTABLE
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span>Status: Open ➔ Verified Fixed</span>
                  <span className="text-[#2563EB] font-bold">100% Deterministic</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Verifier: Velora Verification Subagent with SHA-256 timestamp.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION: LIVE TESTBED (PROOF ON LIVE REALITY — NO GREEN)
          ───────────────────────────────────────────────────────────── */}
      <section id="live-testbed" className="py-24 sm:py-28 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/20 px-3 py-1 rounded-full mb-3">
              ● LIVE TESTBED
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B132B] tracking-tight">
              Audited on Live Public Reality
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2.5 max-w-xl mx-auto font-normal leading-relaxed">
              Explore audited telemetry from live public domains and our deterministic local testbed.
            </p>
          </div>

          {/* Interactive Target Pills */}
          <div className="flex items-center justify-center gap-2.5 mb-10">
            <button
              type="button"
              onClick={() => setActiveTestbed('w3')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTestbed === 'w3'
                  ? 'bg-[#2563EB] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              www.w3.org (WAI)
            </button>
            <button
              type="button"
              onClick={() => setActiveTestbed('hn')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTestbed === 'hn'
                  ? 'bg-[#2563EB] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              news.ycombinator.com
            </button>
            <button
              type="button"
              onClick={() => setActiveTestbed('sandbox')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTestbed === 'sandbox'
                  ? 'bg-[#2563EB] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Interactive Testbed (/sandbox)
            </button>
          </div>

          {/* Showcase Display Card */}
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-7 sm:p-9 space-y-6">
            {activeTestbed === 'w3' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded">
                      BENCHMARK AUDIT
                    </span>
                    <h3 className="text-xl font-bold text-[#0B132B] mt-2">
                      W3C Web Accessibility Initiative (WAI)
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      Target: https://www.w3.org/WAI/ • Criteria: WCAG 2.2 Level AA
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-2xl font-black text-[#2563EB] font-mono">98/100</span>
                    <span className="text-xs text-slate-400 block font-mono">Compliance Score</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px]">LIVE DOM NODES</span>
                    <span className="text-base font-bold text-[#0B132B]">1,248 Nodes Analyzed</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px]">KEYBOARD REACHABILITY</span>
                    <span className="text-base font-bold text-[#2563EB]">100% Reachable (42/42)</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px]">CONTRAST RATIO</span>
                    <span className="text-base font-bold text-[#00D2FF]">Avg 9.2:1 (Pass AA)</span>
                  </div>
                </div>
              </div>
            )}

            {activeTestbed === 'hn' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                      LIVE BARRIER DETECTED
                    </span>
                    <h3 className="text-xl font-bold text-[#0B132B] mt-2">
                      Hacker News (Y Combinator)
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      Target: https://news.ycombinator.com/ • Criteria: WCAG 2.2 Level AA
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-2xl font-black text-amber-600 font-mono">72/100</span>
                    <span className="text-xs text-slate-400 block font-mono">Contrast & Link Sizing</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px]">DETECTED BARRIER</span>
                    <span className="text-base font-bold text-amber-700">Sub-ratio Text (#828282)</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px]">CALCULATED RATIO</span>
                    <span className="text-base font-bold text-rose-600">3.8:1 (Needs 4.5:1)</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px]">PROPOSED REMEDIATION</span>
                    <span className="text-base font-bold text-[#2563EB]">Darken to #595959</span>
                  </div>
                </div>
              </div>
            )}

            {activeTestbed === 'sandbox' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded">
                      INTERACTIVE TEST ENVIRONMENT
                    </span>
                    <h3 className="text-xl font-bold text-[#0B132B] mt-2">
                      Deterministic Local WCAG Sandbox
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      Target: /sandbox • Contains TC1, TC2, TC3 reproducible barrier benchmarks
                    </p>
                  </div>
                  <Link
                    href="/sandbox"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all cursor-pointer shadow-sm"
                  >
                    <span>Open Live Sandbox</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px]">TC1: MODAL TRAP</span>
                    <span className="text-[#2563EB] font-bold">12-cycle loop detected</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px]">TC2: DIV BUTTON</span>
                    <span className="text-[#00D2FF] font-bold">Overridden static pass</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px]">TC3: PHOTO CONTRAST</span>
                    <span className="text-[#2563EB] font-bold">Scrim remediation verified</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION: HIGH-IMPACT BOTTOM CTA BANNER (COBALT & OBSIDIAN)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0B132B] via-[#0F172A] to-[#1E293B] text-white p-10 sm:p-16 text-center shadow-2xl space-y-6 border border-slate-800">
            {/* Ambient Radial Blur */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#2563EB]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl mx-auto space-y-3 relative z-10">
              <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider bg-white/10 border border-white/20 px-3.5 py-1 rounded-full text-[#00D2FF]">
                ZERO SETUP • INSTANT VERIFICATION
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                One Standard. Every User. Built for Modern Web.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-xl mx-auto">
                Stop scheduling accessibility audits months later. Verify your web applications continuously with autonomous precision.
              </p>
            </div>

            <div className="pt-2 relative z-10">
              <Link
                href="/new-audit"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-bold text-[#0B132B] bg-white hover:bg-slate-100 active:bg-slate-200 shadow-xl shadow-black/40 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Enter Velora ↗</span>
              </Link>
            </div>

            {/* Bottom Trust Row */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-medium relative z-10 font-mono">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#00D2FF] stroke-[3]" />
                <span>100% Open & Auditable</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#2563EB] stroke-[3]" />
                <span>Real Live DOM Execution</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#00D2FF] stroke-[3]" />
                <span>Zero Phantom Data</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER: CLEAN WHITE / SLATE FOOTER (DIRECT LINKS)
          ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200/80 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          {/* Brand & Emblem */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#0B132B] flex items-center justify-center text-[#00D2FF] font-black text-xs shadow-xs">
              V
            </div>
            <div>
              <span className="font-bold text-[#0B132B]">VELORA</span>
              <span className="text-slate-400 ml-1.5">© 2026. A better web, verified.</span>
            </div>
          </div>

          {/* Direct Links */}
          <div className="flex items-center gap-6 font-semibold">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#2563EB] transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#2563EB] transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
              </svg>
              <span>LinkedIn</span>
            </a>
            <a
              href="mailto:contact@velora.dev"
              className="hover:text-[#2563EB] transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
            <Link href="/sandbox" className="hover:text-[#2563EB] transition-colors">
              Sandbox
            </Link>
            <Link href="/" className="hover:text-[#2563EB] transition-colors">
              Dashboard
            </Link>
          </div>

          {/* Attribution */}
          <div className="text-center md:text-right text-[11px] text-slate-400 font-mono">
            Electric Cobalt & Pure White Design System
          </div>
        </div>
      </footer>
    </div>
  );
}
