'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FilePlus2,
  AlertTriangle,
  FileText,
  Settings,
  Sprout,
  Sliders,
} from 'lucide-react';
import { useAudit } from '@/context/AuditContext';

interface SidebarProps {
  onItemClick?: () => void;
}

export function Sidebar({ onItemClick }: SidebarProps) {
  const pathname = usePathname();
  const { metrics } = useAudit();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'New Audit', href: '/new-audit', icon: FilePlus2 },
    {
      name: 'Issues',
      href: '/issues',
      icon: AlertTriangle,
      badge: metrics.pending > 0 ? `${metrics.pending} pending` : metrics.open > 0 ? `${metrics.open}` : undefined,
      badgeColor: metrics.pending > 0 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800',
    },
    { name: 'Demo Sandbox', href: '/sandbox', icon: Sliders },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      <div>
        {/* Brand Logo Header (Redirects to Landing Page) */}
        <Link
          href="/welcome"
          onClick={onItemClick}
          className="px-6 pt-7 pb-6 flex items-start gap-3 group transition-all duration-200 cursor-pointer hover:translate-x-0.5 active:scale-[0.99]"
          title="Return to Velora Landing Page"
        >
          {/* Velora Geometric V Logo */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0 group-hover:shadow-blue-500/35 group-hover:brightness-110 transition-all">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 fill-none stroke-current stroke-[2.7] stroke-linecap-round stroke-linejoin-round"
            >
              <path d="M4 4l8 16L20 4" />
              <path d="M7 6l5 10L17 6" className="opacity-50" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-wider text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
              VELORA
            </span>
            <span className="text-[11px] font-medium text-slate-400 tracking-tight">
              A better web, verified.
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="px-4 space-y-1.5 mt-2" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onItemClick}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-blue-600' : 'text-slate-500'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.badgeColor || 'bg-slate-100 text-slate-600'
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

      {/* Bottom Footer Info */}
      <div className="p-5 border-t border-slate-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
          <Sprout className="w-4 h-4 text-blue-600" />
        </div>
        <p className="text-xs text-slate-500 leading-snug font-normal">
          More accessible web for everyone.
        </p>
      </div>
    </aside>
  );
}
