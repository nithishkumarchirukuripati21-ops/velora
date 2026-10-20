'use client';

import React from 'react';
import Link from 'next/link';
import { Accessibility, Sliders, ArrowRight } from 'lucide-react';

export function HeroBanner() {
  return (
    <div className="relative flex flex-col md:flex-row md:items-center justify-between pb-4 pt-1">
      {/* Welcome Text */}
      <div className="max-w-xl z-10 space-y-2">
        <p className="text-sm font-medium text-slate-500 tracking-tight">
          Good morning,
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Welcome back to <span className="text-blue-600">Velora!</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
          Audit your website for accessibility issues with AI-powered analysis and real browser testing.
        </p>

        {/* Quick Demo Sandbox Access Pill */}
        <div className="pt-1">
          <Link
            href="/sandbox"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 hover:text-blue-600 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-all"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>Launch Demo Sandbox with 3 intentional WCAG bugs</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Decorative Accessibility Browser Illustration */}
      <div className="hidden md:flex items-center justify-end relative w-64 h-32 pointer-events-none select-none">
        {/* Soft Leaf Silhouette in Background */}
        <div className="absolute -top-3 right-6 text-blue-200/50">
          <svg width="70" height="70" viewBox="0 0 100 100" fill="currentColor">
            <path d="M20 80C20 40 50 20 80 20C80 60 50 80 20 80Z" opacity="0.4" />
            <path d="M45 45C60 30 75 25 80 20C75 40 60 65 45 45Z" opacity="0.6" />
          </svg>
        </div>

        {/* Browser Mockup Box */}
        <div className="relative w-48 bg-gradient-to-br from-blue-50/90 to-indigo-50/70 border border-blue-100/80 rounded-2xl p-3 shadow-xs">
          {/* Browser Header dots */}
          <div className="flex items-center gap-1 mb-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-300" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-200" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-200" />
          </div>

          {/* Browser content placeholder lines */}
          <div className="space-y-1.5 pr-10">
            <div className="h-2 w-16 bg-blue-200/70 rounded-full" />
            <div className="h-2 w-24 bg-blue-100 rounded-full" />
            <div className="h-2 w-20 bg-blue-100 rounded-full" />
          </div>

          {/* Universal Accessibility Glyph Button */}
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 border-2 border-white">
            <Accessibility className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>

        {/* Secondary soft leaf */}
        <div className="absolute -bottom-2 right-1 text-blue-300/40">
          <svg width="45" height="45" viewBox="0 0 80 80" fill="currentColor">
            <path d="M10 70C20 40 50 30 70 30C60 60 40 70 10 70Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
