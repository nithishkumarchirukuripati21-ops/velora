import { NextRequest, NextResponse } from 'next/server';
import { evaluateSandboxAudit, isDemoTarget } from '@/lib/wcagEngine';
import { auditLiveWebsite, validatePublicTarget, normalizeTargetUrl } from '@/lib/liveAuditor';
import { AgentLogMessage, AuditApiRequest, AuditApiResponse, WCAGLevel } from '@/types/audit';
import { synthesizeIssuesWithGemini } from '@/lib/geminiSynthesizer';

export async function POST(req: NextRequest) {
  try {
    let body: Partial<AuditApiRequest> = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const rawUrl = (body.url || 'https://www.w3.org/WAI/').trim();
    const targetLevel: WCAGLevel = body.targetLevel || 'WCAG 2.2 Level AA';
    const sandboxState = body.sandboxState || {
      modalTrapFixed: false,
      keyboardAccessibilityFixed: false,
      photoContrastFixed: false,
    };
    const userKey = body.userKey ?? body.customKeys ?? body.apiKey;
    const model = body.model;

    const isDemoEnvironment = isDemoTarget(rawUrl);

    // Case 1: Real Live Website Audit (External URL)
    if (!isDemoEnvironment) {
      const normalizedUrl = normalizeTargetUrl(rawUrl);

      // SSRF Security Gate
      const validation = await validatePublicTarget(normalizedUrl);
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

      const liveResult = await auditLiveWebsite(normalizedUrl, targetLevel);

      if (!liveResult.success) {
        return NextResponse.json(
          {
            error: 'Network Retrieval Failure',
            message: liveResult.error,
            logs: liveResult.logs,
          },
          { status: liveResult.statusCode === 400 ? 400 : 502 }
        );
      }

      // Phase 4: Synthesizing Issues & Remediation Matrix via Google Gemini Network
      const synthesis = await synthesizeIssuesWithGemini(liveResult.issues, liveResult.url, {
        userKey,
        model,
        targetLevel,
      });

      const auditId = 'live_' + Math.random().toString(36).substring(2, 9);
      const timestamp = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const responseData: AuditApiResponse = {
        auditId,
        url: liveResult.url,
        targetLevel,
        timestamp,
        score: liveResult.score,
        passedRulesCount: liveResult.passedRulesCount,
        issues: synthesis.issues,
        breakdown: liveResult.breakdown,
        summary: `Live DOM audit completed for ${liveResult.domain} ("${liveResult.pageTitle}"). Evaluated live HTML structure and synthesized ${synthesis.issues.length} candidate barrier(s) across WCAG 2.1 / 2.2 criteria.`,
        logs: [...liveResult.logs, ...synthesis.logs],
        pageTitle: liveResult.pageTitle,
        domStats: liveResult.domStats,
        aiStatus: synthesis.aiStatus,
        keyUsed: synthesis.keyUsed,
        model: synthesis.model,
      };

      return NextResponse.json(responseData);
    }

    // Case 2: Pre-configured Interactive Demo Environment
    const evaluation = evaluateSandboxAudit(sandboxState, targetLevel);
    const auditId = 'demo_' + Math.random().toString(36).substring(2, 9);
    const timestamp = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const isModalTrapFixed = !!(sandboxState.modalTrapFixed || sandboxState.focusFixed);
    const isKeyFixed = !!(sandboxState.keyboardAccessibilityFixed || sandboxState.ariaFixed);
    const isPhotoFixed = !!(sandboxState.photoContrastFixed || sandboxState.contrastFixed);

    const logs: AgentLogMessage[] = [
      {
        id: 'log-1',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        phase: 1,
        text: `Target: Demo Environment (/sandbox) [WCAG Standard: ${targetLevel}]`,
        type: 'info',
      },
      {
        id: 'log-2',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        phase: 2,
        text: 'Decomposing audit: Static accessibility inspection + Simulated keyboard traversal agent',
        type: 'action',
      },
      {
        id: 'log-3',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        phase: 3,
        text: '[Agent] Launching browser session in headless mode (Viewport 1440x900)...',
        type: 'info',
      },
      {
        id: 'log-4',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        phase: 3,
        text: `[Agent] Running automated DOM scan across ${evaluation.passedRulesCount + evaluation.issues.length} rules...`,
        type: 'info',
      },
      {
        id: 'log-5',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        phase: 3,
        text: '[Agent] Simulating keyboard Tab sequence (WCAG 2.1.1 & 2.1.2)...',
        type: 'info',
      },
    ];

    if (!isModalTrapFixed) {
      logs.push({
        id: 'log-6',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        phase: 3,
        text: '[Agent] Detected: Keyboard focus trapped inside dialog container (WCAG 2.1.2 - 12 cycles)',
        type: 'warn',
      });
    }

    if (!isKeyFixed) {
      logs.push({
        id: 'log-7',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        phase: 3,
        text: '[Agent] Detected: Custom interactive element unreachable via keyboard Tab navigation (WCAG 2.1.1)',
        type: 'warn',
      });
    }

    if (!isPhotoFixed) {
      logs.push({
        id: 'log-8',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        phase: 3,
        text: '[Agent] Detected: Text contrast 2.3:1 over photographic background below 4.5:1 minimum (WCAG 1.4.3)',
        type: 'warn',
      });
    }

    // Phase 4: Synthesizing Issues & Remediation Matrix via Google Gemini Network
    const synthesis = await synthesizeIssuesWithGemini(evaluation.issues, '/sandbox', {
      userKey,
      model,
      targetLevel,
    });

    const responseData: AuditApiResponse = {
      auditId,
      url: '/sandbox',
      targetLevel,
      timestamp,
      score: evaluation.score,
      issues: synthesis.issues,
      breakdown: {
        colorContrast: isPhotoFixed ? 98 : 72,
        keyboardOperability: isModalTrapFixed && isKeyFixed ? 96 : 74,
        ariaSemantics: 92,
      },
      summary: `Autonomous WCAG audit completed for /sandbox. Detected ${synthesis.issues.length} candidate barriers and verified ${evaluation.passedRulesCount} passing compliance checkpoints.`,
      logs: [...logs, ...synthesis.logs],
      aiStatus: synthesis.aiStatus,
      keyUsed: synthesis.keyUsed,
      model: synthesis.model,
    };

    return NextResponse.json(responseData);
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { error: 'Failed to execute audit pipeline', message: error.message },
      { status: 500 }
    );
  }
}
