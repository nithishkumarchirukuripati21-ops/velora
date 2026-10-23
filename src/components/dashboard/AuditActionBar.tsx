'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Globe, Sliders, ChevronDown, Play, Loader2, ArrowRight, Square } from 'lucide-react';
import { useAudit } from '@/context/AuditContext';
import { WCAGLevel } from '@/types/audit';

export function AuditActionBar() {
  const router = useRouter();
  const {
    url,
    setUrl,
    targetLevel,
    setTargetLevel,
    startAudit,
    stopAudit,
    isAuditing,
    urlInputRef,
  } = useAudit();

  const [mode, setMode] = useState<'live' | 'demo'>('live');

  const levels: WCAGLevel[] = [
    'WCAG 2.1 Level A',
    'WCAG 2.1 Level AA',
    'WCAG 2.2 Level AA',
    'WCAG 2.2 Level AAA',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuditing) {
      const target = mode === 'demo' ? '/sandbox' : url;
      router.push('/new-audit');
      await startAudit(target, targetLevel);
    }
  };

  const handleSelectDemo = async () => {
    setMode('demo');
    setUrl('/sandbox');
    router.push('/new-audit');
    await startAudit('/sandbox', targetLevel);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] space-y-4">
      {/* Header inside card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-50/80 dark:bg-cyan-950/50 border border-cyan-200/60 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
            <Sparkles className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
              Deploy Autonomous Accessibility Auditor
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
              Inspect any live public website or audit the pre-configured interactive demo testbed.
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs (Live Web vs Demo Testbed) */}
        <div className="flex items-center bg-slate-100/80 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold border border-slate-200/50 dark:border-slate-700">
          <button
            type="button"
            onClick={() => {
              setMode('live');
              if (url === '/sandbox') setUrl('https://www.w3.org/WAI/');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'live'
                ? 'bg-white dark:bg-slate-700 text-cyan-800 dark:text-cyan-300 shadow-xs font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Live Website</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('demo');
              setUrl('/sandbox');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'demo'
                ? 'bg-white dark:bg-slate-700 text-cyan-800 dark:text-cyan-300 shadow-xs font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Demo</span>
          </button>
        </div>
      </div>

      {/* Form Controls */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* URL Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {mode === 'live' ? (
              <Globe className="w-4 h-4 stroke-[2] text-slate-400" />
            ) : (
              <Sliders className="w-4 h-4 stroke-[2] text-cyan-600" />
            )}
          </div>
          <input
            id="audit-target-url"
            ref={urlInputRef}
            type={mode === 'live' ? 'url' : 'text'}
            value={mode === 'demo' ? '/sandbox (Pre-configured Testbed)' : url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com or any public website"
            disabled={isAuditing ? false : mode === 'demo'}
            required
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white dark:bg-slate-800 dark:hover:bg-slate-800 dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition-all disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:text-slate-600 dark:disabled:text-slate-400 font-mono"
          />
        </div>

        {/* Target Level Dropdown */}
        <div className="relative shrink-0">
          <select
            id="audit-target-level"
            value={targetLevel}
            onChange={(e) => setTargetLevel(e.target.value as WCAGLevel)}
            disabled={isAuditing}
            className="w-full sm:w-auto appearance-none pl-4 pr-9 py-2.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white dark:bg-slate-800 dark:hover:bg-slate-800 dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer transition-all"
          >
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4 stroke-[2]" />
          </div>
        </div>

        {/* Start / Stop Audit Button */}
        {isAuditing ? (
          <button
            type="button"
            onClick={stopAudit}
            className="shrink-0 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl px-4 py-2 flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer text-xs sm:text-sm"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>⏹ Stop Audit</span>
          </button>
        ) : (
          <button
            type="submit"
            className="shrink-0 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <span>{mode === 'demo' ? 'Audit Testbed →' : 'Run Autonomous Audit →'}</span>
          </button>
        )}
      </form>

      {/* Quick benchmark chips beneath input */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 dark:text-slate-500 pt-1 font-mono">
        <span className="text-slate-500 dark:text-slate-400 font-semibold font-sans">Quick benchmarks:</span>
        <button
          type="button"
          onClick={() => {
            setMode('live');
            setUrl('https://www.w3.org/WAI/');
          }}
          className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 hover:text-cyan-800 border border-slate-200/80 dark:border-slate-700 font-medium transition-colors cursor-pointer text-[11px]"
        >
          w3.org
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('live');
            setUrl('https://news.ycombinator.com');
          }}
          className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 hover:text-cyan-800 border border-slate-200/80 dark:border-slate-700 font-medium transition-colors cursor-pointer text-[11px]"
        >
          news.ycombinator.com
        </button>
        <button
          type="button"
          onClick={handleSelectDemo}
          className="px-2.5 py-0.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200/80 dark:border-cyan-800 font-bold transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
        >
          <Sliders className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
          <span>Open Demo Sandbox</span>
          <ArrowRight className="w-3 h-3 text-cyan-500" />
        </button>
      </div>
    </div>
  );
}
