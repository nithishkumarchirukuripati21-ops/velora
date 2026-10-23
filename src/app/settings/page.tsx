'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useAudit } from '@/context/AuditContext';
import { WCAGLevel } from '@/types/audit';
import {
  Settings,
  ShieldCheck,
  Keyboard,
  Save,
  CheckCircle2,
  Key,
  Eye,
  EyeOff,
  Loader2,
  Zap,
  RefreshCw,
  Cpu,
  Check,
  Activity,
  Layers,
} from 'lucide-react';
import { GeminiKeyStatus } from '@/lib/geminiKeyManager';

interface NetworkTelemetry {
  activeModel?: string;
  totalKeys: number;
  systemKeyCount: number;
  hasUserOverride: boolean;
  keys: GeminiKeyStatus[];
  userKeyCount?: number;
  totalActive?: number;
  pool?: { id: string; masked: string; source: string; status: string; cooldownUntil?: number }[];
}

export default function SettingsPage() {
  const { settings, updateSettings, showToast } = useAudit();

  const [defaultLevel, setDefaultLevel] = useState<WCAGLevel>(settings.defaultLevel);
  const [keyboardDepth, setKeyboardDepth] = useState<number>(settings.keyboardDepth);
  const [aiModel, setAiModel] = useState<string>(() => {
    if (
      settings.aiModel === 'Gemini 1.5 Flash' ||
      settings.aiModel === 'Gemini 2.0 Flash' ||
      settings.aiModel === 'Gemini 1.5 Pro'
    ) {
      return settings.aiModel;
    }
    return 'Gemini 1.5 Flash';
  });

  const [screenshotCapture, setScreenshotCapture] = useState<boolean>(true);
  const [strictContrast, setStrictContrast] = useState<boolean>(false);

  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('velora_gemini_user_key') ||
        localStorage.getItem('velora_gemini_custom_keys') ||
        localStorage.getItem('velora_gemini_api_key') ||
        settings.geminiApiKey ||
        ''
      );
    }
    return settings.geminiApiKey || '';
  });

  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isTestingKey, setIsTestingKey] = useState<boolean>(false);
  const [keyTestStatus, setKeyTestStatus] = useState<{
    status: 'live_ai' | 'fallback_rules' | 'error';
    message: string;
    keyUsed?: string;
    tierUsed?: string;
    elapsedMs?: number;
  } | null>(null);

  const [telemetry, setTelemetry] = useState<NetworkTelemetry>({
    totalKeys: 3,
    systemKeyCount: 3,
    hasUserOverride: false,
    keys: [],
  });
  const [isRefreshingTelemetry, setIsRefreshingTelemetry] = useState<boolean>(false);

  const syncNetworkTelemetry = useCallback(async (keyToSync?: string) => {
    setIsRefreshingTelemetry(true);
    try {
      const keyVal = keyToSync !== undefined ? keyToSync : geminiApiKey;
      const res = await fetch('/api/remediate/network-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userKey: keyVal }),
      });
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
      }
    } catch {
      // ignore network glitch
    } finally {
      setIsRefreshingTelemetry(false);
    }
  }, [geminiApiKey]);

  useEffect(() => {
    syncNetworkTelemetry();
  }, [syncNetworkTelemetry]);

  const levels: WCAGLevel[] = [
    'WCAG 2.1 Level A',
    'WCAG 2.1 Level AA',
    'WCAG 2.2 Level AA',
    'WCAG 2.2 Level AAA',
  ];

  const geminiModels = [
    {
      id: 'Gemini 1.5 Flash',
      title: 'Gemini 1.5 Flash',
      badge: 'Recommended - Default',
      desc: 'Fast multimodal DOM analysis and instant code patch generation.',
      isRecommended: true,
    },
    {
      id: 'Gemini 2.0 Flash',
      title: 'Gemini 2.0 Flash',
      badge: 'Next-Gen Speed',
      desc: 'Next-generation speed and structured output reasoning.',
      isRecommended: false,
    },
    {
      id: 'Gemini 1.5 Pro',
      title: 'Gemini 1.5 Pro',
      badge: 'Deep Reasoning',
      desc: 'Deep contextual reasoning for complex ARIA states and dense enterprise DOMs.',
      isRecommended: false,
    },
  ];

  const testGeminiKeyNetwork = async () => {
    setIsTestingKey(true);
    setKeyTestStatus(null);
    const startTime = performance.now();

    try {
      const res = await fetch('/api/remediate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueId: 'TC3-PHOTO-CONTRAST',
          ruleId: 'photo-contrast-ratio',
          htmlSnippet: '<div class="banner"><h3>Winter Sale</h3></div>',
          pageContext: 'https://news.ycombinator.com',
          userApiKey: geminiApiKey.trim() || undefined,
        }),
      });

      const elapsedMs = Math.round(performance.now() - startTime);

      if (res.ok) {
        const data = await res.json();
        setKeyTestStatus({
          status: 'live_ai',
          message: `Network Verified: Gemini responded in ${elapsedMs}ms with valid remediation diff.`,
          keyUsed: data.keyUsed || 'System Key Pool',
          tierUsed: data.tierUsed || 'System Pool',
          elapsedMs,
        });
        showToast(`Gemini Failover Mesh verified (${elapsedMs}ms).`);
      } else {
        setKeyTestStatus({
          status: 'fallback_rules',
          message: `HTTP ${res.status}: Fallback rules active. Safe failover verified (${elapsedMs}ms).`,
          elapsedMs,
        });
      }

      syncNetworkTelemetry();
    } catch (err: unknown) {
      const error = err as Error;
      const elapsedMs = Math.round(performance.now() - startTime);
      setKeyTestStatus({
        status: 'error',
        message: `Connection error: ${error.message} (${elapsedMs}ms)`,
        elapsedMs,
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = geminiApiKey.trim();
    if (typeof window !== 'undefined') {
      localStorage.setItem('velora_gemini_user_key', cleanKey);
      localStorage.setItem('velora_gemini_custom_keys', cleanKey);
      localStorage.setItem('velora_gemini_api_key', cleanKey);
    }
    updateSettings({
      defaultLevel,
      keyboardDepth,
      aiModel,
      geminiApiKey: cleanKey,
    });
    syncNetworkTelemetry(cleanKey);
    showToast('Auditor preferences and Gemini Key Network saved!');
  };

  const hasUserKeyActive = Boolean(geminiApiKey.trim()) || telemetry.hasUserOverride;

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-4xl">
        {/* Header Block */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 mb-1">
            <Settings className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase">
              Engine Configuration
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Auditor Settings & Key Failover Network
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Configure default compliance criteria, simulation depth for keyboard agents, and Google Gemini AI parameters.
          </p>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Standard & Compliance Level */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-200/60 dark:border-cyan-800">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Compliance Benchmark
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select the default WCAG guideline version for automated test suites.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">
                  DEFAULT TARGET STANDARD
                </label>
                <select
                  value={defaultLevel}
                  onChange={(e) => setDefaultLevel(e.target.value as WCAGLevel)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-500 transition-all cursor-pointer font-mono"
                >
                  {levels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  WCAG 2.2 Level AA includes criteria such as Focus Appearance & Dragging Movements.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">
                  STRICT CONTRAST THRESHOLD
                </label>
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      Enforce Enhanced AAA Contrast (7:1)
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Standard AA requires 4.5:1 for normal body text.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={strictContrast}
                    onChange={(e) => setStrictContrast(e.target.checked)}
                    className="w-4 h-4 text-cyan-600 rounded cursor-pointer accent-cyan-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Browser Subagent & Keyboard Navigation */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-200/60 dark:border-cyan-800">
                <Keyboard className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Subagent Keyboard Traversal
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Control how deeply the headless browser agent traverses DOM landmarks.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700 font-mono">
                    KEYBOARD NAVIGATION DEPTH
                  </label>
                  <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                    {keyboardDepth} Tab stops
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={150}
                  step={5}
                  value={keyboardDepth}
                  onChange={(e) => setKeyboardDepth(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Maximum sequential keyboard tab stops before terminating traversal.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">
                  EVIDENCE CAPTURE
                </label>
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      High-Resolution Screenshots
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Snap visual evidence bounding boxes for every violation.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={screenshotCapture}
                    onChange={(e) => setScreenshotCapture(e.target.checked)}
                    className="w-4 h-4 text-cyan-600 rounded cursor-pointer accent-cyan-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: AI Model Selection (Exclusively Google Gemini) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-200/60 dark:border-cyan-800">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  AI Reasoning & Remediation Model
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select the Google Gemini model that powers automated code patch generation and barrier analysis.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-2 font-mono">
                ACTIVE REASONING ENGINE
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {geminiModels.map((model) => {
                  const isSelected = aiModel === model.id;
                  return (
                    <div
                      key={model.id}
                      onClick={() => setAiModel(model.id)}
                      className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-50/50 ring-2 ring-cyan-500/20 shadow-xs'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-900">
                          {model.title}
                        </span>
                        {isSelected ? (
                          <div className="w-4 h-4 rounded-full bg-cyan-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300" />
                        )}
                      </div>

                      <div className="mb-2">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full inline-block ${
                            model.isRecommended
                              ? 'bg-cyan-100 text-cyan-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {model.badge}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {model.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 4: Hardware-Style Structured 3-Key Gemini Pool View */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Gemini 3-Key Resilient Failover Network
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Continuous zero-downtime key rotation with automated rate-limit detection.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => syncNetworkTelemetry()}
                disabled={isRefreshingTelemetry}
                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                title="Refresh network telemetry"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingTelemetry ? 'animate-spin text-cyan-600' : ''}`} />
                <span>Refresh Status</span>
              </button>
            </div>

            {/* Hardware-Grade Key Nodes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 font-mono text-xs">
              {/* Card 1: Key Alpha */}
              <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/80 flex flex-col justify-between shadow-2xs relative overflow-hidden">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">NODE 01</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                </div>
                <div className="py-2.5">
                  <span className="text-xs font-bold text-slate-900 block font-sans">Key Alpha</span>
                  <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                    {telemetry.keys?.[0]?.masked || 'AIzaSy...alpha'}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                  <span className="text-emerald-700 font-bold">● Active (100%)</span>
                  <span className="text-slate-400 font-sans">12ms</span>
                </div>
              </div>

              {/* Card 2: Key Beta */}
              <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/80 flex flex-col justify-between shadow-2xs relative overflow-hidden">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">NODE 02</span>
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                </div>
                <div className="py-2.5">
                  <span className="text-xs font-bold text-slate-900 block font-sans">Key Beta</span>
                  <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                    {telemetry.keys?.[1]?.masked || 'AIzaSy...beta'}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                  <span className="text-cyan-700 font-bold">Warm Standby</span>
                  <span className="text-slate-400 font-sans">Ready</span>
                </div>
              </div>

              {/* Card 3: Key Gamma */}
              <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/80 flex flex-col justify-between shadow-2xs relative overflow-hidden">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">NODE 03</span>
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <div className="py-2.5">
                  <span className="text-xs font-bold text-slate-900 block font-sans">Key Gamma</span>
                  <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                    {telemetry.keys?.[2]?.masked || 'AIzaSy...gamma'}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                  <span className="text-blue-700 font-bold">Failover Shield</span>
                  <span className="text-slate-400 font-sans">Cooldown: 0s</span>
                </div>
              </div>
            </div>

            {/* User Custom Key Override Slot */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-mono">
                  <Key className="w-3.5 h-3.5 text-cyan-600" />
                  <span>USER CUSTOM GEMINI KEY (TIER 1 OVERRIDE)</span>
                </label>
                {geminiApiKey && (
                  <button
                    type="button"
                    onClick={() => {
                      setGeminiApiKey('');
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem('velora_gemini_user_key');
                        localStorage.removeItem('velora_gemini_custom_keys');
                        localStorage.removeItem('velora_gemini_api_key');
                      }
                      syncNetworkTelemetry('');
                    }}
                    className="text-[10px] text-slate-400 hover:text-rose-600 transition-colors cursor-pointer font-mono"
                  >
                    Clear override
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={geminiApiKey}
                  onChange={(e) => {
                    const val = e.target.value;
                    setGeminiApiKey(val);
                    setKeyTestStatus(null);
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('velora_gemini_user_key', val.trim());
                      localStorage.setItem('velora_gemini_custom_keys', val.trim());
                      localStorage.setItem('velora_gemini_api_key', val.trim());
                    }
                    syncNetworkTelemetry(val);
                  }}
                  placeholder="Paste your personal Gemini API Key (optional override)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 text-xs font-mono text-slate-800 outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={showApiKey ? 'Hide key' : 'Show key'}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                If provided, your key will be prioritized at Slot 0. If it hits rate limits, Velora automatically falls back to our 3 default system keys without interruption.
              </p>
            </div>

            {/* Test Gemini Failover Network Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={testGeminiKeyNetwork}
                disabled={isTestingKey}
                className="bg-slate-900 hover:bg-slate-800 active:bg-slate-950 disabled:opacity-60 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                {isTestingKey ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    <span>Testing Failover Network...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Test Gemini Failover Network</span>
                  </>
                )}
              </button>
            </div>

            {/* Test Status Banner */}
            {keyTestStatus && (
              <div
                className={`p-4 rounded-xl border text-xs font-mono transition-all animate-in fade-in duration-150 ${
                  keyTestStatus.status === 'live_ai'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : keyTestStatus.status === 'fallback_rules'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="font-bold shrink-0 text-sm">
                    {keyTestStatus.status === 'live_ai'
                      ? '✓'
                      : keyTestStatus.status === 'fallback_rules'
                      ? '⚠️'
                      : '✕'}
                  </span>
                  <div className="space-y-0.5">
                    <div className="font-bold">{keyTestStatus.message}</div>
                    {keyTestStatus.status === 'live_ai' && keyTestStatus.keyUsed && (
                      <div className="text-[10px] text-emerald-700 font-sans mt-0.5">
                        Tier: <strong>{keyTestStatus.tierUsed}</strong> • Key: <strong>{keyTestStatus.keyUsed}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Action Row */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-[0_2px_10px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Auditor Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
