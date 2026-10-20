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
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-blue-900/50">
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-blue-400 mb-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Verification Engine
            </span>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Automated Testbed
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Core Compliance Testbed Scenarios
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Deterministic validation harness demonstrating automated detection of keyboard traps, custom interactive control navigation barriers, photographic background contrast failures, and verified regression retesting.
          </p>
        </div>

        {/* Action Button & Status Pill */}
        <div className="flex items-center gap-3 shrink-0 self-start lg:self-auto">
          {allPassed && !isSuiteRunning && (
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>All Scenarios Verified</span>
            </div>
          )}

          <button
            type="button"
            onClick={runOfficialTestSuite}
            disabled={isSuiteRunning}
            className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-60 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-lg shadow-blue-600/30 flex items-center gap-2.5 transition-all cursor-pointer"
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

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
        {testSuiteResults.map((tc) => {
          const isExpanded = expandedTrace[tc.id];

          return (
            <div
              key={tc.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                tc.status === 'running'
                  ? 'bg-blue-950/70 border-blue-500 ring-2 ring-blue-500/30 animate-pulse'
                  : tc.status === 'passed'
                  ? 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
                  : 'bg-slate-800/40 border-slate-800'
              }`}
            >
              <div>
                {/* Card Top */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-300">
                      {tc.criterion}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      tc.status === 'passed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : tc.status === 'running'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 animate-pulse'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {tc.status === 'passed' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    {tc.status === 'running' && <Loader2 className="w-3 h-3 animate-spin text-blue-400" />}
                    <span>{tc.status === 'passed' ? 'VERIFIED' : tc.status.toUpperCase()}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white mb-3">
                  {tc.title}
                </h3>

                {/* Input vs Expected vs Actual */}
                <div className="space-y-2 text-xs font-mono bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-sans block mb-0.5">
                      Target Context:
                    </span>
                    <span className="text-slate-300 text-[11px] break-all">{tc.input}</span>
                  </div>

                  <div className="pt-1.5 border-t border-slate-800/60">
                    <span className="text-[10px] uppercase font-bold text-amber-400 font-sans block mb-0.5">
                      Expected Benchmark:
                    </span>
                    <span className="text-amber-200/90 text-[11px]">{tc.expectedResult}</span>
                  </div>

                  <div className="pt-1.5 border-t border-slate-800/60">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 font-sans block mb-0.5">
                      Observed Result:
                    </span>
                    <span className="text-emerald-200/90 text-[11px]">{tc.actualResult}</span>
                  </div>
                </div>

                {/* Interactive Trace Details Toggle */}
                {tc.traceDetails && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => toggleTrace(tc.id)}
                      className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>{isExpanded ? 'Hide Verification Telemetry' : 'View Keyboard & Inspection Telemetry'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 p-2.5 bg-slate-900 rounded-lg border border-slate-700/80 text-[11px] text-slate-300 font-mono leading-relaxed animate-in fade-in duration-200">
                        {tc.traceDetails}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Badge */}
              <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="bg-slate-900 px-2 py-0.5 rounded text-[10px] font-semibold text-blue-300 border border-slate-700">
                  {tc.badge || 'Verified'}
                </span>
                <span>Timestamp: {tc.timestamp ? new Date(tc.timestamp).toLocaleTimeString() : 'Verified'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
