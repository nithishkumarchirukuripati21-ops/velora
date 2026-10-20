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
      title: 'Total Audits',
      value: metrics.total,
      subtext: 'Completed audits',
      icon: FileText,
      iconBg: 'bg-purple-100/80 text-purple-600',
    },
    {
      id: 'open',
      title: 'Open Issues',
      value: metrics.open,
      subtext: 'Accessibility issues found',
      icon: AlertTriangle,
      iconBg: 'bg-rose-100/80 text-rose-500',
    },
    {
      id: 'resolved',
      title: 'Resolved Issues',
      value: metrics.resolved,
      subtext: 'Fixed after retest',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-100/80 text-emerald-500',
    },
    {
      id: 'pending',
      title: 'Pending Approval',
      value: metrics.pending,
      subtext: 'Awaiting human review',
      icon: Clock,
      iconBg: 'bg-blue-100/80 text-blue-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="group bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-sm hover:border-slate-200/80 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mb-3.5 ${card.iconBg}`}
              >
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>

              {/* Title */}
              <p className="text-xs font-semibold text-slate-700">
                {card.title}
              </p>

              {/* Value and Chevron */}
              <div className="flex items-center justify-between mt-1.5 mb-2">
                <span className="text-2xl font-bold text-slate-900 tracking-tight">
                  {card.value}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
            </div>

            {/* Subtext */}
            <p className="text-xs text-slate-400 font-normal">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
