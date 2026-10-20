'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sun, ChevronDown, Check, User, LogOut, ShieldCheck, Sliders } from 'lucide-react';
import { useAudit } from '@/context/AuditContext';

export function Header() {
  const { isDarkMode, toggleDarkMode } = useAudit();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="w-full flex items-center justify-between py-4 px-6 sm:px-8 border-b border-slate-100/60 bg-white/50 backdrop-blur-sm sticky top-0 z-30">
      {/* Left: Quick Links (Demo Sandbox) */}
      <div className="flex items-center gap-2.5">
        <Link
          href="/sandbox"
          className="group flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200/80 px-3.5 py-1.5 rounded-full text-blue-700 text-xs font-semibold shadow-xs transition-all active:scale-95"
        >
          <Sliders className="w-3.5 h-3.5 text-blue-600 group-hover:rotate-45 transition-transform" />
          <span>Launch Demo Sandbox</span>
          <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
            Live
          </span>
        </Link>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Toggle Theme"
        >
          <Sun className="w-5 h-5 stroke-[1.8]" />
        </button>

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
          >
            <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-white font-semibold text-xs shadow-xs">
              U
            </div>
            <span className="text-sm font-semibold text-slate-800">User</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 stroke-[2.2]" />
          </button>

          {/* User Menu Dropdown */}
          {userMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
              role="menu"
            >
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-medium text-slate-400">Signed in as</p>
                <p className="text-sm font-semibold text-slate-800 truncate">
                  auditor@velora.ai
                </p>
              </div>
              <div className="py-1">
                <Link
                  href="/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  role="menuitem"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Account Settings
                </Link>
                <div
                  className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 flex items-center gap-2.5"
                  role="menuitem"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  WCAG 2.2 Compliant
                </div>
              </div>
              <div className="border-t border-slate-100 pt-1">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(false)}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2.5"
                  role="menuitem"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
