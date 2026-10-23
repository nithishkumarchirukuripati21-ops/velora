export type WCAGLevel =
  | 'WCAG 2.1 Level A'
  | 'WCAG 2.1 Level AA'
  | 'WCAG 2.2 Level AA'
  | 'WCAG 2.2 Level AAA';

export type AuditStatus = 'queued' | 'running' | 'completed' | 'failed' | 'stopped';

export type IssueSeverity = 'critical' | 'serious' | 'moderate' | 'minor';

export type IssueStatus = 'pending_approval' | 'open' | 'resolved' | 'dismissed';

export interface VisualEvidence {
  elementDescription: string;
  simulatedHtmlPreview: string;
  boundingHighlight: string;
  contrastDetails?: {
    current: string;
    required: string;
  };
}

export interface AIRemediation {
  explanation: string;
  beforeCode: string;
  afterCode: string;
  language: string;
  provider?: string;
}

export interface VisualDiffState {
  label: string;
  statusBadge: string;
  contrast?: string;
  cssStyle?: string;
  previewText?: string;
  elementHtml?: string;
}

export interface VisualDiffEvidence {
  beforeState: VisualDiffState;
  afterState: VisualDiffState;
  retestTimestamp?: string;
  verifierAgent?: string;
}

export interface KeyboardTraceSequence {
  path: string[];
  iterations: number;
  description: string;
  isTrapped: boolean;
}

export interface ContrastSampleDetails {
  sampledBackgroundHex: string;
  sampledForegroundHex: string;
  sampledRatio: number;
  requiredRatio: number;
  backgroundType: 'photographic_image' | 'solid_color' | 'linear_gradient';
}

export interface Issue {
  id: string;
  auditId: string;
  url: string;
  title: string;
  wcagCriterion: string;
  ruleLevel?: 'A' | 'AA' | 'AAA';
  severity: IssueSeverity;
  status: IssueStatus;
  targetSelector: string;
  description: string;
  impact: string;
  visualEvidence: VisualEvidence;
  aiRemediation: AIRemediation;
  visualDiff?: VisualDiffEvidence;
  createdAt: string;
  retrievalTime: string; // ISO string e.g. 2026-10-20T06:15:00.000Z
  namedSource?: string; // Named source e.g. "Interactive Demo Testbed DOM (/sandbox)" or "Live Website DOM (w3.org)"
  issueType?: string; // Classification e.g. "Best Practice Advisory (WCAG 1.3.1 Structure)"
  decisionReason?: string; // Decision rule rationale combining automated checks + keyboard exploration
  destinationLedger?: string; // Proposed destination e.g. "Project Issue Ledger"
  resolvedAt?: string;
  testCaseId?: 'TC1' | 'TC2' | 'TC3' | 'TC4';
  disagreementBadge?: string;
  keyboardTrace?: KeyboardTraceSequence;
  cryptoHash?: string;
  evidenceHash?: string;
  contrastSampleDetails?: ContrastSampleDetails;
  lastRetestResult?: {
    resolved: boolean;
    message: string;
    timestamp: string;
  };
  aiGenerated?: boolean;
  aiModel?: string;
  aiKeyUsed?: string;
}

export interface AuditRecord {
  id: string;
  url: string;
  targetLevel: WCAGLevel;
  status: AuditStatus;
  timestamp: string;
  score?: number;
  issuesCount?: number;
  openIssuesCount: number;
  resolvedIssuesCount: number;
  pendingIssuesCount?: number;
  currentStep?: number;
  pageTitle?: string;
  domStats?: {
    totalNodes: number;
    headings: { h1: number; h2: number; h3: number };
    images: number;
    formControls: number;
  };
  aiStatus?: 'active_gemini_synthesis' | 'deterministic_fallback';
  keyUsed?: string;
}

export interface AuditMetrics {
  total: number;
  open: number;
  resolved: number;
  pending: number;
}

export interface CategoryBreakdown {
  colorContrast: number | string;
  keyboardOperability: number | string;
  ariaSemantics: number | string;
}

export interface AuditReport {
  id: string;
  url: string;
  date: string;
  targetLevel: WCAGLevel;
  overallScore: number;
  breakdown: CategoryBreakdown;
  totalIssues: number;
  passedRulesCount: number;
  summary: string;
}

export interface SettingsConfig {
  defaultLevel: WCAGLevel;
  keyboardDepth: number;
  aiModel: string;
  geminiApiKey?: string;
}

export interface AgentLogMessage {
  id: string;
  timestamp: string;
  phase: number;
  text: string;
  type: 'info' | 'warn' | 'success' | 'action';
}

export interface SandboxToggles {
  modalTrapFixed: boolean; // TC1: [Fix Modal Focus Trap] (allows Esc / unlocks Tab)
  keyboardAccessibilityFixed: boolean; // TC2: [Add Keyboard Accessibility] (adds tabindex="0" + Enter/Space handler)
  photoContrastFixed: boolean; // TC3: [Fix Photo Overlay Contrast] (adds semi-transparent dark backdrop scrim rgba(0,0,0,0.7))
  // Backward compatibility aliases
  contrastFixed?: boolean;
  focusFixed?: boolean;
  ariaFixed?: boolean;
}

export interface TestCaseRunResult {
  id: 'TC1' | 'TC2' | 'TC3' | 'TC4';
  title: string;
  criterion: string;
  input: string;
  expectedResult: string;
  actualResult: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  timestamp?: string;
  traceDetails?: string;
  badge?: string;
}

export interface AuditApiRequest {
  url: string;
  targetLevel?: WCAGLevel;
  sandboxState?: SandboxToggles;
  userKey?: string;
  apiKey?: string;
  customKeys?: string;
  model?: string;
}

export interface AuditApiResponse {
  auditId: string;
  url: string;
  targetLevel: WCAGLevel;
  timestamp: string;
  score: number;
  passedRulesCount?: number;
  issues: Issue[];
  breakdown: CategoryBreakdown;
  summary: string;
  logs: AgentLogMessage[];
  pageTitle?: string;
  domStats?: {
    totalNodes: number;
    headings: { h1: number; h2: number; h3: number };
    images: number;
    formControls: number;
  };
  aiStatus?: 'active_gemini_synthesis' | 'deterministic_fallback';
  keyUsed?: string;
  model?: string;
}

export interface RetestApiRequest {
  issueId: string;
  targetSelector: string;
  sandboxState?: SandboxToggles;
}

export interface RetestApiResponse {
  success: boolean;
  issueId: string;
  resolved: boolean;
  message: string;
  state?: 'resolved' | 'failed' | 'uncertain';
  visualDiff?: VisualDiffEvidence;
}
