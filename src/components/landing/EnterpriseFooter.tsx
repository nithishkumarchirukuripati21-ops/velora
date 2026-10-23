'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, ExternalLink, Activity } from 'lucide-react';

export function EnterpriseFooter() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#02050b] text-slate-400 py-14 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-slate-850">
          {/* Left: Brand Lockup & Status */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                V
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white block">
                  VELORA
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Autonomous Web Accessibility Platform
                </span>
              </div>
            </div>

            {/* Operational Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-slate-300">Systems Operational: 99.98%</span>
            </div>
          </div>

          {/* Right: Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-400">
            <Link href="/new-audit" className="hover:text-cyan-400 transition-colors">
              New Audit
            </Link>
            <Link href="/sandbox" className="hover:text-cyan-400 transition-colors">
              Sandbox Testbed
            </Link>
            <Link href="/reports" className="hover:text-cyan-400 transition-colors">
              Reports
            </Link>
            <Link href="/settings" className="hover:text-cyan-400 transition-colors">
              API Mesh Settings
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
            <a
              href="mailto:engineering@velora.ai"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-400 text-center sm:text-left">
          <div>
            © 2026 VELORA Platform. One Standard. Every User.
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
              WCAG 2.1 / 2.2 AA Verified
            </span>
            <span className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
              Google Gemini 3-Key Mesh
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
