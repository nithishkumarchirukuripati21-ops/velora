'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useAudit } from '@/context/AuditContext';
import { EnterpriseTestbedPanel } from '@/components/dashboard/EnterpriseTestbedPanel';
import {
  Play,
  Sliders,
  X,
  Lock,
  KeyRound,
  Image as ImageIcon,
  FlaskConical,
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 mb-1 font-mono text-xs">
                <FlaskConical className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span className="font-bold tracking-wider uppercase">
                  Interactive Demo Environment — Testbed Controls
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Pre-configured Compliance Laboratory
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                This testbed environment demonstrates three deliberate accessibility challenges: modal keyboard entrapment, custom control accessibility, and image background contrast. Toggle any fix in real time to observe live DOM remediation.
              </p>
            </div>

            {/* Quick Launch Agent Button */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={handleRunAgentOnSandbox}
                className="bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-[0_4px_14px_rgba(6,182,212,0.3)] flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white stroke-none" />
                <span>Audit This Demo Testbed</span>
              </button>
            </div>
          </div>

          {/* 3 Interactive Testbed Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 font-mono">
            {/* Control 1: Fix Modal Focus Trap */}
            <div
              onClick={() => toggleSandboxFix('modalTrapFixed')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isModalTrapFixed
                  ? 'bg-cyan-50/70 dark:bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/20 shadow-xs'
                  : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/90 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  WCAG 2.1.2 (Level A)
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isModalTrapFixed
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  {isModalTrapFixed ? 'Trap Fixed (Esc Active)' : 'Focus Trapped'}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1 font-sans">
                [Fix Modal Focus Trap]
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                {isModalTrapFixed
                  ? 'Registers Escape key listener and restores sequential focus.'
                  : 'Tab cycles infinitely inside dialog; Escape listener unregistered.'}
              </p>
            </div>

            {/* Control 2: Add Keyboard Accessibility */}
            <div
              onClick={() => toggleSandboxFix('keyboardAccessibilityFixed')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isKeyboardAccessibilityFixed
                  ? 'bg-cyan-50/70 dark:bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/20 shadow-xs'
                  : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/90 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  WCAG 2.1.1 (Level A)
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isKeyboardAccessibilityFixed
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {isKeyboardAccessibilityFixed ? 'Keyboard Operable' : 'Unreachable via Tab'}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1 font-sans">
                [Add Keyboard Accessibility]
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                {isKeyboardAccessibilityFixed
                  ? 'Applies tabindex="0" and Enter/Space keyboard event listeners.'
                  : 'Custom div element lacks tabindex="0" and keyboard activation.'}
              </p>
            </div>

            {/* Control 3: Fix Photo Overlay Contrast */}
            <div
              onClick={() => toggleSandboxFix('photoContrastFixed')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isPhotoContrastFixed
                  ? 'bg-cyan-50/70 dark:bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/20 shadow-xs'
                  : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/90 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  WCAG 1.4.3 (Level AA)
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isPhotoContrastFixed
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  {isPhotoContrastFixed ? '10.4:1 (Passes AA & AAA)' : '2.3:1 (Fails AA)'}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1 font-sans">
                [Fix Photo Overlay Contrast]
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                {isPhotoContrastFixed
                  ? 'Applies semi-transparent dark scrim rgba(0,0,0,0.7) + white text.'
                  : 'Grey text overlaid directly on multi-toned photographic imagery.'}
              </p>
            </div>
          </div>
        </div>

        {/* Enterprise Testbed Scenarios Panel */}
        <EnterpriseTestbedPanel />

        {/* Pre-configured Testbed SaaS Mockup Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden relative">
          {/* Simulated Browser Address Bar */}
          <div className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-slate-400 font-medium ml-2 font-sans">Pre-configured Testbed</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 text-xs flex items-center gap-2 max-w-sm w-full justify-between">
              <span>http://localhost:3000/sandbox</span>
              <span className="text-[10px] text-cyan-700 dark:text-cyan-400 font-bold bg-cyan-50 dark:bg-cyan-950/60 px-1.5 py-0.5 rounded">
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
                <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                  V
                </div>
                <span className="text-base font-black tracking-tight text-slate-900">
                  Velora Enterprise Cloud
                </span>
              </div>

              <nav className="sandbox-nav hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
                <a href="#overview" className="hover:text-slate-900">Overview</a>
                <a href="#infrastructure" className="hover:text-slate-900">Infrastructure</a>
                <a href="#compliance" className="hover:text-slate-900">Compliance</a>
                <a href="#telemetry" className="hover:text-slate-900">Telemetry</a>
              </nav>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer shadow-xs"
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
                className="relative bg-slate-900 text-white rounded-2xl p-5 shadow-2xl border-2 border-cyan-500/50 flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Keyboard Trap Scenario
                    </span>
                    <span className="text-xs text-cyan-300">
                      WCAG 2.1.2
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
                    className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
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
              className="rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm relative overflow-hidden flex flex-col items-center justify-center text-center space-y-5 min-h-[360px]"
            >
              <div className="flex items-center gap-2 font-mono">
                <span className="bg-slate-900 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Contrast Scenario
                </span>
                <span className="text-xs bg-white/90 text-slate-800 px-2 py-0.5 rounded-md shadow-xs font-bold">
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
                <div className="flex items-center gap-2 mb-1 font-mono">
                  <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Keyboard Navigation Scenario
                  </span>
                  <span className="text-[11px] text-slate-700 bg-white/80 px-2 py-0.5 rounded font-bold">
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
                      ? 'bg-cyan-600 hover:bg-cyan-700 text-white focus:outline-none focus:ring-4 focus:ring-cyan-400'
                      : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  View Policy Telemetry
                </div>

                <div className="mt-1 font-mono">
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
