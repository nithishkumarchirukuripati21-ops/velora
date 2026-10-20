'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useAudit } from '@/context/AuditContext';
import { Menu, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { toastMessage } = useAudit();

  return (
    <div className="min-h-screen flex bg-[#f3f6fc] text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-700">
      {/* Desktop Left Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex flex-col w-72 bg-white h-full z-10 shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar onItemClick={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar with Hamburger */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link
            href="/welcome"
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 active:scale-95 transition-all"
            title="Return to Velora Landing Page"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              V
            </div>
            <span className="font-extrabold tracking-wider text-slate-900">
              VELORA
            </span>
          </Link>
          <div className="w-8" />
        </div>

        {/* Global Desktop Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-5 sm:p-7 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-xs sm:text-sm font-medium leading-snug">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}
