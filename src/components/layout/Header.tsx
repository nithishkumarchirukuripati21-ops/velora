'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sliders, ExternalLink, Cpu } from 'lucide-react';
import { useAudit } from '@/context/AuditContext';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Header() {
  const pathname = usePathname();
  const { settings } = useAudit();

  const getPageTitle = () => {
    if (pathname.startsWith('/new-audit')) return { title: 'New Audit', category: 'Auditor Workspace' };
    if (pathname.startsWith('/issues')) return { title: 'Issues & Evidence', category: 'Verification Matrix' };
    if (pathname.startsWith('/sandbox') || pathname.startsWith('/demo-sandbox')) return { title: 'Demo Testbed', category: 'Interactive Laboratory' };
    if (pathname.startsWith('/reports')) return { title: 'Compliance Reports', category: 'Executive Archive' };
    if (pathname.startsWith('/settings')) return { title: 'Settings', category: 'Engine Configuration' };
    return { title: 'Platform Overview', category: 'Enterprise Dashboard' };
  };

  const { title, category } = getPageTitle();

  return (
    <header className="w-full flex items-center justify-between py-3.5 px-6 sm:px-8 border-b border-slate-200/70 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 transition-all">
      {/* Left: Active Page Breadcrumb */}
      <div className="flex items-center gap-2.5">
        <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline-block">
          {category}
        </span>
        <span className="text-slate-300 hidden sm:inline-block">/</span>
        <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {title}
        </h1>
      </div>

      {/* Right Controls: Quick Sandbox, Engine Status, Model Badge & Theme */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Action: Launch Testbed Sandbox */}
        <Link
          href="/sandbox"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-cyan-800 bg-cyan-50/80 hover:bg-cyan-100/80 border border-cyan-200/70 shadow-2xs hover:shadow-xs transition-all active:scale-98"
          title="Open interactive sandbox testbed"
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-600" />
          <span>Launch Testbed Sandbox</span>
          <ExternalLink className="w-3 h-3 text-cyan-500" />
        </Link>

        {/* Engine Telemetry Status Pill */}
        <div className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 rounded-full px-3 py-1 flex items-center gap-2 text-xs font-medium shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
          <span className="font-semibold tracking-tight">Gemini 3-Key Failover Mesh: Operational</span>
        </div>

        {/* Compact Model Badge */}
        <div className="hidden sm:inline-flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 rounded-full px-2.5 py-1 text-xs font-mono font-semibold shadow-2xs">
          <Cpu className="w-3 h-3 text-cyan-600" />
          <span className="truncate max-w-[130px]">{settings.aiModel || 'Gemini 1.5 Flash'}</span>
        </div>

        {/* Theme Toggle Button */}
        <ThemeToggle />
      </div>
    </header>
  );
}
