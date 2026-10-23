'use client';

import React from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { useAudit } from '@/context/AuditContext';

export function MetricsGrid() {
  const { metrics } = useAudit();

  const cards = [
    {
      id: 'total',
      title: 'Total Audits Completed',
      value: metrics.total,
      subtext: 'Completed audits',
      icon: FileText,
      iconBg: 'bg-purple-100/80 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
    },
    {
      id: 'open',
      title: 'Active Issues',
      value: metrics.open,
      subtext: 'Accessibility issues found',
      icon: AlertTriangle,
      iconBg: 'bg-rose-100/80 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400',
    },
    {
      id: 'resolved',
      title: 'Deterministic Fixes Verified',
      value: metrics.resolved,
      subtext: 'Fixed after retest',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-100/80 dark:bg-emerald-950/40 text-emerald-500 dark:text-emerald-400',
    },
    {
      id: 'pending',
      title: 'Pending Human Approval',
      value: metrics.pending,
      subtext: 'Awaiting human review',
      icon: Clock,
      iconBg: 'bg-cyan-100/80 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:border-cyan-300/80 dark:hover:border-cyan-700/80 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mb-3.5 ${card.iconBg}`}
              >
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>

              {/* Title */}
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {card.title}
              </p>

              {/* Value and Chevron */}
              <div className="flex items-center justify-between mt-1.5 mb-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                  {card.value}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            {/* Subtext */}
            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
