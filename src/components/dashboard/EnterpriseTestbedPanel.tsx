'use client';

import React, { useState } from 'react';
import { useAudit } from '@/context/AuditContext';
import {
  Play,
  CheckCircle2,
  Loader2,
  Terminal,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FlaskConical,
} from 'lucide-react';

export function EnterpriseTestbedPanel() {
  const { testSuiteResults, isSuiteRunning, runOfficialTestSuite } = useAudit();
  const [expandedTrace, setExpandedTrace] = useState<Record<string, boolean>>({
    TC1: true,
    TC2: false,
    TC3: false,
    TC4: false,
  });

  const toggleTrace = (id: string) => {
    setExpandedTrace((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allPassed = testSuiteResults.every((t) => t.status === 'passed');

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm space-y-6">
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 mb-1.5 font-mono text-xs">
            <FlaskConical className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span className="font-bold uppercase tracking-wider">
              Verification Engine
            </span>
            <span className="bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-300 border border-cyan-200/80 dark:border-cyan-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              Automated Testbed
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Core Compliance Laboratory Scenarios
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Deterministic validation harness demonstrating automated detection of keyboard traps, custom interactive control navigation barriers, photographic background contrast failures, and verified regression retesting.
          </p>
        </div>

        {/* Action Button & Status Pill */}
        <div className="flex items-center gap-3 shrink-0 self-start lg:self-auto">
          {allPassed && !isSuiteRunning && (
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>All Scenarios Verified</span>
            </div>
          )}

          <button
            type="button"
            onClick={runOfficialTestSuite}
            disabled={isSuiteRunning}
            className="bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 disabled:opacity-60 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-[0_2px_10px_rgba(6,182,212,0.3)] flex items-center gap-2.5 transition-all cursor-pointer"
          >
            {isSuiteRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Running Testbed Suite...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white stroke-none" />
                <span>Execute Testbed Suite</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Clean Interactive Laboratory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testSuiteResults.map((tc) => {
          const isExpanded = expandedTrace[tc.id];

          return (
            <div
              key={tc.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                tc.status === 'running'
                  ? 'bg-cyan-50/50 dark:bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/20 shadow-sm'
                  : tc.status === 'passed'
                  ? 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200/90 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 shadow-2xs'
              }`}
            >
              <div>
                {/* Card Top: Criterion & Interactive Badge */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[11px] font-mono font-bold text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800 px-2 py-0.5 rounded-md">
                    {tc.criterion}
                  </span>

                  <div className="flex items-center gap-1.5 font-mono text-[10px]">
                    <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold">
                      Interactive Sandbox Element
                    </span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        tc.status === 'passed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : tc.status === 'running'
                          ? 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 animate-pulse'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {tc.status === 'passed' && <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                      {tc.status === 'running' && <Loader2 className="w-3 h-3 animate-spin text-cyan-600 dark:text-cyan-400" />}
                      <span>{tc.status === 'passed' ? 'VERIFIED' : tc.status.toUpperCase()}</span>
                    </span>
                  </div>
                </div>

                {/* Scenario Title */}
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2.5">
                  {tc.title}
                </h3>

                {/* Input vs Expected vs Actual (Clean Developer Syntax Container) */}
                <div className="space-y-2 text-xs font-mono bg-slate-900 text-slate-100 p-3 rounded-xl border border-slate-800 shadow-inner">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-sans block mb-0.5">
                      Target Context:
                    </span>
                    <span className="text-slate-300 text-[11px] break-all">{tc.input}</span>
                  </div>

                  <div className="pt-1.5 border-t border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-amber-400 font-sans block mb-0.5">
                      Expected Benchmark:
                    </span>
                    <span className="text-amber-200 text-[11px]">{tc.expectedResult}</span>
                  </div>

                  <div className="pt-1.5 border-t border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 font-sans block mb-0.5">
                      Observed Result:
                    </span>
                    <span className="text-emerald-300 font-semibold text-[11px]">{tc.actualResult}</span>
                  </div>
                </div>

                {/* Interactive Trace Details Toggle */}
                {tc.traceDetails && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => toggleTrace(tc.id)}
                      className="text-[11px] font-semibold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 transition-colors cursor-pointer font-mono"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>{isExpanded ? 'Hide Telemetry Logs' : 'View Keyboard & Inspection Telemetry'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-200 font-mono leading-relaxed animate-in fade-in duration-200">
                        {tc.traceDetails}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Badge */}
              <div className="pt-3 mt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="bg-white px-2 py-0.5 rounded text-[10px] font-bold text-cyan-800 border border-slate-200">
                  {tc.badge || 'Verified'}
                </span>
                <span>{tc.timestamp ? new Date(tc.timestamp).toLocaleTimeString() : 'Verified'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
