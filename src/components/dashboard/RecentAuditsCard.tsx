'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Clock,
  ArrowRight,
  Play,
  Globe,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { useAudit } from '@/context/AuditContext';

export function RecentAuditsCard() {
  const router = useRouter();
  const { audits, setSelectedTargetUrl } = useAudit();

  const handleRowClick = (targetUrl: string) => {
    setSelectedTargetUrl(targetUrl);
    router.push('/issues');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between h-full min-h-[380px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/70 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Recent Audits</h2>
          {audits.length > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
              {audits.length}
            </span>
          )}
        </div>
        <Link
          href="/reports"
          className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 flex items-center gap-1 transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center py-4">
        {audits.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center my-auto py-4">
            {/* Document with Magnifying Glass Illustration */}
            <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
              {/* Back Page / Paper Graphic */}
              <div className="w-16 h-20 bg-cyan-50/80 dark:bg-cyan-950/30 border-2 border-cyan-200/80 dark:border-cyan-800/80 rounded-xl shadow-xs relative flex flex-col p-2.5 gap-1.5">
                <div className="absolute top-0 right-0 w-4 h-4 bg-cyan-100 dark:bg-cyan-900/60 rounded-bl-lg border-b border-l border-cyan-200 dark:border-cyan-800" />
                <div className="h-1.5 w-7 bg-cyan-300/70 dark:bg-cyan-600/50 rounded-full" />
                <div className="h-1.5 w-10 bg-cyan-200/60 dark:bg-cyan-700/40 rounded-full" />
                <div className="h-1.5 w-8 bg-cyan-200/60 dark:bg-cyan-700/40 rounded-full" />
                <div className="h-1.5 w-10 bg-cyan-200/60 dark:bg-cyan-700/40 rounded-full" />
              </div>

              {/* Magnifying Glass Overlay */}
              <div className="absolute bottom-1 right-2 w-10 h-10 rounded-full border-3 border-cyan-500 bg-white dark:bg-slate-800 shadow-md flex items-center justify-center">
                <div className="w-3 h-3 rounded-full border-2 border-cyan-400 opacity-60" />
                <div className="absolute -bottom-2 -right-1 w-2.5 h-4 bg-cyan-500 rounded-sm rotate-45 transform origin-top-left" />
              </div>
            </div>

            {/* Empty State Text */}
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight">
              No audits yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5 max-w-xs font-normal">
              Start your first audit to see results here.
            </p>

            {/* Start New Audit Button */}
            <Link
              href="/new-audit"
              className="bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white stroke-none" />
              <span>Start New Audit</span>
            </Link>
          </div>
        ) : (
          /* Populated State */
          <div className="space-y-2.5">
            {audits.map((item) => {
              let domain = item.url;
              try {
                if (item.url.startsWith('http')) {
                  domain = new URL(item.url).hostname;
                } else if (item.url.includes('sandbox')) {
                  domain = 'Demo Sandbox';
                }
              } catch {
                domain = item.url;
              }

              const count = item.issuesCount ?? item.pendingIssuesCount ?? item.openIssuesCount ?? 0;
              const score = item.score ?? Math.max(20, Math.min(98, Math.round(100 - (count * 4))));

              let scoreBadge = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
              if (score < 60) {
                scoreBadge = 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800';
              } else if (score < 80) {
                scoreBadge = 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800';
              }

              let timeFormatted = 'Just now';
              try {
                if (item.timestamp && item.timestamp !== 'Just now') {
                  const d = new Date(item.timestamp);
                  if (!isNaN(d.getTime())) {
                    timeFormatted = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  }
                }
              } catch {
                timeFormatted = 'Just now';
              }

              return (
                <div
                  key={item.id}
                  onClick={() => handleRowClick(item.url)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRowClick(item.url);
                    }
                  }}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-cyan-300 dark:hover:border-cyan-700 bg-white dark:bg-slate-800/60 hover:bg-cyan-50/20 dark:hover:bg-slate-800 shadow-xs hover:shadow-sm transition-all gap-3 cursor-pointer select-none"
                >
                  {/* Left: Domain / URL & Metadata */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-100 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors truncate max-w-[200px] sm:max-w-[260px]">
                        {domain}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
                        {item.targetLevel || 'WCAG 2.2 Level AA'} • {timeFormatted}
                      </p>
                    </div>
                  </div>

                  {/* Right: Violations Count Pill & Compliance Score Badge */}
                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                    {/* Violations Count Pill */}
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 flex items-center gap-1.5 font-mono">
                      <AlertTriangle className="w-3 h-3 text-rose-500 dark:text-rose-400 shrink-0" />
                      <span>{count} {count === 1 ? 'issue' : 'issues'}</span>
                    </span>

                    {/* Compliance Score Badge */}
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border font-mono ${scoreBadge}`}>
                      {score}%
                    </span>

                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
