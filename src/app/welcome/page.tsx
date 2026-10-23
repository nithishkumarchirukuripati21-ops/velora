'use client';

import React, { useState } from 'react';
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
  X,
  Keyboard,
  Globe,
  Radio,
} from 'lucide-react';
import { CuteFloatingRover } from '@/components/landing/CuteFloatingRover';
import { LightZigzagSections } from '@/components/landing/LightZigzagSections';

export default function VeloraElectricCobaltLanding() {
  const [hoveredLetter, setHoveredLetter] = useState<number | null>(null);
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

        {/* Soft Azure Light-Specks */}
        <div
          className="absolute left-[24%] w-2 h-2 rounded-full bg-[#00D2FF]/40 blur-xs animate-drift-fast"
          style={{ animationDelay: '1.5s', top: '-10px' }}
        />
        <div
          className="absolute right-[32%] w-2.5 h-2.5 rounded-full bg-[#2563EB]/35 blur-xs animate-drift-medium"
          style={{ animationDelay: '4s', top: '-20px' }}
        />
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
              href="#runtime-flaw"
              className="hover:text-[#2563EB] transition-colors hover:-translate-y-0.5 inline-block"
            >
              The Flaw
            </a>
            <a
              href="#verification-pipeline"
              className="hover:text-[#2563EB] transition-colors hover:-translate-y-0.5 inline-block"
            >
              Pipeline
            </a>
            <a
              href="#telemetry-feed"
              className="hover:text-[#2563EB] transition-colors hover:-translate-y-0.5 inline-block"
            >
              Telemetry
            </a>
            <a
              href="#sandbox-preview"
              className="hover:text-[#2563EB] transition-colors hover:-translate-y-0.5 inline-block"
            >
              Testbed
            </a>
          </div>

          {/* Right Action: Single Primary Pill Button */}
          <Link
            href="/dashboard"
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
      <section className="relative min-h-[90vh] lg:min-h-screen flex flex-col justify-between pt-24 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
          {/* HERO LEFT: ARCHITECTURAL WORDMARK & DIRECT ACTION */}
          <div className="lg:col-span-6 flex flex-col justify-center items-start space-y-6 sm:space-y-7 text-left">
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

            {/* Hero CTA Button: Solid Cobalt Blue with Cyan Glow */}
            <div className="pt-4">
              <Link
                href="/dashboard"
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

          {/* HERO RIGHT: 3D AUTONOMOUS ACCESSIBILITY AUDITOR ROBOT */}
          <div className="lg:col-span-6 flex justify-center items-center relative perspective-1000">
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center animate-robot-float transform-style-3d">
              {/* Concentric Holographic Audit Orbital Rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[340px] h-[340px] sm:w-[360px] sm:h-[360px] rounded-full border border-[#00D2FF]/40 border-dashed animate-orbit-ring-1 shadow-[0_0_20px_rgba(0,210,255,0.2)]" />
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

                {/* Auditor Optical Visor / Core Eye */}
                <div className="w-full my-auto space-y-3">
                  <div className="relative w-full h-14 rounded-2xl bg-[#0B132B] border-2 border-slate-800 p-2 flex items-center justify-center overflow-hidden shadow-inner">
                    <div className="w-44 sm:w-48 h-5 rounded-full bg-gradient-to-r from-[#2563EB] via-[#00D2FF] to-[#2563EB] animate-visor-pulse shadow-[0_0_25px_#00D2FF] flex items-center justify-center">
                      <div className="w-6 h-3 rounded-full bg-white blur-xs" />
                    </div>
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

              {/* 3 SYMMETRICALLY PULLED-IN TELEMETRY EVIDENCE CHIPS */}
              {/* Chip 1: Focus Trap */}
              <div className="absolute -top-2 left-0 sm:left-2 z-20 animate-chip-1">
                <div className="backdrop-blur-md bg-white/95 border border-slate-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.08)] rounded-2xl px-3.5 py-2 flex items-center gap-2 hover:shadow-lg transition-shadow cursor-default">
                  <div className="w-6 h-6 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 text-[11px] shadow-xs">
                    ⌨️
                  </div>
                  <div className="font-mono text-left">
                    <span className="text-[9px] text-slate-400 block font-semibold leading-none">
                      PROBE 01: KEYBOARD MODAL
                    </span>
                    <span className="text-[11px] font-bold text-[#0B132B]">
                      Focus Trap: <strong className="text-amber-600 font-extrabold">Esc Disarmed</strong>
                    </span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" title="Verified Disarmed" />
                </div>
              </div>

              {/* Chip 2: Photo Contrast */}
              <div className="absolute -top-1 right-0 sm:right-2 z-20 animate-chip-2">
                <div className="backdrop-blur-md bg-white/95 border border-slate-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.08)] rounded-2xl px-3.5 py-2 flex items-center gap-2 hover:shadow-lg transition-shadow cursor-default">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] text-[11px] shadow-xs">
                    🔍
                  </div>
                  <div className="font-mono text-left">
                    <span className="text-[9px] text-slate-400 block font-semibold leading-none">
                      PROBE 02: LUMINANCE SAMPLER
                    </span>
                    <span className="text-[11px] font-bold text-[#0B132B]">
                      Contrast: <strong className="text-[#00D2FF] font-extrabold">4.5:1 AA</strong>
                    </span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#00D2FF] shadow-[0_0_6px_#00D2FF]" />
                </div>
              </div>

              {/* Chip 3: Dual Engine Verification */}
              <div className="absolute -bottom-4 right-2 sm:right-4 z-20 animate-chip-3">
                <div className="backdrop-blur-md bg-white/95 border border-slate-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.08)] rounded-2xl px-3.5 py-2 flex items-center gap-2 hover:shadow-lg transition-shadow cursor-default">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-[#2563EB] text-[11px] shadow-xs">
                    🤖
                  </div>
                  <div className="font-mono text-left">
                    <span className="text-[9px] text-slate-400 block font-semibold leading-none">
                      PROBE 03: DUAL ENGINE
                    </span>
                    <span className="text-[11px] font-bold text-[#0B132B]">
                      Cheerio + Runtime Evaluated
                    </span>
                  </div>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50 shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. CENTERED ANCHOR: SCROLL TO EXPLORE INDICATOR */}
        <div className="w-full flex justify-center items-center pt-8 pb-4">
          <a
            href="#runtime-flaw"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-mono font-bold tracking-wider text-slate-500 bg-white/90 border border-slate-200 shadow-xs hover:border-[#2563EB]/40 hover:text-[#2563EB] transition-all hover:translate-y-0.5"
          >
            <span>SCROLL TO EXPLORE</span>
            <span className="text-[#2563EB]">↓</span>
          </a>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          CUTE FLOATING ROVER BOT (GLIDING SCROLL OBSERVER)
          ───────────────────────────────────────────────────────────── */}
      <CuteFloatingRover />

      {/* ─────────────────────────────────────────────────────────────
          UNIFIED LIGHT-MODE ALTERNATING ZIGZAG SECTIONS
          ───────────────────────────────────────────────────────────── */}
      <LightZigzagSections />
    </div>
  );
}
