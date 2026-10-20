'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useAudit } from '@/context/AuditContext';
import { Issue, IssueStatus, IssueSeverity } from '@/types/audit';
import { isDemoTarget } from '@/lib/wcagEngine';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Check,
  X,
  RotateCw,
  Code2,
  Eye,
  Tag,
  ArrowRight,
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
} from 'lucide-react';

export default function IssuesPage() {
  const {
    issues,
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

  // 1. Sleek Active Audit Target Pill Selector
  // Extract all unique target URLs from current issues (zero phantom targets)
  const availableTargets = useMemo(() => {
    const urlMap = new Map<string, { url: string; label: string; count: number; isDemo: boolean }>();

    for (const issue of issues) {
      const targetUrl = issue.url;
      if (!targetUrl) continue;
      const isDemo = isDemoTarget(targetUrl);
      let label = targetUrl;
      try {
        if (targetUrl.startsWith('http')) {
          label = new URL(targetUrl).hostname;
        } else if (isDemo) {
          label = 'Demo Sandbox';
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
  }, [issues]);

  // Determine current active target (matches newly audited target seamlessly)
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

  // 2. Strict Target URL Scoping: Filter issues by active selected target
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
      activeColor: 'border-b-2 border-amber-600 text-amber-600',
    },
    {
      id: 'open' as IssueStatus,
      label: 'Open Issues',
      count: targetMetrics.open,
      badgeColor: 'bg-rose-100 text-rose-800',
      activeColor: 'border-b-2 border-rose-600 text-rose-600',
    },
    {
      id: 'resolved' as IssueStatus,
      label: 'Resolved Issues',
      count: targetMetrics.resolved,
      badgeColor: 'bg-emerald-100 text-emerald-800',
      activeColor: 'border-b-2 border-emerald-600 text-emerald-600',
    },
    {
      id: 'dismissed' as IssueStatus,
      label: 'Dismissed',
      count: targetMetrics.dismissed,
      badgeColor: 'bg-slate-100 text-slate-600',
      activeColor: 'border-b-2 border-slate-600 text-slate-800',
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
          <span className="bg-rose-100 text-rose-700 border border-rose-200/80 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            Critical
          </span>
        );
      case 'serious':
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-200/80 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            Serious
          </span>
        );
      case 'moderate':
        return (
          <span className="bg-yellow-100 text-yellow-800 border border-yellow-200/80 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
            Moderate
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-0.5 rounded-full shrink-0">
            Minor
          </span>
        );
    }
  };

  const isAllResolvedForTarget =
    targetMetrics.resolved > 0 && targetMetrics.open === 0 && targetMetrics.pending === 0;

  return (
    <DashboardShell>
      <div className="space-y-5">
        {/* Top Header & Active Audit Target Pill Selector */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold tracking-wider uppercase">
                  Accessibility Issue Ledger
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900">
                Audited Compliance Findings
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Human-in-the-loop review, automated regression retesting, and verified code remediations.
              </p>
            </div>

            <Link
              href="/new-audit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 self-start sm:self-auto transition-all shadow-xs"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Launch New Audit</span>
            </Link>
          </div>

          {/* Active Audit Target Pill Selector */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Active Target:
            </span>
            {availableTargets.length === 0 ? (
              <span className="text-xs text-slate-400 italic font-medium">
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
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                    }`}
                  >
                    {t.isDemo ? <Sliders className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                    <span>{t.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {t.count} {t.isDemo ? 'testbed issues' : 'live issues'}
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
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
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
              className="bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs self-start md:self-auto"
            >
              Generate Executive Report
            </Link>
          </div>
        )}

        {/* Filters & Tabs Bar */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Status Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-100 pb-1 sm:border-0 sm:pb-0">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Actions (e.g. Approve All in Pending tab or Retest All in Open tab) */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {activeTab === 'pending_approval' && targetMetrics.pending > 0 && (
                <button
                  type="button"
                  onClick={() => approveAllPendingIssues(activeTargetUrl)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <AllCheck className="w-3.5 h-3.5" />
                  <span>Approve All to Ledger ({targetMetrics.pending})</span>
                </button>
              )}

              {activeTab === 'open' && targetMetrics.open > 0 && (
                <button
                  type="button"
                  onClick={retestAllOpenIssues}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Retest All Open Issues</span>
                </button>
              )}
            </div>
          </div>

          {/* Search & Severity Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by selector, WCAG rule, title, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="serious">Serious</option>
                <option value="moderate">Moderate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Phase 04: Human Action Approval Gate Banner */}
        {activeTab === 'pending_approval' && targetMetrics.pending > 0 && (
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-xs">
                <ShieldAlert className="w-5 h-5 text-white stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
                    Phase 04 — Human Action Approval Gate
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-black/20 text-white px-2 py-0.5 rounded-md border border-white/20">
                    Destination: Project Issue Ledger
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                  Human Authorization Required: Execution paused before logging
                </h3>
                <p className="text-xs text-amber-100/90 mt-0.5 max-w-2xl font-normal">
                  All {targetMetrics.pending} staged violations require explicit human verification. Cryptographic SHA-256 hashes are verified. Approving transitions issues directly into the Project Issue Ledger.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => approveAllPendingIssues(activeTargetUrl)}
              className="bg-white text-orange-700 hover:bg-orange-50 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 self-start md:self-auto shrink-0 cursor-pointer"
            >
              <Check className="w-4 h-4 text-orange-600 stroke-[2.5]" />
              <span>Approve All to Ledger</span>
            </button>
          </div>
        )}

        {/* Enterprise Linear/GitHub-style Issue Cards */}
        <div className="space-y-4">
          {availableTargets.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-xs">
              <ShieldCheck className="w-10 h-10 text-slate-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-bold text-slate-800">
                No Audits Performed Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Launch a live website accessibility audit or run the interactive demo sandbox to generate verified accessibility findings.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  href="/new-audit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
                >
                  Start Live Audit
                </Link>
                <Link
                  href="/sandbox"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-all"
                >
                  Open Demo Sandbox
                </Link>
              </div>
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3 opacity-80" />
              <h3 className="text-base font-bold text-slate-800">
                No issues found in this view
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
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
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 p-5 shadow-xs transition-all flex flex-col gap-3.5"
                >
                  {/* Row 1: Header (Severity + WCAG Tag + Selector + Stable ID + Destination + Hash + Retest Badge) */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {getSeverityBadge(issue.severity)}
                      <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200/60 px-2.5 py-0.5 rounded-md">
                        {issue.wcagCriterion}
                      </span>
                      <code
                        className="text-xs font-mono bg-slate-900 text-slate-200 px-2 py-0.5 rounded truncate max-w-[280px]"
                        title={issue.targetSelector}
                      >
                        {issue.targetSelector}
                      </code>

                      {issue.status === 'pending_approval' && (
                        <span className="text-[10px] font-mono font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                          Destination: Project Issue Ledger
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Cryptographic Hash Badge with Copy Action */}
                      {issue.cryptoHash && (
                        <button
                          type="button"
                          onClick={() => handleCopy(issue.cryptoHash!, `${issue.id}-hash`)}
                          title="Cryptographic Hash (SHA-256 Signature)"
                          className="text-[10px] font-mono bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
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
                          <span>Retest Failed: Issue still active on live website</span>
                        </span>
                      )}

                      {/* Verified Fixed Pill */}
                      {(issue.status === 'resolved' || issue.lastRetestResult?.resolved) && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>Verified Fixed</span>
                        </span>
                      )}

                      <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                        {issue.id}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Title & Human Impact Description */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {issue.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5 line-clamp-2">
                      {issue.description}{' '}
                      <span className="text-slate-500 font-normal">{issue.impact}</span>
                    </p>
                  </div>

                  {/* Disagreement Override Badge (TC2) */}
                  {issue.disagreementBadge && (
                    <div className="bg-amber-50/80 border border-amber-300/80 text-amber-900 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{issue.disagreementBadge}</span>
                    </div>
                  )}

                  {/* Decision Rule Rationale (Rule 3) */}
                  {issue.decisionReason && (
                    <div className="bg-slate-50 border border-slate-200/90 text-slate-700 px-3 py-1.5 rounded-xl text-xs flex items-start gap-2">
                      <ArrowDownRight className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 font-bold mr-1">Decision Rule:</strong>
                        <span className="text-slate-600">{issue.decisionReason}</span>
                      </div>
                    </div>
                  )}

                  {/* Keyboard Traversal Recording / Trace (TC1) */}
                  {issue.keyboardTrace && (
                    <div className="bg-slate-950 text-slate-200 rounded-xl p-3 border border-slate-800 space-y-1.5 text-xs font-mono">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[10px] text-slate-400">
                        <span className="uppercase font-bold text-blue-400 tracking-wider">
                          Interactive Keyboard Path Recording / Trace (WCAG 2.1.2)
                        </span>
                        <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.2 rounded">
                          Trapped: {issue.keyboardTrace.iterations} iterations
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
                        {issue.keyboardTrace.path.map((segment, sIdx) => (
                          <React.Fragment key={sIdx}>
                            <span
                              className={`px-2 py-0.5 rounded ${
                                segment.includes('Stuck') || segment.includes('Cyclic')
                                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {segment}
                            </span>
                            {sIdx < issue.keyboardTrace!.path.length - 1 && (
                              <span className="text-slate-500">→</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans pt-0.5">
                        {issue.keyboardTrace.description}
                      </p>
                    </div>
                  )}

                  {/* Row 3: Compact 2-Column Content Grid (Left: Visual/DOM Inspector, Right: AI Remediation Patch) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
                    {/* Left Column: Visual / DOM Inspector */}
                    <div className="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between text-xs">
                      <div>
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/70 mb-2">
                          <span className="font-bold text-slate-700 flex items-center gap-1.5 text-xs">
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
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
                            className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-200 transition-colors cursor-pointer"
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

                        {/* Photographic Contrast Details if present */}
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

                        {/* Actual HTML Snippet Syntax Box */}
                        <pre className="bg-slate-950 text-slate-200 p-2.5 rounded-lg text-[11px] font-mono overflow-x-auto max-h-[110px] whitespace-pre-wrap break-all border border-slate-800/80 leading-relaxed">
                          {issue.visualEvidence?.simulatedHtmlPreview || issue.targetSelector}
                        </pre>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span className="truncate max-w-[220px]">
                          Target: {issue.targetSelector}
                        </span>
                        <span>Captured DOM node</span>
                      </div>
                    </div>

                    {/* Right Column: AI Remediation Patch */}
                    <div className="lg:col-span-7 bg-slate-900 text-slate-100 rounded-xl p-3 flex flex-col justify-between text-xs shadow-xs font-mono">
                      <div>
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 mb-2">
                          <span className="font-bold text-slate-300 flex items-center gap-1.5 text-xs font-sans">
                            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                            AI Remediation Patch
                          </span>
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

                        {/* Before / After Compact Diff */}
                        <div className="space-y-1.5 max-h-[110px] overflow-y-auto text-[11px]">
                          <div className="bg-slate-950/90 text-rose-300 border border-rose-500/30 p-1.5 rounded overflow-x-auto">
                            <span className="text-[9px] uppercase font-bold text-rose-400 mr-1.5 font-sans">
                              - Before:
                            </span>
                            <pre className="inline">{issue.aiRemediation?.beforeCode}</pre>
                          </div>
                          <div className="bg-slate-950/90 text-emerald-300 border border-emerald-500/30 p-1.5 rounded overflow-x-auto">
                            <span className="text-[9px] uppercase font-bold text-emerald-400 mr-1.5 font-sans">
                              + Remediated:
                            </span>
                            <pre className="inline">{issue.aiRemediation?.afterCode}</pre>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-sans">
                        <span className="truncate max-w-[280px]">
                          {issue.aiRemediation?.explanation}
                        </span>
                        <span>WCAG 2.2 Compliant</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Visual Diff View (When toggled on resolved issues) */}
                  {showDiff && issue.visualDiff && (
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 border border-blue-200/80 rounded-xl p-4 space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Diff className="w-3.5 h-3.5 text-blue-600" />
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t border-slate-100">
                    {/* Left: Source Badge */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      {isDemo ? (
                        <span className="flex items-center gap-1 text-slate-700">
                          <Sliders className="w-3.5 h-3.5 text-blue-600" />
                          <span>Testbed: <strong className="font-mono">/sandbox</strong></span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-700">
                          <Globe className="w-3.5 h-3.5 text-blue-600" />
                          <span>Source: <strong className="font-mono">{issue.namedSource || issue.url}</strong></span>
                        </span>
                      )}
                      <span>•</span>
                      <span
                        className="text-[11px] text-slate-400 font-mono"
                        title={issue.retrievalTime}
                      >
                        Retrieved: {issue.retrievalTime ? new Date(issue.retrievalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Today'}
                      </span>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      {/* For Pending Approval */}
                      {issue.status === 'pending_approval' && (
                        <>
                          <button
                            type="button"
                            onClick={() => dismissIssue(issue.id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5 text-slate-500" />
                            <span>Dismiss</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => approveIssue(issue.id)}
                            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve & Commit to Ledger</span>
                          </button>
                        </>
                      )}

                      {/* For Open Issues: Retest Issue Now */}
                      {issue.status === 'open' && (
                        <>
                          {isDemo && (
                            <Link
                              href="/sandbox"
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Sliders className="w-3.5 h-3.5" />
                              <span>Toggle in Demo Environment</span>
                            </Link>
                          )}

                          <button
                            type="button"
                            disabled={isItemRetesting}
                            onClick={() => retestIssue(issue.id, isDemo)}
                            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-xs transition-all flex items-center gap-2 disabled:opacity-75 cursor-pointer"
                          >
                            <RotateCw
                              className={`w-3.5 h-3.5 ${
                                isItemRetesting ? 'animate-spin' : ''
                              }`}
                            />
                            <span>
                              {isItemRetesting ? 'Checking Target DOM...' : 'Retest Issue Now'}
                            </span>
                          </button>
                        </>
                      )}

                      {/* For Resolved Issues */}
                      {issue.status === 'resolved' && (
                        <div className="flex items-center gap-2">
                          {issue.visualDiff && (
                            <button
                              type="button"
                              onClick={() => toggleDiffView(issue.id)}
                              className="px-3 py-1 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Diff className="w-3.5 h-3.5" />
                              <span>{showDiff ? 'Hide Diff' : 'View Diff'}</span>
                            </button>
                          )}
                          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1">
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
