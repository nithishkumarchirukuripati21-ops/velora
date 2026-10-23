'use client';

import React from 'react';
import { Lightbulb } from 'lucide-react';
import { useAudit } from '@/context/AuditContext';

export function HowItWorksCard() {
  const { currentStep, isAuditing } = useAudit();

  const steps = [
    {
      num: 1,
      title: 'Target Calibration',
      desc: 'Specify target URL and select conformance standard (A, AA, AAA).',
      color: 'bg-cyan-600 text-white',
      glow: 'ring-4 ring-cyan-100',
    },
    {
      num: 2,
      title: 'Real DOM Traversal',
      desc: 'Simulate screen-reader focus tab loops and DOM hierarchy inspection.',
      color: 'bg-sky-600 text-white',
      glow: 'ring-4 ring-sky-100',
    },
    {
      num: 3,
      title: 'Gemini 3-Key Analysis',
      desc: 'Active failover network synthesizes exact WCAG violations and fixes.',
      color: 'bg-emerald-600 text-white',
      glow: 'ring-4 ring-emerald-100',
    },
    {
      num: 4,
      title: 'Ledger Verification',
      desc: 'Remediate code with human approval and cryptographic proof.',
      color: 'bg-indigo-600 text-white',
      glow: 'ring-4 ring-indigo-100',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between h-full min-h-[380px]">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200/70 dark:border-slate-800">
        <Lightbulb className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Autonomous Workflow</h2>
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
                    isCompleted ? 'bg-cyan-400' : 'bg-slate-200/80 dark:bg-slate-700'
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Step Badge */}
              <div
                className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 font-mono transition-all ${
                  step.color
                } ${isCurrent ? step.glow + ' scale-110 ring-cyan-200' : ''}`}
              >
                {step.num}
              </div>

              {/* Step Text */}
              <div className="pt-0.5 pb-3">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {step.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed mt-0.5">
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
