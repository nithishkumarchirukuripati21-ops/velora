'use client';

import React from 'react';
import Link from 'next/link';
import { Accessibility, Sliders, ArrowRight } from 'lucide-react';

export function HeroBanner() {
  return (
    <div className="relative flex flex-col md:flex-row md:items-center justify-between pb-4 pt-1">
      {/* Welcome Text */}
      <div className="max-w-xl z-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-50/90 border border-cyan-200/70 text-cyan-800 text-[11px] font-semibold tracking-wide uppercase">
          Autonomous WCAG Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Welcome to <span className="bg-gradient-to-r from-cyan-600 to-sky-600 bg-clip-text text-transparent">Velora</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Continuous Accessibility Intelligence & Runtime Verification Engine
        </p>

        {/* Quick Demo Sandbox Access Pill */}
        <div className="pt-2">
          <Link
            href="/demo-sandbox"
            className="inline-flex items-center gap-2 bg-white/90 dark:bg-slate-900 hover:bg-cyan-50/50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 hover:border-cyan-200 text-slate-700 dark:text-slate-200 hover:text-cyan-700 dark:hover:text-cyan-400 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-all group cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-600" />
            <span>Launch Demo Sandbox with 3 intentional WCAG bugs</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>

      {/* Decorative Accessibility Browser Illustration */}
      <div className="hidden md:flex items-center justify-end relative w-64 h-32 pointer-events-none select-none">
        {/* Soft Silhouette in Background */}
        <div className="absolute -top-3 right-6 text-cyan-200/40 dark:text-cyan-800/30">
          <svg width="70" height="70" viewBox="0 0 100 100" fill="currentColor">
            <path d="M20 80C20 40 50 20 80 20C80 60 50 80 20 80Z" opacity="0.4" />
            <path d="M45 45C60 30 75 25 80 20C75 40 60 65 45 45Z" opacity="0.6" />
          </svg>
        </div>

        {/* Browser Mockup Box */}
        <div className="relative w-48 bg-gradient-to-br from-cyan-50/90 to-sky-50/70 dark:from-slate-800 dark:to-slate-900 border border-cyan-100/90 dark:border-slate-800 rounded-2xl p-3 shadow-xs">
          {/* Browser Header dots */}
          <div className="flex items-center gap-1 mb-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-200" />
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-200" />
          </div>

          {/* Browser content placeholder lines */}
          <div className="space-y-1.5 pr-10">
            <div className="h-2 w-16 bg-cyan-200/70 rounded-full" />
            <div className="h-2 w-24 bg-cyan-100 rounded-full" />
            <div className="h-2 w-20 bg-cyan-100 rounded-full" />
          </div>

          {/* Universal Accessibility Glyph Button */}
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-600 to-sky-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 border-2 border-white">
            <Accessibility className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>

        {/* Secondary soft decoration */}
        <div className="absolute -bottom-2 right-1 text-sky-300/40">
          <svg width="45" height="45" viewBox="0 0 80 80" fill="currentColor">
            <path d="M10 70C20 40 50 30 70 30C60 60 40 70 10 70Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
