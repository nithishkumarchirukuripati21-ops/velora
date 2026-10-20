# VELORA — WCAG Accessibility Auditor

**A better web, verified.**

VELORA is a web accessibility auditing and verification platform designed to identify potential Web Content Accessibility Guidelines (WCAG) violations, provide supporting evidence, enable human review, and retest issues after fixes.

It combines automated HTML inspection, a controlled accessibility-testing sandbox, AI-assisted remediation, and a human-in-the-loop review workflow to help developers investigate and resolve accessibility barriers.

## Overview

Automated accessibility tools are useful, but they cannot identify every accessibility barrier. Some issues require interactive browser testing, visual inspection, assistive technology, or human judgment.

VELORA aims to bring accessibility inspection, candidate issue management, remediation guidance, and post-fix verification into one workflow.

### Core capabilities

- **Guided audit workflow:** Configure the target website, WCAG benchmark, and available audit settings.
- **Automated HTML inspection:** Parse remote website HTML and run supported accessibility checks.
- **Evidence-based findings:** Associate detected issues with relevant elements and available supporting information.
- **Human-in-the-loop review:** Allow reviewers to inspect candidate findings before accepting them into the issue board.
- **Retesting workflow:** Recheck supported accessibility conditions after a proposed fix.
- **AI-assisted remediation:** Request code suggestions using Google Gemini when an API key is configured.
- **Deterministic fallback:** Provide rule-based remediation templates when Gemini is unavailable or not configured.
- **Interactive sandbox:** Explore predefined accessibility scenarios and experiment with fixes.
- **Reports and exports:** Review findings and export reports in Markdown format.

## Architecture and Core Engines

### 1. Live Audit Engine

**API route:** `/api/audit`

The live audit engine retrieves remote website HTML and parses it using Cheerio. It runs supported static checks against the retrieved document.

Examples of checks that can be performed through HTML inspection include:

- Images with missing or empty alternative text.
- Form controls with missing label associations.
- Interactive elements with missing accessible names.
- Missing document language declarations.
- Missing page titles.
- Missing primary headings.

The checks performed depend on the rules implemented in the current audit engine.

**Important limitation:** Server-side HTML parsing does not execute a full browser session. It cannot, by itself, verify real keyboard interactions, inspect every dynamically rendered element, or capture browser-rendered bounding boxes.

### 2. Accessibility Testing Sandbox

**Route:** `/sandbox`

The sandbox provides a controlled environment for exploring accessibility scenarios and testing predefined remediation states.

Scenarios can include:

- Color contrast problems.
- Keyboard focus and navigation concerns.
- Controls that require accessible names.
- Modal interaction and focus-management scenarios.

The sandbox is intended to help demonstrate accessibility concepts and investigate how changes affect the selected test scenario.

Results from predefined sandbox scenarios should be distinguished from findings discovered independently on arbitrary live websites.

### 3. AI Remediation Engine

**API route:** `/api/remediate`

VELORA includes an API integration for Google Gemini to generate remediation suggestions based on a supplied HTML snippet and accessibility criterion.

The intended response includes structured information such as:

- An explanation of the accessibility problem.
- The original HTML snippet.
- A proposed remediated snippet.

When Gemini is configured, the engine can request AI-generated suggestions. When an API key is unavailable, deterministic WCAG-oriented templates can provide fallback suggestions for supported cases.

AI-generated code is a proposed fix, not proof of conformance. Developers should review the output, test it in context, and verify that the relevant accessibility requirement is satisfied.

Configure the API key through the application's settings interface if that functionality is available in the current deployment. Production deployments should store secrets securely on the server and avoid exposing API keys to client-side code.

### 4. Retest Engine

**API route:** `/api/retest`

The retest engine supports checking previously identified issues after a proposed fix.

The intended workflow is:

1. Record the original candidate finding and its relevant context.
2. Apply a fix to the relevant element or sandbox scenario.
3. Run the applicable verification check again.
4. Compare the new result with the original finding.
5. Mark the issue as resolved only when the relevant verification check passes.

A valid retest must evaluate the actual condition that caused the issue. For example, finding that an HTML element still exists does not establish that it remains inaccessible, and finding that an element has disappeared does not necessarily establish that the underlying problem has been fixed.

The checks available for live pages depend on the implemented verification rules. A successful individual retest does not establish that an entire website conforms to WCAG.

### 5. Human Review Workflow

**Route:** `/issues`

VELORA separates candidate findings from findings accepted by a reviewer.

The review workflow allows users to examine available issue details and decide whether to accept or dismiss a candidate. This helps keep automated detection separate from human judgment.

Human review is especially important for issues whose correctness depends on context, visual presentation, or interactive behavior.

### 6. Reports and Compliance Overview

**Route:** `/reports`

The reporting interface provides a way to review findings and organize them into accessibility-related categories, such as:

- Color contrast.
- Keyboard operability.
- Accessible names and semantics.
- Other supported accessibility checks.

The application also provides a Markdown export workflow.

Report summaries should be interpreted according to the checks actually performed. A generated score or category summary should not be treated as a formal WCAG conformance certification unless it is backed by an appropriate, validated assessment process.

### 7. Configurable Auditor Settings

**Route:** `/settings`

The settings interface provides configuration options for the auditing workflow. Depending on the current implementation, these may include:

- WCAG benchmark selection.
- Contrast-checking preferences.
- Keyboard traversal settings.
- Gemini API key configuration.
- AI remediation testing.

A configuration option does not necessarily mean the corresponding behavior is implemented for every audit. The checks that run depend on the audit engine and the information available to it.

## Application Routes

| Route | Purpose |
|---|---|
| `/` | Dashboard, overview, metrics, and recent audit activity |
| `/new-audit` | Audit configuration and inspection workflow |
| `/issues` | Candidate findings, review, and retesting |
| `/sandbox` | Controlled accessibility-testing scenarios |
| `/reports` | Finding summaries and Markdown export |
| `/settings` | Audit and remediation configuration |

The project also includes API endpoints for audit, retesting, and remediation operations.

## Official Accessibility Test Scenarios

VELORA is intended to be evaluated against four core scenarios.

### TC1 — Modal focus trap

**Expected result:** A modal that prevents keyboard users from navigating appropriately should be identified, with supporting evidence of the relevant keyboard behavior.

**Verification requirement:** The test must exercise the actual modal interaction. Static HTML inspection alone cannot establish whether focus is trapped.

### TC2 — Automated pass, manual failure

**Expected result:** A manually identified accessibility failure should remain reportable even if an automated check passes.

**Verification requirement:** The manual finding must be retained independently of the automated result. A passing automated scan must not automatically dismiss a valid manual failure.

### TC3 — Text contrast over an image

**Expected result:** Contrast should be evaluated using the actual foreground and background appearance behind the text.

**Verification requirement:** The assessment must account for the relevant image background. A fixed contrast value or a calculation against an assumed solid background is not sufficient to establish contrast over a photograph.

### TC4 — Fix and retest

**Expected result:** After a fix is applied, the same relevant accessibility condition should be checked again. The issue should be marked as resolved only if the applicable verification passes.

**Verification requirement:** The test must verify the underlying criterion rather than relying solely on a status toggle or the continued presence or absence of a DOM element.

For each test case, record:

- Test input and initial state.
- Expected result.
- Actual result.
- Evidence collected.
- Final status.
- Any limitations or deviations.

Test results should represent actual test execution. Preconfigured scenarios and simulated results should be identified as such rather than presented as independent live-browser verification.

## Technology Stack

- **Next.js:** Application framework and routing.
- **React:** User interface.
- **TypeScript:** Type-safe application development.
- **Tailwind CSS:** Styling and responsive layouts.
- **Cheerio:** Server-side HTML parsing.
- **Google Gemini API:** AI-assisted remediation when configured.
- **Custom accessibility logic:** WCAG-related checks, finding management, and retest workflows.

Refer to `package.json` for the exact dependencies and versions used by the project.

## Getting Started

### Prerequisites

- Node.js compatible with the project's Next.js version.
- npm.

### 1. Clone the repository

```bash
git clone https://github.com/nithishkumarchirukuripati21-ops/velora.git
cd velora
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Configure any required server-side environment variables according to the application's implementation.

For Gemini remediation, configure the API key through the supported settings flow or server-side configuration. Never commit real API keys, tokens, or other secrets to GitHub.

If the application supports a deterministic fallback without a Gemini key, that fallback can be used to explore supported remediation templates.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Create a production build

```bash
npm run build
```

A successful production build confirms that the application compiles for production. It does not independently prove that the accessibility checks, Gemini integration, or all official test cases behave correctly.

## Accessibility Concepts

### WCAG contrast ratio

WCAG contrast ratio is calculated using the relative luminance of the lighter and darker colors:

\[
\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}
\]

Here, \(L_1\) is the lighter relative luminance and \(L_2\) is the darker relative luminance.

For WCAG 2.x Level AA, the minimum contrast ratios for ordinary text are generally:

- **4.5:1** for normal text.
- **3:1** for large text.

For example, `#888888` against `#FFFFFF` has a contrast ratio of approximately **3.54:1**. This is below the normal-text AA threshold but meets the numerical contrast threshold for large text, assuming the other applicable requirements are satisfied.

Contrast assessment over images requires evaluating the actual text and background appearance rather than assuming a single background color.

### Keyboard accessibility

Keyboard accessibility concerns whether users can navigate and operate interactive controls without relying on a mouse.

Relevant checks may include:

- Keyboard operability.
- Visible focus.
- Logical focus order.
- Modal focus management.
- Appropriate keyboard interaction patterns.

Static HTML inspection can identify some potential problems, but interactive behavior requires suitable browser-based testing and, in some cases, manual evaluation.

### Human review and automated testing

Automated tools can detect many common accessibility problems, but they cannot reliably determine every issue that depends on meaning, context, or user experience.

VELORA is intended to support the auditing process, not replace professional accessibility evaluation or guarantee complete WCAG conformance.

## Security and Responsible Use

When auditing external websites, server-side URL fetching must be handled carefully.

A production deployment should validate submitted URLs, block requests to localhost and private or otherwise restricted network destinations, and validate redirect destinations. API endpoints should also apply appropriate request validation, resource limits, and error handling.

API keys must be protected, and AI-generated remediation should be reviewed before it is applied to production code.

Only audit websites that you are authorized to test, and avoid collecting or publishing sensitive information in audit evidence.

## Validation and Evidence

See [`EVIDENCE.md`](./EVIDENCE.md) for the project's test scenarios, recorded evidence, and validation notes.

When evaluating VELORA, verify the four official scenarios independently:

1. Modal focus behavior.
2. Automated pass with a manually identified failure.
3. Contrast over an image background.
4. Fix verification and retesting.

Record expected results, actual results, and supporting evidence. Clearly distinguish static checks, sandbox simulations, browser-tested behavior, and manual review.

Do not interpret a successful build, a passing simulated test, or an individual resolved issue as proof that an entire website conforms to WCAG.

## Project Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── audit/
│   │   ├── remediate/
│   │   └── retest/
│   ├── issues/
│   ├── landing/
│   ├── new-audit/
│   ├── reports/
│   ├── sandbox/
│   ├── settings/
│   └── welcome/
├── components/
│   ├── dashboard/
│   ├── landing/
│   └── layout/
├── context/
│   └── AuditContext.tsx
├── data/
│   └── mockData.ts
├── lib/
│   ├── liveAuditor.ts
│   └── wcagEngine.ts
└── types/
    └── audit.ts
```

This is a high-level overview. Refer to the repository for the complete file structure.

## Contributing and Feedback

Suggestions and contributions that improve accessibility checks, evidence quality, keyboard verification, remediation safety, and reproducibility are welcome.

When reporting a problem, include:

- The affected route or target website.
- Steps to reproduce the issue.
- Expected behavior.
- Actual behavior.
- Relevant evidence or error messages.

---

**VELORA — A better web, verified.**

Built for the hackathon.