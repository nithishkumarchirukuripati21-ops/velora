'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useAudit } from '@/context/AuditContext';
import { IssueStatus, IssueSeverity } from '@/types/audit';
import { isDemoTarget } from '@/lib/wcagEngine';
import {
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Search,
  Filter,
  Check,
  X,
  RotateCw,
  Eye,
  Sparkles,
  Sliders,
  PartyPopper,
  Diff,
  Copy,
  Globe,
  CheckCheck,
  Hash,
  ShieldAlert,
  ArrowDownRight,
  CheckCheck as AllCheck,
  Plus,
  Trash2,
} from 'lucide-react';

export default function IssuesPage() {
  const router = useRouter();
  const {
    audits,
    issues,
    setUrl,
    resetAllAuditData,
    approveIssue,
    approveAllPendingIssues,
    dismissIssue,
    retestIssue,
    retestAllOpenIssues,
    isRetesting,
    selectedTargetUrl,
    setSelectedTargetUrl,
  } = useAudit();

  const [activeTab, setActiveTab] = useState<IssueStatus>('pending_approval');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [expandedDiffs, setExpandedDiffs] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleDiffView = (id: string) => {
    setExpandedDiffs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (text: string, key: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  // 1. Sleek Active Audit Target Pill Selector (ALL audited websites & testbed)
  const availableTargets = useMemo(() => {
    const urlMap = new Map<string, { url: string; label: string; count: number; isDemo: boolean }>();

    // 1. Collect targets from audits list first
    for (const audit of audits) {
      const targetUrl = audit.url;
      if (!targetUrl) continue;
      const isDemo = isDemoTarget(targetUrl);
      let label = targetUrl;
      try {
        if (targetUrl.startsWith('http')) {
          label = new URL(targetUrl).hostname;
        } else if (isDemo) {
          label = 'Demo Testbed';
        }
      } catch {
        label = targetUrl;
      }
      if (!urlMap.has(targetUrl)) {
        urlMap.set(targetUrl, { url: targetUrl, label, count: 0, isDemo });
      }
    }

    // 2. Collect from issues and accurately count issues per target
    for (const issue of issues) {
      const targetUrl = issue.url;
      if (!targetUrl) continue;
      const isDemo = isDemoTarget(targetUrl);
      let label = targetUrl;
      try {
        if (targetUrl.startsWith('http')) {
          label = new URL(targetUrl).hostname;
        } else if (isDemo) {
          label = 'Demo Testbed';
        }
      } catch {
        label = targetUrl;
      }

      if (urlMap.has(targetUrl)) {
        urlMap.get(targetUrl)!.count += 1;
      } else {
        urlMap.set(targetUrl, { url: targetUrl, label, count: 1, isDemo });
      }
    }

    return Array.from(urlMap.values());
  }, [audits, issues]);

  // Determine current active target
  const activeTargetUrl = useMemo(() => {
    if (selectedTargetUrl) {
      const exact = availableTargets.find((t) => t.url === selectedTargetUrl);
      if (exact) return exact.url;
      const fuzzy = availableTargets.find(
        (t) => t.url.includes(selectedTargetUrl) || selectedTargetUrl.includes(t.url)
      );
      if (fuzzy) return fuzzy.url;
    }
    return availableTargets[0]?.url || '';
  }, [selectedTargetUrl, availableTargets]);

  // 2. Strict Target URL Scoping
  const targetScopedIssues = useMemo(() => {
    if (!activeTargetUrl) return [];
    return issues.filter((i) => i.url === activeTargetUrl);
  }, [issues, activeTargetUrl]);

  // Tab counters scoped to active target
  const targetMetrics = useMemo(() => {
    const pending = targetScopedIssues.filter((i) => i.status === 'pending_approval').length;
    const open = targetScopedIssues.filter((i) => i.status === 'open').length;
    const resolved = targetScopedIssues.filter((i) => i.status === 'resolved').length;
    const dismissed = targetScopedIssues.filter((i) => i.status === 'dismissed').length;
    return { pending, open, resolved, dismissed };
  }, [targetScopedIssues]);

  const tabs = [
    {
      id: 'pending_approval' as IssueStatus,
      label: 'Pending Approval',
      count: targetMetrics.pending,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'open' as IssueStatus,
      label: 'Open Issues',
      count: targetMetrics.open,
      badgeColor: 'bg-rose-100 text-rose-800',
    },
    {
      id: 'resolved' as IssueStatus,
      label: 'Resolved Issues',
      count: targetMetrics.resolved,
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'dismissed' as IssueStatus,
      label: 'Dismissed',
      count: targetMetrics.dismissed,
      badgeColor: 'bg-slate-100 text-slate-600',
    },
  ];

  const filteredIssues = targetScopedIssues.filter((issue) => {
    const matchesTab = issue.status === activeTab;
    const matchesSeverity =
      selectedSeverity === 'all' || issue.severity === selectedSeverity;
    const matchesQuery =
      searchQuery === '' ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.wcagCriterion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.targetSelector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSeverity && matchesQuery;
  });

  const getSeverityBadge = (sev: IssueSeverity) => {
    switch (sev) {
      case 'critical':
        return (
          <span className="bg-rose-50 text-rose-700 border border-rose-200/90 text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shrink-0 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
            CRITICAL
          </span>
        );
      case 'serious':
      case 'moderate':
        return (
          <span className="bg-amber-50 text-amber-800 border border-amber-200/90 text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shrink-0 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            WARNING
          </span>
        );
      default:
        return (
          <span className="bg-cyan-50 text-cyan-800 border border-cyan-200/90 text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shrink-0 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
            BEST PRACTICE
          </span>
        );
    }
  };

  const isAllResolvedForTarget =
    targetMetrics.resolved > 0 && targetMetrics.open === 0 && targetMetrics.pending === 0;

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Top Header & Active Audit Target Pill Selector */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 mb-1">
                <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase">
                  Accessibility Evidence Ledger
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Audited Compliance Findings
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Human-in-the-loop review, automated regression retesting, and verified code remediations.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setUrl('');
                  router.push('/new-audit');
                }}
                className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Audit Another Site</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to permanently reset all audit data and clear your local history?')) {
                    resetAllAuditData();
                  }
                }}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                title="Reset All Audit Data"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span className="hidden sm:inline">🗑️ Reset History</span>
              </button>
            </div>
          </div>

          {/* Active Audit Target Pill Selector (Displays ALL audited websites) */}
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Active Target:
            </span>
            {availableTargets.length === 0 ? (
              <span className="text-xs text-slate-400 italic font-medium font-sans">
                No audits performed yet. Start an audit to inspect findings.
              </span>
            ) : (
              availableTargets.map((t) => {
                const isSelected = t.url === activeTargetUrl;
                return (
                  <button
                    key={t.url}
                    type="button"
                    onClick={() => setSelectedTargetUrl(t.url)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-600 text-white shadow-sm ring-2 ring-cyan-500/30'
                        : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700'
                    }`}
                  >
                    <span>{t.isDemo ? '🧪' : '🌐'}</span>
                    <span>{t.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      ({t.count})
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Celebratory Banner (When all issues are resolved for active target) */}
        {isAllResolvedForTarget && (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <PartyPopper className="w-5 h-5 text-emerald-100" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  100% Remediated
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  All Accessibility Barriers Resolved for {activeTargetUrl}
                </h3>
                <p className="text-xs text-emerald-100/90 mt-0.5">
                  Continuous retesting confirmed full WCAG compliance across all tested selectors.
                </p>
              </div>
            </div>
            <Link
              href="/reports"
              className="bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs self-start md:self-auto cursor-pointer"
            >
              Generate Executive Report
            </Link>
          </div>
        )}

        {/* Filters & Tabs Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-100 dark:border-slate-800 pb-1 sm:border-0 sm:pb-0">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-300 shadow-2xs border border-cyan-200/70 dark:border-cyan-800'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        isActive
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Batch Actions */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {activeTab === 'pending_approval' && targetMetrics.pending > 0 && (
                <button
                  type="button"
                  onClick={() => approveAllPendingIssues(activeTargetUrl)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <AllCheck className="w-3.5 h-3.5" />
                  <span>Approve All to Ledger ({targetMetrics.pending})</span>
                </button>
              )}

              {activeTab === 'open' && targetMetrics.open > 0 && (
                <button
                  type="button"
                  onClick={retestAllOpenIssues}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Retest All Open Issues</span>
                </button>
              )}
            </div>
          </div>

          {/* Search & Severity Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by selector, WCAG rule, title, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all font-mono"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="bg-slate-50 border border-slate-200/80 text-slate-700 text-xs rounded-xl px-3 py-2 outline-none focus:border-cyan-500 cursor-pointer font-mono font-semibold"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="serious">Serious</option>
                <option value="moderate">Moderate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Human Action Approval Gate Banner */}
        {activeTab === 'pending_approval' && targetMetrics.pending > 0 && (
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30">
                    Phase 04 — Human Action Approval Gate
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-white/10 text-slate-300 px-2 py-0.5 rounded-md">
                    Destination: Project Issue Ledger
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                  Human Authorization Required: Execution paused before logging
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 max-w-2xl font-normal">
                  All {targetMetrics.pending} staged violations require explicit human verification. Cryptographic SHA-256 hashes are verified. Approving transitions issues directly into the Project Issue Ledger.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => approveAllPendingIssues(activeTargetUrl)}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 self-start md:self-auto shrink-0 cursor-pointer"
            >
              <Check className="w-4 h-4 text-slate-950 stroke-[2.8]" />
              <span>Approve All to Ledger</span>
            </button>
          </div>
        )}

        {/* Linear-Grade Issue Cards List */}
        <div className="space-y-4">
          {availableTargets.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center shadow-sm">
              <ShieldCheck className="w-10 h-10 text-slate-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No Audits Performed Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                Launch a live website accessibility audit or run the interactive demo sandbox to generate verified accessibility findings.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  href="/new-audit"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Start Live Audit
                </Link>
                <Link
                  href="/sandbox"
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Open Demo Sandbox
                </Link>
              </div>
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3 opacity-80" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No issues found in this view
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                There are no {activeTab.replace('_', ' ')} issues matching your active filter criteria for {activeTargetUrl}.
              </p>
            </div>
          ) : (
            filteredIssues.map((issue) => {
              const isItemRetesting = !!isRetesting[issue.id];
              const showDiff = !!expandedDiffs[issue.id];
              const isDemo = isDemoTarget(issue.url);

              return (
                <div
                  key={issue.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-5 sm:p-6 shadow-sm transition-all flex flex-col gap-4"
                >
                  {/* Row 1: Header (Severity + WCAG Tag + Selector + Destination + Hash + Retest Badge) */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {getSeverityBadge(issue.severity)}
                      <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200/80 px-2.5 py-0.5 rounded-md">
                        {issue.wcagCriterion}
                      </span>
                      <code
                        className="text-xs font-mono bg-slate-900 text-slate-200 px-2.5 py-0.5 rounded-md truncate max-w-[280px]"
                        title={issue.targetSelector}
                      >
                        {issue.targetSelector}
                      </code>

                      {issue.status === 'pending_approval' && (
                        <span className="text-[10px] font-mono font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-md">
                          Destination: Project Issue Ledger
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 font-mono">
                      {/* Cryptographic Hash Badge with Copy Action */}
                      {issue.cryptoHash && (
                        <button
                          type="button"
                          onClick={() => handleCopy(issue.cryptoHash!, `${issue.id}-hash`)}
                          title="Cryptographic Hash (SHA-256 Signature)"
                          className="text-[10px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Hash className="w-2.5 h-2.5 text-slate-400" />
                          <span>{issue.cryptoHash.slice(0, 15)}...</span>
                          {copiedKey === `${issue.id}-hash` ? (
                            <CheckCheck className="w-2.5 h-2.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-2.5 h-2.5 text-slate-400" />
                          )}
                        </button>
                      )}

                      {/* Dynamic Retest Failed Pill */}
                      {issue.lastRetestResult && !issue.lastRetestResult.resolved && (
                        <span className="bg-rose-50 text-rose-700 border border-rose-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-in fade-in duration-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                          <span>Retest Failed: Issue still active on target</span>
                        </span>
                      )}

                      {/* Verified Fixed Pill */}
                      {(issue.status === 'resolved' || issue.lastRetestResult?.resolved) && (
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>Verified Fixed</span>
                        </span>
                      )}

                      <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                        {issue.id}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Title & Human Impact Description */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {issue.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                      {issue.description}{' '}
                      <span className="text-slate-500 dark:text-slate-400 font-normal">{issue.impact}</span>
                    </p>
                  </div>

                  {/* Disagreement Override Badge */}
                  {issue.disagreementBadge && (
                    <div className="bg-amber-50 border border-amber-300/80 text-amber-900 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{issue.disagreementBadge}</span>
                    </div>
                  )}

                  {/* Decision Rule Rationale */}
                  {issue.decisionReason && (
                    <div className="bg-slate-50 border border-slate-200/90 text-slate-700 px-3.5 py-2 rounded-xl text-xs flex items-start gap-2">
                      <ArrowDownRight className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 font-bold mr-1 font-mono">Decision Rule:</strong>
                        <span className="text-slate-600">{issue.decisionReason}</span>
                      </div>
                    </div>
                  )}

                  {/* Keystroke Trace: Interactive Breadcrumb Pills with Clear Visual Arrows */}
                  {issue.keyboardTrace && (
                    <div className="bg-slate-900 text-slate-200 rounded-xl p-3.5 border border-slate-800 space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[10px] text-slate-400">
                        <span className="uppercase font-bold text-cyan-400 tracking-wider">
                          Interactive Keyboard Path Recording / Trace (WCAG 2.1.2)
                        </span>
                        <span className="bg-rose-950 text-rose-300 border border-rose-800/80 px-2 py-0.5 rounded font-bold">
                          Trapped: {issue.keyboardTrace.iterations} Tab iterations
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] pt-1">
                        {issue.keyboardTrace.path.map((segment, sIdx) => (
                          <React.Fragment key={sIdx}>
                            <span
                              className={`px-2.5 py-1 rounded-lg font-bold border ${
                                segment.includes('Stuck') || segment.includes('Cyclic') || segment.includes('Loop')
                                  ? 'bg-rose-950 text-rose-300 border-rose-700 shadow-[0_0_8px_rgba(244,63,94,0.3)] animate-pulse'
                                  : 'bg-slate-800 text-slate-200 border-slate-700'
                              }`}
                            >
                              {segment}
                            </span>
                            {sIdx < issue.keyboardTrace!.path.length - 1 && (
                              <span className="text-cyan-400 font-bold text-sm">→</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans pt-0.5">
                        {issue.keyboardTrace.description}
                      </p>
                    </div>
                  )}

                  {/* Row 3: 2-Column Grid (Left: Visual/DOM Evidence, Right: AI Remediation Patch) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                    {/* Left Column: Visual / DOM Inspector */}
                    <div className="lg:col-span-5 bg-slate-50/90 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between text-xs">
                      <div>
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 mb-2">
                          <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs font-sans">
                            <Eye className="w-3.5 h-3.5 text-cyan-600" />
                            Visual / DOM Evidence
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                issue.visualEvidence?.simulatedHtmlPreview || issue.targetSelector,
                                `${issue.id}-html`
                              )
                            }
                            className="text-[10px] text-slate-500 hover:text-slate-900 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-200 transition-colors cursor-pointer font-sans"
                          >
                            {copiedKey === `${issue.id}-html` ? (
                              <>
                                <CheckCheck className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy HTML</span>
                              </>
                            )}
                          </button>
                        </div>

                        {issue.contrastSampleDetails && (
                          <div className="mb-2 flex items-center gap-2 text-[10px] font-mono">
                            <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">
                              Sampled: {issue.contrastSampleDetails.sampledRatio}:1
                            </span>
                            <span className="text-slate-500">
                              Required: {issue.contrastSampleDetails.requiredRatio}:1 (AA)
                            </span>
                          </div>
                        )}

                        {/* Code Snippet Box */}
                        <pre className="bg-slate-900 text-slate-100 p-3 rounded-xl text-[11px] font-mono overflow-x-auto max-h-[120px] whitespace-pre-wrap break-all border border-slate-800 leading-relaxed shadow-inner">
                          {issue.visualEvidence?.simulatedHtmlPreview || issue.targetSelector}
                        </pre>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span className="truncate max-w-[220px]">
                          Target: {issue.targetSelector}
                        </span>
                        <span>Captured DOM node</span>
                      </div>
                    </div>

                    {/* Right Column: AI Remediation Patch */}
                    <div className="lg:col-span-7 bg-slate-900 text-slate-100 rounded-xl p-3.5 flex flex-col justify-between text-xs shadow-md font-mono border border-slate-800">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-slate-800 mb-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs font-sans">
                              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                              Proposed Remediation Patch
                            </span>
                            {issue.aiGenerated ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-2 py-0.5 rounded-full shadow-xs">
                                <span>✨ Synthesized by Gemini 1.5 Flash</span>
                                {issue.aiKeyUsed && (
                                  <span className="text-cyan-200/80 font-mono">• Key: {issue.aiKeyUsed}</span>
                                )}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-sans font-medium bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full">
                                <span>⚙️ Deterministic WCAG Rule Template</span>
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                issue.aiRemediation?.afterCode || '',
                                `${issue.id}-patch`
                              )
                            }
                            className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors cursor-pointer font-sans"
                          >
                            {copiedKey === `${issue.id}-patch` ? (
                              <>
                                <CheckCheck className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-300 font-bold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Patch</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Before / After Diff */}
                        <div className="space-y-1.5 max-h-[120px] overflow-y-auto text-[11px]">
                          <div className="bg-slate-950 text-rose-300 border border-rose-900/40 p-2 rounded-lg overflow-x-auto">
                            <span className="text-[9px] uppercase font-bold text-rose-400 mr-1.5 font-sans">
                              - Before:
                            </span>
                            <pre className="inline">{issue.aiRemediation?.beforeCode}</pre>
                          </div>
                          <div className="bg-slate-950 text-emerald-300 border border-emerald-900/40 p-2 rounded-lg overflow-x-auto">
                            <span className="text-[9px] uppercase font-bold text-emerald-400 mr-1.5 font-sans">
                              + Remediated:
                            </span>
                            <pre className="inline">{issue.aiRemediation?.afterCode}</pre>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-sans">
                        <span className="truncate max-w-[280px]">
                          {issue.aiRemediation?.explanation}
                        </span>
                        <span>Developer Review Required</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Visual Diff View */}
                  {showDiff && issue.visualDiff && (
                    <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-sans">
                          <Diff className="w-3.5 h-3.5 text-cyan-600" />
                          Verified Side-by-Side Visual Diff
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {issue.visualDiff.verifierAgent || 'Velora Verification Engine'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="bg-white border border-rose-200 rounded-lg p-3">
                          <span className="text-[10px] font-bold text-rose-700 uppercase block mb-1">
                            Before (Failed State)
                          </span>
                          <span className="font-mono text-rose-800 font-semibold block text-[11px]">
                            {issue.visualDiff.beforeState.previewText || issue.targetSelector}
                          </span>
                        </div>
                        <div className="bg-white border border-emerald-300 rounded-lg p-3 ring-1 ring-emerald-100">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">
                            After (Verified Remediated)
                          </span>
                          <span className="font-mono text-emerald-900 font-bold block text-[11px]">
                            {issue.visualDiff.afterState.previewText || issue.targetSelector}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Row 4: Footer Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      {isDemo ? (
                        <span className="flex items-center gap-1 text-slate-700">
                          <Sliders className="w-3.5 h-3.5 text-cyan-600" />
                          <span>Testbed: <strong className="font-mono">/sandbox</strong></span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-700">
                          <Globe className="w-3.5 h-3.5 text-cyan-600" />
                          <span>Source: <strong className="font-mono">{issue.namedSource || issue.url}</strong></span>
                        </span>
                      )}
                      <span>•</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {issue.retrievalTime ? new Date(issue.retrievalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Today'}
                      </span>
                    </div>

                    {/* Action Controls: Prominent Approve Remediation & Retest Fix Buttons */}
                    <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
                      {issue.status === 'pending_approval' && (
                        <>
                          <button
                            type="button"
                            onClick={() => dismissIssue(issue.id)}
                            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5 text-slate-500" />
                            <span>Dismiss</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => approveIssue(issue.id)}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 shadow-[0_2px_10px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.8]" />
                            <span>Approve Remediation</span>
                          </button>
                        </>
                      )}

                      {issue.status === 'open' && (
                        <>
                          {isDemo && (
                            <Link
                              href="/sandbox"
                              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <Sliders className="w-3.5 h-3.5 text-cyan-600" />
                              <span>Toggle in Sandbox</span>
                            </Link>
                          )}

                          <button
                            type="button"
                            disabled={isItemRetesting}
                            onClick={() => retestIssue(issue.id)}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-[0_2px_10px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 disabled:opacity-75 cursor-pointer"
                          >
                            <RotateCw
                              className={`w-3.5 h-3.5 ${
                                isItemRetesting ? 'animate-spin' : ''
                              }`}
                            />
                            <span>
                              {isItemRetesting ? 'Retesting Remote DOM...' : 'Retest Fix on Remote DOM'}
                            </span>
                          </button>
                        </>
                      )}

                      {issue.status === 'resolved' && (
                        <div className="flex items-center gap-2">
                          {issue.visualDiff && (
                            <button
                              type="button"
                              onClick={() => toggleDiffView(issue.id)}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Diff className="w-3.5 h-3.5" />
                              <span>{showDiff ? 'Hide Diff' : 'View Diff'}</span>
                            </button>
                          )}
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Resolved at {issue.resolvedAt || 'Just now'}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
