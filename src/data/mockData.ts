import { Issue, AuditReport, SettingsConfig } from '@/types/audit';

export const INITIAL_SETTINGS: SettingsConfig = {
  defaultLevel: 'WCAG 2.2 Level AA',
  keyboardDepth: 50,
  aiModel: 'Gemini 1.5 Flash',
};

export const INITIAL_ISSUES: Issue[] = [
  {
    id: 'TC1-MODAL-TRAP',
    testCaseId: 'TC1',
    auditId: 'init-barrier-01',
    url: '/sandbox',
    namedSource: 'Interactive Demo Testbed DOM (/sandbox)',
    destinationLedger: 'Project Issue Ledger',
    title: 'Keyboard Focus Trap in Modal Dialog',
    wcagCriterion: 'WCAG 2.1.2 No Keyboard Trap (Level A)',
    ruleLevel: 'A',
    severity: 'critical',
    status: 'pending_approval',
    targetSelector: 'div#interactive-modal[role="dialog"]',
    decisionReason:
      'Decision Rule (Simulation): Automated focus listener combined with Simulated Keyboard Traversal agent detected cyclic Tab focus loop without Escape key listener. Flagged as Critical Keyboard Trap per WCAG 2.1.2.',
    description:
      'Keyboard focus is trapped within the dialog container during Tab traversal. Sequential keyboard navigation cannot exit to page landmarks, and the Escape key listener is not registered.',
    impact:
      'Keyboard-only and switch-access users are permanently stuck inside the dialog container and prevented from reaching any other part of the application.',
    cryptoHash: 'sha256:4a8f9c1b3e5d7a2f0e9b8c7d6a5e4f3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e',
    retrievalTime: '2026-10-20T06:00:00.000Z',
    createdAt: 'Today at 09:15 AM',
    keyboardTrace: {
      path: [
        '[Address Bar: http://localhost:3000/sandbox]',
        '[Header Navigation Link]',
        '[Modal Dialog Window]',
        '[Stuck: Cyclic Tab loop inside modal (12 iterations)]',
      ],
      iterations: 12,
      description:
        'Automated traversal agent logged 12 consecutive Tab cycles trapped inside dialog container. Escape key produced no event handler response.',
      isTrapped: true,
    },
    visualEvidence: {
      elementDescription: 'Interactive dialog confirmation window',
      simulatedHtmlPreview:
        '<div id="interactive-modal" role="dialog" aria-modal="true"><button>Confirm Role Assignment</button><button class="close">X</button></div>',
      boundingHighlight: 'border-2 border-rose-600 ring-4 ring-rose-600/30',
    },
    aiRemediation: {
      explanation:
        'Attach an Escape key handler to dismiss the dialog and return keyboard focus to the triggering element. Ensure sequential focus wraps cleanly without blocking navigation.',
      beforeCode: `// Failing: Keydown handler intercepts Tab and blocks Escape
dialog.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    trapFocusCycle(e, dialog);
  }
});`,
      afterCode: `// Remediated: Escape dismisses dialog and restores focus
dialog.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDialogAndRestoreFocus();
  }
});`,
      language: 'javascript',
    },
  },
  {
    id: 'TC2-KEYBOARD-NAV',
    testCaseId: 'TC2',
    auditId: 'init-barrier-02',
    url: '/sandbox',
    namedSource: 'Interactive Demo Testbed DOM (/sandbox)',
    destinationLedger: 'Project Issue Ledger',
    title: 'Interactive Element Missing Keyboard Navigation',
    wcagCriterion: 'WCAG 2.1.1 Keyboard Operable (Level A)',
    ruleLevel: 'A',
    severity: 'serious',
    status: 'pending_approval',
    targetSelector: 'div.btn-custom-action[role="button"]',
    disagreementBadge: 'Static Linter: PASS | Keyboard Agent: FAIL (Disagreement Resolved: Logged as Failure)',
    decisionReason:
      'Decision Rule (Automated vs Keyboard Override): Static syntax / linter rules passed, but Simulated Keyboard Traversal failed to focus or activate element due to missing tabindex="0" and keyboard event listeners. Disagreement resolved: Automated pass overridden, logged as Failure per WCAG 2.1.1.',
    description:
      'Static syntax and styling rules passed, but VELORA Simulated Keyboard Traversal identified that the custom interactive control lacks tabindex="0" and keyboard activation handlers (Enter/Space), rendering it completely unreachable via keyboard.',
    impact:
      'Keyboard-only navigation users cannot focus on, navigate to, or activate this primary action control.',
    cryptoHash: 'sha256:8b2e1f4a9c3d5e7f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f',
    retrievalTime: '2026-10-20T06:00:00.000Z',
    createdAt: 'Today at 09:18 AM',
    visualEvidence: {
      elementDescription: 'Custom action button rendered as div',
      simulatedHtmlPreview: '<div role="button" class="btn-custom-action">View Policy Telemetry</div>',
      boundingHighlight: 'border-2 border-amber-500 ring-4 ring-amber-500/20',
    },
    aiRemediation: {
      explanation:
        'Add tabindex="0" and keyboard event listeners for Enter and Space, or replace with a native <button> element.',
      beforeCode: `<!-- Failing: Non-focusable interactive control -->
<div role="button" class="btn-custom-action" onclick="handleClick()">
  View Policy Telemetry
</div>`,
      afterCode: `<!-- Remediated: Keyboard operable with visible focus ring -->
<div
  role="button"
  tabindex="0"
  class="btn-custom-action focus:ring-2 focus:ring-blue-500"
  onclick="handleClick()"
  onkeydown="(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()"
>
  View Policy Telemetry
</div>`,
      language: 'html',
    },
  },
  {
    id: 'TC3-PHOTO-CONTRAST',
    testCaseId: 'TC3',
    auditId: 'init-barrier-03',
    url: '/sandbox',
    namedSource: 'Interactive Demo Testbed DOM (/sandbox)',
    destinationLedger: 'Project Issue Ledger',
    title: 'Insufficient Contrast Over Complex Photographic Background',
    wcagCriterion: 'WCAG 1.4.3 Contrast (Minimum) - Level AA',
    ruleLevel: 'AA',
    severity: 'critical',
    status: 'pending_approval',
    targetSelector: 'div#photo-hero-card p.photo-overlay-text',
    decisionReason:
      'Decision Rule (Pixel Luminance Sampling): Underlying photographic image luminance measured under text bounding box (2.3:1). Missing solid background evidence resolved via sub-pixel canvas luminance sampling. Flagged as Contrast Failure against 4.5:1 threshold per WCAG 1.4.3.',
    description:
      'Text rendered over multi-colored photographic background yields a sampled contrast ratio of 2.3:1 against underlying pixel luminance values, failing the mandatory 4.5:1 minimum threshold for WCAG 1.4.3 Level AA.',
    impact:
      'Users with low vision, aging eyes, or users in high ambient glare environments cannot read text overlaid directly on complex imagery.',
    cryptoHash: 'sha256:3c5e7f9a1b2d4e6f8a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f',
    retrievalTime: '2026-10-20T06:00:00.000Z',
    createdAt: 'Today at 09:22 AM',
    contrastSampleDetails: {
      sampledBackgroundHex: '#e2e8f0',
      sampledForegroundHex: '#94a3b8',
      sampledRatio: 2.3,
      requiredRatio: 4.5,
      backgroundType: 'photographic_image',
    },
    visualEvidence: {
      elementDescription: 'Photographic hero banner caption text',
      simulatedHtmlPreview: '<div class="photo-bg"><p style="color:#94a3b8">Autonomous Infrastructure Governance</p></div>',
      boundingHighlight: 'border-2 border-rose-500 ring-4 ring-rose-500/20',
      contrastDetails: {
        current: '2.3:1 (Fails AA)',
        required: '4.5:1 (Minimum)',
      },
    },
    aiRemediation: {
      explanation:
        'Deploy a semi-transparent dark backdrop scrim (rgba(0,0,0,0.7)) behind the text container and use high-contrast white #ffffff text (10.4:1 ratio).',
      beforeCode: `/* Failing: Low contrast 2.3:1 over photographic background */
.photo-overlay-text {
  color: #94a3b8;
  background: transparent;
}`,
      afterCode: `/* Remediated: 10.4:1 contrast with semi-transparent dark scrim */
.photo-overlay-text {
  color: #ffffff;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  padding: 8px 16px;
  border-radius: 8px;
}`,
      language: 'css',
    },
  },
];

export const INITIAL_REPORTS: AuditReport[] = [
  {
    id: 'rep-001',
    url: 'https://example.com/sandbox',
    date: 'Oct 17, 2026',
    targetLevel: 'WCAG 2.2 Level AA',
    overallScore: 78,
    breakdown: {
      colorContrast: 72,
      keyboardOperability: 76,
      ariaSemantics: 86,
    },
    totalIssues: 3,
    passedRulesCount: 45,
    summary:
      'Autonomous WCAG audit completed for pre-configured testbed. Identified 3 accessibility barriers across keyboard focus entrapment, custom control accessibility, and image contrast.',
  },
  {
    id: 'rep-002',
    url: 'https://store.acme-corp.io',
    date: 'Oct 15, 2026',
    targetLevel: 'WCAG 2.1 Level AA',
    overallScore: 94,
    breakdown: {
      colorContrast: 96,
      keyboardOperability: 92,
      ariaSemantics: 95,
    },
    totalIssues: 1,
    passedRulesCount: 48,
    summary:
      'E-commerce catalog conforms to 94% of tested rules. Minor touch target spacing issue detected on product filter chips.',
  },
];
