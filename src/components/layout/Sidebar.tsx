'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FilePlus2,
  AlertTriangle,
  FileText,
  Settings,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import { useAudit } from '@/context/AuditContext';

interface SidebarProps {
  onItemClick?: () => void;
}

export function Sidebar({ onItemClick }: SidebarProps) {
  const pathname = usePathname();
  const { metrics } = useAudit();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'New Audit', href: '/new-audit', icon: FilePlus2 },
    {
      name: 'Issues',
      href: '/issues',
      icon: AlertTriangle,
      badge:
        metrics.pending > 0
          ? `${metrics.pending} pending`
          : metrics.open > 0
          ? `${metrics.open}`
          : undefined,
      badgeColor:
        metrics.pending > 0 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800',
    },
    { name: 'Demo Sandbox', href: '/sandbox', icon: Sliders },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none shadow-[2px_0_12px_-2px_rgba(0,0,0,0.02)]">
      <div>
        {/* Brand Section: Modernized Velora emblem + subtle tag v2.4 Enterprise */}
        <Link
          href="/welcome"
          onClick={onItemClick}
          className="px-5 pt-6 pb-5 flex items-center gap-3 group transition-all duration-200 cursor-pointer hover:translate-x-0.5 active:scale-[0.99]"
          title="Return to Velora Landing Page"
        >
          {/* Velora Geometric Shield / Apex Emblem */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1D4ED8] via-[#2563EB] to-[#00D2FF] p-0.5 shadow-md shadow-cyan-500/20 shrink-0 group-hover:shadow-cyan-500/35 transition-all">
            <div className="w-full h-full bg-[#0B132B] rounded-[10px] flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-[#00D2FF] fill-none stroke-current stroke-[2.6] stroke-linecap-round stroke-linejoin-round"
              >
                <path d="M12 3L4 9v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V9l-8-6z" />
                <path d="M9.5 12l2 2 3-3" strokeWidth="2.8" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                VELORA
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 uppercase">
                v2.4 Enterprise
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 font-mono tracking-tight">
              Autonomous Verification
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="px-3 space-y-1 mt-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard' || pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onItemClick}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 font-semibold border-l-2 border-cyan-500 shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 rounded-xl px-3 py-2.5 transition-all'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer: All Systems Operational status dot */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">All Systems Operational</span>
        </div>
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
      </div>
    </aside>
  );
}
