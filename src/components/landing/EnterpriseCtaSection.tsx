'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Terminal, Sliders, ExternalLink } from 'lucide-react';

export function EnterpriseCtaSection() {
  return (
    <section id="sandbox-preview" className="relative py-28 bg-[#030712] text-white overflow-hidden border-t border-slate-800/80">
      {/* Ambient Radial Cyber Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.22),rgba(6,182,212,0.12),rgba(3,7,18,0))] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Glowing Cyber Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 p-8 sm:p-14 text-center backdrop-blur-2xl shadow-[0_0_80px_rgba(6,182,212,0.18)] overflow-hidden"
        >
          {/* Subtle top laser highlight */}
          <div className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

          {/* Micro Telemetry Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider mb-6 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
            AUTONOMOUS AUDITING ENGINE READY
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-2xl mx-auto leading-tight">
            Deploy Continuous Web Accessibility Intelligence.
          </h2>

          <p className="mt-5 text-sm sm:text-base text-slate-400 max-w-xl mx-auto font-normal leading-relaxed">
            Eliminate runtime focus traps, verify sub-pixel photo contrast, and synthesize AST code patches with our resilient Google Gemini network.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary Button */}
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_40px_rgba(6,182,212,0.7)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer font-sans"
            >
              <span>Enter Console</span>
              <span className="text-slate-950 font-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
            </Link>

            {/* Secondary Button */}
            <Link
              href="/sandbox"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full text-sm font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/40 hover:text-white shadow-lg transition-all duration-200 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Explore Testbed Sandbox</span>
            </Link>
          </div>

          {/* Verification Badges Below Buttons */}
          <div className="mt-10 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              WCAG 2.1 & 2.2 AA Certified
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Live DOM Event Ingestion
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              Gemini 3-Key Failover Mesh
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
