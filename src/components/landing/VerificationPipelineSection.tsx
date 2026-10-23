'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Layers,
  Lock,
  Zap,
  Repeat,
  CheckCircle2,
  Sparkles,
  Eye,
  Sliders,
  ExternalLink,
  GitBranch,
  Terminal,
  Activity,
  Check,
  X,
  Radio,
} from 'lucide-react';

export function VerificationPipelineSection() {
  // Stage 1 Interactive State: URL Security Check
  const [testUrl, setTestUrl] = useState('https://app.enterprise-core.io');
  const [dnsStatus, setDnsStatus] = useState<'safe' | 'checking'>('safe');

  // Stage 2 Interactive State: Photometric Luminance Calculation
  const [textLuminance, setTextLuminance] = useState<number>(0.84); // White text
  const [bgLuminance, setBgLuminance] = useState<number>(0.12); // Deep blue photo
  const contrastRatio = ((textLuminance + 0.05) / (bgLuminance + 0.05)).toFixed(2);
  const isContrastPass = parseFloat(contrastRatio) >= 4.5;

  // Stage 3 Interactive State: Gemini 3-Key Failover Mesh
  const [activeKeyNode, setActiveKeyNode] = useState<'alpha' | 'beta' | 'gamma'>('alpha');
  const [isSimulating429, setIsSimulating429] = useState<boolean>(false);

  // Stage 4 Interactive State: Cryptographic Ledger Approval
  const [isApproved, setIsApproved] = useState<boolean>(true);
  const [retestStatus, setRetestStatus] = useState<'verified' | 'retesting'>('verified');

  const triggerFailoverSimulation = () => {
    setIsSimulating429(true);
    setActiveKeyNode('beta');
    setTimeout(() => {
      setIsSimulating429(false);
    }, 1600);
  };

  const handleRetest = () => {
    setRetestStatus('retesting');
    setTimeout(() => {
      setRetestStatus('verified');
    }, 1200);
  };

  return (
    <section id="verification-pipeline" className="relative py-28 bg-[#070b14] text-slate-100 overflow-hidden border-t border-slate-800/80">
      {/* Background Cyber Ambient Lights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-600/10 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-500/30 text-blue-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            END-TO-END ASSURANCE
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            The Closed-Loop Verification Pipeline
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
            Four deterministic stages that bridge security isolation, dynamic browser event loops, resilient multi-key Gemini neural synthesis, and immutable cryptographic sign-off.
          </p>
        </motion.div>

        {/* Bento Grid (4 Interactive Stages) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* ───────────────────────────────────────────────────────────
              STAGE 01: Zero-Trust Live DOM Ingestion
              ─────────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-7 shadow-xl hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Stage Badge & Icon */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 block tracking-wider">
                      STAGE 01 // SECURITY SANDBOX
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      Zero-Trust Live DOM Ingestion
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  SSRF SHIELD
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-4 leading-relaxed font-normal">
                Verifies target URLs before extraction with hardened Cheerio DOM parsing. Real-time DNS lookups reject RFC 1918 private subnets, cloud metadata endpoints, and internal spoof loops.
              </p>

              {/* Live Interactive DNS / SSRF Verification Widget */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>TARGET DOMAIN PROBE:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    GUARD ARMED
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-xs">URL:</span>
                  <input
                    type="text"
                    value={testUrl}
                    onChange={(e) => setTestUrl(e.target.value)}
                    className="bg-transparent text-cyan-300 text-xs font-mono w-full focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block">DNS.LOOKUP:</span>
                    <span className="text-slate-200 font-bold">104.21.48.192 [PUBLIC]</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block">RFC 1918 CHECK:</span>
                    <span className="text-emerald-400 font-bold">BLOCKED 10.0.0.0/8</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>EXTRACTION ENGINE:</span>
              <span className="text-cyan-400 font-bold">Cheerio Fast-Stream (0ms Overhead)</span>
            </div>
          </motion.div>

          {/* ───────────────────────────────────────────────────────────
              STAGE 02: Autonomous Traversal & Sub-Pixel Luminance
              ─────────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-7 shadow-xl hover:border-blue-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Stage Badge & Icon */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-400 block tracking-wider">
                      STAGE 02 // SUB-PIXEL PHOTOMETRY
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      Autonomous Traversal & Luminance
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-500/30">
                  WCAG (L1+0.05)/(L2+0.05)
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-4 leading-relaxed font-normal">
                Simulates 12-iteration Tab sequences while calculating photometric luminance over raw image pixels behind transparent overlays and gradient backdrops.
              </p>

              {/* Interactive Mathematical Luminance Visualizer */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">PHOTOMETRIC FORMULA:</span>
                  <span className="text-cyan-300 font-bold">Contrast = (L₁ + 0.05) / (L₂ + 0.05)</span>
                </div>

                {/* Sub-Pixel Visual Swatch */}
                <div
                  className="h-12 rounded-xl flex items-center justify-between px-4 transition-colors relative overflow-hidden"
                  style={{
                    backgroundColor: `rgb(${Math.round(bgLuminance * 255)}, ${Math.round(
                      bgLuminance * 180 + 30
                    )}, ${Math.round(bgLuminance * 255 + 80)})`,
                  }}
                >
                  <span
                    className="font-bold text-sm tracking-wide transition-colors"
                    style={{
                      color: textLuminance > 0.5 ? '#ffffff' : '#030712',
                    }}
                  >
                    Headline Over Dynamic Photo
                  </span>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isContrastPass
                        ? 'bg-emerald-500/90 text-slate-950'
                        : 'bg-rose-500/90 text-white'
                    }`}
                  >
                    {contrastRatio}:1 {isContrastPass ? 'PASS AA' : 'FAIL AA'}
                  </span>
                </div>

                {/* Slider Control */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Background Image Luminance (L₂): {bgLuminance}</span>
                    <span>Text Luminance (L₁): {textLuminance}</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.45"
                    step="0.01"
                    value={bgLuminance}
                    onChange={(e) => setBgLuminance(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>TAB SIMULATION:</span>
              <span className="text-emerald-400 font-bold">12 Cycles Evaluated</span>
            </div>
          </motion.div>

          {/* ───────────────────────────────────────────────────────────
              STAGE 03: Multi-Model Gemini Failover Mesh
              ─────────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-7 shadow-xl hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Stage Badge & Icon */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-indigo-400 block tracking-wider">
                      STAGE 03 // NEURAL RESILIENCE
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      Multi-Model Gemini Failover Mesh
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={triggerFailoverSimulation}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-900 transition-colors cursor-pointer"
                  title="Simulate rate limit failover"
                >
                  {isSimulating429 ? '429 TRIGGERED...' : 'TEST 429 ROTATION'}
                </button>
              </div>

              <p className="text-xs text-slate-400 mt-4 leading-relaxed font-normal">
                3-Node resilient key network. If primary quota exhausts (HTTP 429), the orchestrator rotates transparently to standby keys in under 15ms with zero dropped audits.
              </p>

              {/* 3-Node Interactive Diagram & Power Conduits */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>RESILIENT MESH TOPOLOGY:</span>
                  <span className="text-cyan-400 font-bold">100% GOOGLE GEMINI POOL</span>
                </div>

                {/* 3 Nodes */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Node Alpha */}
                  <div
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      activeKeyNode === 'alpha'
                        ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span className="text-[9px] block">NODE 01</span>
                    <span className="text-xs font-bold block">Key Alpha</span>
                    <span className="text-[9px] text-emerald-400 font-semibold">
                      {activeKeyNode === 'alpha' ? '● ACTIVE' : 'STANDBY'}
                    </span>
                  </div>

                  {/* Node Beta */}
                  <div
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      activeKeyNode === 'beta'
                        ? 'bg-indigo-950/70 border-indigo-400 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span className="text-[9px] block">NODE 02</span>
                    <span className="text-xs font-bold block">Key Beta</span>
                    <span className="text-[9px] text-cyan-400 font-semibold">
                      {activeKeyNode === 'beta' ? '● ENGAGED' : 'READY'}
                    </span>
                  </div>

                  {/* Node Gamma */}
                  <div
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      activeKeyNode === 'gamma'
                        ? 'bg-amber-950/70 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span className="text-[9px] block">NODE 03</span>
                    <span className="text-xs font-bold block">Key Gamma</span>
                    <span className="text-[9px] text-slate-400 font-semibold">SHIELD</span>
                  </div>
                </div>

                {/* AST Remediation Diff Preview */}
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] space-y-1">
                  <div className="text-slate-500 flex items-center justify-between">
                    <span>AST REMEDIATION SYNTHESIS:</span>
                    <span className="text-cyan-400">Gemini 1.5 Flash</span>
                  </div>
                  <div className="text-rose-400 bg-rose-950/30 px-2 py-0.5 rounded">
                    - &lt;div onClick=&#123;handleClick&#125;&gt;Dismiss&lt;/div&gt;
                  </div>
                  <div className="text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded">
                    + &lt;button type=&quot;button&quot; aria-label=&quot;Dismiss notification&quot;&gt;Dismiss&lt;/button&gt;
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>FAILOVER LATENCY:</span>
              <span className="text-indigo-400 font-bold">&lt;15ms Zero Loss</span>
            </div>
          </motion.div>

          {/* ───────────────────────────────────────────────────────────
              STAGE 04: Deterministic Cryptographic Ledger
              ─────────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-7 shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Stage Badge & Icon */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 block tracking-wider">
                      STAGE 04 // CRYPTOGRAPHIC AUDIT TRAIL
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      Deterministic Cryptographic Ledger
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  SHA-256 LOCKED
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-4 leading-relaxed font-normal">
                Generates immutable SHA-256 issue fingerprints. Engineers approve remediations via human-in-the-loop switches with instant server-side regression re-testing.
              </p>

              {/* Cryptographic Hash & Approval Toggle */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>ISSUE FINGERPRINT:</span>
                  <span className="text-emerald-400 font-bold">IMMUTABLE</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 break-all select-all">
                  sha256:7f83b165c92b8d4e9124a91f34e207b99c8f0012
                </div>

                {/* Human-in-the-loop Approval & Re-Test Actions */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px]">Human Approval:</span>
                    <button
                      type="button"
                      onClick={() => setIsApproved((prev) => !prev)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                        isApproved
                          ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {isApproved ? '✓ APPROVED' : 'PENDING'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleRetest}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <Repeat className={`w-3 h-3 ${retestStatus === 'retesting' ? 'animate-spin text-cyan-400' : ''}`} />
                    <span>{retestStatus === 'retesting' ? 'RE-TESTING...' : 'RE-TEST'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>REGRESSION STATUS:</span>
              <span className="text-emerald-400 font-bold">Zero Regressions Detected</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
