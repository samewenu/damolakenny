# Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-art-direct the existing one-page portfolio (`index.html`, `styles.css`, `app.js`) from its current minimal-editorial look into a genuine print-magazine aesthetic — warm paper + oxblood ink (light-first, ink/dark mode via toggle), Fraunces/Newsreader/Fragment Mono, radius-0, stamp buttons + underline links, duotone photo plates, and editorial devices — while preserving every piece of content and every working feature.

**Architecture:** Static site, 3 files at repo root, no build step. This is a **restyle + relayout**, not a rebuild: HTML gets targeted edits (font `<link>`, editorial hooks like running heads / folios / drop caps / plate wrappers / dateline dividers, and button/input class swaps); `styles.css` is largely rewritten around a new token + utility system, section block by section block; `app.js` changes are minimal (theme-toggle label, default flip). All styling hangs off design tokens and shared editorial utilities defined in Tasks 1–2. Each task leaves the page rendering coherently.

**Tech Stack:** Vanilla HTML/CSS/JS. Google Fonts (Fraunces, Newsreader, Fragment Mono). Inline SVG icons + inline-SVG paper grain (no new image assets). Node static server (`.claude/dev-server.mjs`) for local verification.

**Spec:** `docs/superpowers/specs/2026-07-08-portfolio-editorial-redesign-design.md` — source of truth for all decisions and exact values.

## Global Constraints

- **frontend-design skill:** the implementing session MUST load `frontend-design` before writing styling code (every task) and keep its guidance active. Task 9 is the dedicated polish pass.
- Static only: no frameworks, no build tools, no JS libraries. Only external requests are Google Fonts.
- Branch: all work on `redesign/editorial`, branched from `main`. Commit after every task.
- **Fonts:** Fraunces (display/masthead/numerals/drop caps/pull quotes), Newsreader (body/reading), Fragment Mono (folios, captions, kickers, running heads, nav, form labels). No Archivo, Inter, or Playfair. Exact Google Fonts `<link>` in Task 1.
- **Color tokens verbatim.** Light (`body.light-theme`, DEFAULT): `--paper:#f3efe4`, `--paper-inset:#eae4d5`, `--ink:#1a1714`, `--ink-soft:#55504a`, `--accent:#7a2e2e`, `--accent-text:#7a2e2e`, `--rule:rgba(26,23,20,0.22)`, `--rule-strong:rgba(26,23,20,0.55)`, `--danger:#9a2f1c`. Ink (`body.dark-theme`): `--paper:#1a1714`, `--paper-inset:#221e1a`, `--ink:#f0ead9`, `--ink-soft:#a8a094`, `--accent:#c25b53`, `--accent-text:#e0968b`, `--rule:rgba(240,234,217,0.18)`, `--rule-strong:rgba(240,234,217,0.5)`, `--danger:#e08a80`.
- **Accent usage rule:** small oxblood text (links, kickers, running heads, captions) uses `--accent-text`; large/display oxblood (headlines, numerals, drop caps, pull quotes, rules) uses `--accent`. Identical in light; `--accent-text` is the AA-safe brightened shade in ink mode.
- **Radius 0 everywhere** (`--radius: 0`). No pills, no rounded cards. Buttons are `.stamp-btn` (hard-edged) or `.link-underline` (oxblood text + drawn underline).
- **Theme:** class names stay `light-theme`/`dark-theme`; **default flips to `light-theme`** (paper). localStorage key stays `portfolio-theme`. Toggle via `classList` add/remove (never `className =`). `app.js` `initTheme` default must ALSO flip: `const initial = saved === 'dark-theme' ? 'dark-theme' : 'light-theme';` (was the reverse). Task 1 owns this app.js line.
- **Transitional compatibility aliases (Task 1):** because section CSS below the `/* ===== SECTIONS ===== */` marker is rewritten only in later tasks, Task 1 must add aliases so the interim renders coherently — in `:root`: `--radius:0` (exists), `--pill-radius:0`, `--font-head:var(--font-display)`, `--font-accent:var(--font-display)`; per theme block: `--bg-main:var(--paper)`, `--bg-surface:var(--paper-inset)`, `--text-primary:var(--ink)`, `--text-secondary:var(--ink-soft)`, `--hairline:var(--rule)`, `--pill-ink:var(--paper)`, `--accent-primary:var(--accent)`. These self-heal as sections are rewritten; Task 9 removes any leftover.
- **Copy rules:** NO city names anywhere ("Remote — Worldwide"); three core roles always in order — Customer Service Representative, AI Brand Manager, Graphic Designer; wordmark exactly `DAMOLA` + italic `kenny`.
- **Preserved element IDs (must not change):** `themeToggle`, `siteHeader`, `navMenu`, `menuToggle`, `contactForm`, `contactName`, `contactEmail`, `contactIndustry`, `contactProject`, `contactMessage`, `nameError`, `emailError`, `messageError`, `formSuccessFeedback`, `formErrorFeedback`, `contactSubmitBtn`, `viewAuditLogsBtn`, `auditLogsModal`, `closeModalBtn`, `auditLogsTableBody`, `lightbox`, `lightboxClose`, `lightboxPrev`, `lightboxNext`, `lightboxMedia`, `lightboxCaption`.
- **Accessibility:** single `h1`; retain all ARIA (form `aria-describedby`/`role=alert`/`role=status`, dialog `role`/`aria-modal`/focus traps, `aria-expanded`); AA contrast in both themes; `:focus-visible` rings in `--accent`; decorative folios/drop caps/`◆` dividers marked `aria-hidden`.
- `prefers-reduced-motion: reduce` disables cover sequence, scroll reveals, tickers; grain is static regardless.
- Duotone plates are CSS-only, develop to full color on hover/focus, with an `@supports` fallback to the plain full-color image; empty gallery slots keep the "sample coming soon" placeholder.
- Tasks 1–8 implement as written; Task 9 (polish) may refine visual values (spacing, type sizes, axis settings, hover timing) but must preserve tokens, IDs, class names, structure, and behavior.

## File Structure

| File | Responsibility |
|------|----------------|
| `index.html` | Markup; targeted edits — font link, editorial hooks, button/input class swaps, theme default |
| `styles.css` | Rewritten around new tokens + utilities (T1–2), then per-section blocks replaced (T3–8) |
| `app.js` | Minimal edits — theme-toggle label + pre-paint default; all modules preserved |
| `.claude/dev-server.mjs` | Existing local server (unchanged) |

Verification server: a Node static server may already run on port 4173 (managed externally). If `curl -s -o /dev/null -w '%{http_code}' http://localhost:4173/` returns `000`, start one: `node .claude/dev-server.mjs &` from repo root. Quote all paths (repo path contains a space). Browser checks via preview tooling; console must be clean.

---

### Task 1: Foundation — fonts, tokens, base, type utilities, paper grain

**Files:**
- Modify: `index.html` (font `<link>`, `<body>` default class, pre-paint script)
- Modify: `styles.css` (replace `:root`, both theme blocks, reset/base, typography utilities; add editorial type utilities + grain)

**Interfaces:**
- Produces: tokens per Global Constraints; CSS vars `--font-display/--font-body/--font-mono/--paper/--paper-inset/--ink/--ink-soft/--accent/--accent-text/--rule/--rule-strong/--danger/--radius/--measure/--ease`; utility classes `.display`, `.kicker`, `.running-head`, `.folio`, `.caption`, `.rule-double`, `.numeral`, `.leader-row`, `.margin-note`, `.drop-cap`, `.pull-quote`, `.grain`; `body.light-theme` default.

- [ ] **Step 1: Branch**

```bash
cd "/Users/MAC/Documents/New project/Brand Manager"
git checkout -b redesign/editorial
```

- [ ] **Step 2: Swap the font `<link>` in `index.html`** — replace the current Google Fonts line (the `family=Archivo...` link) with:

```html
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,400..900,0..100,0..1;1,9..144,400..900,0..100,0..1&family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400..600&family=Fragment+Mono:ital@0;1&display=swap" rel="stylesheet">
```

- [ ] **Step 3: Flip theme default in `index.html`.** Change `<body class="dark-theme">` to `<body class="light-theme">`. Then update the pre-paint script so it applies the *saved* choice against a light default — replace the script body's `if` block with:

```javascript
            if (localStorage.getItem('portfolio-theme') === 'dark-theme') {
                document.body.className = 'dark-theme';
            }
```

Also update `<meta name="color-scheme" content="dark light">` to `content="light dark"`.

- [ ] **Step 4: Replace the top of `styles.css`** — everything from the opening comment through the `.tag-row li { ... }` block and the `prefers-reduced-motion` block (the current lines 1–100, i.e. tokens + reset + typography utilities + pills/cards + reduced-motion) — with:

```css
/* ==========================================================================
   DAMOLAKENNY — EDITORIAL / PRINT MAGAZINE
   ========================================================================= */

:root {
    --font-display: 'Fraunces', Georgia, 'Times New Roman', serif;
    --font-body: 'Newsreader', Georgia, serif;
    --font-mono: 'Fragment Mono', 'SFMono-Regular', ui-monospace, monospace;
    --container-max: 1320px;
    --measure: 66ch;
    --section-pad: clamp(64px, 9vw, 130px);
    --radius: 0;
    --ease: cubic-bezier(0.16, 1, 0.3, 1);
}

body.light-theme {
    --paper: #f3efe4; --paper-inset: #eae4d5;
    --ink: #1a1714; --ink-soft: #55504a;
    --accent: #7a2e2e; --accent-text: #7a2e2e;
    --rule: rgba(26, 23, 20, 0.22); --rule-strong: rgba(26, 23, 20, 0.55);
    --danger: #9a2f1c; --grain-blend: multiply; --grain-opacity: 0.05;
    color-scheme: light;
}

body.dark-theme {
    --paper: #1a1714; --paper-inset: #221e1a;
    --ink: #f0ead9; --ink-soft: #a8a094;
    --accent: #c25b53; --accent-text: #e0968b;
    --rule: rgba(240, 234, 217, 0.18); --rule-strong: rgba(240, 234, 217, 0.5);
    --danger: #e08a80; --grain-blend: screen; --grain-opacity: 0.06;
    color-scheme: dark;
}

/* --- Reset & base --- */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 88px; }
body {
    font-family: var(--font-body); font-size: 1.125rem; line-height: 1.6;
    background: var(--paper); color: var(--ink);
    font-optical-sizing: auto; -webkit-font-smoothing: antialiased;
    transition: background 0.4s var(--ease), color 0.4s var(--ease);
}
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
ul, ol { list-style: none; }
button { font: inherit; color: inherit; background: none; border: none; cursor: pointer; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
::selection { background: var(--accent); color: var(--paper); }
body.no-scroll, body.menu-open { overflow: hidden; }

.container { max-width: var(--container-max); margin: 0 auto; padding: 0 clamp(20px, 5vw, 64px); }
section { padding: var(--section-pad) 0; }
p { color: var(--ink-soft); }
h1, h2, h3, h4, h5 { color: var(--ink); font-weight: 560; }

/* --- Paper grain overlay --- */
.grain {
    position: fixed; inset: 0; z-index: 200; pointer-events: none;
    opacity: var(--grain-opacity); mix-blend-mode: var(--grain-blend);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* --- Display & editorial type utilities --- */
.display {
    font-family: var(--font-display); font-weight: 560; line-height: 1.0;
    letter-spacing: -0.01em; font-optical-sizing: auto;
    font-variation-settings: 'SOFT' 40, 'WONK' 1, 'opsz' 144;
}
.kicker, .running-head, .folio, .caption {
    font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.16em;
    font-size: 0.72rem; color: var(--accent-text);
}
.running-head {
    display: flex; align-items: baseline; gap: 14px;
    padding-bottom: 12px; margin-bottom: clamp(32px, 5vw, 56px);
    border-bottom: 1px solid var(--rule);
}
.running-head .rh-folio { margin-left: auto; color: var(--ink-soft); }
.section-title { font-family: var(--font-display); font-weight: 560; font-size: clamp(2.2rem, 5vw, 4rem); line-height: 1.02; letter-spacing: -0.015em; max-width: 18ch; }
.caption { color: var(--ink-soft); display: block; margin-top: 10px; }
.folio { color: var(--ink-soft); }
.rule-double { border: 0; border-top: 3px solid var(--rule-strong); box-shadow: 0 3px 0 -2px var(--rule-strong); height: 0; }
.numeral {
    font-family: var(--font-display); font-weight: 500; color: var(--accent);
    font-size: clamp(3rem, 8vw, 7rem); line-height: 0.9;
    font-variation-settings: 'SOFT' 30, 'WONK' 0, 'opsz' 144;
}
.leader-row { display: flex; align-items: baseline; gap: 10px; }
.leader-row .leader { flex: 1; border-bottom: 1px dotted var(--rule); transform: translateY(-4px); }
.margin-note { font-family: var(--font-mono); font-size: 0.72rem; line-height: 1.5; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.06em; }
.drop-cap::first-letter {
    font-family: var(--font-display); color: var(--accent); font-weight: 600;
    float: left; font-size: 4.4em; line-height: 0.72; padding: 0.04em 0.12em 0 0;
    font-variation-settings: 'SOFT' 0, 'WONK' 0, 'opsz' 144;
}
.pull-quote {
    font-family: var(--font-display); font-style: italic; font-weight: 500;
    color: var(--accent); font-size: clamp(1.6rem, 3.5vw, 2.6rem); line-height: 1.2;
    padding: clamp(28px, 4vw, 44px) 0; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule);
}

@media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
}

/* ===== SECTIONS ===== */
```

- [ ] **Step 5: Add the grain element to `index.html`** — immediately after the opening `<body ...>` + pre-paint script, before the skip-link, add:

```html
    <div class="grain" aria-hidden="true"></div>
```

- [ ] **Step 6: Verify**

```bash
curl -s -o /dev/null -w '%{http_code}' http://localhost:4173/ || node .claude/dev-server.mjs &
curl -s http://localhost:4173/ | grep -c 'Fraunces'
curl -s http://localhost:4173/ | grep -c 'class="light-theme"'
```

Expected: `1` and `1`. Browser: warm cream page, Fraunces/Newsreader loading, faint grain, no console errors. (Sections below still use old CSS blocks — the page is a coherent hybrid until later tasks; that is expected.)

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: editorial foundation — fonts, paper/ink tokens, type utilities, grain"
```

---

### Task 2: Components — stamp buttons, underline links, form inputs, duotone plates, dateline tickers, theme toggle

**Files:**
- Modify: `styles.css` (append component styles below the `/* ===== SECTIONS ===== */` marker)
- Modify: `index.html` (swap button/CTA classes; theme-toggle label; ticker dividers)
- Modify: `app.js` (`initTheme` — no structural change, but remove reliance on sun/moon icons if needed; toggle label handled in CSS/HTML)

**Interfaces:**
- Consumes: tokens + utilities (T1).
- Produces: `.link-underline`, `.stamp-btn`, `.field` (underline input), `.plate` (+ `.plate-media`, duotone develop, `@supports` fallback), `.dateline` (restyled marquee), `.theme-toggle` label form.

- [ ] **Step 1: Append component CSS to `styles.css`:**

```css
/* --- Links & buttons --- */
.link-underline {
    color: var(--accent-text); font-family: var(--font-mono); text-transform: uppercase;
    letter-spacing: 0.12em; font-size: 0.8rem; padding-bottom: 3px;
    background-image: linear-gradient(var(--accent-text), var(--accent-text));
    background-size: 0% 1px; background-position: 0 100%; background-repeat: no-repeat;
    transition: background-size 0.4s var(--ease);
}
.link-underline:hover, .link-underline:focus-visible { background-size: 100% 1px; }
.link-underline .arr { margin-left: 8px; }
.stamp-btn {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.78rem;
    color: var(--ink); background: transparent; border: 1px solid var(--accent);
    padding: 14px 26px; border-radius: 0;
    transition: background 0.3s var(--ease), color 0.3s var(--ease), box-shadow 0.1s var(--ease);
}
.stamp-btn:hover { background: var(--accent); color: var(--paper); }
.stamp-btn:active { box-shadow: inset 0 2px 6px rgba(0,0,0,0.35); }

/* --- Underline form fields --- */
.field {
    font-family: var(--font-body); font-size: 1rem; color: var(--ink); background: transparent;
    border: 0; border-bottom: 1px solid var(--ink); border-radius: 0; padding: 10px 2px;
    transition: border-color 0.3s var(--ease);
}
.field:focus { outline: none; border-bottom-color: var(--accent); }
.field.invalid { border-bottom-color: var(--danger); }
select.field { background: var(--paper); }

/* --- Duotone plate --- */
.plate { position: relative; overflow: hidden; background: var(--paper-inset); border: 1px solid var(--rule); }
.plate img { width: 100%; height: 100%; object-fit: cover; display: block; }
@supports (mix-blend-mode: multiply) {
    .plate.duo img { filter: grayscale(1) contrast(1.04); transition: filter 0.5s var(--ease); }
    .plate.duo::before, .plate.duo::after {
        content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none;
        transition: opacity 0.5s var(--ease);
    }
    .plate.duo::before { background: var(--accent); mix-blend-mode: multiply; opacity: 0.9; }
    .plate.duo::after { background: var(--paper); mix-blend-mode: screen; opacity: 0.5; }
    .plate.duo:hover img, .plate.duo:focus-within img { filter: none; }
    .plate.duo:hover::before, .plate.duo:hover::after,
    .plate.duo:focus-within::before, .plate.duo:focus-within::after { opacity: 0; }
}

/* --- Dateline ticker (restyled marquee) --- */
.dateline { overflow: hidden; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); padding: 14px 0; }
.dateline .marquee-track { display: flex; width: max-content; animation: marquee 34s linear infinite; }
.dateline .marquee-set {
    display: flex; gap: 30px; padding-right: 30px; white-space: nowrap; align-items: center;
    font-family: var(--font-display); font-weight: 500; font-size: 1.05rem; text-transform: uppercase; letter-spacing: 0.04em;
}
.dateline .marquee-set .dot { color: var(--accent); }
.dateline:hover .marquee-track { animation-play-state: paused; }
@keyframes marquee { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .dateline .marquee-track { animation: none; } }

/* --- Theme toggle (PAPER / INK label switch) --- */
.theme-toggle {
    font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.14em;
    color: var(--ink-soft); border: 1px solid var(--rule); padding: 8px 12px; display: inline-flex; gap: 6px;
}
.theme-toggle .tt-on { color: var(--accent-text); }
body.light-theme .theme-toggle .tt-ink { color: var(--ink-soft); }
body.light-theme .theme-toggle .tt-paper { color: var(--accent-text); }
body.dark-theme .theme-toggle .tt-paper { color: var(--ink-soft); }
body.dark-theme .theme-toggle .tt-ink { color: var(--accent-text); }
```

- [ ] **Step 2: Replace the theme-toggle button contents in `index.html`.** Replace the two `<svg class="icon-sun">`/`<svg class="icon-moon">` inside `<button ... id="themeToggle" ...>` with:

```html
                    <span class="tt-paper">Paper</span><span aria-hidden="true">/</span><span class="tt-ink">Ink</span>
```

Keep the button's `id="themeToggle"` and `aria-label`.

- [ ] **Step 3: Swap all button/CTA classes in `index.html`** (structure unchanged, only class + minor inner markup):
  - Nav CTA `class="pill pill-primary nav-cta"` → `class="link-underline nav-cta"`.
  - Hero CTAs: "See My Work" `pill pill-primary` → `stamp-btn`; "Let's Talk" `pill pill-outline` → `link-underline`.
  - About resume `class="pill pill-outline"` → `class="stamp-btn"`.
  - Big-CTA: "Book a Call" `pill pill-primary` → `stamp-btn`; "Fill the Brief" `pill pill-outline` → `link-underline`.
  - Contact submit: `class="pill pill-primary btn-submit"` → `class="stamp-btn btn-submit"` (keep `id="contactSubmitBtn"`).
  - Footer email `class="pill pill-dark"` → `class="link-underline"`; footer "Back to Top" `class="pill pill-dark back-top"` → `class="link-underline back-top"`.

- [ ] **Step 4: Restyle the two tickers' markup in `index.html`.** On both `<div class="marquee ...">` (roles + tools) change the wrapper class to `class="dateline"` (keep `aria-hidden="true"`). Inside each `.marquee-set`, the current items are `<span>…</span>` separators; ensure divider spans between items read `<span class="dot" aria-hidden="true">◆</span>` (replace the existing plain `—` separators with `◆` dot spans; keep both `.marquee-set` halves identical).

- [ ] **Step 5: Verify**

```bash
node --check app.js
curl -s http://localhost:4173/ | grep -c 'stamp-btn'
curl -s http://localhost:4173/ | grep -c 'link-underline'
curl -s http://localhost:4173/ | grep -c 'dateline'
```

Expected: `node --check` silent; stamp-btn ≥ 3, link-underline ≥ 4, dateline = 2. Browser: buttons render as bordered stamps / underline links (no pills), theme toggle shows `Paper / Ink` and flips + persists, tickers show `◆` dividers in Fraunces.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: editorial components — stamp buttons, underline links, duotone plates, dateline tickers, paper/ink toggle"
```

---

### Task 3: Masthead + cover (nav & hero)

**Files:**
- Modify: `index.html` (nav running header + folio; hero cover markup — running head, dateline credit, portrait plate, stats figures)
- Modify: `styles.css` (replace the current nav block AND hero block with editorial versions)

**Interfaces:**
- Consumes: T1 utilities, T2 components.
- Produces: `.masthead`, `.cover`, `.cover-figure`, `.stat-figures`.

- [ ] **Step 1: Replace the nav block CSS** (current `.navbar-wrapper`/`.navbar`/`.nav-*` rules) with:

```css
/* --- Masthead --- */
.navbar-wrapper { position: sticky; top: 0; z-index: 80; background: var(--paper); transition: box-shadow 0.3s var(--ease); }
.navbar-wrapper::after { content: ''; display: block; height: 0; border-bottom: 1px solid var(--rule); }
.navbar-wrapper.scrolled { box-shadow: 0 1px 0 var(--rule); }
.navbar { display: flex; align-items: center; justify-content: space-between; gap: 24px; height: 74px; }
.nav-logo { font-family: var(--font-display); font-weight: 600; font-size: 1.35rem; letter-spacing: -0.01em; }
.logo-italic { font-style: italic; font-weight: 500; }
.nav-list { display: flex; gap: 26px; }
.nav-link { font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--ink-soft); padding-bottom: 3px;
    background-image: linear-gradient(var(--accent-text), var(--accent-text)); background-size: 0% 1px; background-position: 0 100%; background-repeat: no-repeat; transition: color 0.3s var(--ease), background-size 0.3s var(--ease); }
.nav-link:hover { color: var(--ink); background-size: 100% 1px; }
.nav-actions { display: flex; align-items: center; gap: 16px; }
.nav-folio { font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--ink-soft); }
.menu-toggle { display: none; }
.menu-toggle .icon-close { display: none; }
body.menu-open .menu-toggle .icon-close { display: block; }
body.menu-open .menu-toggle .icon-bars { display: none; }
@media (max-width: 900px) {
    .nav-list { position: fixed; inset: 0; z-index: 90; display: none; flex-direction: column; align-items: center; justify-content: center; gap: 28px; background: var(--paper); font-size: 1rem; }
    .nav-list.active { display: flex; }
    .nav-list .nav-link { font-size: 1.1rem; }
    .menu-toggle { display: inline-flex; flex: 0 0 auto; position: relative; z-index: 100; border: 1px solid var(--rule); width: 40px; height: 40px; align-items: center; justify-content: center; }
    .nav-folio { display: none; }
    .nav-cta { display: none; }
}
```

- [ ] **Step 2: Add a folio to the nav in `index.html`.** Inside `.nav-actions`, before the `theme-toggle` button, add:

```html
                <span class="nav-folio" aria-hidden="true">№ 01 · Portfolio</span>
```

- [ ] **Step 3: Replace the hero block CSS** (current `.hero*`, `.stats-row`, `.stat*`, `.employer*` rules) with:

```css
/* --- Cover (hero) --- */
.hero { padding-top: clamp(36px, 6vw, 80px); }
.rule-double.cover-rule { margin-bottom: 20px; }
.cover-issue { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.16em; color: var(--ink-soft); margin-bottom: clamp(28px, 5vw, 56px); }
.cover-grid { display: grid; grid-template-columns: 1.35fr 1fr; gap: clamp(28px, 5vw, 64px); align-items: end; }
.cover-headline { font-family: var(--font-display); font-weight: 540; font-size: clamp(3rem, 9vw, 7.5rem); line-height: 0.95; letter-spacing: -0.02em; font-variation-settings: 'SOFT' 30, 'WONK' 1, 'opsz' 144; margin-bottom: 28px; }
.cover-headline em { font-style: italic; color: var(--accent); font-weight: 500; }
.cover-credit { font-family: var(--font-mono); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--ink-soft); line-height: 1.9; margin-bottom: 28px; }
.cover-lead { max-width: 46ch; margin-bottom: 28px; }
.cover-ctas { display: flex; flex-wrap: wrap; align-items: center; gap: 22px; }
.cover-figure { }
.cover-figure .plate { aspect-ratio: 4 / 5; }
.stat-figures { display: flex; margin-top: clamp(40px, 6vw, 72px); border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
.stat-fig { flex: 1; padding: 22px 0; border-right: 1px solid var(--rule); }
.stat-fig:last-child { border-right: 0; padding-left: 0; }
.stat-fig:not(:first-child) { padding-left: 24px; }
.stat-fig .num { font-family: var(--font-display); font-weight: 500; font-size: clamp(1.8rem, 3.4vw, 2.8rem); color: var(--ink); font-variation-settings: 'opsz' 144; }
.stat-fig .lbl { font-family: var(--font-mono); font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--ink-soft); margin-top: 6px; }
@media (max-width: 820px) {
    .cover-grid { grid-template-columns: 1fr; align-items: start; }
    .cover-figure { max-width: 420px; }
    .stat-figures { flex-direction: column; }
    .stat-fig { border-right: 0; border-bottom: 1px solid var(--rule); padding-left: 0 !important; }
    .stat-fig:last-child { border-bottom: 0; }
}
```

- [ ] **Step 4: Replace the hero HTML** — the inner content of `<section class="hero" id="hero">` becomes (keep the section wrapper + `reveal` classes on the copy/figure/meta):

```html
        <section class="hero" id="hero">
            <div class="container">
                <hr class="rule-double cover-rule" aria-hidden="true">
                <div class="cover-issue"><span>Portfolio № 01</span><span>Remote — Worldwide</span></div>
                <div class="cover-grid">
                    <div class="cover-copy reveal">
                        <h1 class="cover-headline">Customer care, AI brands &amp; design — <em>done properly.</em></h1>
                        <p class="cover-credit">Customer Service Representative — AI Brand Manager — Graphic Designer</p>
                        <p class="cover-lead drop-cap">I'm Oyindamola. I keep customers genuinely cared for, build AI-powered brand systems, and design the assets that make it all look sharp — for tech, e-commerce, and lifestyle startups. Fully remote, worldwide.</p>
                        <div class="cover-ctas">
                            <a href="#work" class="stamp-btn">See the Work</a>
                            <a href="#contact" class="link-underline">Let's Talk <span class="arr" aria-hidden="true">→</span></a>
                        </div>
                    </div>
                    <figure class="cover-figure reveal">
                        <div class="plate duo"><img src="assets/oyindamola_portrait.png" alt="Portrait of Oyindamola Kehinde Waheed"></div>
                        <figcaption class="caption">Fig. 1 — Oyindamola Kehinde Waheed</figcaption>
                    </figure>
                </div>
                <dl class="stat-figures reveal">
                    <div class="stat-fig"><dd class="num">5+</dd><dt class="lbl">Years in ops &amp; support</dt></div>
                    <div class="stat-fig"><dd class="num">3</dd><dt class="lbl">Core disciplines</dt></div>
                    <div class="stat-fig"><dd class="num">&lt;24h</dd><dt class="lbl">Response time</dt></div>
                </dl>
                <p class="kicker" style="margin-top:40px;">Organizations I've worked with</p>
                <div class="employer-strip">
                    <span>CVS Pharmacy</span><span>Sagility Health</span><span>University of Ibadan</span><span>Abiodun Foundation College</span><span>Lawleezy Healthcare</span>
                </div>
            </div>
        </section>
```

Add employer-strip CSS to the hero block:

```css
.employer-strip { display: flex; flex-wrap: wrap; gap: 14px 30px; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--rule); }
.employer-strip span { font-family: var(--font-display); font-weight: 500; font-size: 0.95rem; color: var(--ink-soft); font-style: italic; }
```

- [ ] **Step 5: Verify**

```bash
curl -s http://localhost:4173/ | grep -c 'cover-headline'
curl -s http://localhost:4173/ | grep -c 'stat-fig'
```

Expected: `1`, `3`. Browser: cover shows an oversized asymmetric Fraunces headline with italic oxblood accent, mono credit line, drop-cap lead, duotone portrait plate with `Fig. 1` caption (develops to color on hover), three big stat figures, running-header nav with folio + Paper/Ink toggle. Single `h1`. No console errors.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: masthead running header and magazine cover hero"
```

---

### Task 4: Services editorial index + secondary skills contents list

**Files:**
- Modify: `index.html` (services section — running head, numbered feature rows, ruled skills list)
- Modify: `styles.css` (replace `.services`/`.service-*`/`.skills-*` blocks)

**Interfaces:** Consumes T1/T2. Produces `.feature-index`, `.feature-row`, `.skills-index`.

- [ ] **Step 1: Replace the services CSS** with:

```css
/* --- Services (editorial index) --- */
.feature-index { border-top: 1px solid var(--rule); }
.feature-row { display: grid; grid-template-columns: auto 1fr; gap: clamp(20px, 4vw, 56px); padding: clamp(28px, 4vw, 48px) 0; border-bottom: 1px solid var(--rule); }
.feature-row .numeral { line-height: 0.8; }
.feature-row h3 { font-family: var(--font-display); font-weight: 560; font-size: clamp(1.5rem, 3vw, 2.2rem); margin-bottom: 12px; }
.feature-row .feature-body { max-width: 60ch; margin-bottom: 16px; }
.feature-row .feature-tools { font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--ink-soft); }
.skills-index { margin-top: clamp(44px, 6vw, 72px); }
.skills-index .skill-row { display: flex; align-items: baseline; gap: 14px; padding: 16px 0; border-bottom: 1px solid var(--rule); }
.skills-index .skill-row:first-of-type { border-top: 1px solid var(--rule); }
.skills-index .skill-name { font-family: var(--font-display); font-weight: 560; font-size: 1.1rem; }
.skills-index .leader { flex: 1; border-bottom: 1px dotted var(--rule); transform: translateY(-4px); }
.skills-index .skill-tools { font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-soft); }
```

- [ ] **Step 2: Replace the services HTML** inner content (keep `<section class="services" id="services">`). Running head + three feature rows + skills contents list:

```html
        <section class="services" id="services">
            <div class="container">
                <div class="running-head reveal"><span>№ 01</span><span>What I Do</span><span class="rh-folio" aria-hidden="true">Services</span></div>
                <h2 class="section-title reveal" style="margin-bottom:clamp(32px,4vw,48px);">Three disciplines, one operator.</h2>
                <div class="feature-index">
                    <article class="feature-row reveal"><span class="numeral" aria-hidden="true">01</span><div><h3>Customer Service Representative</h3><p class="feature-body">Empathetic frontline support that keeps customers loyal — ticketing, escalations, billing queries, and retention across chat, email, and phone.</p><p class="feature-tools">Zendesk · CRM platforms · Ticketing · Live chat · Email support · Care-portal systems · Escalation workflows</p></div></article>
                    <article class="feature-row reveal"><span class="numeral" aria-hidden="true">02</span><div><h3>AI Brand Manager</h3><p class="feature-body">Brand voice systems, AI-assisted content pipelines, and persona mapping that keep your brand consistent everywhere it speaks.</p><p class="feature-tools">Claude · ChatGPT · Jasper · Midjourney · Prompt engineering · Content calendars · Brand voice guides</p></div></article>
                    <article class="feature-row reveal"><span class="numeral" aria-hidden="true">03</span><div><h3>Graphic Designer</h3><p class="feature-body">Clean, editorial social assets, slide systems, and marketing graphics designed to sell without shouting.</p><p class="feature-tools">Canva · Photoshop · Midjourney · Slide systems · Social templates · Brand kits</p></div></article>
                </div>
                <div class="skills-index reveal">
                    <p class="kicker">Also in my toolkit</p>
                    <div class="skill-row"><span class="skill-name">Data Analysis</span><span class="leader" aria-hidden="true"></span><span class="skill-tools">SQL · Power BI · Excel</span></div>
                    <div class="skill-row"><span class="skill-name">Executive Assistance</span><span class="leader" aria-hidden="true"></span><span class="skill-tools">Notion · MS Teams · SOP design</span></div>
                    <div class="skill-row"><span class="skill-name">Social Media Management</span><span class="leader" aria-hidden="true"></span><span class="skill-tools">Buffer · Later · Copywriting</span></div>
                    <div class="skill-row"><span class="skill-name">Video Editing</span><span class="leader" aria-hidden="true"></span><span class="skill-tools">CapCut · Premiere Pro</span></div>
                </div>
            </div>
        </section>
```

- [ ] **Step 3: Verify**

```bash
curl -s http://localhost:4173/ | grep -c 'feature-row'
curl -s http://localhost:4173/ | grep -c 'skill-row'
```

Expected: `3`, `4`. Browser: three ruled feature rows with big oxblood numerals hanging left, role titles in Fraunces, tools as mono captions; skills as a dot-leader contents list; running head with folio. Roles in correct order.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: services as editorial numbered index + skills contents list"
```

---

### Task 5: Selected Work — asymmetric photo plates + lightbox spread

**Files:**
- Modify: `index.html` (work section — running head, filter toggles, plate figures, mono captions/folios; lightbox caption furniture)
- Modify: `styles.css` (replace `.work`/`.filter-*`/`.work-*`/`.tile-*`/lightbox blocks)

**Interfaces:** Consumes T1/T2 (`.plate.duo`). Produces `.plate-grid`, `.plate-item`, `.filter-toggle`. Preserves all lightbox IDs and the `.work-tile[data-*]`/`.tile-btn` contract used by `initGallery`/`initLightbox`.

- [ ] **Step 1: Replace the work + lightbox CSS** with:

```css
/* --- Selected Work (plates) --- */
.filter-row { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 34px; }
.filter-toggle { font-family: var(--font-mono); font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--ink-soft); padding-bottom: 3px; border-bottom: 1px solid transparent; transition: color 0.3s var(--ease), border-color 0.3s var(--ease); }
.filter-toggle:hover { color: var(--ink); }
.filter-toggle.active { color: var(--accent-text); border-bottom-color: var(--accent); }
.plate-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: clamp(18px, 2.4vw, 32px); }
.work-tile { grid-column: span 2; }
.work-tile:nth-child(6n+1) { grid-column: span 3; }
.work-tile:nth-child(6n+4) { grid-column: span 3; }
.work-tile .tile-btn { display: block; width: 100%; }
.work-tile .plate { aspect-ratio: 4 / 3; }
.work-tile.tall .plate { aspect-ratio: 3 / 4; }
.work-tile figcaption { display: flex; justify-content: space-between; gap: 12px; margin-top: 12px; font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--ink-soft); }
.work-tile figcaption .w-title { color: var(--ink); }
.work-note { margin-top: 28px; font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-soft); }
.tile-media { display: block; width: 100%; height: 100%; }
.tile-media::before { content: 'Sample coming soon'; position: absolute; inset: 0; z-index: 2; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--ink-soft); }
.tile-media img { position: relative; z-index: 3; }
@media (max-width: 820px) { .plate-grid { grid-template-columns: 1fr 1fr; } .work-tile, .work-tile:nth-child(6n+1), .work-tile:nth-child(6n+4) { grid-column: span 1; } }
@media (max-width: 520px) { .plate-grid { grid-template-columns: 1fr; } }

/* --- Lightbox (spread) --- */
.lightbox { position: fixed; inset: 0; z-index: 150; display: flex; align-items: center; justify-content: center; gap: 16px; background: rgba(20,17,14,0.94); padding: 24px; }
.lightbox[hidden] { display: none; }
.lightbox-figure { max-width: min(860px, 82vw); border: 1px solid var(--rule-strong); }
.lightbox-media { background: var(--paper-inset); }
.lightbox-media img { max-height: 72vh; width: 100%; object-fit: contain; }
.lightbox-placeholder { display: flex; align-items: center; justify-content: center; width: min(680px,70vw); height: 46vh; font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--ink-soft); }
.lightbox figcaption { color: var(--paper); font-family: var(--font-mono); font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.12em; padding: 14px 16px; border-top: 1px solid rgba(240,234,217,0.2); }
.lightbox-btn { width: 46px; height: 46px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid rgba(240,234,217,0.3); color: var(--paper); flex: 0 0 auto; }
.lightbox-btn:hover { border-color: var(--accent); }
.lightbox-close { position: absolute; top: 24px; right: 24px; }
@media (max-width: 520px) { .lightbox { flex-wrap: wrap; } .lightbox-prev, .lightbox-next { order: 2; } }
```

- [ ] **Step 2: Edit the work HTML.** Keep `<section class="work" id="work">` and the 10 `<figure class="work-tile" data-category data-title data-category-label>` blocks with their `<button class="tile-btn">…<span class="tile-media"><img …></span></button>` (the `initGallery`/`initLightbox` contract). Changes:
  - Replace the `.section-head` (micro-label + title) with a running head + section title:
    ```html
    <div class="running-head reveal"><span>№ 02</span><span>Selected Work</span><span class="rh-folio" aria-hidden="true">Plates</span></div>
    <h2 class="section-title reveal" style="margin-bottom:clamp(28px,4vw,44px);">The work speaks for itself.</h2>
    ```
  - Change the chips container `class="filter-row"` (keep) but each `<button class="filter-chip" data-filter="…">` → `class="filter-toggle"` (keep `data-filter` and the `active` default on "All"). Wrap the grid container class `work-grid` → `plate-grid`.
  - Inside each tile, wrap the media as a duotone plate: the existing `<span class="tile-media"><img …></span>` stays, but add `class="plate duo"` to a wrapper around it — i.e. `<span class="tile-media plate duo"><img …></span>` (the `.plate` positioning + `.tile-media::before` placeholder coexist; `initGallery`'s `img.remove()` on error still reveals the `::before`).
  - Update each `<figcaption>` to mono furniture: `<figcaption><span class="w-title">AI Brand Voice System</span><span>Plate 01 — Brand &amp; Social</span></figcaption>` (number plates 01–10 in order; keep the category label text).
  - Keep the `.work-note` paragraph; its new class styling is already defined.
  - **Important:** verify `initGallery` toggles `.work-tile[hidden]` (unchanged) and `initLightbox` reads `data-title`/`data-category-label` (unchanged). Do not rename these.

- [ ] **Step 3: Verify**

```bash
node --check app.js
curl -s http://localhost:4173/ | grep -c 'work-tile'
curl -s http://localhost:4173/ | grep -c 'filter-toggle'
curl -s http://localhost:4173/ | grep -c 'plate duo'
```

Expected: `10`, `5`, `10`. Browser: asymmetric plate grid (first tile of each six spans wider), duotone tiles that develop to full color on hover, mono `Plate NN — Category` captions; filter toggles are underlined-when-active mono text; clicking a tile opens the framed lightbox spread with a figure-legend caption; filters still show correct counts (Video → 2); placeholders show for missing images (no broken icons).

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: selected work as asymmetric duotone photo plates + lightbox spread"
```

---

### Task 6: About feature + testimonials pull quotes + process + experience contents

**Files:**
- Modify: `index.html` (about, testimonials, process, experience sections)
- Modify: `styles.css` (replace `.about*`, `.testimonials`/`.quote-*`, `.process*`, `.experience`/`.xp-*` blocks)

**Interfaces:** Consumes T1/T2 (`.drop-cap`, `.pull-quote`, `.numeral`, `.margin-note`, `.plate.duo`, `.leader-row`). Produces `.feature-article`, `.quotes`, `.process-list`, `.contents`.

- [ ] **Step 1: Replace the about + testimonials + process + experience CSS** with:

```css
/* --- About (feature article) --- */
.feature-article { display: grid; grid-template-columns: 1fr 1.35fr; gap: clamp(28px, 5vw, 64px); align-items: start; }
.feature-article .about-figure .plate { aspect-ratio: 4 / 5; }
.feature-article .about-figure figcaption { margin-top: 10px; }
.about-body > p { margin-bottom: 18px; max-width: var(--measure); }
.about-lead { font-size: 1.3rem; color: var(--ink); }
.about-notes { display: flex; gap: 28px; margin: 22px 0 26px; }
.about-notes .margin-note strong { display: block; font-family: var(--font-display); font-style: normal; font-size: 1.2rem; color: var(--ink); letter-spacing: 0; }
@media (max-width: 820px) { .feature-article { grid-template-columns: 1fr; } .feature-article .about-figure { max-width: 380px; } }

/* --- Testimonials (pull quotes) --- */
.quotes { display: grid; gap: 0; }
.quotes blockquote { padding: clamp(24px, 3.5vw, 40px) 0; border-bottom: 1px solid var(--rule); }
.quotes blockquote:first-child { border-top: 1px solid var(--rule); }
.quotes blockquote p { font-family: var(--font-display); font-style: italic; font-weight: 500; color: var(--accent); font-size: clamp(1.4rem, 3vw, 2.2rem); line-height: 1.25; margin-bottom: 14px; }
.quotes cite { font-family: var(--font-mono); font-style: normal; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--ink-soft); }
.quotes cite::before { content: '— '; }

/* --- Process --- */
.process-list { max-width: 780px; }
.process-step { display: grid; grid-template-columns: auto 1fr; gap: 28px; padding: 26px 0; border-bottom: 1px solid var(--rule); align-items: baseline; }
.process-step:first-child { border-top: 1px solid var(--rule); }
.process-step .numeral { font-size: clamp(2.2rem, 5vw, 3.6rem); }
.process-step h3 { font-family: var(--font-display); font-weight: 560; font-size: 1.25rem; margin-bottom: 6px; }

/* --- Experience (contents page) --- */
.contents { border-top: 1px solid var(--rule); }
.contents .xp-row { display: grid; grid-template-columns: 150px 1fr auto; gap: 18px; align-items: baseline; padding: 16px 0; border-bottom: 1px solid var(--rule); }
.contents .xp-dates { font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-soft); }
.contents .xp-role { font-family: var(--font-display); font-weight: 560; font-size: 1.05rem; }
.contents .xp-org { font-family: var(--font-body); font-style: italic; color: var(--ink-soft); }
@media (max-width: 640px) { .contents .xp-row { grid-template-columns: 1fr; gap: 4px; } .contents .xp-org { text-align: left; } }
```

- [ ] **Step 2: Replace the about HTML** inner content (keep `<section class="about" id="about">`):

```html
        <section class="about" id="about">
            <div class="container">
                <div class="running-head reveal"><span>№ 03</span><span>About</span><span class="rh-folio" aria-hidden="true">The Person</span></div>
                <div class="feature-article">
                    <figure class="about-figure reveal">
                        <div class="plate duo"><img src="assets/about_candid.png" alt="Oyindamola working at her desk"></div>
                        <figcaption class="caption">Fig. 2 — At work</figcaption>
                    </figure>
                    <div class="about-body reveal">
                        <h2 class="section-title" style="margin-bottom:24px;">The person behind the systems.</h2>
                        <p class="about-lead drop-cap">I didn't take the traditional path. My training is in scientific research — a B.Sc. and M.Sc. in Human Anatomy — where I learned to see operations as systems: patterns, precision, and processes that hold up under pressure.</p>
                        <div class="about-notes">
                            <p class="margin-note"><strong>B.Sc.</strong> Anatomy</p>
                            <p class="margin-note"><strong>M.Sc.</strong> Human Anatomy</p>
                        </div>
                        <p>That rigor carried me through frontline support and administrative operations at CVS Pharmacy and Sagility Health, and today it powers everything I do — from resolving a customer's toughest day to building AI brand systems and designing assets that feel human.</p>
                        <a href="OYINDAMOLA RESUME(pdfgear.com).pdf" download="Oyindamola_Resume.pdf" class="stamp-btn" style="margin-top:8px;">Get My Resume (PDF)</a>
                    </div>
                </div>
            </div>
        </section>
```

- [ ] **Step 3: Replace the testimonials HTML** inner content (keep `<section class="testimonials">`), keeping the placeholder comment:

```html
        <section class="testimonials">
            <div class="container">
                <div class="running-head reveal"><span>№ 04</span><span>Testimonials</span><span class="rh-folio" aria-hidden="true">Notices</span></div>
                <!-- PLACEHOLDER TESTIMONIALS — swap with real quotes before wide sharing (spec §10) -->
                <div class="quotes">
                    <blockquote class="reveal"><p>"Oyindamola turned our support inbox from a fire drill into a system. Response times dropped and customers noticed."</p><cite>Operations Lead, healthcare services</cite></blockquote>
                    <blockquote class="reveal"><p>"The brand voice prompts she built write like our best copywriter on their best day."</p><cite>Founder, e-commerce startup</cite></blockquote>
                    <blockquote class="reveal"><p>"Clean, consistent design work delivered faster than agencies we'd paid triple for."</p><cite>Marketing Manager, SaaS</cite></blockquote>
                    <blockquote class="reveal"><p>"She documents everything. Handovers that used to take weeks now take a call."</p><cite>CEO, creative agency</cite></blockquote>
                </div>
            </div>
        </section>
```

- [ ] **Step 4: Replace the process HTML** inner content (keep `<section class="process" id="process">`):

```html
        <section class="process" id="process">
            <div class="container">
                <div class="running-head reveal"><span>№ 05</span><span>How We'd Work</span><span class="rh-folio" aria-hidden="true">Method</span></div>
                <h2 class="section-title reveal" style="margin-bottom:clamp(28px,4vw,44px);">A four-step process.</h2>
                <ol class="process-list">
                    <li class="process-step reveal"><span class="numeral" aria-hidden="true">1</span><div><h3>Discovery Call</h3><p>We talk goals, scope, and fit. Book via the contact form or email.</p></div></li>
                    <li class="process-step reveal"><span class="numeral" aria-hidden="true">2</span><div><h3>Audit &amp; Proposal</h3><p>I review your current support, brand, and content setup, then send a clear plan with scope and timeline.</p></div></li>
                    <li class="process-step reveal"><span class="numeral" aria-hidden="true">3</span><div><h3>Build &amp; Iterate</h3><p>I execute with weekly check-ins and transparent reporting. You always know what's shipping.</p></div></li>
                    <li class="process-step reveal"><span class="numeral" aria-hidden="true">4</span><div><h3>Handover &amp; Support</h3><p>Documentation and SOPs so your team can run it — with ongoing support if you want it.</p></div></li>
                </ol>
            </div>
        </section>
```

- [ ] **Step 5: Replace the experience HTML** inner content (keep `<section class="experience">` and the commented certification template):

```html
        <section class="experience">
            <div class="container">
                <div class="running-head reveal"><span>№ 06</span><span>Experience</span><span class="rh-folio" aria-hidden="true">Contents</span></div>
                <ul class="contents">
                    <li class="xp-row reveal"><span class="xp-dates">Oct 2024 – Jul 2025</span><span class="xp-role">Customer Service Representative</span><span class="xp-org">CVS Pharmacy · Remote</span></li>
                    <li class="xp-row reveal"><span class="xp-dates">Jan 2023 – Jun 2024</span><span class="xp-role">Healthcare Representative</span><span class="xp-org">Sagility Health · Remote</span></li>
                    <li class="xp-row reveal"><span class="xp-dates">Nov 2022 – Dec 2023</span><span class="xp-role">Tutor &amp; Content Designer</span><span class="xp-org">Abiodun Foundation College</span></li>
                    <li class="xp-row reveal"><span class="xp-dates">Feb 2019 – Sep 2022</span><span class="xp-role">Locum Pharmacist &amp; Operations Support</span><span class="xp-org">Lawleezy Healthcare Pharmacy</span></li>
                    <li class="xp-row reveal"><span class="xp-dates">Jun 2021 – Dec 2021</span><span class="xp-role">Laboratory Attendant &amp; Data Analyst</span><span class="xp-org">Human Anatomy Dept., University of Ibadan</span></li>
                </ul>
                <!-- CERTIFICATIONS: client will supply entries (spec §10). Duplicate the block below when they arrive:
                <div class="certs" style="margin-top:44px;">
                    <p class="kicker">Certifications</p>
                    <ul class="contents"><li class="xp-row"><span class="xp-dates">YEAR</span><span class="xp-role">Certificate name</span><span class="xp-org">Issuer</span></li></ul>
                </div>
                -->
            </div>
        </section>
```

- [ ] **Step 6: Verify**

```bash
curl -s http://localhost:4173/ | grep -c 'process-step'
curl -s http://localhost:4173/ | grep -c 'xp-row'
curl -s http://localhost:4173/ | grep -c 'quotes'
```

Expected: `4`, `6` (5 visible + 1 in the commented template), `1`. Browser: about is a two-column feature with oxblood drop cap, duotone portrait + caption, mono margin-notes for degrees, stamp resume button; testimonials are large italic oxblood pull quotes with mono attributions divided by rules; process is numbered steps with big numerals; experience is a ruled contents list. No city names in prose.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: about feature, pull-quote testimonials, process steps, contents-page experience"
```

---

### Task 7: FAQ interview + big CTA + contact correspondence + footer colophon + audit modal

**Files:**
- Modify: `index.html` (faq, big-cta, contact, footer, audit modal)
- Modify: `styles.css` (replace `.faq*`, `.big-cta*`, `.contact*`, form, `.footer*`, `.modal*`/audit blocks)

**Interfaces:** Consumes T1/T2 (`.field`, `.stamp-btn`, `.link-underline`, `.running-head`). Preserves all form + modal IDs and ARIA.

- [ ] **Step 1: Replace the faq + big-cta + contact + footer + modal CSS** with:

```css
/* --- FAQ (interview) --- */
.faq-grid { border-top: 1px solid var(--rule); }
.faq-item { border-bottom: 1px solid var(--rule); }
.faq-item summary { cursor: pointer; list-style: none; display: flex; gap: 14px; align-items: baseline; padding: 20px 0; font-family: var(--font-display); font-weight: 560; font-size: 1.15rem; }
.faq-item summary::-webkit-details-marker { display: none; }
.faq-item summary::before { content: 'Q'; font-family: var(--font-display); font-style: italic; color: var(--accent); flex: 0 0 auto; }
.faq-item summary::after { content: '+'; margin-left: auto; color: var(--accent-text); font-family: var(--font-mono); transition: transform 0.3s var(--ease); }
.faq-item[open] summary::after { transform: rotate(45deg); }
.faq-item p { padding: 0 0 22px 28px; max-width: var(--measure); }

/* --- Big CTA --- */
.big-cta { border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
.big-cta-inner { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 22px; }
.big-cta-inner h2 { font-family: var(--font-display); font-weight: 540; font-size: clamp(2rem, 5vw, 3.6rem); line-height: 1.05; max-width: 20ch; }
.big-cta-inner h2 em { font-style: italic; color: var(--accent); }
.big-cta-ctas { display: flex; flex-wrap: wrap; gap: 22px; align-items: center; justify-content: center; }

/* --- Contact (correspondence) --- */
.contact-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: clamp(28px, 5vw, 64px); }
.contact-info .section-title { margin-bottom: 20px; }
.contact-details { margin-top: 30px; }
.contact-details li { display: flex; flex-direction: column; gap: 3px; padding: 14px 0; border-bottom: 1px solid var(--rule); }
.contact-details li span { font-family: var(--font-mono); font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--accent-text); }
.contact-form .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 26px; }
.contact-form .form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
.contact-form label { font-family: var(--font-mono); font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--ink-soft); }
.error-msg { display: none; font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--danger); }
.error-msg.visible { display: block; }
.btn-submit .btn-wait { display: none; }
.btn-submit.submitting .btn-text { display: none; }
.btn-submit.submitting .btn-wait { display: inline; }
.form-feedback { display: none; margin-top: 16px; font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; padding: 14px 0; border-top: 1px solid var(--rule); }
.form-feedback.visible { display: block; }
.success-feedback { color: var(--accent-text); }
.error-feedback { color: var(--danger); }

/* --- Footer (colophon, inverse) --- */
.footer { background: var(--ink); color: var(--paper); overflow: hidden; }
.footer h5, .footer p, .footer a, .footer li, .footer span { color: var(--paper); }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; padding-top: clamp(52px, 8vw, 92px); padding-bottom: 44px; }
.footer-title { font-family: var(--font-display); font-weight: 540; font-size: clamp(1.5rem, 2.6vw, 2.2rem); max-width: 16ch; margin-bottom: 22px; }
.footer-title em { font-style: italic; color: var(--accent); }
.footer-col h5 { font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 16px; }
.footer-col li { margin-bottom: 10px; font-family: var(--font-mono); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; }
.footer-socials { display: flex; gap: 14px; margin-top: 18px; }
.footer-socials a { width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid rgba(243,239,228,0.35); }
.footer-meta { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; border-top: 1px solid rgba(243,239,228,0.25); padding: 22px 0; font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; }
#viewAuditLogsBtn { text-decoration: underline; }
.footer-logotype { font-family: var(--font-display); font-weight: 560; font-size: clamp(4rem, 13.5vw, 12.5rem); line-height: 0.78; text-align: center; white-space: nowrap; margin-bottom: -0.08em; }
.footer-logotype .logo-italic { font-style: italic; }
@media (max-width: 820px) { .contact-grid { grid-template-columns: 1fr; } .contact-form .form-row { grid-template-columns: 1fr; } .footer-grid { grid-template-columns: 1fr 1fr; } }

/* --- Audit modal --- */
.modal { position: fixed; inset: 0; z-index: 140; display: none; align-items: center; justify-content: center; background: rgba(20,17,14,0.8); padding: 24px; }
.modal.visible { display: flex; }
.modal-content { background: var(--paper); border: 1px solid var(--rule-strong); max-width: 860px; width: 100%; max-height: 80vh; overflow: auto; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--rule); }
.modal-header h3 { font-family: var(--font-display); font-weight: 560; font-size: 1.1rem; }
.close-modal { font-size: 1.5rem; line-height: 1; }
.modal-body { padding: 24px; }
.audit-table-wrapper { overflow-x: auto; }
.audit-table { width: 100%; border-collapse: collapse; font-family: var(--font-mono); font-size: 0.78rem; }
.audit-table th, .audit-table td { text-align: left; padding: 10px 12px; border-bottom: 1px solid var(--rule); }
.audit-table th { text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.66rem; color: var(--ink-soft); }
.status-badge { border: 1px solid var(--rule); padding: 2px 10px; font-size: 0.66rem; text-transform: uppercase; }
.status-badge.success { color: var(--accent-text); border-color: var(--accent); }
```

- [ ] **Step 2: Edit the FAQ HTML** (keep `<section class="faq" id="faq">` and all 8 `<details class="faq-item">`). Replace the `.section-head` with a running head + title, and keep the `<details>`/`<summary>`/`<p>` items exactly (the CSS adds the `Q` and `+` marks):

```html
                <div class="running-head reveal"><span>№ 07</span><span>FAQs</span><span class="rh-folio" aria-hidden="true">Interview</span></div>
                <h2 class="section-title reveal" style="margin-bottom:clamp(24px,3vw,40px);">Questions, answered.</h2>
```

Change the grid wrapper `class="faq-grid"` (keep). Each answer `<p>` stays; prefix each answer's text with an italic oxblood "A" via CSS is optional — instead leave the `<p>` as the answer (the summary already carries the `Q`). Keep native `<details>` behavior.

- [ ] **Step 3: Edit the big-CTA HTML** (keep `<section class="big-cta">`), wrapping the accent phrase in `<em>` and swapping button classes (already done in Task 2 Step 3; confirm classes are `stamp-btn` / `link-underline`), and set the container class to `big-cta-inner` and the CTA wrapper to `big-cta-ctas`:

```html
        <section class="big-cta">
            <div class="container big-cta-inner reveal">
                <h2>Not sure what you need? <em>Let's have a chat.</em></h2>
                <p>Tell me where it hurts — support, brand, or design — and I'll tell you honestly what would help.</p>
                <div class="big-cta-ctas">
                    <a href="mailto:oyindamolaw8@gmail.com" class="stamp-btn">Book a Call</a>
                    <a href="#contact" class="link-underline">Fill the Brief <span class="arr" aria-hidden="true">→</span></a>
                </div>
            </div>
        </section>
```

- [ ] **Step 4: Edit the contact HTML** (keep `<section class="contact" id="contact">` and the ENTIRE `<form id="contactForm">` with all field IDs, `aria-describedby`, `role=alert`/`role=status`, select options, feedback divs). Changes: replace the `.section-head`/`.micro-label` with a running head; add `class="field"` to every `<input>`, `<select>`, `<textarea>` (in addition to existing attributes); ensure submit keeps `class="stamp-btn btn-submit" id="contactSubmitBtn"`; keep the `.contact-details` list with availability "Remote — Worldwide". Running head:

```html
                <div class="running-head reveal"><span>№ 08</span><span>Say Hello</span><span class="rh-folio" aria-hidden="true">Correspondence</span></div>
```

- [ ] **Step 5: Edit the footer HTML** (keep `<footer class="footer">`, all links, `#viewAuditLogsBtn`, `.footer-logotype`). Wrap the accent phrase of `.footer-title` in `<em>`; ensure social icons keep their inline SVGs; the "Back to Top" and email are already `link-underline` (Task 2). No structural change beyond the `<em>` and class confirmations.

- [ ] **Step 6: Edit the audit modal HTML** (keep `<div class="modal" id="auditLogsModal" role="dialog" aria-modal="true" aria-label="…">` and the `#closeModalBtn`, `#auditLogsTableBody`, `tabindex="0"` wrapper). Only the `.modal-content` may drop the old `hairline-card` class (styling now via `.modal-content`); everything else unchanged.

- [ ] **Step 7: Verify**

```bash
node --check app.js
curl -s http://localhost:4173/ | grep -c '<details'
curl -s http://localhost:4173/ | grep -c 'class="field"'
curl -s http://localhost:4173/ | grep -c 'role="alert"'
```

Expected: `8`, `5` (3 inputs/textarea + 2 selects), `4`. Browser: FAQ reads as an interview (italic oxblood `Q`, rotating `+`); contact form has underline-only fields on paper with a stamp submit; footer is inverse ink paper with the giant Fraunces logotype; audit modal opens (Escape/backdrop/focus-restore intact) with mono table. Full form flow works: empty → inline errors, bad email, valid → "Sending…" → success → reset.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: FAQ interview, big CTA, correspondence contact, colophon footer, audit modal"
```

---

### Task 8: Cover motion sequence + scroll reveal + responsive pass

**Files:**
- Modify: `styles.css` (append reveal + cover-sequence + responsive rules)
- Modify: `app.js` (cover sequence trigger if needed; reveal already exists)

**Interfaces:** Consumes everything. Produces `.reveal`/`.in-view` editorial variant, `.cover-copy`/`.cover-figure` load animation, breakpoint rules.

- [ ] **Step 1: Append reveal + cover-sequence CSS:**

```css
/* --- Scroll reveal --- */
.reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.7s var(--ease), transform 0.7s var(--ease); }
.reveal.in-view { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; } }

/* --- Cover load sequence --- */
.js .cover-rule { transform: scaleX(0); transform-origin: left; animation: rule-draw 0.9s var(--ease) forwards; }
.js .cover-headline { opacity: 0; animation: rise 0.8s var(--ease) 0.2s forwards; }
.js .cover-credit { opacity: 0; animation: rise 0.8s var(--ease) 0.35s forwards; }
.js .cover-lead { opacity: 0; animation: rise 0.8s var(--ease) 0.5s forwards; }
.js .cover-ctas { opacity: 0; animation: rise 0.8s var(--ease) 0.62s forwards; }
.js .cover-figure { opacity: 0; animation: rise 0.9s var(--ease) 0.45s forwards; }
@keyframes rule-draw { to { transform: scaleX(1); } }
@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
    .js .cover-rule, .js .cover-headline, .js .cover-credit, .js .cover-lead, .js .cover-ctas, .js .cover-figure { animation: none; opacity: 1; transform: none; }
}
```

Note: the cover-copy `.reveal` from Task 3 markup would conflict with the sequence animation. In Task 3 the cover copy/figure carry `reveal`; here the `.js .cover-*` animations own the intro. **Remove the `reveal` class from `.cover-copy` and `.cover-figure` in the hero HTML** (they animate via the sequence instead); keep `reveal` on `.stat-figures`.

- [ ] **Step 2: Append responsive rules** (section breakpoints already inlined per section; add global guards):

```css
@media (max-width: 900px) {
    .running-head .rh-folio { display: none; }
}
@media (max-width: 640px) {
    .cover-issue { font-size: 0.66rem; }
    .filter-row { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 8px; -webkit-overflow-scrolling: touch; }
    .filter-toggle { flex: 0 0 auto; }
    .footer-meta { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 3: Confirm `initReveal` in `app.js` is unchanged and still targets `.reveal`** (it is; no edit needed). Verify the `js` class is added by the pre-paint script (it is: `document.documentElement.classList.add('js')`).

- [ ] **Step 4: Verify**

```bash
curl -s http://localhost:4173/ | grep -c 'reveal'
node --check app.js
```

Expected: reveal count ≥ 28 (cover-copy/figure removed, rest retained). Browser at 1280 / 768 / 375 in BOTH paper and ink modes: cover performs the staged reveal on load (rule draws, headline/credit/lead/CTAs rise, portrait develops); sections fade on scroll; no horizontal scrollbar; plate grid, feature rows, contents list, footer all collapse cleanly; filter toggles scroll horizontally on mobile; reduced-motion emulation shows everything static and visible.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: cover load sequence, editorial scroll reveal, responsive pass"
```

---

### Task 9: frontend-design polish pass + full verification

**Files:** Modify `styles.css` (refinements only), `index.html` (only if a polish fix needs markup, no ID/structure/class-contract changes).

- [ ] **Step 1: Polish pass with the frontend-design skill loaded.** Walk every section top-to-bottom in both paper and ink modes and refine within the system: Fraunces axis settings (SOFT/WONK/opsz) per size, optical spacing and baseline rhythm, drop-cap alignment, plate aspect ratios and duotone strength, dot-leader alignment, pull-quote measure, footer logotype clipping, hover/focus timing, running-head rhythm. Allowed: change CSS values, add CSS rules. Not allowed: rename classes/IDs, restructure HTML, break the gallery/lightbox/form/modal contracts, introduce colors outside tokens, add dependencies.

- [ ] **Step 2: Run the spec §11 verification checklist.** Console clean at load + during interaction. Snapshots at desktop (1280), tablet (768), mobile (375) in both modes. Manual flows: cover sequence; theme toggle (Paper/Ink) persists across reload; overlay menu; every filter toggle + plate develop-on-hover; lightbox open/prev/next/Escape/backdrop/focus-restore; every FAQ item; form paths (empty → inline errors, bad email, valid → Sending → success → reset); audit log records + opens + closes with focus restore; both tickers; drop caps / pull quotes / dot-leaders render; reduced-motion emulation.

- [ ] **Step 3: Confirm conformance.** `curl -s http://localhost:4173/ | grep -ciE 'lagos|ibadan, nigeria'` → `0` ("University of Ibadan" as an institution is allowed). Single `h1` (the cover headline). Three roles in order in the cover credit line. No `pill`/`Inter`/`Archivo`/`Playfair` references remain: `grep -c 'pill\|Archivo\|Inter\|Playfair' index.html styles.css` → `0` (except the Fraunces/Newsreader/Fragment font link).

- [ ] **Step 4: Final commit**

```bash
git add -A && git commit -m "style: frontend-design polish pass and final verification"
```

---

## Post-plan self-review notes

- **Spec coverage:** §4.1 fonts → T1; §4.2 scale → T1 (+ per-section sizes T3–7); §4.3 tokens → T1; §4.4 anti-slop (radius 0, no pills/cards/micro-labels) → T1 tokens + T2 components + section rewrites; §4.5 devices catalog → T1 utilities (drop-cap, pull-quote, running-head, folio, numeral, leader, margin-note, caption, rule-double) + T2 (plate, dateline); §5.1 masthead → T3; §5.2 cover → T3; §5.3 tickers → T2/T4; §5.4 services → T4; §5.6 work plates → T5; §5.7 about → T6; §5.8 testimonials → T6; §5.9 process → T6; §5.10 experience → T6; §5.11 FAQ → T7; §5.12 big CTA → T7; §5.13 contact → T7; §5.14 footer → T7; §5.15 audit modal → T7; §6 components → T2 (+ toggle T2); §7 motion → T8; §8 technical → T1 (fonts/grain/pre-paint), all tasks; §9 preserved features → verified each task + T9; §11 verification → T9. Deferred content (§10) intentionally not implemented.
- **Type/contract consistency:** theme classes `light-theme`(default)/`dark-theme`; `--accent` (large) vs `--accent-text` (small) applied per usage; gallery/lightbox contract (`.work-tile[hidden]`, `data-title`/`data-category-label`, `.tile-btn`, `.tile-media` + `::before` placeholder, `initGallery` img-error removal) preserved through T5's `.plate duo` wrapper; all form + modal IDs and ARIA preserved through T7; `initReveal`/`initTheme`/`initMenu`/`initStickyNav`/`initGallery`/`initLightbox`/`initContactForm`/`initAuditModal` unchanged except toggle label.
- **Known deviations:** default theme flips dark→light (spec §4.3, approved); pre-paint script default flips accordingly (T1 Step 3); cover copy/figure use the load-sequence animation instead of `.reveal` (T8 Step 1).
