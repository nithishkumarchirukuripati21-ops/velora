# VELORA — Autonomous WCAG Accessibility Auditor
> **A better web, verified.**

VELORA is an autonomous web accessibility auditing and runtime verification platform designed to help development teams identify Web Content Accessibility Guidelines (WCAG 2.1 & 2.2) violations, inspect cryptographic evidence, generate AI-assisted remediation code diffs, and deterministically retest issues after deployment.

By unifying live server-side DOM scraping, synthetic keyboard navigation traversal, sub-pixel photometric color contrast math, and a resilient 3-key Google Gemini AI failover network, VELORA bridges the gap between static HTML linting and real-world interactive user experiences.

---

## 📌 Overview

Automated scanners like Lighthouse and Axe-Core primarily inspect static HTML syntax in isolation, missing over **60% of runtime interactive barriers**—such as focus traps inside dynamic dialogs, color contrast failures over photographic backgrounds, and unsemantic custom widgets lacking keyboard listeners.

VELORA solves these blind spots through a closed-loop system:
- **Detects** live runtime and static barriers on any public domain.
- **Synthesizes** exact, copy-paste code patches using Google Gemini.
- **Requires** explicit human authorization before issues enter the ledger.
- **Verifies** deployed fixes through deterministic live DOM re-testing.

---

## ⚡ Core Features

- **Live DOM & Server-Side Scraping:** Securely extracts and audits live webpage DOM trees using server-side Cheerio scraping protected by DNS-resolution SSRF guards.
- **Agentic Keyboard Traversal:** Simulates cyclic `Tab` and `Escape` key sequences to detect interactive focus traps and uncover unsemantic custom buttons.
- **Sub-Pixel Luminance Sampling:** Computes color contrast ratios using the mathematical W3C relative luminance formula over rendered background imagery and gradients.
- **3-Key Google Gemini Failover Mesh:** Automatically distributes remediation workloads across a 3-project API pool to avoid HTTP 429 quota exhaustion and eliminate downtime.
- **Cryptographic Evidence Ledger:** Binds every violation to a unique 64-character SHA-256 fingerprint, CSS selector path, and keystroke breadcrumb trace.
- **Human-in-the-Loop Sign-Off:** Enforces a mandatory authorization gate where developers review proposed remediation diffs before committing them.
- **Deterministic Retest Engine:** Directly queries the live target server post-fix; closes issues with a Before/After diff only when the element passes on the remote DOM.
- **Compliance Level Filtering:** Dynamically adapts rules and contrast thresholds across WCAG 2.1 Level A, WCAG 2.2 Level AA, and WCAG 2.2 Level AAA.
- **Audit Reports & Markdown Export:** Delivers category-specific compliance metrics with one-click exportable technical audit summaries.

---

## 🧩 Core Architecture & Modules

### 1. Ingestion Gateway & Live Audit Engine
Retrieves target URLs using server-side Cheerio parsing. Before making outbound requests, the engine resolves hostnames through Node.js `dns.promises.lookup()` to block private RFC 1918 subnets (`10.x`, `192.168.x`), loopback addresses (`127.0.0.1`), and cloud metadata endpoints (`169.254.169.254`), with strict redirect guards (`{ redirect: 'error' }`).

### 2. Disagreement Arbiter & Keyboard Engine
Identifies discrepancies where static linters pass custom elements (e.g., `<div role="button">`) that fail keyboard reachability due to missing `tabindex="0"` or keyboard event listeners. In such cases, the agent overrides the static pass:

$$\text{Static Linter: PASS} \quad \land \quad \text{Keyboard Agent: FAIL} \implies \mathbf{OVERRIDE \to LOGGED \; AS \; FAILURE}$$

### 3. Photometric Contrast Engine
Calculates relative luminance ($L$) directly from underlying pixel data rather than relying on static CSS fallbacks:

$$L = 0.2126 \cdot R_{\text{linear}} + 0.7152 \cdot G_{\text{linear}} + 0.0722 \cdot B_{\text{linear}}$$

$$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05} \quad (L_1 \ge L_2)$$

When text over photo backgrounds fails the 4.5:1 threshold, the engine calculates the required dark scrim opacity (`rgba(0,0,0,0.7)`) and foreground color shift to restore compliance ($8.59:1$).

### 4. Resilient 3-Key Gemini Remediation Network
Coordinates a pool of three Google Gemini API keys across separate projects (`GEMINI_API_KEY_1/2/3`). If Key 1 triggers an HTTP 429 rate limit, it enters a 60-second cooldown while Key 2 or Key 3 immediately assumes execution without dropping in-flight audit streams.

### 5. Human Authorization & Evidence Ledger
Every candidate finding is captured with an immutable SHA-256 digest, code snippet, and proposed code remediation diff. Issues remain held at the authorization gate until approved by an engineer, preventing unreviewed changes from entering production workflows.

### 6. Deterministic Retest Verification
Kills naive mock status updates. Retesting re-fetches the live remote URL. If an issue is still detected on the remote server, it outputs:
> `Retest Failed: Issue is still actively detected on remote server.`

Issues are marked `VERIFIED FIXED` only after a clean remote inspection.

---

## 🗺️ Application Routes

| Route | Purpose |
| :--- | :--- |
| **`/`** | Landing page featuring product overview and Bento-grid architectural showcase |
| **`/dashboard`** | Platform metrics, audit status, and target calibration |
| **`/new-audit`** | Live inspection workspace with real-time terminal output |
| **`/issues`** | Human-in-the-Loop review gate, code diffs, and SHA-256 ledger |
| **`/sandbox`** | Interactive testing laboratory for keyboard and contrast scenarios (TC1–TC4) |
| **`/reports`** | Conformance scorecards and Markdown report downloads |
| **`/settings`** | Gemini 3-key mesh telemetry, model selection, and WCAG target levels |

---

## 🛠️ Technology Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Frontend:** React, Tailwind CSS, Lucide Icons, Framer Motion
- **Server-Side Scraping:** Cheerio, Node.js HTTP
- **AI Remediation Engine:** Google Gemini (1.5 Flash, 2.0 Flash)
- **Security & Crypto:** Node.js native `crypto` (SHA-256), `dns.promises` (SSRF Hardening)
- **Testing:** Headless CLI test runners (`npx tsx scripts/test-engine-live.ts`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js: `v18.0.0` or higher
- Package Manager: `npm` or `pnpm`

### Installation
```bash
git clone https://github.com/nithishkumarchirukuripati21-ops/velora.git
cd velora
npm install
