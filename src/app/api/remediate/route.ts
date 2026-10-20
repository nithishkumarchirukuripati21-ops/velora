import { NextRequest, NextResponse } from 'next/server';

interface RemediateRequestBody {
  elementSnippet?: string;
  wcagRule?: string;
  criterion?: string;
  issueDescription?: string;
  targetSelector?: string;
  apiKey?: string;
}

export async function POST(req: NextRequest) {
  try {
    let body: RemediateRequestBody = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const {
      elementSnippet = '',
      wcagRule = 'WCAG 2.1 / 2.2 Accessibility Barrier',
      criterion = 'WCAG 2.2 AA',
      issueDescription = 'Accessibility barrier detected on interactive or sensory element.',
      targetSelector = 'element',
    } = body;

    // Retrieve API key from request body (passed by user in settings) or environment
    const apiKey = (body.apiKey?.trim() || process.env.GEMINI_API_KEY || '').trim();

    // Case 1: Real Google Gemini API Call if Key is Present
    if (apiKey) {
      try {
        console.log(`[AI Engine] Dispatching real LLM remediation request to Google Gemini (gemini-1.5-flash)...`);

        const prompt = `You are a world-class accessibility engineer specialized in WCAG 2.2 AA and WAI-ARIA standards.
Analyze this non-compliant HTML element and generate an accurate, production-ready remediation code patch.

WCAG Violation Rule: ${wcagRule} (${criterion})
Element Selector: ${targetSelector}
Issue Context: ${issueDescription}

Broken HTML Snippet:
\`\`\`html
${elementSnippet || `<${targetSelector}>Broken Element</${targetSelector}>`}
\`\`\`

You must respond with ONLY a valid, parseable JSON object matching this exact schema:
{
  "explanation": "A concise 1-2 sentence plain-English explanation of why this barrier harms users with disabilities and how your patch fixes it.",
  "beforeSnippet": "The original broken snippet",
  "remediatedSnippet": "The fully accessible, production-ready HTML/CSS/JS patch with proper ARIA attributes, semantic tags, or contrast values."
}`;

        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const geminiResponse = await fetch(geminiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          }),
          signal: AbortSignal.timeout(10000),
        });

        if (geminiResponse.ok) {
          const data = await geminiResponse.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

          // Clean any markdown fences if present
          const jsonText = rawText.replace(/```json\n?|\n?```/gi, '').trim();
          const parsed = JSON.parse(jsonText);

          if (parsed && parsed.remediatedSnippet) {
            console.log(`[AI Engine] Successfully generated real LLM remediation patch via Gemini 1.5 Flash.`);
            return NextResponse.json({
              success: true,
              provider: 'Google Gemini (gemini-1.5-flash)',
              remediation: {
                explanation: parsed.explanation || 'Remediated for full WCAG 2.2 AA compliance.',
                beforeSnippet: parsed.beforeSnippet || elementSnippet,
                remediatedSnippet: parsed.remediatedSnippet,
                beforeCode: parsed.beforeSnippet || elementSnippet,
                afterCode: parsed.remediatedSnippet,
                language: 'html',
                provider: 'Google Gemini 1.5 Flash',
              },
            });
          }
        } else {
          const errText = await geminiResponse.text();
          console.warn(`[AI Engine] Gemini API returned status ${geminiResponse.status}: ${errText}. Falling back to deterministic templates.`);
        }
      } catch (geminiErr: unknown) {
        const error = geminiErr as Error;
        console.warn(`[AI Engine] Gemini API call failed (${error.message}). Falling back to deterministic templates.`);
      }
    } else {
      console.log(`[AI Engine] Gemini API key not detected. Using deterministic WCAG rule templates.`);
    }

    // Case 2: Graceful Deterministic Rule-Based Fallback
    const fallbackRemediation = generateDeterministicRemediation(
      wcagRule,
      criterion,
      elementSnippet,
      targetSelector,
      issueDescription
    );

    return NextResponse.json({
      success: true,
      provider: 'Deterministic WCAG Template Engine',
      fallback: true,
      remediation: fallbackRemediation,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { error: 'Failed to generate remediation', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * Deterministic WCAG Rule Templates (Fallback when Gemini API key is absent)
 */
function generateDeterministicRemediation(
  rule: string,
  criterion: string,
  snippet: string,
  selector: string,
  description: string
) {
  const lowerRule = (rule + ' ' + criterion + ' ' + selector + ' ' + description).toLowerCase();

  // 1. Missing Image Alt Text
  if (lowerRule.includes('alt') || lowerRule.includes('1.1.1') || selector.includes('img')) {
    const cleanSnippet = snippet || '<img src="/banner.jpg" class="header-img">';
    const fixedSnippet = cleanSnippet.includes('alt=""')
      ? cleanSnippet.replace(/alt=""/i, 'alt="Descriptive label of visual content"')
      : cleanSnippet.includes('alt')
      ? cleanSnippet
      : cleanSnippet.replace(/<img/i, '<img alt="Descriptive label of visual content"');

    return {
      explanation:
        'Screen readers cannot convey unlabelled graphics. Adding an informative alt attribute ensures blind and low-vision users understand the image purpose.',
      beforeSnippet: cleanSnippet,
      remediatedSnippet: fixedSnippet,
      beforeCode: cleanSnippet,
      afterCode: fixedSnippet,
      language: 'html',
      provider: 'Deterministic WCAG Template Engine',
    };
  }

  // 2. Form Control Missing Label
  if (lowerRule.includes('label') || lowerRule.includes('1.3.1') || lowerRule.includes('4.1.2') || selector.includes('input')) {
    const cleanSnippet = snippet || '<input type="text" name="search" placeholder="Search...">';
    const idMatch = cleanSnippet.match(/id="([^"]+)"/);
    const id = idMatch ? idMatch[1] : 'search-input';
    const inputWithId = cleanSnippet.includes('id=') ? cleanSnippet : cleanSnippet.replace(/<input/i, `<input id="${id}"`);
    const fixedSnippet = `<!-- Associated semantic label for assistive tech -->\n<label for="${id}" class="sr-only">Search</label>\n${inputWithId}`;

    return {
      explanation:
        'Form inputs without associated <label> elements prevent screen readers from announcing what data needs to be entered. An explicit label guarantees accessibility.',
      beforeSnippet: cleanSnippet,
      remediatedSnippet: fixedSnippet,
      beforeCode: cleanSnippet,
      afterCode: fixedSnippet,
      language: 'html',
      provider: 'Deterministic WCAG Template Engine',
    };
  }

  // 3. Modal Focus Trap
  if (lowerRule.includes('trap') || lowerRule.includes('2.1.2') || selector.includes('modal')) {
    const cleanSnippet = snippet || '<div id="interactive-modal" class="modal-dialog">...</div>';
    const fixedSnippet = `// Remediated: Escape dismisses dialog and restores focus
const dialog = document.getElementById('interactive-modal');
dialog.setAttribute('aria-modal', 'true');
dialog.setAttribute('role', 'dialog');

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !dialog.classList.contains('hidden')) {
    e.preventDefault();
    closeDialogModal(); // Safely release focus back to trigger
  }
});`;

    return {
      explanation:
        'Keyboard focus trapped inside a modal without an Escape key release listener completely blocks keyboard-only and motor-impaired navigation.',
      beforeSnippet: cleanSnippet,
      remediatedSnippet: fixedSnippet,
      beforeCode: cleanSnippet,
      afterCode: fixedSnippet,
      language: 'javascript',
      provider: 'Deterministic WCAG Template Engine',
    };
  }

  // 4. Custom Button Missing Keyboard Access
  if (lowerRule.includes('keyboard') || lowerRule.includes('2.1.1') || selector.includes('button') || selector.includes('role="button"')) {
    const cleanSnippet = snippet || '<div role="button" class="btn">View Details</div>';
    const fixedSnippet = cleanSnippet.includes('<div')
      ? cleanSnippet.replace(/<div/i, '<button type="button"').replace(/<\/div>/i, '</button>')
      : cleanSnippet.replace(/<div/i, '<div tabindex="0" role="button" onkeydown="if(event.key===\'Enter\'||event.key===\' \') handleClick()"');

    return {
      explanation:
        'Non-semantic <div> elements acting as buttons cannot receive keyboard Tab focus or trigger via Enter/Space unless converted to <button> or equipped with tabindex="0".',
      beforeSnippet: cleanSnippet,
      remediatedSnippet: fixedSnippet,
      beforeCode: cleanSnippet,
      afterCode: fixedSnippet,
      language: 'html',
      provider: 'Deterministic WCAG Template Engine',
    };
  }

  // 5. Photo Contrast
  if (lowerRule.includes('contrast') || lowerRule.includes('1.4.3') || selector.includes('photo')) {
    const cleanSnippet = snippet || '.photo-banner { color: #94a3b8; background-image: url(/photo.jpg); }';
    const fixedSnippet = `/* Remediated: 10.4:1 contrast with semi-transparent dark scrim */
.photo-banner {
  color: #ffffff;
  background-image: linear-gradient(rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0.72)), url(/photo.jpg);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}`;

    return {
      explanation:
        'Text rendered directly over multi-colored photography fails the 4.5:1 AA contrast minimum. A semi-transparent dark scrim guarantees legibility across all viewport coordinates.',
      beforeSnippet: cleanSnippet,
      remediatedSnippet: fixedSnippet,
      beforeCode: cleanSnippet,
      afterCode: fixedSnippet,
      language: 'css',
      provider: 'Deterministic WCAG Template Engine',
    };
  }

  // Generic Fallback
  const cleanSnippet = snippet || `<div class="target-element">...</div>`;
  const fixedSnippet = `<!-- Remediated for ${criterion} -->\n${cleanSnippet.replace(/>/, ` aria-label="Accessible descriptive title" tabindex="0">`)}`;

  return {
    explanation:
      'Remediated element with explicit accessibility semantics and keyboard reachability to comply with WCAG 2.2 AA requirements.',
    beforeSnippet: cleanSnippet,
    remediatedSnippet: fixedSnippet,
    beforeCode: cleanSnippet,
    afterCode: fixedSnippet,
    language: 'html',
    provider: 'Deterministic WCAG Template Engine',
  };
}
