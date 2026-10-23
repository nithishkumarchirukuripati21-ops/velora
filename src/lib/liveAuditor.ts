import * as cheerio from 'cheerio';
import crypto from 'crypto';
import dns from 'dns';
import { promisify } from 'util';
import { Issue, AgentLogMessage, WCAGLevel, CategoryBreakdown } from '@/types/audit';

const lookup = promisify(dns.lookup);

export interface LiveAuditResult {
  url: string;
  domain: string;
  pageTitle: string;
  statusCode: number;
  byteSize: number;
  score: number;
  passedRulesCount: number;
  issues: Issue[];
  logs: AgentLogMessage[];
  breakdown: CategoryBreakdown;
  domStats: {
    totalNodes: number;
    headings: { h1: number; h2: number; h3: number };
    images: number;
    formControls: number;
  };
}

/**
 * Generates a mathematically deterministic 64-character SHA-256 evidence hash
 */
export function generateEvidenceHash(url: string, selector: string, snippet: string, rule: string): string {
  const payload = `${url}::${selector}::${snippet}::${rule}`;
  return 'sha256:' + crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Hardened SSRF Target Validator with DNS resolution and private network blocking.
 */
export async function validatePublicTarget(rawUrl: string): Promise<{ valid: boolean; error?: string; parsedUrl?: URL }> {
  try {
    let urlString = rawUrl.trim();
    if (!urlString) {
      return { valid: false, error: 'URL cannot be empty.' };
    }
    if (!/^https?:\/\//i.test(urlString)) {
      urlString = 'https://' + urlString;
    }
    const parsed = new URL(urlString);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, error: 'Invalid protocol: Only HTTP and HTTPS are permitted.' };
    }

    const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname === '0.0.0.0') {
      return { valid: false, error: 'Security Restriction: Requests to localhost or loopback addresses are prohibited.' };
    }

    const { address } = await lookup(hostname);
    if (
      address.startsWith('10.') ||
      address.startsWith('127.') ||
      address.startsWith('192.168.') ||
      address.startsWith('169.254.') ||
      address === '::1' ||
      address === '0.0.0.0' ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(address)
    ) {
      return { valid: false, error: 'Security Restriction: Destination resolves to a restricted private or link-local IP address (SSRF prevention).' };
    }

    return { valid: true, parsedUrl: parsed };
  } catch {
    return { valid: false, error: 'DNS Resolution Failure: Unable to resolve hostname.' };
  }
}

/**
 * Backward compatibility wrapper
 */
export async function isPermittedUrl(rawUrl: string): Promise<{ valid: boolean; reason?: string }> {
  const result = await validatePublicTarget(rawUrl);
  return { valid: result.valid, reason: result.error };
}

export type LiveAuditOutcome =
  | ({ success: true } & LiveAuditResult)
  | { success: false; error: string; statusCode?: number; logs: AgentLogMessage[] };

/**
 * Normalizes input URL to include https:// if missing
 */
export function normalizeTargetUrl(rawUrl: string): string {
  let trimmed = rawUrl.trim();
  if (!trimmed) return 'https://example.com';
  if (trimmed.startsWith('/') || trimmed.startsWith('localhost')) return trimmed;
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }
  return trimmed;
}

/**
 * Performs a real HTTP fetch and live DOM accessibility audit on a public website
 */
export async function auditLiveWebsite(
  rawUrl: string,
  targetLevel: WCAGLevel = 'WCAG 2.2 Level AA'
): Promise<LiveAuditOutcome> {
  const targetUrl = normalizeTargetUrl(rawUrl);

  const logs: AgentLogMessage[] = [];
  const addLog = (phase: number, text: string, type: AgentLogMessage['type'] = 'info') => {
    logs.push({
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      phase,
      text,
      type,
    });
  };

  // SSRF Validation Gate
  const urlCheck = await isPermittedUrl(targetUrl);
  if (!urlCheck.valid) {
    const errorMsg = urlCheck.reason || 'Security policy restriction: Requests to private, loopback, or cloud-metadata network addresses are prohibited (SSRF prevention).';
    addLog(1, `[Security Block] ${errorMsg}`, 'warn');
    return {
      success: false,
      error: errorMsg,
      statusCode: 400,
      logs,
    };
  }

  let domain = 'example.com';
  try {
    domain = new URL(targetUrl).hostname;
  } catch {
    domain = targetUrl;
  }

  addLog(1, `Target configured: ${targetUrl} [${targetLevel}]`, 'info');
  addLog(1, `Resolving DNS and establishing secure TLS connection to ${domain}...`, 'info');

  let html = '';
  let statusCode = 200;
  let byteSize = 0;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(targetUrl, {
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
      redirect: 'error',
    });

    clearTimeout(timeout);
    statusCode = res.status;

    if (!res.ok) {
      addLog(2, `Target returned HTTP status ${res.status}. Halting audit.`, 'warn');
      return {
        success: false,
        error: 'Network Retrieval Failure: Unable to fetch target URL. Verify the host is publicly reachable.',
        statusCode: res.status,
        logs,
      };
    }

    html = await res.text();
    byteSize = Buffer.byteLength(html, 'utf8');

    addLog(2, `HTTP Response received: Status ${statusCode} (${Math.round(byteSize / 1024)} KB payload)`, 'action');
  } catch (err: unknown) {
    const error = err as Error;
    addLog(2, `Network Retrieval Failure: ${error.message}`, 'warn');
    return {
      success: false,
      error: 'Network Retrieval Failure: Unable to fetch target URL. Verify the host is publicly reachable.',
      logs,
    };
  }

  addLog(2, `Decomposing live document tree against WCAG 2.1 / 2.2 Level AA rule matrix...`, 'action');
  addLog(3, `[Agent] Loading parsed DOM tree into server inspection runtime...`, 'info');

  const $ = cheerio.load(html);
  const pageTitle = $('title').first().text().trim() || `${domain} - Home`;
  const totalNodes = $('*').length;
  const h1Count = $('h1').length;
  const h2Count = $('h2').length;
  const h3Count = $('h3').length;
  const allImages = $('img');
  const formInputs = $('input, select, textarea').not('[type="hidden"], [type="submit"], [type="reset"], [type="button"]');
  const domStats = {
    totalNodes: totalNodes, // Real parsed DOM node count (No artificial padding)
    headings: { h1: h1Count, h2: h2Count, h3: h3Count },
    images: allImages.length,
    formControls: formInputs.length,
  };
  const isoNow = new Date().toISOString();

  addLog(3, `[Agent] Document title resolved: "${pageTitle.slice(0, 50)}${pageTitle.length > 50 ? '...' : ''}"`, 'info');

  const issues: Issue[] = [];
  let passedRulesCount = 0; // Calculated from actual checks evaluated against the DOM

  // 1. WCAG 1.1.1: Images Missing Alt Attributes (alt="" is valid decorative markup under WCAG 1.1.1)
  const brokenImages = $('img:not([alt])');
  let missingAltCount = 0;
  const seenSelectors = new Set<string>();

  brokenImages.each((idx, el) => {
    missingAltCount++;
    if (issues.filter((i) => i.wcagCriterion.includes('1.1.1')).length < 8) {
      const src = $(el).attr('src') || $(el).attr('data-src') || '';
      const idAttr = $(el).attr('id');
      const nameAttr = $(el).attr('name');
      const classAttr = $(el).attr('class');

      let selector = 'img';
      if (idAttr) {
        selector = `img#${idAttr}`;
      } else if (nameAttr) {
        selector = `img[name="${nameAttr}"]`;
      } else if (src) {
        selector = `img[src="${src}"]`;
      } else if (classAttr) {
        selector = `img.${classAttr.trim().split(/\s+/)[0]}`;
      } else {
        selector = `img:nth-of-type(${idx + 1})`;
      }

      if (seenSelectors.has(selector)) {
        selector = `${selector}:nth-of-type(${idx + 1})`;
      }
      seenSelectors.add(selector);

      const outerHtml = $.html(el);
      const snippet = outerHtml.length > 200 ? outerHtml.slice(0, 197) + '...' : outerHtml;

      issues.push({
        id: `REAL-IMG-ALT-${idx + 1}`,
        auditId: 'live-web',
        url: targetUrl,
        namedSource: `Live Website DOM (${domain})`,
        destinationLedger: 'Project Issue Ledger',
        title: `Image Missing Alternative Text: ${selector}`,
        wcagCriterion: 'WCAG 1.1.1 Non-text Content - Level A',
        ruleLevel: 'A',
        severity: 'critical',
        status: 'pending_approval',
        targetSelector: selector,
        decisionReason: `Decision Rule: <img> element lacks 'alt' attribute (${selector}). Screen readers cannot perceive graphic; flagged as Level A violation.`,
        description: `The image element lacks an 'alt' attribute (${selector}). Screen readers cannot convey its purpose or content.`,
        impact: 'Screen reader users cannot perceive or understand the content conveyed by this graphical element.',
        retrievalTime: isoNow,
        createdAt: 'Just now',
        cryptoHash: generateEvidenceHash(targetUrl, selector, snippet, 'WCAG 1.1.1 Non-text Content - Level A'),
        visualEvidence: {
          elementDescription: `Image element on ${domain}`,
          simulatedHtmlPreview: snippet,
          boundingHighlight: 'border-2 border-rose-500 ring-4 ring-rose-500/20',
        },
        aiRemediation: {
          explanation:
            'Add an informative alt attribute describing the image content. For non-interactive decorative icons, specify alt="" or role="presentation".',
          beforeCode: snippet,
          afterCode: snippet.replace(/<img/i, '<img alt="Descriptive label of image"'),
          language: 'html',
        },
      });
    }
  });

  if (missingAltCount > 0) {
    addLog(3, `[Agent] Flagged ${missingAltCount} image(s) lacking alt text (WCAG 1.1.1 Level A)`, 'warn');
  } else {
    passedRulesCount += 3;
    addLog(3, `[Agent] Verified all ${allImages.length} images have accessible alt attributes`, 'info');
  }

  // 2. WCAG 1.3.1 & 4.1.2: Form Controls Missing Labels
  const formControls = $('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), select, textarea');
  let missingLabelCount = 0;

  formControls.each((idx, el) => {
    const id = $(el).attr('id');
    const name = $(el).attr('name');
    const tag = el.tagName.toLowerCase();
    const type = $(el).attr('type') || (tag === 'select' ? 'select' : tag === 'textarea' ? 'textarea' : 'text');
    const ariaLabel = $(el).attr('aria-label');
    const ariaLabelledby = $(el).attr('aria-labelledby');
    const title = $(el).attr('title');
    const parentLabel = $(el).closest('label');

    const hasForLabel = id ? $(`label[for="${id}"]`).length > 0 : false;
    const hasAria = !!(ariaLabel && ariaLabel.trim().length > 0);
    const hasAriaLabelledby = !!(ariaLabelledby && $(`#${ariaLabelledby}`).length > 0);
    const hasTitle = !!(title && title.trim().length > 0);
    const hasParentLabel = parentLabel.length > 0;

    if (!hasForLabel && !hasAria && !hasAriaLabelledby && !hasTitle && !hasParentLabel) {
      missingLabelCount++;
      if (issues.filter((i) => i.wcagCriterion.includes('1.3.1')).length < 4) {
        let selector = tag;
        if (id) {
          selector = `${tag}#${id}`;
        } else if (name) {
          selector = `${tag}[name="${name}"]`;
        } else {
          selector = `${tag}:nth-of-type(${idx + 1})`;
        }

        const outerHtml = $.html(el);
        const snippet = outerHtml.length > 200 ? outerHtml.slice(0, 197) + '...' : outerHtml;

        issues.push({
          id: `REAL-FORM-LABEL-${idx + 1}`,
          auditId: 'live-web',
          url: targetUrl,
          namedSource: `Live Website DOM (${domain})`,
          destinationLedger: 'Project Issue Ledger',
          title: `Form Control Missing Accessible Label: ${selector}`,
          wcagCriterion: 'WCAG 1.3.1 Info and Relationships & 4.1.2 Name, Role, Value - Level A',
          ruleLevel: 'A',
          severity: 'serious',
          status: 'pending_approval',
          targetSelector: selector,
          decisionReason: `Decision Rule: Form control <${tag}> lacks programmatic label association (no label[for], aria-label, aria-labelledby, or title attribute). Flagged as Level A violation.`,
          description: `Form control <${tag}${name ? ` name="${name}"` : ''}> has no associated <label>, aria-label, or title attribute.`,
          impact: 'Assistive technology users cannot determine what input or format is expected in this control.',
          retrievalTime: isoNow,
          createdAt: 'Just now',
          cryptoHash: generateEvidenceHash(targetUrl, selector, snippet, 'WCAG 1.3.1 Info and Relationships & 4.1.2 Name, Role, Value - Level A'),
          visualEvidence: {
            elementDescription: `Unlabeled ${type} control on ${domain}`,
            simulatedHtmlPreview: snippet,
            boundingHighlight: 'border-2 border-amber-500 ring-4 ring-amber-500/20',
          },
          aiRemediation: {
            explanation:
              'Pair the input with a programmatic <label for="..."> element matching the input id, or attach an explicit aria-label.',
            beforeCode: snippet,
            afterCode: `<label for="${id || name || 'field'}">Field Description</label>\n` + snippet,
            language: 'html',
          },
        });
      }
    }
  });

  if (missingLabelCount > 0) {
    addLog(3, `[Agent] Detected ${missingLabelCount} form control(s) missing accessible labels (WCAG 1.3.1)`, 'warn');
  } else {
    passedRulesCount += 2;
  }

  // 3. WCAG 4.1.2: Empty / Non-descriptive Interactive Links & Buttons
  const interactiveControls = $('a[href], button');
  let emptyControlCount = 0;

  interactiveControls.each((idx, el) => {
    const text = $(el).text().trim();
    const ariaLabel = $(el).attr('aria-label');
    const ariaLabelledby = $(el).attr('aria-labelledby');
    const title = $(el).attr('title');
    const hasAltImg = $(el).find('img[alt]').filter((_, im) => !!$(im).attr('alt')?.trim()).length > 0;
    const hasAriaSvg = $(el).find('svg[aria-label], svg[role="img"]').length > 0;

    const hasAccessibleName =
      text.length > 0 ||
      !!(ariaLabel && ariaLabel.trim().length > 0) ||
      !!ariaLabelledby ||
      !!(title && title.trim().length > 0) ||
      hasAltImg ||
      hasAriaSvg;

    if (!hasAccessibleName) {
      emptyControlCount++;
      if (issues.filter((i) => i.wcagCriterion.includes('4.1.2') && i.id.startsWith('REAL-EMPTY')).length < 2) {
        const tag = el.tagName.toLowerCase();
        const href = $(el).attr('href');
        const id = $(el).attr('id');
        const className = $(el).attr('class');

        let selector = tag;
        if (id) {
          selector = `${tag}#${id}`;
        } else if (href) {
          selector = `${tag}[href="${href.slice(0, 40)}"]`;
        } else if (className) {
          selector = `${tag}.${className.trim().split(/\s+/)[0]}`;
        } else {
          selector = `${tag}:nth-of-type(${idx + 1})`;
        }

        const outerHtml = $.html(el);
        const snippet = outerHtml.length > 200 ? outerHtml.slice(0, 197) + '...' : outerHtml;

        issues.push({
          id: `REAL-EMPTY-CTRL-${idx + 1}`,
          auditId: 'live-web',
          url: targetUrl,
          namedSource: `Live Website DOM (${domain})`,
          destinationLedger: 'Project Issue Ledger',
          title: `Interactive ${tag.toUpperCase()} Missing Accessible Name: ${selector}`,
          wcagCriterion: 'WCAG 4.1.2 Name, Role, Value - Level A',
          ruleLevel: 'A',
          severity: 'serious',
          status: 'pending_approval',
          targetSelector: selector,
          decisionReason: `Decision Rule: Interactive element <${tag}> lacks text content, aria-label, aria-labelledby, and embedded labeled icon. Flagged as Name, Role, Value violation.`,
          description: `Interactive <${tag}> contains no inner text, aria-label, or title, causing screen readers to announce it as an unlabeled control.`,
          impact: 'Keyboard and screen reader users cannot discern what clicking this control will do.',
          retrievalTime: isoNow,
          createdAt: 'Just now',
          cryptoHash: generateEvidenceHash(targetUrl, selector, snippet, 'WCAG 4.1.2 Name, Role, Value - Level A'),
          visualEvidence: {
            elementDescription: `Unlabeled ${tag} control on ${domain}`,
            simulatedHtmlPreview: snippet,
            boundingHighlight: 'border-2 border-amber-500 ring-4 ring-amber-500/20',
          },
          aiRemediation: {
            explanation: `Provide an accessible name using inner text or an aria-label attribute.`,
            beforeCode: snippet,
            afterCode: snippet.replace(new RegExp(`<${tag}`, 'i'), `<${tag} aria-label="Action description"`),
            language: 'html',
          },
        });
      }
    }
  });

  if (emptyControlCount > 0) {
    addLog(3, `[Agent] Found ${emptyControlCount} interactive link/button(s) without accessible names (WCAG 4.1.2)`, 'warn');
  } else {
    passedRulesCount += 2;
  }

  // 4. WCAG 3.1.1: Document Language Missing
  const htmlLang = $('html[lang]').attr('lang') || $('html').attr('lang');
  if ($('html[lang]').length === 0 || !htmlLang || htmlLang.trim().length === 0) {
    issues.push({
      id: 'REAL-LANG-MISSING',
      auditId: 'live-web',
      url: targetUrl,
      namedSource: `Live Website DOM (${domain})`,
      destinationLedger: 'Project Issue Ledger',
      title: 'Document Root Missing Language Attribute (WCAG 3.1.1)',
      wcagCriterion: 'WCAG 3.1.1 Language of Page - Level A',
      ruleLevel: 'A',
      severity: 'moderate',
      status: 'pending_approval',
      targetSelector: 'html',
      decisionReason: `Decision Rule: Root <html> element missing 'lang' attribute; screen readers cannot determine language of document.`,
      description: `The <html> element does not specify a 'lang' attribute. Assistive technologies cannot accurately select speech synthesizer pronunciation rules.`,
      impact: 'Screen readers may pronounce content using an incorrect speech synthesis voice or dialect.',
      retrievalTime: isoNow,
      createdAt: 'Just now',
      cryptoHash: generateEvidenceHash(targetUrl, 'html', '<html>', 'WCAG 3.1.1 Language of Page - Level A'),
      visualEvidence: {
        elementDescription: 'Root HTML document tag',
        simulatedHtmlPreview: '<html>',
        boundingHighlight: 'border-2 border-yellow-500 ring-4 ring-yellow-500/20',
      },
      aiRemediation: {
        explanation: 'Add a valid BCP 47 language tag to the root <html> tag (e.g. lang="en").',
        beforeCode: '<html>',
        afterCode: '<html lang="en">',
        language: 'html',
      },
    });
    addLog(3, `[Agent] <html> tag lacks 'lang' attribute (WCAG 3.1.1 Level A)`, 'warn');
  } else {
    passedRulesCount += 2;
    addLog(3, `[Agent] Document language declared as lang="${htmlLang}" (WCAG 3.1.1 Passed)`, 'info');
  }

  // 5. WCAG 2.4.2: Page Title Check
  const titleTag = $('head title');
  if (titleTag.length === 0 || titleTag.text().trim().length === 0) {
    issues.push({
      id: 'REAL-TITLE-MISSING',
      auditId: 'live-web',
      url: targetUrl,
      namedSource: `Live Website DOM (${domain})`,
      destinationLedger: 'Project Issue Ledger',
      title: 'Web Page Missing Descriptive <title> Tag (WCAG 2.4.2)',
      wcagCriterion: 'WCAG 2.4.2 Page Titled - Level A',
      ruleLevel: 'A',
      severity: 'serious',
      status: 'pending_approval',
      targetSelector: 'head title',
      decisionReason: `Decision Rule: Document head contains empty or missing <title> element; violates Level A Page Titled criterion.`,
      description: `The document head lacks a descriptive <title> tag. Users cannot readily orient themselves across browser tabs or history.`,
      impact: 'Users with cognitive impairments and screen reader users cannot quickly identify the current document context.',
      retrievalTime: isoNow,
      createdAt: 'Just now',
      cryptoHash: generateEvidenceHash(targetUrl, 'head title', '<head></head>', 'WCAG 2.4.2 Page Titled - Level A'),
      visualEvidence: {
        elementDescription: 'HTML Head tag title',
        simulatedHtmlPreview: '<head></head>',
        boundingHighlight: 'border-2 border-rose-500 ring-4 ring-rose-500/20',
      },
      aiRemediation: {
        explanation: 'Insert an informative <title> tag inside the <head> element.',
        beforeCode: '<head></head>',
        afterCode: `<head>\n  <title>${domain} - Official Portal</title>\n</head>`,
        language: 'html',
      },
    });
    addLog(3, `[Agent] Document head missing <title> tag (WCAG 2.4.2 Level A)`, 'warn');
  } else {
    passedRulesCount += 2;
  }

  // 6. WCAG 1.3.1: H1 Heading Check (Best Practice Advisory)
  if (h1Count === 0) {
    issues.push({
      id: 'REAL-H1-MISSING',
      auditId: 'live-web',
      url: targetUrl,
      namedSource: `Live Website DOM (${domain})`,
      destinationLedger: 'Project Issue Ledger',
      title: 'Document Lacks Primary <h1> Landmark Heading (Best Practice Advisory)',
      wcagCriterion: 'WCAG 1.3.1 Info and Relationships - Level A',
      ruleLevel: 'A',
      severity: 'moderate',
      issueType: 'Best Practice Advisory (WCAG 1.3.1 Structure)',
      status: 'pending_approval',
      targetSelector: 'main, body',
      decisionReason: `Decision Rule: Page DOM tree missing primary <h1> landmark; classified as Type: Best Practice Advisory (WCAG 1.3.1 Structure) rather than critical WCAG failure.`,
      description: `The document does not contain an <h1> heading to define the main topic or purpose of the page.`,
      impact: 'Screen reader users navigating by heading landmarks cannot find the primary topic of the page.',
      retrievalTime: isoNow,
      createdAt: 'Just now',
      cryptoHash: generateEvidenceHash(targetUrl, 'main, body', '<main><!-- No h1 found --></main>', 'WCAG 1.3.1 Info and Relationships - Level A'),
      visualEvidence: {
        elementDescription: 'Heading hierarchy inspection',
        simulatedHtmlPreview: '<main><!-- No h1 found --></main>',
        boundingHighlight: 'border-2 border-yellow-500 ring-4 ring-yellow-500/20',
      },
      aiRemediation: {
        explanation: 'Add a single, descriptive <h1> element representing the page topic.',
        beforeCode: '<main>\n  <h2>Section Title</h2>\n</main>',
        afterCode: `<main>\n  <h1>${pageTitle}</h1>\n  <h2>Section Title</h2>\n</main>`,
        language: 'html',
      },
    });
  } else {
    passedRulesCount += 2;
  }

  // Additional Real DOM Conformance Checks
  const viewportMeta = $('meta[name="viewport"]').attr('content') || '';
  const isLevelA = targetLevel === 'WCAG 2.1 Level A';
  const isLevelAAA = targetLevel.includes('AAA');
  const allowsResize = !viewportMeta.includes('user-scalable=no') && !viewportMeta.includes('maximum-scale=1.0');

  if (allowsResize) {
    passedRulesCount += 1; // WCAG 1.4.4 Resize text
  } else if (!isLevelA) {
    // Under Level AA and AAA, blocking pinch-to-zoom is a Level AA failure
    issues.push({
      id: 'REAL-VIEWPORT-ZOOM',
      auditId: 'live-web',
      url: targetUrl,
      namedSource: `Live Website DOM (${domain})`,
      destinationLedger: 'Project Issue Ledger',
      title: 'Viewport Meta Tag Disables User Pinch-to-Zoom (WCAG 1.4.4 Level AA)',
      wcagCriterion: 'WCAG 1.4.4 Resize Text - Level AA',
      ruleLevel: 'AA',
      severity: 'serious',
      status: 'pending_approval',
      targetSelector: 'meta[name="viewport"]',
      decisionReason: `Decision Rule: Viewport meta tag contains user-scalable=no or maximum-scale=1.0, preventing users with low vision from resizing content up to 200%. Flagged as Level AA failure.`,
      description: `The viewport configuration blocks user zoom capabilities. Assistive magnification and browser zoom cannot enlarge text to 200%.`,
      impact: 'Partially sighted users cannot enlarge interface text or imagery on mobile viewports.',
      retrievalTime: isoNow,
      createdAt: 'Just now',
      cryptoHash: generateEvidenceHash(targetUrl, 'meta[name="viewport"]', viewportMeta, 'WCAG 1.4.4 Resize Text - Level AA'),
      visualEvidence: {
        elementDescription: 'HTML Viewport Meta Configuration',
        simulatedHtmlPreview: `<meta name="viewport" content="${viewportMeta}">`,
        boundingHighlight: 'border-2 border-rose-500 ring-4 ring-rose-500/20',
      },
      aiRemediation: {
        explanation: 'Remove user-scalable=no and allow viewport scaling up to at least 2.0 (200%).',
        beforeCode: `<meta name="viewport" content="${viewportMeta}">`,
        afterCode: '<meta name="viewport" content="width=device-width, initial-scale=1">',
        language: 'html',
      },
    });
    addLog(3, `[Agent] Detected viewport zoom restriction: user-scalable=no (WCAG 1.4.4 Level AA)`, 'warn');
  }

  if ($('main, [role="main"]').length > 0) {
    passedRulesCount += 1; // WCAG 2.4.1 Bypass Blocks (Main landmark)
  }

  if ($('nav, [role="navigation"]').length > 0) {
    passedRulesCount += 1; // WCAG 1.3.1 Landmark structure (Nav)
  }

  if ($('header, [role="banner"]').length > 0) {
    passedRulesCount += 1; // WCAG 1.3.1 Landmark structure (Header)
  }

  if ($('footer, [role="contentinfo"]').length > 0) {
    passedRulesCount += 1; // WCAG 1.3.1 Landmark structure (Footer)
  }

  // Filter issues strictly by selected targetLevel (Level A, Level AA, Level AAA)
  const filteredIssues = issues.filter((issue) => {
    if (isLevelA) return issue.ruleLevel === 'A';
    if (isLevelAAA) return issue.ruleLevel === 'A' || issue.ruleLevel === 'AA' || issue.ruleLevel === 'AAA';
    // Default Level AA:
    return issue.ruleLevel === 'A' || issue.ruleLevel === 'AA';
  }).map((iss) => {
    const hash =
      iss.cryptoHash ||
      generateEvidenceHash(
        targetUrl,
        iss.targetSelector,
        iss.visualEvidence?.simulatedHtmlPreview || '',
        iss.wcagCriterion
      );
    return {
      ...iss,
      cryptoHash: hash,
      evidenceHash: hash,
    };
  });

  // Calculate compliance score strictly from real tested results
  const testedCount = passedRulesCount + filteredIssues.length;
  const complianceScore = testedCount > 0 ? Math.round((passedRulesCount / testedCount) * 100) : 100;
  const score = complianceScore;

  addLog(
    4,
    `Audit Complete: Analyzed live DOM of ${domain} against ${targetLevel}. Found ${filteredIssues.length} candidate barrier(s), verified ${passedRulesCount} passing checkpoints. Score: ${score}/100.`,
    'success'
  );

  return {
    success: true,
    url: targetUrl,
    domain,
    pageTitle,
    statusCode,
    byteSize,
    score,
    passedRulesCount,
    issues: filteredIssues,
    logs,
    breakdown: {
      colorContrast: 'Manual / Testbed Required',
      keyboardOperability: 'Manual / Testbed Required',
      ariaSemantics: `${complianceScore}%`,
    },
    domStats,
  };
}
