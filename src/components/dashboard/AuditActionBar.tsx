'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Globe, Sliders, ChevronDown, Play, Loader2, ArrowRight } from 'lucide-react';
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
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs transition-shadow hover:shadow-sm space-y-4">
      {/* Header inside card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Sparkles className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">
              Deploy Autonomous Accessibility Auditor
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-normal">
              Inspect any live public website or audit the pre-configured interactive demo testbed.
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs (Live Web vs Demo Testbed) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('live');
              if (url === '/sandbox') setUrl('https://www.w3.org/WAI/');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'live'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
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
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
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
              <Sliders className="w-4 h-4 stroke-[2] text-blue-600" />
            )}
          </div>
          <input
            ref={urlInputRef}
            type={mode === 'live' ? 'url' : 'text'}
            value={mode === 'demo' ? '/sandbox (Pre-configured Testbed)' : url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={isAuditing || mode === 'demo'}
            required
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50/60 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-600"
          />
        </div>

        {/* Target Level Dropdown */}
        <div className="relative shrink-0">
          <select
            value={targetLevel}
            onChange={(e) => setTargetLevel(e.target.value as WCAGLevel)}
            disabled={isAuditing}
            className="w-full sm:w-auto appearance-none pl-4 pr-9 py-2.5 bg-slate-50/60 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs sm:text-sm font-medium text-slate-700 outline-none cursor-pointer transition-all"
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

        {/* Start Audit Button */}
        <button
          type="submit"
          disabled={isAuditing}
          className="shrink-0 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-xs sm:text-sm px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
        >
          {isAuditing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Auditing...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white stroke-none" />
              <span>{mode === 'demo' ? 'Audit Testbed' : 'Start Live Audit'}</span>
            </>
          )}
        </button>
      </form>

      {/* Quick presets row */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
        <span>Suggested targets:</span>
        <button
          type="button"
          onClick={() => {
            setMode('live');
            setUrl('https://www.w3.org/WAI/');
          }}
          className="text-blue-600 hover:underline font-medium"
        >
          w3.org/WAI
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => {
            setMode('live');
            setUrl('https://example.com');
          }}
          className="text-blue-600 hover:underline font-medium"
        >
          example.com
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={handleSelectDemo}
          className="text-slate-600 hover:text-blue-600 font-medium flex items-center gap-1"
        >
          <span>Demo Environment (Interactive Testbed)</span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
        </button>
      </div>
    </div>
  );
}
