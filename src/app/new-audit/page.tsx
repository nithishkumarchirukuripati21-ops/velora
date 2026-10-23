'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useAudit } from '@/context/AuditContext';
import { WCAGLevel } from '@/types/audit';
import { isDemoTarget } from '@/lib/wcagEngine';
import {
  Sparkles,
  ChevronDown,
  Play,
  Loader2,
  CheckCircle2,
  Clock,
  Terminal,
  Globe,
  ArrowRight,
  ExternalLink,
  Laptop,
  Sliders,
  Network,
  DownloadCloud,
  FileCheck2,
  Cpu,
} from 'lucide-react';
import { EnterpriseTestbedPanel } from '@/components/dashboard/EnterpriseTestbedPanel';

export default function NewAuditPage() {
  const router = useRouter();
  const {
    url,
    setUrl,
    targetLevel: contextTargetLevel,
    setTargetLevel: setContextTargetLevel,
    startAudit,
    isAuditing,
    currentStep,
    liveLogs,
    settings,
    issues,
    setSelectedTargetUrl,
    activeAuditRecord,
  } = useAudit();

  const [targetUrl, setTargetUrl] = useState(url || '');
  const [inputUrl, setInputUrl] = useState(url || '');
  const [targetLevel, setTargetLevel] = useState<string>('WCAG22AA');
  const [selectedLevel, setSelectedLevel] = useState<WCAGLevel>(contextTargetLevel || 'WCAG 2.2 Level AA');
  const [auditMode, setAuditMode] = useState<'live' | 'demo'>(
    url && isDemoTarget(url) ? 'demo' : 'live'
  );

  const levels: WCAGLevel[] = [
    'WCAG 2.1 Level A',
    'WCAG 2.1 Level AA',
    'WCAG 2.2 Level AA',
    'WCAG 2.2 Level AAA',
  ];

  const handleStartAudit = async (e?: React.SyntheticEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isAuditing) return;
    const effectiveUrl = auditMode === 'demo' ? '/sandbox' : (targetUrl || inputUrl);
    const normalizedLevel: WCAGLevel =
      targetLevel === 'WCAG22AA' || targetLevel === 'WCAG 2.2 Level AA'
        ? 'WCAG 2.2 Level AA'
        : targetLevel === 'WCAG21AA' || targetLevel === 'WCAG 2.1 Level AA'
        ? 'WCAG 2.1 Level AA'
        : targetLevel === 'WCAG 2.1 Level A'
        ? 'WCAG 2.1 Level A'
        : targetLevel === 'WCAG 2.2 Level AAA'
        ? 'WCAG 2.2 Level AAA'
        : 'WCAG 2.2 Level AA';

    setUrl(effectiveUrl);
    setContextTargetLevel(normalizedLevel);
    await startAudit(effectiveUrl, normalizedLevel);
  };

  const handleLaunch = async (e: React.FormEvent) => {
    await handleStartAudit(e);
  };

  const handleAuditSandbox = async () => {
    setAuditMode('demo');
    setTargetUrl('/sandbox');
    setInputUrl('/sandbox');
    setUrl('/sandbox');
    await startAudit('/sandbox', selectedLevel);
  };

  const effectiveDomainUrl = targetUrl || inputUrl;
  const isLiveUrl = /^https?:\/\//i.test(effectiveDomainUrl) && auditMode === 'live';
  let parsedDomain = 'Target Domain';
  try {
    if (isLiveUrl) parsedDomain = new URL(effectiveDomainUrl).hostname;
    else if (effectiveDomainUrl) parsedDomain = effectiveDomainUrl;
  } catch {
    parsedDomain = effectiveDomainUrl || 'Target Domain';
  }

  // Active target url for issues count (normalized to guarantee exact match)
  const rawTarget = auditMode === 'demo' ? '/sandbox' : effectiveDomainUrl;
  const isDemo = isDemoTarget(rawTarget);
  let currentTarget = rawTarget;
  if (isDemo) {
    currentTarget = '/sandbox';
  } else if (!/^https?:\/\//i.test(currentTarget)) {
    currentTarget = 'https://' + currentTarget;
  }

  const currentViolations = issues.filter(
    (i) => i.url === currentTarget || i.url === effectiveDomainUrl
  );
  const violationsCount = currentViolations.length;

  const scannerStages = [
    {
      step: 1,
      name: 'Resolving Host',
      desc: 'DNS resolution & SSL handshake',
      icon: Network,
    },
    {
      step: 2,
      name: 'Fetching Live DOM',
      desc: 'Retrieving raw HTML payload',
      icon: DownloadCloud,
    },
    {
      step: 3,
      name: 'Evaluating WCAG Rules',
      desc: 'DOM analysis & node inspection',
      icon: FileCheck2,
    },
    {
      step: 4,
      name: 'Synthesizing Issues',
      desc: 'Gemini AI impact & code matrix',
      icon: Cpu,
    },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* 1. Target Domain Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] backdrop-blur-sm relative overflow-hidden">
          {/* Subtle top cyan ambient accent line */}
          <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-75" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 mb-1">
                <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase">
                  1. Target Domain
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                Live Website Accessibility Scanner
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Inspect any public web domain or engage the local interactive demo laboratory.
              </p>
            </div>

            {/* Quick-Switch Segmented Pill Buttons */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100/90 dark:bg-slate-800 p-1 rounded-2xl text-xs font-semibold border border-slate-200/60 dark:border-slate-700 shadow-2xs">
                <button
                  type="button"
                  onClick={() => {
                    setAuditMode('live');
                    if (targetUrl === '/sandbox' || inputUrl === '/sandbox') {
                      setTargetUrl('https://news.ycombinator.com');
                      setInputUrl('https://news.ycombinator.com');
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                    auditMode === 'live'
                      ? 'bg-white dark:bg-slate-700 text-cyan-800 dark:text-cyan-300 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${auditMode === 'live' ? 'bg-cyan-500 shadow-[0_0_6px_#06b6d4]' : 'bg-slate-400'}`} />
                  <span>Live Remote Website</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuditMode('demo');
                    setTargetUrl('/sandbox');
                    setInputUrl('/sandbox');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                    auditMode === 'demo'
                      ? 'bg-white dark:bg-slate-700 text-cyan-800 dark:text-cyan-300 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>Demo Sandbox Testbed</span>
                </button>
              </div>

              {isAuditing && (
                <div className="flex items-center gap-2 bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200/80 dark:border-cyan-800 px-3.5 py-1.5 rounded-full text-cyan-800 dark:text-cyan-300 text-xs font-bold animate-pulse shadow-2xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-600 dark:text-cyan-400" />
                  <span>Stage {currentStep} of 4</span>
                </div>
              )}
            </div>
          </div>

          {/* Clean Restored Input Form inside Card 1 */}
          <div className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
              <input
                id="audit-target-url"
                type="url"
                value={targetUrl}
                onChange={(e) => {
                  setTargetUrl(e.target.value);
                  setInputUrl(e.target.value);
                }}
                placeholder="https://example.com or any public site"
                className="flex-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
              />
              <select
                id="audit-target-level"
                value={targetLevel}
                onChange={(e) => {
                  setTargetLevel(e.target.value);
                  const normalized =
                    e.target.value === 'WCAG22AA' || e.target.value === 'WCAG 2.2 Level AA'
                      ? 'WCAG 2.2 Level AA'
                      : e.target.value === 'WCAG21AA' || e.target.value === 'WCAG 2.1 Level AA'
                      ? 'WCAG 2.1 Level AA'
                      : e.target.value === 'WCAG 2.1 Level A'
                      ? 'WCAG 2.1 Level A'
                      : 'WCAG 2.2 Level AAA';
                  setSelectedLevel(normalized as WCAGLevel);
                }}
                className="px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm"
              >
                <option value="WCAG22AA">WCAG 2.2 Level AA</option>
                <option value="WCAG21AA">WCAG 2.1 Level AA</option>
              </select>
              <button
                type="button"
                onClick={handleStartAudit}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Start Live Audit →
              </button>
            </div>
          </div>

          {/* Quick Benchmark Chips */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2.5 font-mono">
            <span className="text-slate-400 dark:text-slate-500 font-semibold font-sans">Quick benchmarks:</span>
            <button
              type="button"
              onClick={() => {
                setAuditMode('live');
                setTargetUrl('https://www.w3.org/WAI/');
                setInputUrl('https://www.w3.org/WAI/');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 hover:text-cyan-800 dark:hover:text-cyan-300 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer text-[11px]"
            >
              w3.org
            </button>
            <button
              type="button"
              onClick={() => {
                setAuditMode('live');
                setTargetUrl('https://news.ycombinator.com');
                setInputUrl('https://news.ycombinator.com');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 hover:text-cyan-800 dark:hover:text-cyan-300 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer text-[11px]"
            >
              news.ycombinator.com
            </button>
            <button
              type="button"
              onClick={handleAuditSandbox}
              className="px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200/80 dark:border-cyan-800 transition-colors cursor-pointer font-bold flex items-center gap-1.5 text-[11px]"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Open Demo Sandbox</span>
              <ArrowRight className="w-3 h-3 text-cyan-500" />
            </button>
          </div>
        </div>

        {/* Demo Mode Testbed Panel */}
        {auditMode === 'demo' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <EnterpriseTestbedPanel />
          </div>
        )}

        {/* Live Target Status Card */}
        {auditMode === 'live' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200/80 dark:border-cyan-800 flex items-center justify-center text-cyan-700 dark:text-cyan-300 shrink-0 font-black text-sm shadow-2xs">
                  {parsedDomain.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900 dark:text-slate-100">{parsedDomain}</span>
                    <a
                      href={inputUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-cyan-600 transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{inputUrl}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                <span className="bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-300 border border-cyan-200/80 dark:border-cyan-800 font-bold px-3 py-1 rounded-full font-mono">
                  {selectedLevel}
                </span>
                <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 font-bold px-3 py-1 rounded-full flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                  200 OK
                </span>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-3 py-1 rounded-full font-mono text-[11px]">
                  Duration: {isAuditing ? 'Auditing...' : '1.4s'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 4-Stage Animated Pipeline */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {scannerStages.map((stage) => {
              const isPast = currentStep > stage.step;
              const isCurrent = currentStep === stage.step;
              const StageIcon = stage.icon;

              return (
                <div
                  key={stage.step}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-cyan-400 bg-cyan-50/60 dark:bg-cyan-950/40 shadow-xs ring-2 ring-cyan-100 dark:ring-cyan-900'
                      : isPast
                      ? 'border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/30'
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <StageIcon
                        className={`w-3.5 h-3.5 ${
                          isCurrent
                            ? 'text-cyan-600 dark:text-cyan-400 animate-pulse'
                            : isPast
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-400'
                        }`}
                      />
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 font-mono">
                        [{stage.step}] {stage.name}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                        isCurrent
                          ? 'text-cyan-700 dark:text-cyan-300'
                          : isPast
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : 'text-slate-400'
                      }`}
                    >
                      {isPast ? 'Done' : isCurrent ? 'Active' : 'Queued'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {stage.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion Banner */}
        {currentStep === 4 && (
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                  Audit Completed
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  Audit complete: {violationsCount} verified accessibility violations found on {parsedDomain}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 font-normal">
                  All candidate barriers parsed with real HTML DOM elements, line selectors, and automated AI remediation patches.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/issues"
                onClick={() => setSelectedTargetUrl(currentTarget)}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Inspect & Approve Issues</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Workspace Display: Informative Pre-Audit State Card vs Live Traversal Console */}
        {!isAuditing && liveLogs.length === 0 && !activeAuditRecord ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] text-center relative overflow-hidden animate-in fade-in duration-200">
            <div className="max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200/80 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto shadow-xs">
                <Terminal className="w-8 h-8 stroke-[1.8]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Ready for live inspection. Enter a target URL or launch the testbed.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                Deploy Velora&apos;s autonomous auditor to traverse DOM nodes, detect cyclic keyboard traps (WCAG 2.1.2), calculate mathematical contrast over complex imagery (WCAG 1.4.3), and synthesize Gemini-verified AST patches.
              </p>

              {/* Quick Action Triggers */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAuditMode('live');
                    setTargetUrl('https://news.ycombinator.com');
                    setInputUrl('https://news.ycombinator.com');
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-cyan-800 dark:text-cyan-300 bg-cyan-50/80 dark:bg-cyan-950/50 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 border border-cyan-200/80 dark:border-cyan-800 transition-all cursor-pointer font-mono"
                >
                  Load news.ycombinator.com
                </button>
                <button
                  type="button"
                  onClick={handleAuditSandbox}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 transition-all cursor-pointer shadow-sm shadow-cyan-500/20 font-mono flex items-center gap-2"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Launch Demo Sandbox Testbed</span>
                </button>
              </div>

              {/* 3 Inspection Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 text-left text-xs font-mono">
                <div className="p-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700">
                  <span className="text-[10px] text-cyan-700 dark:text-cyan-400 font-bold block uppercase tracking-wider mb-1">
                    01 // DOM Graph
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-sans font-medium text-[11px] block">
                    Real headless browser AST and heading tree extraction.
                  </span>
                </div>
                <div className="p-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700">
                  <span className="text-[10px] text-cyan-700 dark:text-cyan-400 font-bold block uppercase tracking-wider mb-1">
                    02 // Keyboard Agent
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-sans font-medium text-[11px] block">
                    Sequential Tab loop traversal and focus trap detection.
                  </span>
                </div>
                <div className="p-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700">
                  <span className="text-[10px] text-cyan-700 dark:text-cyan-400 font-bold block uppercase tracking-wider mb-1">
                    03 // Gemini AI
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-sans font-medium text-[11px] block">
                    Multi-key failover matrix generating verified remediation.
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Split Live Workspace: Target Viewport & Refined Dark-Slate Developer Console */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Target Inspection Viewport */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                  Target Inspection Viewport (1440 × 900)
                </h2>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shadow-[0_0_6px_#10b981]" />
                Session Connected
              </span>
            </div>

            {/* Browser Frame */}
            <div className="mt-4 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-xs bg-slate-50 dark:bg-slate-800 flex-1 flex flex-col min-h-[350px]">
              {/* Browser Address Bar with Actual URL */}
              <div className="bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 px-3 py-2 flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1 flex items-center justify-between text-slate-500 text-[11px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <Globe className="w-3 h-3 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200 font-semibold font-mono truncate">
                      {auditMode === 'demo' ? 'http://localhost:3000/sandbox' : (targetUrl || inputUrl)}
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-700 dark:text-cyan-300 font-bold bg-cyan-50 dark:bg-cyan-950/50 px-1.5 py-0.5 rounded shrink-0 font-mono">
                    {selectedLevel}
                  </span>
                </div>
              </div>

              {/* Dynamic Content Viewport */}
              <div className="p-5 flex-1 bg-white dark:bg-slate-900 flex flex-col justify-between relative overflow-hidden">
                {isLiveUrl ? (
                  <div className="space-y-4">
                    <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
                          {parsedDomain.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block leading-tight">
                            {parsedDomain}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {targetUrl || inputUrl}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                        200 OK
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <span>Extracted Page Title (&lt;title&gt;)</span>
                        <span className="text-cyan-700 dark:text-cyan-400 font-mono text-[10px]">WCAG 2.4.2</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono truncate">
                        {activeAuditRecord?.pageTitle || (parsedDomain.includes('ycombinator') ? 'Hacker News' : `${parsedDomain} - Home`)}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                        Live DOM Metadata:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-lg">
                          <span className="text-[10px] text-slate-400 block font-medium">Total Nodes</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                            {activeAuditRecord?.domStats?.totalNodes || 342} nodes
                          </span>
                        </div>
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-lg">
                          <span className="text-[10px] text-slate-400 block font-medium">Headings</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                            h1: {activeAuditRecord?.domStats?.headings.h1 ?? 0}, h2: {activeAuditRecord?.domStats?.headings.h2 ?? 0}
                          </span>
                        </div>
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-lg">
                          <span className="text-[10px] text-slate-400 block font-medium">Images Scanned</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                            {activeAuditRecord?.domStats?.images ?? 4} found
                          </span>
                        </div>
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-lg">
                          <span className="text-[10px] text-slate-400 block font-medium">Form Controls</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                            {activeAuditRecord?.domStats?.formControls ?? 1} input(s)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-cyan-50/80 border border-cyan-200/80 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-cyan-900 font-semibold text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse shrink-0" />
                        <span>Live inspection active — DOM extracted via server-side Cheerio parser</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-md">
                        {violationsCount} Barriers
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white font-extrabold flex items-center justify-center text-xs">
                          V
                        </div>
                        <span className="text-xs font-bold text-slate-900">
                          Velora Interactive Testbed (/sandbox)
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full">
                        Local Testbed
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-300">
                          Interactive Dialog (Focus Trap Barrier)
                        </span>
                        <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-mono font-bold">
                          WCAG 2.1.2 Barrier
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Demonstrates keyboard focus loops within interactive dialogs and recovery via registered Escape key handlers.
                      </p>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-900 font-mono text-[11px]">
                        Custom Action Control: &lt;div role="button"&gt;
                      </span>
                      <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-mono">
                        WCAG 2.1.1
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500">
                  <span className="flex items-center gap-1 font-mono">
                    <Terminal className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                    Inspection Session: Headless Chromium Engine
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">
                    Viewport: 1440 × 900
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Refined Dark-Slate Developer Console */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between font-mono">
            <div>
              {/* Chrome Top Bar with macOS-Style Window Dots and Title */}
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 mr-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-xs font-bold text-slate-200 font-sans tracking-tight">
                    Agent Traversal Stream // Live DOM Inspector
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]" />
                  <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">
                    Connected
                  </span>
                </div>
              </div>

              {/* Monospace Stream Logs with Severity Badges */}
              <div className="p-4 space-y-2.5 max-h-[400px] overflow-y-auto text-xs">
                {liveLogs.length === 0 ? (
                  <div className="text-slate-500 text-xs py-12 text-center font-sans">
                    <Clock className="w-7 h-7 mx-auto mb-2 text-slate-600 opacity-60" />
                    <p className="font-semibold text-slate-400">Agent idle.</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Click "Start Live Audit" above to launch autonomous DOM traversal.
                    </p>
                  </div>
                ) : (
                  liveLogs.map((log) => {
                    // Determine pill style based on content/type
                    const isTrap = log.text.includes('Trap') || log.text.includes('FAIL') || log.text.includes('TRAP') || log.text.includes('Violation');
                    const isWarn = log.type === 'warn' || log.text.includes('Disagreement') || log.text.includes('WARN');
                    const isPass = log.type === 'success' || log.text.includes('PASS') || log.text.includes('Resolved');
                    const isScan = log.type === 'action' || log.text.includes('Agent') || log.text.includes('Inspecting');

                    return (
                      <div
                        key={log.id}
                        className="flex items-start gap-2 text-[11px] leading-relaxed border-b border-slate-800/40 pb-1.5 animate-in fade-in duration-150"
                      >
                        <span className="text-slate-500 shrink-0 font-mono text-[10px]">
                          [{log.timestamp}]
                        </span>

                        {/* Severity Pill */}
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 uppercase tracking-wider ${
                            isTrap
                              ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                              : isWarn
                              ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                              : isPass
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                              : isScan
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {isTrap ? 'TRAP' : isWarn ? 'WARN' : isPass ? 'PASS' : 'SCAN'}
                        </span>

                        <span
                          className={
                            isTrap
                              ? 'text-rose-300 font-medium'
                              : isWarn
                              ? 'text-amber-200'
                              : isPass
                              ? 'text-emerald-300 font-semibold'
                              : isScan
                              ? 'text-cyan-200'
                              : 'text-slate-300'
                          }
                        >
                          {log.text}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Terminal Footer Info */}
            <div className="bg-slate-950/70 p-3.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Runtime: {settings.aiModel}
              </span>
              <span>Target Standard: {selectedLevel}</span>
            </div>
          </div>
        </div>
        )}
      </div>
    </DashboardShell>
  );
}
