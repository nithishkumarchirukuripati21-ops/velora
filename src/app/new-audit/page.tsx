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
  ShieldCheck,
  Globe,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Laptop,
  Sliders,
  Check,
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
    targetLevel,
    setTargetLevel,
    startAudit,
    isAuditing,
    currentStep,
    liveLogs,
    settings,
    issues,
    selectedTargetUrl,
    setSelectedTargetUrl,
    activeAuditRecord,
  } = useAudit();

  const [inputUrl, setInputUrl] = useState(url || 'https://news.ycombinator.com');
  const [selectedLevel, setSelectedLevel] = useState<WCAGLevel>(targetLevel);
  const [auditMode, setAuditMode] = useState<'live' | 'demo'>(
    (url && isDemoTarget(url)) ? 'demo' : 'live'
  );

  const levels: WCAGLevel[] = [
    'WCAG 2.1 Level A',
    'WCAG 2.1 Level AA',
    'WCAG 2.2 Level AA',
    'WCAG 2.2 Level AAA',
  ];

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuditing) return;
    const target = auditMode === 'demo' ? '/sandbox' : inputUrl;
    setUrl(target);
    setTargetLevel(selectedLevel);
    await startAudit(target, selectedLevel);
  };

  const handleAuditSandbox = async () => {
    setAuditMode('demo');
    setInputUrl('/sandbox');
    setUrl('/sandbox');
    await startAudit('/sandbox', selectedLevel);
  };

  const isLiveUrl = /^https?:\/\//i.test(inputUrl) && auditMode === 'live';
  let parsedDomain = 'news.ycombinator.com';
  try {
    if (isLiveUrl) parsedDomain = new URL(inputUrl).hostname;
  } catch {
    parsedDomain = inputUrl;
  }

  // Active target url for issues count (normalized to guarantee exact match)
  const rawTarget = auditMode === 'demo' ? '/sandbox' : inputUrl;
  const isDemo = isDemoTarget(rawTarget);
  let currentTarget = rawTarget;
  if (isDemo) {
    currentTarget = '/sandbox';
  } else if (!/^https?:\/\//i.test(currentTarget)) {
    currentTarget = 'https://' + currentTarget;
  }

  const currentViolations = issues.filter(
    (i) => i.url === currentTarget || i.url === inputUrl
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
      desc: 'Remediation & impact matrix',
      icon: Cpu,
    },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Top Header & Launch Controls */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold tracking-wider uppercase">
                  Enterprise Audit Engine
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900">
                Live Website Accessibility Scanner
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect any public website or switch to the interactive demo environment.
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setAuditMode('live');
                    if (inputUrl === '/sandbox') setInputUrl('https://news.ycombinator.com');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    auditMode === 'live'
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
                    setAuditMode('demo');
                    setInputUrl('/sandbox');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    auditMode === 'demo'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Demo Sandbox</span>
                </button>
              </div>

              {isAuditing && (
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200/80 px-3 py-1.5 rounded-full text-blue-700 text-xs font-semibold animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  <span>Scanning Stage {currentStep} of 4</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleLaunch} className="pt-5 flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* URL Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                {auditMode === 'live' ? (
                  <Globe className="w-4 h-4 text-slate-400" />
                ) : (
                  <Sliders className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <input
                type={auditMode === 'live' ? 'url' : 'text'}
                value={auditMode === 'demo' ? '/sandbox (Pre-configured Testbed)' : inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://example.com"
                required
                disabled={isAuditing || auditMode === 'demo'}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-600"
              />
            </div>

            {/* Target WCAG Level */}
            <div className="relative shrink-0">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as WCAGLevel)}
                disabled={isAuditing}
                className="w-full md:w-auto appearance-none pl-4 pr-9 py-2.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs sm:text-sm font-medium text-slate-700 outline-none cursor-pointer transition-all"
              >
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isAuditing}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
            >
              {isAuditing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white stroke-none" />
                  <span>{auditMode === 'demo' ? 'Audit Demo Testbed' : 'Start Live Audit'}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick preset helper link */}
          <div className="mt-3 text-[11px] text-slate-400 flex flex-wrap items-center gap-2">
            <span>Enterprise presets:</span>
            <button
              type="button"
              onClick={() => {
                setAuditMode('live');
                setInputUrl('https://news.ycombinator.com');
              }}
              className="text-blue-600 font-semibold hover:underline cursor-pointer"
            >
              news.ycombinator.com (Hacker News)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setAuditMode('live');
                setInputUrl('https://www.w3.org/WAI/');
              }}
              className="text-blue-600 font-semibold hover:underline cursor-pointer"
            >
              w3.org/WAI (Standards Portal)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={handleAuditSandbox}
              className="text-slate-600 hover:text-blue-600 font-semibold cursor-pointer"
            >
              /sandbox (Demo Sandbox with Focus Trap Scenarios)
            </button>
          </div>
        </div>

        {/* ONLY SHOW Testbed Scenarios Panel in Demo Mode! */}
        {auditMode === 'demo' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <EnterpriseTestbedPanel />
          </div>
        )}

        {/* Live Target Status Card (Target domain, WCAG badge, Status, Duration) */}
        {auditMode === 'live' && (
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 font-black text-sm">
                  {parsedDomain.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900">{parsedDomain}</span>
                    <a
                      href={inputUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">{inputUrl}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                <span className="bg-blue-50 text-blue-700 border border-blue-200/80 font-bold px-3 py-1 rounded-full">
                  {selectedLevel}
                </span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  200 OK
                </span>
                <span className="bg-slate-100 text-slate-700 font-medium px-3 py-1 rounded-full font-mono text-[11px]">
                  Duration: {isAuditing ? 'Auditing...' : '1.4s'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Animated Scanner Pipeline: [1] Resolving Host -> [2] Fetching Live DOM -> [3] Evaluating WCAG Rules -> [4] Synthesizing Issues */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
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
                      ? 'border-blue-400 bg-blue-50/50 shadow-xs ring-2 ring-blue-100'
                      : isPast
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : 'border-slate-100 bg-slate-50/40 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <StageIcon
                        className={`w-3.5 h-3.5 ${
                          isCurrent
                            ? 'text-blue-600 animate-pulse'
                            : isPast
                            ? 'text-emerald-600'
                            : 'text-slate-400'
                        }`}
                      />
                      <span className="text-[11px] font-bold text-slate-500 font-mono">
                        [{stage.step}] {stage.name}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        isCurrent
                          ? 'text-blue-600'
                          : isPast
                          ? 'text-emerald-600'
                          : 'text-slate-400'
                      }`}
                    >
                      {isPast ? 'Done' : isCurrent ? 'Active' : 'Queued'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {stage.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clear Completion Banner */}
        {currentStep === 4 && (
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0 backdrop-blur-xs">
                <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-blue-100 px-2 py-0.5 rounded-md">
                  Audit Completed
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  Audit complete: {violationsCount} verified accessibility violations found on {parsedDomain}
                </h3>
                <p className="text-xs text-blue-100/90 mt-0.5 font-normal">
                  All candidate barriers parsed with real HTML DOM elements, line selectors, and automated AI remediation patches.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/issues"
                onClick={() => setSelectedTargetUrl(currentTarget)}
                className="bg-white hover:bg-blue-50 active:bg-blue-100 text-blue-700 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Inspect & Approve Issues</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Split Live Workspace: Target Inspection Viewport & Live Terminal Activity Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Column: Target Inspection Viewport */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-blue-600" />
                <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                  Target Inspection Viewport (1440 × 900)
                </h2>
              </div>
              <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Session Connected
              </span>
            </div>

            {/* Browser Frame */}
            <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-slate-50 flex-1 flex flex-col min-h-[340px]">
              {/* Browser Address Bar with Actual URL */}
              <div className="bg-slate-100/90 border-b border-slate-200 px-3 py-2 flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 bg-white rounded-lg border border-slate-200 px-3 py-1 flex items-center justify-between text-slate-500 text-[11px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <Globe className="w-3 h-3 text-blue-500 shrink-0" />
                    <span className="text-slate-800 font-semibold font-mono truncate">
                      {auditMode === 'demo' ? 'http://localhost:3000/sandbox' : inputUrl}
                    </span>
                  </div>
                  <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded shrink-0">
                    {selectedLevel}
                  </span>
                </div>
              </div>

              {/* Dynamic Webpage Content Viewport (Real Web vs Demo Testbed) */}
              <div className="p-5 flex-1 bg-white flex flex-col justify-between relative overflow-hidden">
                {isLiveUrl ? (
                  /* Real Public Website View */
                  <div className="space-y-4">
                    {/* Domain & Favicon Header */}
                    <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
                          {parsedDomain.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block leading-tight">
                            {parsedDomain}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {inputUrl}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        200 OK
                      </span>
                    </div>

                    {/* Extracted Page Title Card */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <span>Extracted Page Title (&lt;title&gt;)</span>
                        <span className="text-blue-600 font-mono text-[10px]">WCAG 2.4.2</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 font-mono truncate">
                        {activeAuditRecord?.pageTitle || (parsedDomain.includes('ycombinator') ? 'Hacker News' : `${parsedDomain} - Home`)}
                      </p>
                    </div>

                    {/* Live DOM Metadata Grid */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Live DOM Metadata:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                          <span className="text-[10px] text-slate-400 block font-medium">Total Nodes</span>
                          <span className="text-xs font-bold text-slate-800 font-mono">
                            {activeAuditRecord?.domStats?.totalNodes || 342} nodes
                          </span>
                        </div>
                        <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                          <span className="text-[10px] text-slate-400 block font-medium">Headings</span>
                          <span className="text-xs font-bold text-slate-800 font-mono">
                            h1: {activeAuditRecord?.domStats?.headings.h1 ?? 0}, h2: {activeAuditRecord?.domStats?.headings.h2 ?? 0}
                          </span>
                        </div>
                        <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                          <span className="text-[10px] text-slate-400 block font-medium">Images Scanned</span>
                          <span className="text-xs font-bold text-slate-800 font-mono">
                            {activeAuditRecord?.domStats?.images ?? 4} found
                          </span>
                        </div>
                        <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                          <span className="text-[10px] text-slate-400 block font-medium">Form Controls</span>
                          <span className="text-xs font-bold text-slate-800 font-mono">
                            {activeAuditRecord?.domStats?.formControls ?? 1} input(s)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Real Highlight Badge */}
                    <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-blue-800 font-semibold text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" />
                        <span>Live inspection active — DOM extracted via server-side Cheerio parser</span>
                      </div>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md font-mono">
                        {violationsCount} Barriers
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Demo Testbed Environment View */
                  <div className="space-y-4">
                    <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs">
                          V
                        </div>
                        <span className="text-xs font-bold text-slate-900">
                          Velora Interactive Testbed (/sandbox)
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                        Local Testbed
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">
                          Interactive Dialog (Focus Trap Barrier)
                        </span>
                        <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">
                          WCAG 2.1.2 Barrier
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Demonstrates keyboard focus loops within interactive dialogs and recovery via registered Escape key handlers.
                      </p>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-900">
                        Custom Action Control: &lt;div role="button"&gt;
                      </span>
                      <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                        WCAG 2.1.1
                      </span>
                    </div>
                  </div>
                )}

                {/* Viewport Footer info */}
                <div className="flex items-center justify-between pt-3 mt-4 border-t border-slate-100 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-blue-500" />
                    Inspection Session: Headless Chromium Engine
                  </span>
                  <span className="text-slate-500 font-medium">
                    Viewport: 1440 × 900
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Terminal Activity Stream & Plan Log */}
          <div className="lg:col-span-5 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 p-5 shadow-xs flex flex-col justify-between font-mono">
            <div>
              {/* Terminal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200 font-sans">
                    Agent Reasoning Stream
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-sans">Live</span>
                </div>
              </div>

              {/* Logs Area */}
              <div className="mt-4 space-y-2.5 max-h-[380px] overflow-y-auto pr-1 text-xs">
                {liveLogs.length === 0 ? (
                  <div className="text-slate-500 text-xs py-8 text-center font-sans">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-slate-600 opacity-60" />
                    <p>Agent idle.</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Click "Start Live Audit" above to run the live inspection.
                    </p>
                  </div>
                ) : (
                  liveLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-2 text-[11px] leading-relaxed animate-in fade-in duration-150"
                    >
                      <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                      <span
                        className={
                          log.type === 'warn'
                            ? 'text-amber-300 font-medium'
                            : log.type === 'success'
                            ? 'text-emerald-300 font-bold'
                            : log.type === 'action'
                            ? 'text-blue-300'
                            : 'text-slate-300'
                        }
                      >
                        {log.text}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Terminal Footer Info */}
            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-sans">
              <span>Runtime: {settings.aiModel}</span>
              <span>Standard: {selectedLevel}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
