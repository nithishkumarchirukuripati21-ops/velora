'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useAudit } from '@/context/AuditContext';
import { WCAGLevel } from '@/types/audit';
import {
  Settings,
  ShieldCheck,
  Bot,
  Keyboard,
  Save,
  CheckCircle2,
  Sparkles,
  Sliders,
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings, showToast } = useAudit();

  const [defaultLevel, setDefaultLevel] = useState<WCAGLevel>(settings.defaultLevel);
  const [keyboardDepth, setKeyboardDepth] = useState<number>(settings.keyboardDepth);
  const [aiModel, setAiModel] = useState<string>(settings.aiModel);

  const [screenshotCapture, setScreenshotCapture] = useState<boolean>(true);
  const [strictContrast, setStrictContrast] = useState<boolean>(false);

  const levels: WCAGLevel[] = [
    'WCAG 2.1 Level A',
    'WCAG 2.1 Level AA',
    'WCAG 2.2 Level AA',
    'WCAG 2.2 Level AAA',
  ];

  const models = [
    'Claude 3.5 Sonnet',
    'GPT-4o',
    'Gemini 1.5 Pro',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      defaultLevel,
      keyboardDepth,
      aiModel,
    });
  };

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-4xl">
        {/* Header Block */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Settings className="w-4 h-4" />
            <span className="text-xs font-bold tracking-wider uppercase">
              Platform Configuration
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Auditor Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure default compliance criteria, simulation depth for keyboard agents, and AI model parameters.
          </p>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Standard & Compliance Level */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Compliance Benchmark
                </h2>
                <p className="text-xs text-slate-400">
                  Select the default WCAG guideline version for automated test suites.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Default Target Standard
                </label>
                <select
                  value={defaultLevel}
                  onChange={(e) => setDefaultLevel(e.target.value as WCAGLevel)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all cursor-pointer"
                >
                  {levels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  WCAG 2.2 Level AA includes 9 new criteria such as Focus Appearance & Dragging Movements.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Strict Contrast Threshold
                </label>
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <span className="text-xs font-medium text-slate-800 block">
                      Enforce Enhanced AAA Contrast (7:1)
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Standard AA requires 4.5:1 for body copy.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={strictContrast}
                    onChange={(e) => setStrictContrast(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Browser Subagent & Keyboard Navigation */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Keyboard className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Subagent Keyboard Traversal
                </h2>
                <p className="text-xs text-slate-400">
                  Control how deeply the headless browser agent traverses DOM landmarks.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Keyboard Navigation Depth
                  </label>
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
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
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Maximum sequential keyboard tab stops before terminating traversal.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Evidence Capture
                </label>
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <span className="text-xs font-medium text-slate-800 block">
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
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: AI Assistant Model Selection */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  AI Remediation & Reasoning Model
                </h2>
                <p className="text-xs text-slate-400">
                  Select the underlying LLM that powers code patch generation and barrier analysis.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                AI Assistant Model
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {models.map((model) => (
                  <div
                    key={model}
                    onClick={() => setAiModel(model)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      aiModel === model
                        ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-100'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-800">
                        {model}
                      </span>
                      {aiModel === model && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      {model.includes('Claude')
                        ? 'Optimal for code remediation'
                        : model.includes('GPT')
                        ? 'Broad reasoning'
                        : 'Fast multimodal DOM parsing'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Save Action Row */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-xs sm:text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer"
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
