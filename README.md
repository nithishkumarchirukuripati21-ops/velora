# VELORA — Autonomous WCAG Accessibility Auditor

**A better web, verified.**

VELORA is an accessibility auditing and verification platform designed to identify potential WCAG violations, collect supporting evidence, enable human review, and retest issues after fixes. It combines automated accessibility checks with keyboard-navigation inspection and a human-in-the-loop workflow to help teams investigate and resolve accessibility barriers.

## Overview

Accessibility issues can remain undetected when teams rely exclusively on automated scans. VELORA is designed to bring automated checks, keyboard testing, visual evidence, human approval, and post-fix verification into one workflow.

### Core capabilities

- **Guided audit workflow:** Collect the target URL, WCAG benchmark, and viewport settings before an audit.
- **Accessibility inspection:** Examine page structure, interactive elements, keyboard navigation, and color contrast.
- **Evidence-based findings:** Associate candidate issues with relevant elements and supporting evidence.
- **Human-in-the-loop review:** Allow reviewers to inspect and approve candidate findings before they are added to the issue board.
- **Fix verification:** Retest identified issues and compare results before and after a proposed fix.
- **Reports and exports:** Review findings by category and export a Markdown report.
- **Interactive sandbox:** Explore deliberately introduced accessibility problems and test fixes in a controlled environment.

## Key Features

### 1. Audit workflow

The audit workspace organizes the process into four stages:

1. **Collect details** — Specify the target website, WCAG benchmark, and viewport.
2. **Plan checks** — Determine relevant accessibility checks and keyboard-navigation tests.
3. **Inspect the website** — Examine accessible DOM information, interactive elements, keyboard behavior, and contrast where supported.
4. **Review findings** — Present candidate issues for human approval before they are recorded as accepted findings.

### 2. Interactive testing sandbox

The `/sandbox` route provides a controlled environment for exploring common accessibility problems.

The intended demonstrations include:

- **Color contrast:** Gray text against a white background.
- **Keyboard focus:** Testing whether keyboard users can identify the currently focused element.
- **Accessible naming:** An icon-only modal control that requires an accessible name.

An organizer control bar lets users experiment with fixes and observe the resulting behavior.

### 3. Retesting and verification

The `/api/retest` endpoint supports the retesting workflow for previously identified issues.

The intended verification flow is:

1. Identify an issue and capture its original state.
2. Apply a fix to the relevant element.
3. Run the checks again against the updated state.
4. Compare the new results with the original findings.
5. Mark the issue as fixed only when the applicable verification checks pass.

A successful individual retest does not establish that an entire website conforms to WCAG.

### 4. Human-in-the-loop issue review

VELORA is designed to keep human reviewers involved in accepting candidate findings. Reviewers can inspect the available evidence before an issue is added to the issue board.

This separates automatically detected candidates from findings that have been reviewed and accepted.

### 5. Reports and compliance overview

The `/reports` route provides an overview of findings across categories such as:

- Color contrast
- Keyboard operability
- ARIA and accessible semantics

The reporting interface also supports detailed finding inspection and Markdown export.

### 6. Configurable auditor settings

The `/settings` route provides configuration options for the auditing workflow, including:

- WCAG benchmark selection
- Contrast-checking preferences
- Keyboard traversal depth
- AI model selection options

The actual checks performed depend on the implemented audit engine and the available browser and page information.

## Application Routes

| Route | Purpose |
|---|---|
| `/` | Home dashboard, metrics, recent audits, and workflow overview |
| `/new-audit` | Audit workspace and inspection workflow |
| `/issues` | Candidate findings, review workflow, and retesting interface |
| `/sandbox` | Controlled accessibility-testing playground |
| `/reports` | Finding summaries and report export |
| `/settings` | Auditor configuration |

Additional routes and API endpoints may be present in the source tree.

## Technology Stack

- **Next.js** — Application framework and routing
- **React** — User interface
- **TypeScript** — Type-safe application development
- **Tailwind CSS** — Styling and responsive layouts
- **Accessibility engine** — Custom WCAG-related checks and finding logic
- **API routes** — Audit and retest operations

See `package.json` for the exact dependency versions used by the project.

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm 10 or later

### Installation

Clone the repository:

```bash
git clone https://github.com/nithishkumarchirukuripati21-ops/velora.git
cd velora
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production build

Run:

```bash
npm run build
```

This checks whether the application can be compiled for production. A successful build does not, by itself, verify the accuracy or completeness of the accessibility checks.

## Accessibility Concepts

### Color contrast

WCAG contrast ratio is calculated from the relative luminance of foreground and background colors:

\[
\text{Contrast Ratio}=\frac{L_1+0.05}{L_2+0.05}
\]

Here, \(L_1\) is the lighter relative luminance and \(L_2\) is the darker relative luminance.

For WCAG AA, the minimum contrast ratio is generally:

- **4.5:1** for normal text
- **3:1** for large text

For example, `#888888` against `#FFFFFF` has a contrast ratio of approximately **3.54:1**. That fails the normal-text AA threshold but meets the numerical threshold for large text, assuming the other applicable requirements are satisfied.

### Keyboard accessibility

Keyboard checks help identify potential barriers involving focus visibility, navigation order, and modal focus behavior. Automated DOM inspection can identify some problems, but interactive behavior may require actual browser keyboard testing and human evaluation.

### Scope and limitations

VELORA is an auditing aid, not a guarantee of WCAG conformance. Automated checks cannot identify every accessibility barrier. Some requirements depend on context, assistive technology behavior, manual interaction, and human judgment.

Audit results should therefore be interpreted alongside their evidence and the scope of the checks actually performed.

## Validation and Evidence

See [`EVIDENCE.md`](./EVIDENCE.md) for the project's test scenarios, evidence, and validation notes.

When evaluating the platform, verify each official test case independently:

- **Modal focus trap:** Confirm the keyboard interaction and capture evidence.
- **Automated pass, manual failure:** Confirm that a manually identified failure is retained despite a passing automated scan.
- **Contrast over an image:** Evaluate the actual text/background combination rather than assuming a solid background.
- **Fix and retest:** Re-run the relevant checks and confirm that the issue closes only when verification succeeds.

Record the expected result, actual result, and evidence for each test. Any unsupported checks or deviations should be documented explicitly.

## Project Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── audit/
│   │   └── retest/
│   ├── issues/
│   ├── new-audit/
│   ├── reports/
│   ├── sandbox/
│   └── settings/
├── components/
├── context/
├── data/
├── lib/
│   ├── liveAuditor.ts
│   └── wcagEngine.ts
└── types/
```

## Contributing and Feedback

Issues, suggestions, and contributions that improve accessibility testing, evidence quality, keyboard verification, and reproducibility are welcome.

When reporting a problem, include the affected route, reproduction steps, expected behavior, actual behavior, and any relevant evidence.

---

**VELORA — A better web, verified.**

Built for the hackathon.
