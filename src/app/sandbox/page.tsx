'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useAudit } from '@/context/AuditContext';
import { EnterpriseTestbedPanel } from '@/components/dashboard/EnterpriseTestbedPanel';
import {
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  X,
  ExternalLink,
  ShieldCheck,
  Eye,
  ArrowRight,
  Info,
  Lock,
  Unlock,
  KeyRound,
  Image as ImageIcon,
} from 'lucide-react';

export default function SandboxPage() {
  const router = useRouter();
  const {
    sandboxToggles,
    toggleSandboxFix,
    startAudit,
    setUrl,
    showToast,
  } = useAudit();

  const [promoModalOpen, setPromoModalOpen] = useState(true);
  const [modalTrapCycleCount, setModalTrapCycleCount] = useState(0);
  const modalFirstBtnRef = useRef<HTMLButtonElement | null>(null);
  const modalLastBtnRef = useRef<HTMLButtonElement | null>(null);

  const isModalTrapFixed = !!(sandboxToggles.modalTrapFixed || sandboxToggles.focusFixed);
  const isKeyboardAccessibilityFixed = !!(sandboxToggles.keyboardAccessibilityFixed || sandboxToggles.ariaFixed);
  const isPhotoContrastFixed = !!(sandboxToggles.photoContrastFixed || sandboxToggles.contrastFixed);

  // Keyboard Trap simulation
  useEffect(() => {
    if (!promoModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalTrapFixed && e.key === 'Escape') {
        e.preventDefault();
        showToast('Escape key blocked: Modal traps keyboard focus. Toggle [Fix Modal Focus Trap] to allow Escape.');
        setModalTrapCycleCount((prev) => prev + 1);
        return;
      }

      if (isModalTrapFixed && e.key === 'Escape') {
        setPromoModalOpen(false);
        showToast('Modal dismissed via Escape key (WCAG 2.1.2 Compliant).');
        return;
      }

      if (!isModalTrapFixed && e.key === 'Tab') {
        setModalTrapCycleCount((prev) => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [promoModalOpen, isModalTrapFixed, showToast]);

  const handleRunAgentOnSandbox = async () => {
    setUrl('/sandbox');
    router.push('/new-audit');
    await startAudit('/sandbox', 'WCAG 2.2 Level AA');
  };

  const handleCustomActionClick = () => {
    showToast('Action triggered: "View Policy Telemetry" activated!');
  };

  const handleCustomActionKeyDown = (e: React.KeyboardEvent) => {
    if (isKeyboardAccessibilityFixed && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleCustomActionClick();
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Pre-configured Testbed Control Bar */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <Sliders className="w-4 h-4" />
                <span className="text-xs font-bold tracking-wider uppercase">
                  Interactive Demo Environment — Testbed Controls
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Pre-configured Compliance Testbed
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                This testbed environment demonstrates three deliberate accessibility challenges: modal keyboard entrapment, custom control accessibility, and image background contrast. Toggle any fix in real time to observe DOM remediation.
              </p>
            </div>

            {/* Quick Launch Agent Button */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={handleRunAgentOnSandbox}
                className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-2xl shadow-lg shadow-blue-600/30 flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white stroke-none" />
                <span>Audit This Demo Testbed</span>
              </button>
            </div>
          </div>

          {/* 3 Interactive Testbed Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
            {/* Control 1: Fix Modal Focus Trap */}
            <div
              onClick={() => toggleSandboxFix('modalTrapFixed')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isModalTrapFixed
                  ? 'bg-blue-950/60 border-blue-500/80 shadow-md ring-2 ring-blue-500/30'
                  : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  WCAG 2.1.2 (Level A)
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isModalTrapFixed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {isModalTrapFixed ? 'Trap Fixed (Esc Enabled)' : 'Focus Trapped'}
                </span>
              </div>
              <p className="text-sm font-bold text-white mb-1">
                [Fix Modal Focus Trap]
              </p>
              <p className="text-xs text-slate-400">
                {isModalTrapFixed
                  ? 'Registers Escape key listener and restores sequential focus'
                  : 'Tab cycles infinitely inside dialog; Escape listener unregistered'}
              </p>
            </div>

            {/* Control 2: Add Keyboard Accessibility */}
            <div
              onClick={() => toggleSandboxFix('keyboardAccessibilityFixed')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isKeyboardAccessibilityFixed
                  ? 'bg-blue-950/60 border-blue-500/80 shadow-md ring-2 ring-blue-500/30'
                  : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                  WCAG 2.1.1 (Level A)
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isKeyboardAccessibilityFixed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {isKeyboardAccessibilityFixed ? 'Keyboard Operable' : 'Unreachable via Tab'}
                </span>
              </div>
              <p className="text-sm font-bold text-white mb-1">
                [Add Keyboard Accessibility]
              </p>
              <p className="text-xs text-slate-400">
                {isKeyboardAccessibilityFixed
                  ? 'Applies tabindex="0" and Enter/Space keyboard event listeners'
                  : 'Custom div element lacks tabindex="0" and keyboard activation'}
              </p>
            </div>

            {/* Control 3: Fix Photo Overlay Contrast */}
            <div
              onClick={() => toggleSandboxFix('photoContrastFixed')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isPhotoContrastFixed
                  ? 'bg-blue-950/60 border-blue-500/80 shadow-md ring-2 ring-blue-500/30'
                  : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                  WCAG 1.4.3 (Level AA)
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isPhotoContrastFixed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {isPhotoContrastFixed ? '10.4:1 (Passes AA & AAA)' : '2.3:1 (Fails AA)'}
                </span>
              </div>
              <p className="text-sm font-bold text-white mb-1">
                [Fix Photo Overlay Contrast]
              </p>
              <p className="text-xs text-slate-400">
                {isPhotoContrastFixed
                  ? 'Applies semi-transparent dark scrim rgba(0,0,0,0.7) + white text'
                  : 'Grey text overlaid directly on multi-toned photographic imagery'}
              </p>
            </div>
          </div>
        </div>

        {/* Enterprise Testbed Scenarios Panel */}
        <EnterpriseTestbedPanel />

        {/* Pre-configured Testbed SaaS Mockup Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
          {/* Simulated Browser Address Bar */}
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-slate-400 font-medium ml-2">Pre-configured Testbed</span>
            </div>
            <div className="bg-white border border-slate-200 px-4 py-1 rounded-lg text-slate-600 font-mono text-xs flex items-center gap-2 max-w-sm w-full justify-between">
              <span>http://localhost:3000/sandbox</span>
              <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded">
                Live DOM
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Viewport: 1440 × 900</div>
          </div>

          {/* Embedded Web Page Body */}
          <div className="p-6 sm:p-10 space-y-10 relative">
            {/* Header Nav */}
            <header className="flex items-center justify-between pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-base shadow-sm">
                  V
                </div>
                <span className="text-lg font-black tracking-tight text-slate-900">
                  Velora Enterprise Cloud
                </span>
              </div>

              <nav className="sandbox-nav hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                <a href="#overview" className="hover:text-slate-900">
                  Overview
                </a>
                <a href="#infrastructure" className="hover:text-slate-900">
                  Infrastructure
                </a>
                <a href="#compliance" className="hover:text-slate-900">
                  Compliance
                </a>
                <a href="#telemetry" className="hover:text-slate-900">
                  Telemetry
                </a>
              </nav>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Console Access
                </button>
              </div>
            </header>

            {/* Modal Dialog (Focus Trap Scenario) */}
            {promoModalOpen && (
              <div
                id="interactive-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                tabIndex={-1}
                className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-2xl border-2 border-blue-500/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Keyboard Trap Scenario
                    </span>
                    <span className="text-xs font-mono text-blue-300">
                      WCAG 2.1.2 (No Keyboard Trap)
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isModalTrapFixed
                          ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/50'
                          : 'bg-rose-500/30 text-rose-300 border border-rose-400/50 animate-pulse'
                      }`}
                    >
                      {isModalTrapFixed
                        ? 'PASS: Escape Enabled & Focus Unlocked'
                        : 'FAIL: Focus Trapped (Escape Disabled)'}
                    </span>
                  </div>

                  <h3 id="modal-title" className="text-base font-bold text-white">
                    Access Role Elevation Dialog (Focus Trapped Container)
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isModalTrapFixed
                      ? 'Remediated: Escape key handler registered. Tab cycles through controls without trapping navigation.'
                      : 'Barrier: Tab key loops endlessly through internal dialog controls. Escape key is unhandled, preventing users from closing the dialog.'}
                  </p>
                  {modalTrapCycleCount > 0 && !isModalTrapFixed && (
                    <p className="text-[11px] font-mono text-amber-300">
                      Keyboard Trace: {modalTrapCycleCount} trapped navigation events intercepted within modal dialog.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    ref={modalFirstBtnRef}
                    type="button"
                    onClick={() => showToast('Role elevation confirmed.')}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    Confirm Access
                  </button>

                  <button
                    ref={modalLastBtnRef}
                    type="button"
                    onClick={() => setPromoModalOpen(false)}
                    aria-label="Dismiss access dialog"
                    className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Photographic Background Hero Section */}
            <div
              id="photo-hero-card"
              style={{
                backgroundImage: `url('/sample-hero-bg.svg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              className="rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-md relative overflow-hidden flex flex-col items-center justify-center text-center space-y-5 min-h-[360px]"
            >
              <div className="flex items-center gap-2">
                <span className="bg-slate-900 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Contrast Scenario
                </span>
                <span className="text-xs font-mono bg-white/90 text-slate-800 px-2 py-0.5 rounded-md shadow-xs">
                  WCAG 1.4.3 Contrast Minimum
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                    isPhotoContrastFixed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white animate-pulse'
                  }`}
                >
                  {isPhotoContrastFixed
                    ? '10.4:1 Contrast (PASS AA & AAA)'
                    : '2.3:1 Contrast (FAIL AA < 4.5:1)'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight max-w-2xl">
                Autonomous Cloud Infrastructure with Continuous Compliance
              </h2>

              <div className="max-w-xl mx-auto">
                <p
                  className={`photo-overlay-text text-sm sm:text-base font-semibold transition-all ${
                    isPhotoContrastFixed
                      ? 'text-white bg-black/70 backdrop-blur-xs px-4 py-2 rounded-xl shadow-lg border border-white/20'
                      : 'text-[#94a3b8] bg-transparent p-1'
                  }`}
                >
                  Continuous accessibility auditing across multi-cloud Kubernetes clusters with automated patch remediation.
                </p>
                <p className="text-[10px] text-slate-500 mt-2 font-mono">
                  {isPhotoContrastFixed
                    ? 'Remediation Applied: rgba(0,0,0,0.7) scrim with white text (#ffffff) => 10.4:1'
                    : 'Failing: Grey text (#94a3b8) on multi-toned photo background => 2.3:1 measured'}
                </p>
              </div>

              {/* Custom Action Control */}
              <div className="pt-4 flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Keyboard Navigation Scenario
                  </span>
                  <span className="text-[11px] font-mono text-slate-700 bg-white/80 px-2 py-0.5 rounded">
                    WCAG 2.1.1 Keyboard Operable
                  </span>
                </div>

                <div
                  role="button"
                  tabIndex={isKeyboardAccessibilityFixed ? 0 : undefined}
                  onClick={handleCustomActionClick}
                  onKeyDown={handleCustomActionKeyDown}
                  className={`btn-custom-action font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md transition-all cursor-pointer ${
                    isKeyboardAccessibilityFixed
                      ? 'bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-4 focus:ring-blue-400'
                      : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  View Policy Telemetry
                </div>

                <div className="mt-1">
                  {isKeyboardAccessibilityFixed ? (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                      WCAG 2.1.1 PASS (tabindex="0" + Enter/Space Active)
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full shadow-xs">
                      Static Linter: PASS | Keyboard Agent: FAIL (Disagreement Resolved)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
