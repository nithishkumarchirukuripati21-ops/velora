import { NextRequest, NextResponse } from 'next/server';
import { evaluateRetest, isDemoTarget } from '@/lib/wcagEngine';
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
      let domain = 'remote host';
      try {
        if (targetUrl && /^https?:\/\//i.test(targetUrl)) {
          domain = new URL(targetUrl).hostname;
        }
      } catch {
        domain = targetUrl || 'remote host';
      }

      let stillFailing = true;

      if (targetUrl) {
        try {
          let res = await fetch(targetUrl, {
            headers: {
              Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.9',
            },
            signal: AbortSignal.timeout(7000),
          });

          if (res.status >= 400) {
            try {
              const retryRes = await fetch(targetUrl, { signal: AbortSignal.timeout(7000) });
              if (retryRes.status < 400) {
                res = retryRes;
              }
            } catch {
              // keep res
            }
          }
          const html = await res.text();
          const $ = cheerio.load(html);

          // Verify if selector or issue still exists
          if (issueId.includes('IMG-ALT')) {
            try {
              const targetEl = $(targetSelector);
              if (targetEl.length > 0) {
                const alt = targetEl.attr('alt');
                stillFailing = typeof alt === 'undefined' || alt.trim() === '';
              } else {
                stillFailing = $('img:not([alt]), img[alt=""]').length > 0;
              }
            } catch {
              stillFailing = true;
            }
          } else if (issueId.includes('FORM-LABEL')) {
            try {
              const targetEl = $(targetSelector);
              if (targetEl.length > 0) {
                const id = targetEl.attr('id');
                const aria = targetEl.attr('aria-label');
                const title = targetEl.attr('title');
                const hasLabel =
                  (id && $(`label[for="${id}"]`).length > 0) ||
                  !!(aria && aria.trim()) ||
                  !!(title && title.trim()) ||
                  targetEl.closest('label').length > 0;
                stillFailing = !hasLabel;
              } else {
                stillFailing = true;
              }
            } catch {
              stillFailing = true;
            }
          } else if (issueId.includes('H1-MISSING')) {
            stillFailing = $('h1').length === 0;
          } else if (issueId.includes('LANG')) {
            const lang = $('html[lang]').attr('lang') || $('html').attr('lang');
            stillFailing = !lang || lang.trim().length === 0;
          } else if (issueId.includes('EMPTY-CTRL') || issueId.includes('EMPTY-INTERACTIVE')) {
            try {
              const targetEl = $(targetSelector);
              if (targetEl.length > 0) {
                const text = targetEl.text().trim();
                const aria = targetEl.attr('aria-label');
                stillFailing = !text && !aria;
              } else {
                stillFailing = true;
              }
            } catch {
              stillFailing = true;
            }
          } else {
            try {
              stillFailing = $(targetSelector).length > 0;
            } catch {
              stillFailing = true;
            }
          }
        } catch {
          stillFailing = true;
        }
      }

      const visualDiff: VisualDiffEvidence = {
        retestTimestamp: timestamp,
        verifierAgent: 'Velora Live DOM Retest Agent',
        beforeState: {
          label: 'Initial Audit State',
          statusBadge: 'FAIL: Barrier Recorded in Live Target DOM',
          previewText: targetSelector,
        },
        afterState: {
          label: stillFailing ? 'Retest State (Still Non-Compliant)' : 'Retest State (Remediated)',
          statusBadge: stillFailing
            ? `FAIL: Actively Non-Compliant on ${domain}`
            : `PASS: Remediated on ${domain}`,
          previewText: targetSelector,
        },
      };

      const message = stillFailing
        ? `Retest Failed: Issue is still actively detected on the remote server at ${domain}. (Target element: ${targetSelector} remains non-compliant).`
        : `Verified: Barrier remediated in live DOM on ${domain}. Target element ${targetSelector} is compliant.`;

      return NextResponse.json({
        success: true,
        issueId,
        resolved: !stillFailing,
        message,
        visualDiff,
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
