import { NextRequest, NextResponse } from 'next/server';
import { evaluateRetest, isDemoTarget } from '@/lib/wcagEngine';
import { validatePublicTarget } from '@/lib/liveAuditor';
import { RetestApiRequest, RetestApiResponse, VisualDiffEvidence } from '@/types/audit';
import * as cheerio from 'cheerio';

export async function POST(req: NextRequest) {
  try {
    let body: Partial<RetestApiRequest> = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }
    const { issueId, targetSelector, sandboxState } = body;
    const targetUrl = (body as { url?: string }).url;

    if (!issueId || !targetSelector) {
      return NextResponse.json(
        { error: 'issueId and targetSelector are required' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Determine if this is a live URL retest
    const isLiveUrl = !!(
      (targetUrl && !isDemoTarget(targetUrl)) ||
      issueId.startsWith('REAL-') ||
      (targetUrl && /^https?:\/\//i.test(targetUrl))
    );

    // Case 1: Handle Live Web Issue Retest
    if (isLiveUrl) {
      if (targetUrl) {
        const validation = await validatePublicTarget(targetUrl);
        if (!validation.valid) {
          return NextResponse.json(
            {
              error: 'Security Policy Restriction',
              message:
                validation.error ||
                'Security policy restriction: Requests to private, loopback, or cloud-metadata network addresses are prohibited (SSRF prevention).',
            },
            { status: 400 }
          );
        }
      }

      let domain = 'remote host';
      try {
        if (targetUrl && /^https?:\/\//i.test(targetUrl)) {
          domain = new URL(targetUrl).hostname;
        }
      } catch {
        domain = targetUrl || 'remote host';
      }

      let html = '';
      if (targetUrl) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 8000);
          const res = await fetch(targetUrl, {
            headers: {
              Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.9',
            },
            signal: controller.signal,
            redirect: 'error',
          });
          clearTimeout(timeout);

          if (!res.ok) {
            return NextResponse.json({
              success: true,
              issueId,
              resolved: false,
              message: `Retest Failed: Remote server at ${domain} returned HTTP ${res.status}.`,
            } as RetestApiResponse);
          }
          html = await res.text();
        } catch (fetchErr: unknown) {
          const error = fetchErr as Error;
          return NextResponse.json({
            success: true,
            issueId,
            resolved: false,
            message: `Retest Failed: Unable to fetch live DOM from ${domain} (${error.message}).`,
          } as RetestApiResponse);
        }
      }

      const $ = cheerio.load(html);

      // 1. WCAG 1.1.1 (Image Alt)
      if (issueId.includes('IMG-ALT') || targetSelector.startsWith('img')) {
        const targetEl = $(targetSelector);
        if (targetEl.length === 0) {
          return NextResponse.json({
            success: true,
            issueId,
            resolved: false,
            message: `Retest Failed: Target element (${targetSelector}) not found in live DOM.`,
          } as RetestApiResponse);
        }
        const alt = targetEl.attr('alt');
        const isResolved = typeof alt !== 'undefined';
        const message = isResolved
          ? `Verified: Element ${targetSelector} specifies accessible alt attribute (${alt === '' ? 'marked decorative alt=""' : `alt="${alt}"`}).`
          : `Retest Failed: Element ${targetSelector} is still missing an alt attribute in live DOM on ${domain}.`;

        return NextResponse.json({
          success: true,
          issueId,
          resolved: isResolved,
          state: isResolved ? 'resolved' : 'failed',
          message,
          visualDiff: {
            retestTimestamp: timestamp,
            verifierAgent: 'Velora Live DOM Retest Agent',
            beforeState: {
              label: 'Initial Audit State',
              statusBadge: 'FAIL: Missing Alt Attribute',
              previewText: targetSelector,
            },
            afterState: {
              label: isResolved ? 'Remediated State' : 'Still Non-Compliant',
              statusBadge: isResolved ? (alt === '' ? 'PASS: alt="" decorative verified' : `PASS: alt="${alt}" verified`) : 'FAIL: Missing Alt Attribute',
              previewText: targetSelector,
            },
          },
        } as RetestApiResponse);
      }

      // 2. WCAG 1.3.1 / 4.1.2 (Form Label)
      if (issueId.includes('FORM-LABEL') || targetSelector.match(/^(input|select|textarea)/i)) {
        const targetEl = $(targetSelector);
        if (targetEl.length === 0) {
          return NextResponse.json({
            success: true,
            issueId,
            resolved: false,
            message: `Retest Failed: Target form control (${targetSelector}) not found in live DOM.`,
          } as RetestApiResponse);
        }
        const id = targetEl.attr('id');
        const ariaLabel = targetEl.attr('aria-label');
        const ariaLabelledby = targetEl.attr('aria-labelledby');
        const title = targetEl.attr('title');
        const hasForLabel = id ? $(`label[for="${id}"]`).length > 0 : false;
        const hasParentLabel = targetEl.closest('label').length > 0;
        const hasAria = !!(ariaLabel && ariaLabel.trim().length > 0);
        const hasAriaLabelledby = !!(ariaLabelledby && $(`#${ariaLabelledby}`).length > 0);
        const hasTitle = !!(title && title.trim().length > 0);

        const isResolved = hasForLabel || hasParentLabel || hasAria || hasAriaLabelledby || hasTitle;
        const message = isResolved
          ? `Verified: Form control (${targetSelector}) has valid programmatic label/ARIA in live DOM.`
          : `Retest Failed: Form control (${targetSelector}) still lacks programmatic label on ${domain}.`;

        return NextResponse.json({
          success: true,
          issueId,
          resolved: isResolved,
          state: isResolved ? 'resolved' : 'failed',
          message,
          visualDiff: {
            retestTimestamp: timestamp,
            verifierAgent: 'Velora Live DOM Retest Agent',
            beforeState: {
              label: 'Initial Audit State',
              statusBadge: 'FAIL: Missing Accessible Label',
              previewText: targetSelector,
            },
            afterState: {
              label: isResolved ? 'Remediated State' : 'Still Non-Compliant',
              statusBadge: isResolved ? 'PASS: Programmatic Label Verified' : 'FAIL: Missing Label',
              previewText: targetSelector,
            },
          },
        } as RetestApiResponse);
      }

      // 3. WCAG 1.3.1 (H1 Landmark)
      if (issueId.includes('H1-MISSING') || targetSelector.includes('h1')) {
        const hasH1 = $('h1').length > 0;
        const message = hasH1
          ? `Verified: Document contains primary <h1> landmark ("${$('h1').first().text().trim().slice(0, 40)}...").`
          : `Retest Failed: Document still lacks an <h1> heading in live DOM on ${domain}.`;

        return NextResponse.json({
          success: true,
          issueId,
          resolved: hasH1,
          state: hasH1 ? 'resolved' : 'failed',
          message,
          visualDiff: {
            retestTimestamp: timestamp,
            verifierAgent: 'Velora Live DOM Retest Agent',
            beforeState: {
              label: 'Initial Audit State',
              statusBadge: 'FAIL: No H1 Heading Landmark',
              previewText: 'main, body',
            },
            afterState: {
              label: hasH1 ? 'Remediated State' : 'Still Non-Compliant',
              statusBadge: hasH1 ? 'PASS: <h1> Landmark Verified' : 'FAIL: Missing H1',
              previewText: 'h1',
            },
          },
        } as RetestApiResponse);
      }

      // 4. WCAG 3.1.1 (Language of Page)
      if (issueId.includes('LANG') || targetSelector.includes('html')) {
        const lang = $('html').attr('lang') || $('html[lang]').attr('lang');
        const isResolved = !!(lang && lang.trim().length > 0);
        const message = isResolved
          ? `Verified: Document specifies valid language attribute (lang="${lang}").`
          : `Retest Failed: <html> element still lacks lang attribute in live DOM on ${domain}.`;

        return NextResponse.json({
          success: true,
          issueId,
          resolved: isResolved,
          state: isResolved ? 'resolved' : 'failed',
          message,
          visualDiff: {
            retestTimestamp: timestamp,
            verifierAgent: 'Velora Live DOM Retest Agent',
            beforeState: {
              label: 'Initial Audit State',
              statusBadge: 'FAIL: Missing html[lang]',
              previewText: '<html>',
            },
            afterState: {
              label: isResolved ? 'Remediated State' : 'Still Non-Compliant',
              statusBadge: isResolved ? `PASS: lang="${lang}" Verified` : 'FAIL: Missing lang',
              previewText: `<html lang="${lang || ''}">`,
            },
          },
        } as RetestApiResponse);
      }

      // 5. Unhandled / Dynamic Criteria: Return an uncertain state per Step 3 of brief
      return NextResponse.json({
        success: true,
        issueId,
        resolved: false,
        state: 'uncertain',
        message: 'Static re-test inconclusive: Criterion requires manual review or dynamic runtime evaluation.',
        visualDiff: {
          retestTimestamp: timestamp,
          verifierAgent: 'Velora Differential Retest Engine',
          beforeState: {
            label: 'Initial Audit State',
            statusBadge: 'UNCERTAIN: Dynamic Evaluation Required',
            previewText: targetSelector,
          },
          afterState: {
            label: 'Static Inspection Inconclusive',
            statusBadge: 'UNCERTAIN: Manual Review Required',
            previewText: targetSelector,
          },
        },
      } as RetestApiResponse);
    }

    // Case 2: Handle Demo Environment Retest (/sandbox)
    const retestResult = evaluateRetest(issueId, targetSelector, sandboxState);

    const responseData: RetestApiResponse = {
      success: true,
      issueId,
      resolved: retestResult.resolved,
      message: retestResult.message,
      visualDiff: retestResult.visualDiff,
    };

    return NextResponse.json(responseData);
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { error: 'Failed to execute retest engine', message: error.message },
      { status: 500 }
    );
  }
}
