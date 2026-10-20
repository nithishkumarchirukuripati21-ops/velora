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
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between h-full min-h-[380px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100/70">
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Recent Audits</h2>
          {audits.length > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {audits.length}
            </span>
          )}
        </div>
        <Link
          href="/reports"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
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
              <div className="w-16 h-20 bg-blue-50/80 border-2 border-blue-200/80 rounded-xl shadow-xs relative flex flex-col p-2.5 gap-1.5">
                <div className="absolute top-0 right-0 w-4 h-4 bg-blue-100 rounded-bl-lg border-b border-l border-blue-200" />
                <div className="h-1.5 w-7 bg-blue-300/70 rounded-full" />
                <div className="h-1.5 w-10 bg-blue-200/60 rounded-full" />
                <div className="h-1.5 w-8 bg-blue-200/60 rounded-full" />
                <div className="h-1.5 w-10 bg-blue-200/60 rounded-full" />
              </div>

              {/* Magnifying Glass Overlay */}
              <div className="absolute bottom-1 right-2 w-10 h-10 rounded-full border-3 border-blue-500 bg-white/95 shadow-md flex items-center justify-center">
                <div className="w-3 h-3 rounded-full border-2 border-blue-400 opacity-60" />
                <div className="absolute -bottom-2 -right-1 w-2.5 h-4 bg-blue-500 rounded-sm rotate-45 transform origin-top-left" />
              </div>
            </div>

            {/* Empty State Text */}
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">
              No audits yet
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-5 max-w-xs font-normal">
              Start your first audit to see results here.
            </p>

            {/* Start New Audit Button */}
            <Link
              href="/new-audit"
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
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

              let scoreBadge = 'bg-emerald-50 text-emerald-700 border-emerald-300';
              if (score < 60) {
                scoreBadge = 'bg-rose-50 text-rose-700 border-rose-300';
              } else if (score < 80) {
                scoreBadge = 'bg-amber-50 text-amber-700 border-amber-300';
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
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-200/90 hover:border-blue-400 bg-white hover:bg-blue-50/20 shadow-xs hover:shadow-sm transition-all gap-3 cursor-pointer select-none"
                >
                  {/* Left: Domain / URL & Metadata */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate max-w-[200px] sm:max-w-[260px]">
                        {domain}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.targetLevel || 'WCAG 2.2 Level AA'} • {timeFormatted}
                      </p>
                    </div>
                  </div>

                  {/* Right: Violations Count Pill & Compliance Score Badge */}
                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                    {/* Violations Count Pill */}
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-rose-50 text-rose-700 border-rose-200 flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0" />
                      <span>{count} {count === 1 ? 'issue' : 'issues'} found</span>
                    </span>

                    {/* Compliance Score Badge */}
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${scoreBadge}`}>
                      {score}%
                    </span>

                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
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
