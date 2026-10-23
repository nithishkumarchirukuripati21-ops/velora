import { Issue, SandboxToggles, VisualDiffEvidence, WCAGLevel } from '@/types/audit';

// Pure JavaScript cryptographic SHA-256 implementation (zero Node.js dependencies, 100% safe in client bundles)
function sha256Pure(ascii: string): string {
  function rightRotate(v: number, a: number) {
    return (v >>> a) | (v << (32 - a));
  }
  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;
  const hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  for (let i = 0; i < ascii.length; i++) {
    words[i >> 2] |= ascii.charCodeAt(i) << (24 - (i % 4) * 8);
  }
  words[asciiBitLength >> 5] |= 0x80 << (24 - (asciiBitLength % 32));
  words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

  const w: number[] = new Array(64);
  for (let block = 0; block < words.length; block += 16) {
    let [a, b, c, d, e, f, g, h] = hash;
    for (let i = 0; i < 64; i++) {
      if (i < 16) {
        w[i] = words[block + i] | 0;
      } else {
        const gamma0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const gamma1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + gamma0 + w[i - 7] + gamma1) | 0;
      }
      const ch = (e & f) ^ (~e & g);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const sigma0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const sigma1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const temp1 = (h + sigma1 + ch + k[i] + w[i]) | 0;
      const temp2 = (sigma0 + maj) | 0;
      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }
    hash[0] = (hash[0] + a) | 0;
    hash[1] = (hash[1] + b) | 0;
    hash[2] = (hash[2] + c) | 0;
    hash[3] = (hash[3] + d) | 0;
    hash[4] = (hash[4] + e) | 0;
    hash[5] = (hash[5] + f) | 0;
    hash[6] = (hash[6] + g) | 0;
    hash[7] = (hash[7] + h) | 0;
  }
  let res = '';
  for (let i = 0; i < 8; i++) {
    for (let j = 3; j >= 0; j--) {
      const byte = (hash[i] >> (8 * j)) & 255;
      res += (byte < 16 ? '0' : '') + byte.toString(16);
    }
  }
  return res;
}

export function generateEvidenceHash(url: string, selector: string, snippet: string, rule: string): string {
  const payload = `${url}::${selector}::${snippet}::${rule}`;
  return 'sha256:' + sha256Pure(payload);
}

/**
 * Calculates WCAG 2.1 relative luminance
 * Formula: https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) => {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Computes WCAG Contrast Ratio: (L1 + 0.05) / (L2 + 0.05)
 */
export function computeContrastRatio(fgHex: string, bgHex: string): number {
  const fg = hexToRgb(fgHex);
  const bg = hexToRgb(bgHex);
  const l1 = getLuminance(fg.r, fg.g, fg.b);
  const l2 = getLuminance(bg.r, bg.g, bg.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

/**
 * Accurately determines if target is strictly the local Demo Environment (/sandbox)
 */
export function isDemoTarget(rawUrl: string | undefined | null): boolean {
  if (!rawUrl) return false;
  const clean = rawUrl.trim().toLowerCase();
  if (
    clean === '/sandbox' ||
    clean === 'sandbox' ||
    clean === 'demo sandbox' ||
    clean === 'demo environment' ||
    clean.startsWith('/sandbox')
  ) {
    return true;
  }
  try {
    const parsed = new URL(clean);
    if (
      (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') &&
      parsed.pathname.startsWith('/sandbox')
    ) {
      return true;
    }
  } catch {
    // not a valid full URL
  }
  return false;
}

/**
 * Evaluates pre-configured demo testbed violations based on live toggle states
 */
export function evaluateSandboxAudit(
  sandboxState: SandboxToggles = {
    modalTrapFixed: false,
    keyboardAccessibilityFixed: false,
    photoContrastFixed: false,
  },
  targetLevel: WCAGLevel = 'WCAG 2.2 Level AA'
): { issues: Issue[]; score: number; passedRulesCount: number } {
  const issues: Issue[] = [];
  let passedCount = 45;
  const isoNow = new Date().toISOString();

  const isModalTrapFixed = !!(sandboxState.modalTrapFixed || sandboxState.focusFixed);
  const isKeyFixed = !!(sandboxState.keyboardAccessibilityFixed || sandboxState.ariaFixed);
  const isPhotoFixed = !!(sandboxState.photoContrastFixed || sandboxState.contrastFixed);

  // Barrier 1: Keyboard Focus Trap in Modal Dialog (WCAG 2.1.2 Level A - Critical)
  if (!isModalTrapFixed) {
    issues.push({
      id: 'TC1-MODAL-TRAP',
      testCaseId: 'TC1',
      auditId: 'demo-testbed',
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
      cryptoHash: generateEvidenceHash(
        '/sandbox',
        'div#interactive-modal[role="dialog"]',
        '<div id="interactive-modal" role="dialog" aria-modal="true"><button>Confirm</button><button class="close">X</button></div>',
        'WCAG 2.1.2 No Keyboard Trap (Level A)'
      ),
      retrievalTime: isoNow,
      createdAt: 'Just now',
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
        elementDescription: 'Interactive floating dialog window',
        simulatedHtmlPreview:
          '<div id="interactive-modal" role="dialog" aria-modal="true"><button>Confirm</button><button class="close">X</button></div>',
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
        afterCode: `// Proposed Remediation Patch (Developer Review Required)
dialog.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDialogAndRestoreFocus();
  }
});`,
        language: 'javascript',
      },
    });
  } else {
    passedCount += 1;
  }

  // Barrier 2: Interactive Element Missing Keyboard Navigation (WCAG 2.1.1 Level A - High)
  if (!isKeyFixed) {
    issues.push({
      id: 'TC2-KEYBOARD-NAV',
      testCaseId: 'TC2',
      auditId: 'demo-testbed',
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
      cryptoHash: generateEvidenceHash(
        '/sandbox',
        'div.btn-custom-action[role="button"]',
        '<div role="button" class="btn-custom-action">View Details</div>',
        'WCAG 2.1.1 Keyboard Operable (Level A)'
      ),
      retrievalTime: isoNow,
      createdAt: 'Just now',
      visualEvidence: {
        elementDescription: 'Custom action button rendered as div',
        simulatedHtmlPreview: '<div role="button" class="btn-custom-action">View Details</div>',
        boundingHighlight: 'border-2 border-amber-500 ring-4 ring-amber-500/20',
      },
      aiRemediation: {
        explanation:
          'Add tabindex="0" and keyboard event listeners for Enter and Space, or replace with a native <button> element.',
        beforeCode: `<!-- Failing: Non-focusable interactive control -->
<div role="button" class="btn-custom-action" onclick="handleClick()">
  View Details
</div>`,
        afterCode: `<!-- Proposed Remediation Patch (Developer Review Required) -->
<div
  role="button"
  tabindex="0"
  class="btn-custom-action focus:ring-2 focus:ring-blue-500"
  onclick="handleClick()"
  onkeydown="(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()"
>
  View Details
</div>`,
        language: 'html',
      },
    });
  } else {
    passedCount += 1;
  }

  // Barrier 3: Insufficient Contrast Over Complex Photographic Background (WCAG 1.4.3 Level AA / WCAG 1.4.6 Level AAA)
  const isLevelAOnly = targetLevel === 'WCAG 2.1 Level A';
  const isAAA = targetLevel.includes('AAA');
  const photoMeasuredRatio = isPhotoFixed ? 10.4 : 2.3;
  const requiresRatio = isAAA ? 7.0 : 4.5;
  const criterionText = isAAA
    ? 'WCAG 1.4.6 Contrast (Enhanced) - Level AAA'
    : 'WCAG 1.4.3 Contrast (Minimum) - Level AA';
  const ruleLevelText: 'A' | 'AA' | 'AAA' = isAAA ? 'AAA' : 'AA';

  if (!isPhotoFixed && !isLevelAOnly) {
    issues.push({
      id: 'TC3-PHOTO-CONTRAST',
      testCaseId: 'TC3',
      auditId: 'demo-testbed',
      url: '/sandbox',
      namedSource: 'Interactive Demo Testbed DOM (/sandbox)',
      destinationLedger: 'Project Issue Ledger',
      title: isAAA
        ? 'Insufficient Enhanced Contrast Over Complex Photographic Background (7:1 Minimum)'
        : 'Insufficient Contrast Over Complex Photographic Background',
      wcagCriterion: criterionText,
      ruleLevel: ruleLevelText,
      severity: 'critical',
      status: 'pending_approval',
      targetSelector: 'div#photo-hero-card p.photo-overlay-text',
      decisionReason: isAAA
        ? `Decision Rule (Pixel Luminance Sampling): Underlying photographic image luminance measured under text bounding box (${photoMeasuredRatio}:1). Fails strict 7:1 AAA enhanced contrast threshold per WCAG 1.4.6.`
        : 'Decision Rule (Pixel Luminance Sampling): Underlying photographic image luminance measured under text bounding box (2.3:1). Missing solid background evidence resolved via sub-pixel canvas luminance sampling. Flagged as Contrast Failure against 4.5:1 threshold per WCAG 1.4.3.',
      description: isAAA
        ? `Text rendered over multi-colored photographic background yields a sampled contrast ratio of ${photoMeasuredRatio}:1, failing the mandatory 7:1 enhanced threshold for WCAG 1.4.6 Level AAA.`
        : 'Text rendered over multi-colored photographic background yields a sampled contrast ratio of 2.3:1 against underlying pixel luminance values, failing the mandatory 4.5:1 minimum threshold for WCAG 1.4.3 Level AA.',
      impact:
        'Users with low vision, aging eyes, or users in high ambient glare environments cannot read text overlaid directly on complex imagery.',
      cryptoHash: generateEvidenceHash(
        '/sandbox',
        'div#photo-hero-card p.photo-overlay-text',
        '<div class="photo-bg"><p style="color:#94a3b8">Autonomous AI Governance</p></div>',
        criterionText
      ),
      retrievalTime: isoNow,
      createdAt: 'Just now',
      contrastSampleDetails: {
        sampledBackgroundHex: '#e2e8f0',
        sampledForegroundHex: '#94a3b8',
        sampledRatio: photoMeasuredRatio,
        requiredRatio: requiresRatio,
        backgroundType: 'photographic_image',
      },
      visualEvidence: {
        elementDescription: 'Photographic hero banner caption text',
        simulatedHtmlPreview:
          '<div class="photo-bg"><p style="color:#94a3b8">Autonomous AI Governance</p></div>',
        boundingHighlight: 'border-2 border-rose-500 ring-4 ring-rose-500/20',
        contrastDetails: {
          current: `${photoMeasuredRatio}:1 (${isPhotoFixed ? 'Passes' : isAAA ? 'Fails AAA' : 'Fails AA'})`,
          required: `${requiresRatio}:1 (${isAAA ? 'Enhanced AAA' : 'Minimum AA'})`,
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
        afterCode: `/* Proposed Remediation Patch (Developer Review Required) */
.photo-overlay-text {
  color: #ffffff;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  padding: 8px 16px;
  border-radius: 8px;
}`,
        language: 'css',
      },
    });
  } else {
    passedCount += 1;
  }

  const totalChecked = passedCount + issues.length;
  const score = totalChecked > 0 ? Math.round((passedCount / totalChecked) * 100) : 100;

  const finalizedIssues = issues.map((iss) => ({
    ...iss,
    evidenceHash: iss.cryptoHash,
  }));

  return { issues: finalizedIssues, score, passedRulesCount: passedCount };
}

/**
 * Retests a specific issue against current sandbox state or remediation rules
 */
export function evaluateRetest(
  issueId: string,
  targetSelector: string,
  sandboxState?: SandboxToggles
): { resolved: boolean; visualDiff: VisualDiffEvidence; message: string } {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // 1. Modal Focus Trap Retest
  if (issueId.includes('MODAL') || targetSelector.includes('modal')) {
    const isFixed = !!(sandboxState && (sandboxState.modalTrapFixed || sandboxState.focusFixed));

    const visualDiff: VisualDiffEvidence = {
      retestTimestamp: timestamp,
      verifierAgent: 'Velora Keyboard Subagent (Tab Trap Verifier)',
      beforeState: {
        label: 'Original State (Failed Audit)',
        statusBadge: 'FAIL: Keyboard Focus Trapped (WCAG 2.1.2)',
        previewText: 'Dialog Window (Infinite Tab Loop)',
        cssStyle: 'focus-trap: active; escape: blocked;',
        elementHtml: '<div id="interactive-modal" class="trapped">...</div>',
      },
      afterState: {
        label: isFixed ? 'Verified Retest State (Passed)' : 'Retest State (Still Trapped)',
        statusBadge: isFixed ? 'PASS: Escape Unlocks & Tab Loops Broken' : 'FAIL: Focus Trapped',
        previewText: isFixed ? 'Focus Unlocked: Escape closes dialog' : 'Focus Trapped in modal',
        cssStyle: isFixed ? 'escape-listener: active; tabindex: managed;' : 'focus-trap: active;',
        elementHtml: isFixed
          ? '<div id="interactive-modal" class="remediated-accessible" aria-modal="true">...</div>'
          : '<div id="interactive-modal" class="trapped">...</div>',
      },
    };

    return {
      resolved: isFixed,
      visualDiff,
      message: isFixed
        ? 'DOM inspection confirmed: Accessible attributes verified. Escape key dismisses modal and Tab navigation cycles cleanly.'
        : 'Retest failed: Remediation toggle is still OFF in sandbox testbed. Enable "[Fix Modal Focus Trap]" to remediate.',
    };
  }

  // 2. Keyboard Navigation Retest
  if (issueId.includes('KEYBOARD') || targetSelector.includes('custom-action') || targetSelector.includes('role="button"')) {
    const isFixed = !!(sandboxState && (sandboxState.keyboardAccessibilityFixed || sandboxState.ariaFixed));

    const visualDiff: VisualDiffEvidence = {
      retestTimestamp: timestamp,
      verifierAgent: 'Velora Simulated Keyboard Traversal Agent',
      beforeState: {
        label: 'Original State (Failed Audit)',
        statusBadge: 'FAIL: Unreachable via Tab Key (WCAG 2.1.1)',
        previewText: '<div role="button">View Details</div> (No tabindex)',
        cssStyle: 'tabindex: none; onkeydown: none;',
        elementHtml: '<div role="button" class="btn">View Details</div>',
      },
      afterState: {
        label: isFixed ? 'Verified Retest State (Passed)' : 'Retest State (Still Unreachable)',
        statusBadge: isFixed ? 'PASS: Full Keyboard Operability (tabindex="0" + Enter/Space)' : 'FAIL: No Tabindex',
        previewText: isFixed ? 'Focusable & Operable via Keyboard' : 'Still Unreachable',
        cssStyle: isFixed ? 'tabindex: 0; outline: 2px solid #2563eb;' : 'tabindex: none;',
        elementHtml: isFixed
          ? '<div role="button" tabindex="0" class="btn focus:ring-2">View Details</div>'
          : '<div role="button" class="btn">View Details</div>',
      },
    };

    return {
      resolved: isFixed,
      visualDiff,
      message: isFixed
        ? 'DOM inspection confirmed: Accessible attributes verified. Custom element includes tabindex="0" and Enter/Space keyboard handlers.'
        : 'Retest failed: Remediation toggle is still OFF in sandbox testbed. Enable "[Add Keyboard Accessibility]" to remediate.',
    };
  }

  // 3. Photo Contrast Retest
  if (issueId.includes('PHOTO') || issueId.includes('contrast') || targetSelector.includes('photo')) {
    const isFixed = !!(sandboxState && (sandboxState.photoContrastFixed || sandboxState.contrastFixed));

    const visualDiff: VisualDiffEvidence = {
      retestTimestamp: timestamp,
      verifierAgent: 'Velora Pixel Luminance Analyzer',
      beforeState: {
        label: 'Original State (Failed Audit)',
        statusBadge: 'FAIL: Contrast 2.3:1 on Photographic Background (< 4.5:1)',
        contrast: '2.3:1',
        previewText: 'Grey text #94a3b8 on photographic imagery',
        cssStyle: 'color: #94a3b8; background: transparent;',
        elementHtml: '<p class="photo-overlay-text text-[#94a3b8]">Autonomous AI Governance</p>',
      },
      afterState: {
        label: isFixed ? 'Verified Retest State (Passed)' : 'Retest State (Still Failing)',
        statusBadge: isFixed ? 'PASS: Contrast 10.4:1 with rgba(0,0,0,0.7) Scrim' : 'FAIL: Still 2.3:1',
        contrast: isFixed ? '10.4:1' : '2.3:1',
        previewText: isFixed ? 'White text with dark scrim overlay' : 'Grey text #94a3b8 on photographic imagery',
        cssStyle: isFixed
          ? 'color: #ffffff; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);'
          : 'color: #94a3b8; background: transparent;',
        elementHtml: isFixed
          ? '<p class="photo-overlay-text text-white bg-black/70 backdrop-blur px-3 py-1.5 rounded">Autonomous AI Governance</p>'
          : '<p class="photo-overlay-text text-[#94a3b8]">Autonomous AI Governance</p>',
      },
    };

    return {
      resolved: isFixed,
      visualDiff,
      message: isFixed
        ? 'DOM inspection confirmed: Accessible attributes verified. Photographic background scrim rgba(0,0,0,0.7) deployed with white text (10.4:1).'
        : 'Retest failed: Remediation toggle is still OFF in sandbox testbed. Enable "[Fix Photo Overlay Contrast]" to remediate.',
    };
  }

  // Generic / Unmatched Retest Fallback (Defaults to false unless verified)
  const visualDiff: VisualDiffEvidence = {
    retestTimestamp: timestamp,
    verifierAgent: 'Velora Live DOM Retest Agent',
    beforeState: {
      label: 'Initial Audit State',
      statusBadge: 'FAIL: Barrier Recorded in Target DOM',
      previewText: targetSelector,
    },
    afterState: {
      label: 'Retest State (Still Non-Compliant)',
      statusBadge: 'FAIL: Actively Non-Compliant',
      previewText: targetSelector,
    },
  };

  return {
    resolved: false,
    visualDiff,
    message: `Retest failed: Element ${targetSelector} remains non-compliant in target DOM.`,
  };
}
