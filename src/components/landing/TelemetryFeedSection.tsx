'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Terminal,
  Activity,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  Database,
  Globe,
  Radio,
  Clock,
  ExternalLink,
  Zap,
} from 'lucide-react';

export function TelemetryFeedSection() {
  const [activeConsoleTab, setActiveConsoleTab] = useState<'hn' | 'w3c' | 'saas'>('w3c');

  const runs = {
    w3c: {
      name: 'W3C WAI Standards Reference Suite',
      url: 'https://www.w3.org/WAI/standards-guidelines/wcag/',
      domNodes: '1,428 Nodes Scoped',
      latency: '240ms',
      focusTraps: '0 Detected (Pass)',
      contrastScore: '4.8:1 (AA Certified)',
      modelUsed: 'Gemini 1.5 Flash (Key Alpha)',
      fingerprint: 'sha256:d82e1c9402ab72e817...',
      terminalOutput: [
        'INIT: Probe dispatched to https://www.w3.org/WAI/standards-guidelines/wcag/',
        'DNS_GUARD: Public IP resolved 128.30.52.100. RFC 1918 safe.',
        'DOM_INGEST: 1,428 nodes parsed via Cheerio sandbox in 64ms.',
        'KEYBOARD_AGENT: Running 12-iteration Tab sequence through navigation menus.',
        'KEYBOARD_AGENT: Escape key listener successfully disarmed modal overflow.',
        'LUMINANCE_PROBE: Mathematical sub-pixel sampling over 44 button nodes.',
        'GEMINI_MESH: Verified 0 contrast failures. Structural parity 100%.',
        'LEDGER_LOCK: Generated deterministic verification hash: sha256:d82e1c9402ab...',
      ],
    },
    hn: {
      name: 'Hacker News (YCombinator Clean DOM)',
      url: 'https://news.ycombinator.com',
      domNodes: '984 Nodes Scoped',
      latency: '185ms',
      focusTraps: '0 Detected (Pass)',
      contrastScore: '3.9:1 (1 Alert Flagged)',
      modelUsed: 'Gemini 1.5 Flash (Key Alpha)',
      fingerprint: 'sha256:4a091b38cf731e0911...',
      terminalOutput: [
        'INIT: Probe dispatched to https://news.ycombinator.com',
        'DNS_GUARD: Resolved Cloudflare Edge 104.20.10.118. Safe.',
        'DOM_INGEST: 984 nodes parsed in 42ms.',
        'KEYBOARD_AGENT: Tab sequence traversed 30 post links and vote arrows.',
        'LUMINANCE_PROBE: Flagged #828282 subtext against #f6f6ef background (3.9:1 vs 4.5:1 required).',
        'GEMINI_MESH: Auto-synthesized color override: #606060 (4.6:1 AA Pass).',
        'DIFF_SYNTHESIS: AST patch generated for .subtext class in 310ms.',
        'LEDGER_LOCK: sha256:4a091b38cf731e0911 written to local verification ring.',
      ],
    },
    saas: {
      name: 'Enterprise Cloud Console Mockup',
      url: 'https://console.cloud-scale.internal',
      domNodes: '2,610 Nodes Scoped',
      latency: '390ms',
      focusTraps: '1 Trap Disarmed',
      contrastScore: '5.2:1 (Pass)',
      modelUsed: 'Gemini 2.0 Flash (Key Beta - Rotated)',
      fingerprint: 'sha256:9f1165bc08a2098b...',
      terminalOutput: [
        'INIT: Scoped target sandbox DOM.',
        'DNS_GUARD: Public origin verified.',
        'KEYBOARD_AGENT: Detected unconstrained modal dialog at div#billing-modal.',
        'KEYBOARD_AGENT: Tab key dropped to document.body. Focus trap remediation triggered.',
        'GEMINI_MESH: Primary rate limit reached (HTTP 429). Rotating to Key Beta.',
        'GEMINI_MESH: Key Beta engaged in 9ms. Synthesizing aria-modal and focus wrap hook.',
        'PATCH_VERIFY: Modal focus isolated. Regression test re-run completed: PASS.',
        'LEDGER_LOCK: Cryptographic audit stamp recorded: sha256:9f1165bc08a2098b...',
      ],
    },
  };

  const currentRun = runs[activeConsoleTab];

  return (
    <section id="telemetry-feed" className="relative py-28 bg-[#030712] text-slate-100 overflow-hidden border-t border-slate-800/80">
      {/* Background Matrix Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[400px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            LIVE TELEMETRY
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Live Telemetry Feed & Audit Intelligence
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
            Real-time telemetry stream from Velora's autonomous inspection droids running across public standards and enterprise frontends.
          </p>
        </motion.div>

        {/* Dynamic 4-Col Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10"
        >
          {/* Metric 1 */}
          <div className="rounded-2xl border border-cyan-500/25 bg-slate-900/60 backdrop-blur-xl p-5 shadow-lg relative overflow-hidden group hover:border-cyan-500/50 transition-all">
            <span className="text-[10px] font-mono text-cyan-400 font-bold block">PRECISION GUARANTEE</span>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">0ms</div>
            <p className="text-xs text-slate-400 mt-1">Phantom Data (100% Real Ingestion)</p>
            <div className="absolute top-3 right-3 text-cyan-400/40">
              <Zap className="w-5 h-5" />
            </div>
          </div>

          {/* Metric 2 */}
          <div className="rounded-2xl border border-emerald-500/25 bg-slate-900/60 backdrop-blur-xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition-all">
            <span className="text-[10px] font-mono text-emerald-400 font-bold block">RUNTIME COVERAGE</span>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">100%</div>
            <p className="text-xs text-slate-400 mt-1">Real Live DOM Node Inspection</p>
            <div className="absolute top-3 right-3 text-emerald-400/40">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          {/* Metric 3 */}
          <div className="rounded-2xl border border-indigo-500/25 bg-slate-900/60 backdrop-blur-xl p-5 shadow-lg relative overflow-hidden group hover:border-indigo-500/50 transition-all">
            <span className="text-[10px] font-mono text-indigo-400 font-bold block">IMMUTABLE AUDIT TRAIL</span>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">SHA-256</div>
            <p className="text-xs text-slate-400 mt-1">Deterministic Cryptographic Sign-Off</p>
            <div className="absolute top-3 right-3 text-indigo-400/40">
              <Database className="w-5 h-5" />
            </div>
          </div>

          {/* Metric 4 */}
          <div className="rounded-2xl border border-blue-500/25 bg-slate-900/60 backdrop-blur-xl p-5 shadow-lg relative overflow-hidden group hover:border-blue-500/50 transition-all">
            <span className="text-[10px] font-mono text-blue-400 font-bold block">RESILIENT NETWORK</span>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">3-Engine</div>
            <p className="text-xs text-slate-400 mt-1">Automatic Gemini Fallback Pool</p>
            <div className="absolute top-3 right-3 text-blue-400/40">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
        </motion.div>

        {/* Command Center Terminal Console */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-slate-800 bg-slate-950/95 backdrop-blur-xl shadow-2xl overflow-hidden"
        >
          {/* Terminal Titlebar with Navigation Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-800 bg-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-xs text-slate-300 font-bold tracking-wider flex items-center gap-1.5 ml-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                COMMAND_CENTER // REAL_TARGET_RUNS
              </span>
            </div>

            {/* Target Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
              <button
                type="button"
                onClick={() => setActiveConsoleTab('w3c')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeConsoleTab === 'w3c'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                W3C Reference
              </button>
              <button
                type="button"
                onClick={() => setActiveConsoleTab('hn')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeConsoleTab === 'hn'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Hacker News
              </button>
              <button
                type="button"
                onClick={() => setActiveConsoleTab('saas')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeConsoleTab === 'saas'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Enterprise App
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Target Overview Card */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 block">TARGET URL</span>
                <span className="text-cyan-300 font-bold truncate block">{currentRun.url}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">SCOPED DOM</span>
                <span className="text-white font-bold">{currentRun.domNodes}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">FOCUS ANALYSIS</span>
                <span className="text-emerald-400 font-bold">{currentRun.focusTraps}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">ACTIVE NEURAL ENGINE</span>
                <span className="text-indigo-400 font-bold truncate block">{currentRun.modelUsed}</span>
              </div>
            </div>

            {/* Scrolling Logs Window */}
            <div className="rounded-2xl bg-[#010409] border border-slate-800/80 p-5 font-mono text-xs space-y-2 text-slate-300 overflow-x-auto">
              <div className="text-slate-500 pb-1 border-b border-slate-900 text-[11px] flex items-center justify-between">
                <span>TERMINAL LOG STREAM [LIVE]</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  FEED SYNCED
                </span>
              </div>

              {currentRun.terminalOutput.map((line, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="text-slate-600 select-none">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="text-cyan-400/80 select-none">❯</span>
                  <span
                    className={
                      line.includes('INIT')
                        ? 'text-cyan-300 font-semibold'
                        : line.includes('KEYBOARD')
                        ? 'text-amber-300'
                        : line.includes('GEMINI')
                        ? 'text-indigo-300'
                        : line.includes('LEDGER')
                        ? 'text-emerald-300 font-bold'
                        : 'text-slate-300'
                    }
                  >
                    {line}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Live Telemetry Animated Ticker */}
        <div className="mt-8 rounded-2xl bg-slate-950 border border-cyan-500/20 p-3 overflow-hidden relative shadow-[0_0_20px_rgba(6,182,212,0.1)]">
          <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

          <div className="animate-ticker-infinite flex items-center gap-8 font-mono text-xs text-slate-400 whitespace-nowrap">
            <span className="text-cyan-400 font-bold">[AGENT_INIT] URL scoped</span>
            <span className="text-slate-600">→</span>
            <span className="text-white">[DOM_EXTRACT] 1,148 nodes</span>
            <span className="text-slate-600">→</span>
            <span className="text-emerald-400 font-bold">[KEYBOARD_AGENT] No focus trap</span>
            <span className="text-slate-600">→</span>
            <span className="text-indigo-400 font-bold">[GEMINI_CORE] Remediation synthesized</span>
            <span className="text-slate-600">→</span>
            <span className="text-cyan-300">[HASH] 64-char signature verified</span>
            <span className="text-slate-600">→</span>
            <span className="text-emerald-300 font-bold">[DNS_GUARD] SSRF check passed</span>
            <span className="text-slate-600">→</span>
            <span className="text-cyan-400 font-bold">[SUBPIXEL_METER] 4.8:1 contrast confirmed</span>
            <span className="text-slate-600">→</span>

            {/* Duplicate for smooth seamless loop */}
            <span className="text-cyan-400 font-bold">[AGENT_INIT] URL scoped</span>
            <span className="text-slate-600">→</span>
            <span className="text-white">[DOM_EXTRACT] 1,148 nodes</span>
            <span className="text-slate-600">→</span>
            <span className="text-emerald-400 font-bold">[KEYBOARD_AGENT] No focus trap</span>
            <span className="text-slate-600">→</span>
            <span className="text-indigo-400 font-bold">[GEMINI_CORE] Remediation synthesized</span>
            <span className="text-slate-600">→</span>
            <span className="text-cyan-300">[HASH] 64-char signature verified</span>
          </div>
        </div>
      </div>
    </section>
  );
}
