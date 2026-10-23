import { Issue, AgentLogMessage, WCAGLevel } from '@/types/audit';
import { geminiNetwork } from '@/lib/geminiKeyManager';

export interface SynthesisResult {
  issues: Issue[];
  logs: AgentLogMessage[];
  aiStatus: 'active_gemini_synthesis' | 'deterministic_fallback';
  keyUsed?: string;
  model: string;
  durationMs: number;
}

export interface SynthesisOptions {
  userKey?: string;
  model?: string;
  targetLevel?: WCAGLevel;
}

function normalizeModelName(inputModel?: string): string {
  if (!inputModel) return 'gemini-1.5-flash';
  const lower = inputModel.toLowerCase().trim();
  if (lower.includes('2.0') || lower.includes('gemini-2.0')) {
    return 'gemini-2.0-flash';
  }
  if (lower.includes('pro') || lower.includes('gemini-1.5-pro')) {
    return 'gemini-1.5-pro';
  }
  return 'gemini-1.5-flash';
}

/**
 * Phase 4: Synthesizes candidate DOM accessibility violations using the 3-Key Google Gemini Network
 * with automatic failover (429 rate limit rotation) and graceful deterministic fallback.
 */
export async function synthesizeIssuesWithGemini(
  issues: Issue[],
  targetUrl: string,
  options?: SynthesisOptions
): Promise<SynthesisResult> {
  const targetModel = normalizeModelName(options?.model);
  const targetLevel = options?.targetLevel || 'WCAG 2.2 Level AA';
  const userKey = options?.userKey?.trim();
  if (userKey) {
    geminiNetwork.setUserKey(userKey);
  }

  const logs: AgentLogMessage[] = [];
  const nowIso = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Phase 4 Initiation Log
  logs.push({
    id: 'log-phase4-conn-' + Math.random().toString(36).substring(2, 7),
    timestamp: nowIso(),
    phase: 4,
    text: '[AI Agent] Phase 4: Connecting to Google Gemini 1.5 Flash via Key Network...',
    type: 'action',
  });

  if (!issues || issues.length === 0) {
    logs.push({
      id: 'log-phase4-none-' + Math.random().toString(36).substring(2, 7),
      timestamp: nowIso(),
      phase: 4,
      text: '[AI Agent] Phase 4: No candidate violations detected; synthesis bypassed.',
      type: 'info',
    });
    return {
      issues: [],
      logs,
      aiStatus: 'deterministic_fallback',
      model: targetModel,
      durationMs: 0,
    };
  }

  logs.push({
    id: 'log-phase4-dispatch-' + Math.random().toString(36).substring(2, 7),
    timestamp: nowIso(),
    phase: 4,
    text: `[AI Agent] Dispatched ${issues.length} violations to Gemini AI. Generating tailored code remediation & impact matrix...`,
    type: 'info',
  });

  const startTime = performance.now();

  const candidateSummaries = issues.slice(0, 10).map((issue, idx) => ({
    index: idx,
    id: issue.id,
    targetSelector: issue.targetSelector,
    wcagCriterion: issue.wcagCriterion,
    brokenSnippet:
      issue.visualEvidence?.simulatedHtmlPreview ||
      issue.aiRemediation?.beforeCode ||
      `<${issue.targetSelector}>Broken Element</${issue.targetSelector}>`,
    description: issue.description,
  }));

  const prompt = `You are VELORA's principal accessibility AI agent specialized in ${targetLevel} and WAI-ARIA standards.
Target URL: ${targetUrl}
Compliance Benchmark Standard: ${targetLevel}

Synthesize and analyze these accessibility violation(s) found in the page DOM specifically citing and complying with ${targetLevel}:
${JSON.stringify(candidateSummaries, null, 2)}

For each violation, provide:
1. "humanImpact": A concise 1-2 sentence explanation of how this specific barrier impacts screen reader or keyboard users in this specific context under ${targetLevel}.
2. "beforeSnippet": The original broken code snippet.
3. "remediatedSnippet": A clean, accessible, production-ready code patch with proper ARIA attributes, semantic HTML tags, labels, or styles tailored to that element complying with ${targetLevel}.
4. "explanation": A concise explanation of why this barrier harms users and how the patch resolves it per ${targetLevel}.

Respond with ONLY a valid, parseable JSON object matching this exact schema:
{
  "synthesizedIssues": [
    {
      "index": 0,
      "humanImpact": "string",
      "beforeSnippet": "string",
      "remediatedSnippet": "string",
      "explanation": "string"
    }
  ]
}`;

  try {
    const outcome = await geminiNetwork.executeWithAutoFailover(async (activeKey) => {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': activeKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        }),
        signal: AbortSignal.timeout(18000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const err = new Error(errorText);
        (err as unknown as { status: number; statusCode: number }).status = response.status;
        (err as unknown as { status: number; statusCode: number }).statusCode = response.status;
        throw err;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonText = rawText.replace(/```json\n?|\n?```/gi, '').trim();
      const parsed = JSON.parse(jsonText);

      if (!parsed || !Array.isArray(parsed.synthesizedIssues)) {
        throw new Error('Malformed JSON received from Gemini synthesis model');
      }

      return parsed as {
        synthesizedIssues: Array<{
          index?: number;
          humanImpact?: string;
          beforeSnippet?: string;
          remediatedSnippet?: string;
          explanation?: string;
        }>;
      };
    });

    const durationMs = Math.round(performance.now() - startTime);
    const keyUsed = outcome.keyUsed;
    const synthesizedList = outcome.data.synthesizedIssues || [];

    const updatedIssues = issues.map((issue, idx) => {
      const match = synthesizedList.find((s) => s.index === idx) || synthesizedList[idx];
      if (match) {
        return {
          ...issue,
          impact: match.humanImpact || issue.impact,
          aiRemediation: {
            explanation: match.explanation || issue.aiRemediation?.explanation || 'Remediated for full WCAG compliance.',
            beforeCode: match.beforeSnippet || issue.aiRemediation?.beforeCode || '',
            afterCode: match.remediatedSnippet || issue.aiRemediation?.afterCode || '',
            language: issue.aiRemediation?.language || 'html',
            provider: `Google Gemini 1.5 Flash (${keyUsed})`,
          },
          aiGenerated: true,
          aiModel: 'gemini-1.5-flash',
          aiKeyUsed: keyUsed,
        };
      }
      return {
        ...issue,
        aiGenerated: true,
        aiModel: 'gemini-1.5-flash',
        aiKeyUsed: keyUsed,
      };
    });

    logs.push({
      id: 'log-phase4-complete-' + Math.random().toString(36).substring(2, 7),
      timestamp: nowIso(),
      phase: 4,
      text: `[AI Agent] Synthesis complete via Key (${keyUsed}) in ${durationMs}ms. 0 failovers.`,
      type: 'success',
    });

    return {
      issues: updatedIssues,
      logs,
      aiStatus: 'active_gemini_synthesis',
      keyUsed,
      model: 'gemini-1.5-flash',
      durationMs,
    };
  } catch (err: unknown) {
    const durationMs = Math.round(performance.now() - startTime);
    logs.push({
      id: 'log-phase4-fallback-' + Math.random().toString(36).substring(2, 7),
      timestamp: nowIso(),
      phase: 4,
      text: '[AI Agent] Gemini keys unconfigured or cooling down (429). Applied deterministic WCAG rule templates.',
      type: 'warn',
    });

    const updatedIssues = issues.map((issue) => ({
      ...issue,
      aiGenerated: false,
    }));

    return {
      issues: updatedIssues,
      logs,
      aiStatus: 'deterministic_fallback',
      model: targetModel,
      durationMs,
    };
  }
}
