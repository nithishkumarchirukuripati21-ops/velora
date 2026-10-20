'use client';

import React from 'react';
import { Lightbulb } from 'lucide-react';
import { useAudit } from '@/context/AuditContext';

export function HowItWorksCard() {
  const { currentStep, isAuditing } = useAudit();

  const steps = [
    {
      num: 1,
      title: 'Collect the details',
      desc: 'Provide the website URL and target level.',
      color: 'bg-blue-600 text-white',
      glow: 'ring-4 ring-blue-100',
    },
    {
      num: 2,
      title: 'Plan the next steps',
      desc: 'Combines automated checks with keyboard testing.',
      color: 'bg-purple-600 text-white',
      glow: 'ring-4 ring-purple-100',
    },
    {
      num: 3,
      title: 'Find the information',
      desc: 'Audit the website pages using a real browser.',
      color: 'bg-emerald-500 text-white',
      glow: 'ring-4 ring-emerald-100',
    },
    {
      num: 4,
      title: 'Take action',
      desc: 'Human approval required. Logs issues.',
      color: 'bg-amber-500 text-white',
      glow: 'ring-4 ring-amber-100',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between h-full min-h-[380px]">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100/70">
        <Lightbulb className="w-4 h-4 text-blue-600" />
        <h2 className="text-sm font-bold text-slate-900">How It Works</h2>
      </div>

      {/* 4 Steps Vertical Workflow */}
      <div className="flex-1 flex flex-col justify-between pt-5 pb-1">
        {steps.map((step, idx) => {
          const isCurrent = isAuditing && currentStep === step.num;
          const isCompleted = isAuditing && currentStep > step.num;
          const isLast = idx === steps.length - 1;

          return (
            <div key={step.num} className="relative flex items-start gap-4">
              {/* Connector Line */}
              {!isLast && (
                <div
                  className={`absolute top-7 left-3.5 -ml-px w-0.5 h-9 transition-colors ${
                    isCompleted ? 'bg-blue-300' : 'bg-slate-100'
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Step Badge */}
              <div
                className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                  step.color
                } ${isCurrent ? step.glow + ' scale-110' : ''}`}
              >
                {step.num}
              </div>

              {/* Step Text */}
              <div className="pt-0.5 pb-3">
                <p className="text-xs font-bold text-slate-900 leading-snug">
                  {step.title}
                </p>
                <p className="text-[11px] text-slate-400 font-normal leading-relaxed mt-0.5">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
