# DamolaKenny Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean rebuild of the one-page portfolio (`index.html`, `styles.css`, `app.js`) into a dark-first minimal-editorial design with champagne gold accent, projecting three core roles (Customer Service Representative, AI Brand Manager, Graphic Designer).

**Architecture:** Static site, three files at repo root, no build step. HTML is built progressively section-by-section — the page renders completely and validly after every task. `app.js` is a set of small `init*()` functions called from one `DOMContentLoaded` handler; form-validation and audit-log logic are ported from the old `app.js` (preserved element IDs make the port drop-in). All styling hangs off design tokens defined once in Task 1.

**Tech Stack:** Vanilla HTML/CSS/JS. Google Fonts (Archivo, Inter, Playfair Display italic). Inline SVG icons (no FontAwesome). Python `http.server` for local verification.

**Spec:** `docs/superpowers/specs/2026-07-07-portfolio-redesign-design.md` — the source of truth for all content and design decisions.

## Global Constraints

- **frontend-design skill:** The implementing session MUST load the `frontend-design` skill before writing any styling code (Task 1) and keep its guidance active throughout. Task 9 is the dedicated polish pass. (User requirement.)
- Static only: no frameworks, no build tools, no JS libraries. The only external requests are Google Fonts.
- Branch: all work on `redesign/minimal-editorial`, branched from `main`. Commit after every task.
- Dark theme is the default: `<body class="dark-theme">`. Light theme via toggle. localStorage key: `portfolio-theme` (values `dark-theme` / `light-theme`).
- Color tokens verbatim — dark: bg `#121210`, surface `#1a1a17`, text `#f4f2ed`, secondary `#a8a49b`, hairline `rgba(255,255,255,0.12)`, accent `#c5a880`, danger `#e08a80`. Light: bg `#ffffff`, surface `#f6f6f4`, text `#111111`, secondary `#5f5c55`, hairline `#e5e5e2`, accent `#c5a880`, accent-text `#8f7248` (small gold text on white), danger `#b03a30`.
- Fonts: Archivo 700/800 (uppercase headlines), Inter 400/500/600 (body), Playfair Display **italic only** 400/600 (accent words + logo "kenny"). No Lato, no Alex Brush.
- Copy rules: NO city names anywhere ("Remote — Worldwide" framing). The three core roles always in this order: Customer Service Representative, AI Brand Manager, Graphic Designer. Wordmark is exactly `DAMOLA` + italic `kenny`.
- Ported element IDs must not change: `themeToggle`, `contactForm`, `contactName`, `contactEmail`, `contactIndustry`, `contactProject`, `contactMessage`, `nameError`, `emailError`, `messageError`, `formSuccessFeedback`, `formErrorFeedback`, `contactSubmitBtn`, `viewAuditLogsBtn`, `auditLogsModal`, `closeModalBtn`, `auditLogsTableBody`.
- Accessibility: single `h1`, semantic landmarks, `:focus-visible` styles, `aria-expanded` on menu, focus trap in lightbox, alt text on all images, AA contrast in both themes.
- `prefers-reduced-motion: reduce` disables marquees, scroll reveals, and smooth scrolling.
- Gallery links nowhere off-site. Work images live in `assets/work/`; a missing image degrades to a styled placeholder block, never a broken image.
- Tasks 1–8 implement exactly as written. Task 9 (polish) may refine visual values (spacing, type sizes, hover states) but must preserve tokens, structure, IDs, class names, and behavior.

## File Structure

| File | Responsibility |
|------|----------------|
| `index.html` | All markup + content, built progressively (Tasks 1–7) |
| `styles.css` | Tokens/reset/utilities (Task 1), then per-section styles appended (Tasks 2–8) |
| `app.js` | `init*()` modules: storage guards + audit core + theme (T1), menu/sticky (T2), gallery/lightbox (T5), form + audit modal port (T7), reveal (T8) |
| `assets/work/` | Client work samples (`.gitkeep` now, images later) |
| `.claude/launch.json` | Local static server config for verification |

Verification server (all tasks): `python3 -m http.server 4173` from repo root, then `curl -s http://localhost:4173/`. Visual checks: open `http://localhost:4173` in a browser (or preview tooling) — check rendering AND that the console has no errors.

---

### Task 1: Foundation — branch, tokens, base styles, theme system

**Files:**
- Create: `assets/work/.gitkeep`, `.claude/launch.json`
- Rewrite: `index.html`, `styles.css`, `app.js` (fresh content, old versions remain in git history)

**Interfaces:**
- Produces (later tasks rely on): CSS classes `.container`, `.display`, `.italic-accent`, `.micro-label`, `.section-title`, `.section-head`, `.pill`, `.pill-primary`, `.pill-outline`, `.pill-dark`, `.hairline-card`, `.tag-row`; CSS vars per Global Constraints; JS functions `storageGet(key) -> string|null`, `storageSet(key, value) -> void`, `logAuditEvent(actionType, targetEntity, actor, status) -> void`; the `DOMContentLoaded` init block in `app.js` that later tasks append `init*()` calls to; the `<main id="main">` element tasks 3–7 insert sections into.

- [ ] **Step 1: Create branch and scaffolding**

```bash
cd "/Users/MAC/Documents/New project/Brand Manager"
git checkout -b redesign/minimal-editorial
touch assets/work/.gitkeep
mkdir -p .claude
```

Create `.claude/launch.json`:

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "portfolio",
      "runtimeExecutable": "python3",
      "runtimeArgs": ["-m", "http.server", "4173"],
      "port": 4173
    }
  ]
}
```

- [ ] **Step 2: Write fresh `index.html`** (complete file — later tasks insert sections into `<main>`):

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Customer Service Representative, AI Brand Manager, and Graphic Designer — remote, worldwide. I keep customers cared for, brands consistent, and content sharp.">
    <meta name="color-scheme" content="dark light">
    <meta property="og:title" content="Oyindamola Kehinde Waheed | Customer Service, AI Brand Management & Graphic Design">
    <meta property="og:description" content="Customer Service Representative, AI Brand Manager, and Graphic Designer — remote, worldwide.">
    <meta property="og:type" content="website">
    <meta property="og:image" content="assets/oyindamola_portrait.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800&family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@1,400;1,600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
    <title>Oyindamola Kehinde Waheed | Customer Service, AI Brand Management & Graphic Design</title>
</head>
<body class="dark-theme">

    <!-- TASK 2 INSERTS: header/nav -->

    <main id="main">
        <!-- TASK 3 INSERTS: hero + roles marquee -->
        <!-- TASK 4 INSERTS: services + skills + tools marquee -->
        <!-- TASK 5 INSERTS: work gallery -->
        <!-- TASK 6 INSERTS: about, testimonials, process, experience -->
        <!-- TASK 7 INSERTS: faq, big cta, contact -->
    </main>

    <!-- TASK 2 INSERTS: footer -->
    <!-- TASK 5 INSERTS: lightbox -->
    <!-- TASK 7 INSERTS: audit modal -->

    <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 3: Write fresh `styles.css`** (complete file for this task; later tasks append below the `/* ===== SECTIONS ===== */` marker):

```css
/* ==========================================================================
   DAMOLAKENNY — MINIMAL EDITORIAL, DARK-FIRST
   ========================================================================= */

:root {
    --font-head: 'Archivo', 'Helvetica Neue', Arial, sans-serif;
    --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --font-accent: 'Playfair Display', Georgia, serif;
    --container-max: 1200px;
    --section-pad: clamp(72px, 10vw, 140px);
    --radius: 4px;
    --pill-radius: 9999px;
    --ease: cubic-bezier(0.16, 1, 0.3, 1);
}

body.dark-theme {
    --bg-main: #121210; --bg-surface: #1a1a17;
    --text-primary: #f4f2ed; --text-secondary: #a8a49b;
    --hairline: rgba(255, 255, 255, 0.12);
    --accent: #c5a880; --accent-text: #c5a880;
    --danger: #e08a80;
    --pill-ink: #121210;
    color-scheme: dark;
}

body.light-theme {
    --bg-main: #ffffff; --bg-surface: #f6f6f4;
    --text-primary: #111111; --text-secondary: #5f5c55;
    --hairline: #e5e5e2;
    --accent: #c5a880; --accent-text: #8f7248;
    --danger: #b03a30;
    --pill-ink: #111111;
    color-scheme: light;
}

/* --- Reset & base --- */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
    font-family: var(--font-body); font-size: 16px; line-height: 1.65;
    background: var(--bg-main); color: var(--text-primary);
    transition: background 0.4s var(--ease), color 0.4s var(--ease);
    -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
ul, ol { list-style: none; }
button { font: inherit; color: inherit; background: none; border: none; cursor: pointer; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
body.no-scroll, body.menu-open { overflow: hidden; }

.container { max-width: var(--container-max); margin: 0 auto; padding: 0 24px; }
section { padding: var(--section-pad) 0; }

/* --- Typography utilities --- */
.display {
    font-family: var(--font-head); font-weight: 800;
    text-transform: uppercase; letter-spacing: -0.02em; line-height: 1.05;
}
.italic-accent {
    font-family: var(--font-accent); font-style: italic; font-weight: 600;
    text-transform: none; letter-spacing: 0;
}
.micro-label {
    display: block; margin-bottom: 16px;
    font-weight: 600; font-size: 0.75rem;
    text-transform: uppercase; letter-spacing: 0.14em;
    color: var(--accent-text);
}
.section-title { font-size: clamp(2rem, 4.5vw, 3.25rem); max-width: 20ch; }
.section-head { margin-bottom: clamp(40px, 6vw, 72px); }
p { color: var(--text-secondary); }
h1, h2, h3, h4, h5 { color: var(--text-primary); }

/* --- Pills & cards --- */
.pill {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 28px; border-radius: var(--pill-radius);
    font-weight: 600; font-size: 0.9rem; border: 1px solid transparent;
    transition: transform 0.3s var(--ease), background 0.3s var(--ease),
                color 0.3s var(--ease), border-color 0.3s var(--ease);
}
.pill:hover { transform: translateY(-2px); }
.pill-primary { background: var(--accent); color: var(--pill-ink); }
.pill-outline { border-color: var(--hairline); color: var(--text-primary); }
.pill-outline:hover { border-color: var(--accent); }
.pill-dark { background: #121210; color: #f4f2ed; }
.hairline-card { border: 1px solid var(--hairline); border-radius: var(--radius); }
.tag-row { display: flex; flex-wrap: wrap; gap: 8px; }
.tag-row li {
    font-size: 0.75rem; font-weight: 500; color: var(--text-secondary);
    border: 1px solid var(--hairline); border-radius: var(--pill-radius);
    padding: 4px 12px;
}

@media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
}

/* ===== SECTIONS (Tasks 2–8 append below) ===== */
```

- [ ] **Step 4: Write fresh `app.js`** (complete file; later tasks add `init*()` functions and calls):

```js
/* ==========================================================================
   DAMOLAKENNY PORTFOLIO — CORE LOGIC
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    initAuditLogs();
    initTheme();
});

/* --- Safe storage (degrades in private browsing) --- */
function storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
}
function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ }
}

/* --- Audit log core (ported from previous app.js, storage-guarded) --- */
function initAuditLogs() {
    if (storageGet('system-audit-logs')) return;
    const initialLogs = [{
        timestamp: new Date().toISOString(),
        actionType: 'App Mount',
        targetEntity: 'Main DOM Loaded',
        actor: 'Portfolio App',
        status: 'SUCCESS'
    }];
    storageSet('system-audit-logs', JSON.stringify(initialLogs));
}

function logAuditEvent(actionType, targetEntity, actor, status) {
    let logs = [];
    try { logs = JSON.parse(storageGet('system-audit-logs')) || []; } catch (e) { logs = []; }
    logs.unshift({
        timestamp: new Date().toISOString(),
        actionType: actionType,
        targetEntity: targetEntity,
        actor: actor,
        status: status
    });
    storageSet('system-audit-logs', JSON.stringify(logs));
}

/* --- Theme (dark default) --- */
function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const saved = storageGet('portfolio-theme');
    const initial = saved === 'light-theme' ? 'light-theme' : 'dark-theme';
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(initial);
    logAuditEvent('Theme Loaded', 'Theme initialized to: ' + initial, 'System', 'SUCCESS');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
        const next = document.body.classList.contains('dark-theme') ? 'light-theme' : 'dark-theme';
        document.body.classList.remove('dark-theme', 'light-theme');
        document.body.classList.add(next);
        storageSet('portfolio-theme', next);
        logAuditEvent('Theme Toggle', 'Changed theme to: ' + next, 'User', 'SUCCESS');
    });
}
```

(`classList` add/remove — never `className =` — so theme switches preserve unrelated body state classes like `menu-open`/`no-scroll` added by Tasks 2 and 5.)

(Note: `initTheme` guards `!toggle` only because the toggle button arrives in Task 2 — the guard keeps Task 1 independently runnable and stays harmless afterward.)

- [ ] **Step 5: Verify**

```bash
cd "/Users/MAC/Documents/New project/Brand Manager"
python3 -m http.server 4173 &   # leave running for all tasks
curl -s http://localhost:4173/ | grep -c 'class="dark-theme"'
```

Expected: `1`. Open `http://localhost:4173` in a browser: near-black `#121210` page, empty but no console errors, fonts load.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: scaffold redesign foundation (tokens, base styles, theme system)"
```

---

### Task 2: Nav with overlay menu + gold footer with giant logotype

**Files:**
- Modify: `index.html` (replace the `TASK 2 INSERTS: header/nav` and `TASK 2 INSERTS: footer` comments)
- Modify: `styles.css` (append), `app.js` (add `initMenu`, `initStickyNav` + calls)

**Interfaces:**
- Consumes: `.pill*`, `.micro-label`, tokens (T1); `initTheme` wires `#themeToggle` created here.
- Produces: `#siteHeader`, `#navMenu`, `#menuToggle`, `body.menu-open` convention; `.logo-italic`; footer with `#viewAuditLogsBtn` (wired in Task 7); `.footer-logotype`.

- [ ] **Step 1: Replace `<!-- TASK 2 INSERTS: header/nav -->` in `index.html` with:**

```html
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="navbar-wrapper" id="siteHeader">
        <nav class="navbar container" aria-label="Primary">
            <a href="#hero" class="nav-logo">DAMOLA<span class="logo-italic">kenny</span></a>
            <ul class="nav-list" id="navMenu">
                <li><a href="#about" class="nav-link">About</a></li>
                <li><a href="#services" class="nav-link">Services</a></li>
                <li><a href="#work" class="nav-link">Work</a></li>
                <li><a href="#process" class="nav-link">Process</a></li>
                <li><a href="#faq" class="nav-link">FAQ</a></li>
            </ul>
            <div class="nav-actions">
                <button class="theme-toggle" id="themeToggle" aria-label="Toggle color theme">
                    <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
                    <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
                </button>
                <a href="#contact" class="pill pill-primary nav-cta">Let's Talk</a>
                <button class="menu-toggle" id="menuToggle" aria-expanded="false" aria-controls="navMenu" aria-label="Toggle menu">
                    <svg class="icon-bars" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
                    <svg class="icon-close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
            </div>
        </nav>
    </header>
```

- [ ] **Step 2: Replace `<!-- TASK 2 INSERTS: footer -->` with:**

```html
    <footer class="footer">
        <div class="container footer-grid">
            <div class="footer-brand">
                <p class="footer-title display">Let's build something <span class="italic-accent">worth caring about.</span></p>
                <a href="mailto:oyindamolaw8@gmail.com" class="pill pill-dark">oyindamolaw8@gmail.com</a>
            </div>
            <nav class="footer-col" aria-label="Footer menu">
                <h5>Menu</h5>
                <ul>
                    <li><a href="#about">About</a></li>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#work">Work</a></li>
                    <li><a href="#process">Process</a></li>
                    <li><a href="#faq">FAQ</a></li>
                </ul>
            </nav>
            <nav class="footer-col" aria-label="Footer services">
                <h5>Services</h5>
                <ul>
                    <li><a href="#services">Customer Service</a></li>
                    <li><a href="#services">AI Brand Management</a></li>
                    <li><a href="#services">Graphic Design</a></li>
                </ul>
            </nav>
            <div class="footer-col">
                <h5>Contact</h5>
                <ul>
                    <li><a href="mailto:oyindamolaw8@gmail.com">oyindamolaw8@gmail.com</a></li>
                    <li><a href="tel:+2347041107313">+234 704 110 7313</a></li>
                    <li>Remote — Worldwide</li>
                </ul>
                <div class="footer-socials">
                    <a href="https://linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 8.5H3.56V20.4h3.38zM5.25 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM20.44 13.28c0-3.3-1.76-4.83-4.1-4.83a3.54 3.54 0 0 0-3.21 1.77V8.5H9.75V20.4h3.38v-6.28c0-1.42.65-2.26 1.9-2.26 1.15 0 1.7.81 1.7 2.26v6.28h3.7z"/></svg></a>
                    <a href="https://twitter.com" target="_blank" rel="noopener" aria-label="X (Twitter)"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.18l-4.84-6.33L5.44 21H2.37l7.17-8.19L2 3h6.34l4.37 5.78zm-1.08 16.16h1.7L7.42 4.74H5.6z"/></svg></a>
                    <a href="mailto:oyindamolaw8@gmail.com" aria-label="Email"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></a>
                </div>
            </div>
        </div>
        <div class="container footer-meta">
            <p>&copy; 2026 Oyindamola Kehinde Waheed. All rights reserved.</p>
            <a href="#" id="viewAuditLogsBtn">System Audit Log</a>
            <a href="#hero" class="pill pill-dark back-top">Back to Top
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 19V5m-6 6 6-6 6 6"/></svg>
            </a>
        </div>
        <div class="footer-logotype" aria-hidden="true">DAMOLA<span class="logo-italic">kenny</span></div>
    </footer>
```

- [ ] **Step 3: Append to `styles.css`:**

```css
/* --- Skip link --- */
.skip-link {
    position: absolute; left: -9999px; top: 0; z-index: 200;
    background: var(--accent); color: var(--pill-ink); padding: 10px 20px;
}
.skip-link:focus { left: 0; }

/* --- Nav --- */
.navbar-wrapper {
    position: sticky; top: 0; z-index: 80;
    background: var(--bg-main);
    border-bottom: 1px solid transparent;
    transition: border-color 0.3s var(--ease), background 0.4s var(--ease);
}
.navbar-wrapper.scrolled { border-bottom-color: var(--hairline); }
.navbar { display: flex; align-items: center; justify-content: space-between; height: 76px; }
.nav-logo, .footer-logotype {
    font-family: var(--font-head); font-weight: 800; text-transform: uppercase; letter-spacing: -0.02em;
}
.nav-logo { font-size: 1.2rem; }
.logo-italic { font-family: var(--font-accent); font-style: italic; font-weight: 600; text-transform: lowercase; }
.nav-list { display: flex; gap: 36px; }
.nav-link { font-size: 0.9rem; font-weight: 500; color: var(--text-secondary); transition: color 0.3s var(--ease); }
.nav-link:hover { color: var(--text-primary); }
.nav-actions { display: flex; align-items: center; gap: 14px; }
.nav-cta { padding: 10px 22px; }
.theme-toggle, .menu-toggle {
    display: inline-flex; align-items: center; justify-content: center;
    width: 40px; height: 40px; border: 1px solid var(--hairline); border-radius: var(--pill-radius);
    transition: border-color 0.3s var(--ease);
}
.theme-toggle:hover, .menu-toggle:hover { border-color: var(--accent); }
body.dark-theme .icon-moon { display: none; }
body.light-theme .icon-sun { display: none; }
.menu-toggle { display: none; }
.icon-close { display: none; }
body.menu-open .icon-close { display: block; }
body.menu-open .icon-bars { display: none; }

@media (max-width: 1024px) {
    .nav-list {
        position: fixed; inset: 0; z-index: 90;
        display: none; flex-direction: column; align-items: center; justify-content: center; gap: 32px;
        background: var(--bg-main); font-size: 1.4rem;
    }
    .nav-list.active { display: flex; }
    .menu-toggle { display: inline-flex; position: relative; z-index: 100; }
    .nav-cta { display: none; }
}

/* --- Footer (gold block, fixed ink both themes) --- */
.footer { background: var(--accent); color: #121210; overflow: hidden; }
.footer h5, .footer p, .footer a, .footer li { color: #121210; }
.footer-grid {
    display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px;
    padding-top: clamp(56px, 8vw, 96px); padding-bottom: 48px;
}
.footer-title { font-size: clamp(1.5rem, 2.6vw, 2.2rem); margin-bottom: 24px; max-width: 16ch; }
.footer-col h5 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 16px; }
.footer-col li { margin-bottom: 10px; font-size: 0.9rem; }
.footer-col a:hover { text-decoration: underline; }
.footer-socials { display: flex; gap: 14px; margin-top: 20px; }
.footer-socials a {
    display: inline-flex; align-items: center; justify-content: center;
    width: 36px; height: 36px; border: 1px solid rgba(18, 18, 16, 0.35); border-radius: var(--pill-radius);
}
.footer-meta {
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
    border-top: 1px solid rgba(18, 18, 16, 0.25); padding-top: 24px; padding-bottom: 24px; font-size: 0.85rem;
}
#viewAuditLogsBtn { text-decoration: underline; }
.footer-logotype {
    font-size: clamp(4rem, 13.5vw, 12.5rem); line-height: 0.78;
    text-align: center; white-space: nowrap; margin-bottom: -0.08em; user-select: none;
}
```

- [ ] **Step 4: Add to `app.js`** — new functions at the end of the file, and update the init block to:

```js
document.addEventListener('DOMContentLoaded', () => {
    initAuditLogs();
    initTheme();
    initMenu();
    initStickyNav();
});
```

```js
/* --- Mobile overlay menu --- */
function initMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    menuToggle.addEventListener('click', () => {
        const open = navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
    });
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

/* --- Sticky nav hairline --- */
function initStickyNav() {
    const header = document.getElementById('siteHeader');
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}
```

- [ ] **Step 5: Verify**

```bash
curl -s http://localhost:4173/ | grep -c 'footer-logotype'
```

Expected: `1`. Browser: gold footer with giant clipped `DAMOLAkenny` at bottom; theme toggle flips dark/light and persists on reload; below 1024px the hamburger opens a full-screen overlay; console clean.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: minimal nav with overlay menu and gold footer with giant logotype"
```

---

### Task 3: Hero, stats row, employer strip, roles marquee

**Files:**
- Modify: `index.html` (replace `TASK 3 INSERTS` comment), `styles.css` (append)

**Interfaces:**
- Consumes: `.display`, `.italic-accent`, `.micro-label`, `.pill*` (T1).
- Produces: `.marquee` / `.marquee-track` / `.marquee-set` pattern reused by Task 4's tools marquee; `#hero` anchor target.

- [ ] **Step 1: Replace `<!-- TASK 3 INSERTS: hero + roles marquee -->` with:**

```html
        <section class="hero" id="hero">
            <div class="container hero-grid">
                <div class="hero-copy">
                    <p class="micro-label">Customer Service · AI Brand Management · Graphic Design</p>
                    <h1 class="display hero-title">Customer care, AI brands &amp; design — <span class="italic-accent">done properly.</span></h1>
                    <p class="hero-sub">I'm Oyindamola. I keep customers genuinely cared for, build AI-powered brand systems, and design the assets that make it all look sharp — for tech, e-commerce, and lifestyle startups. Fully remote, worldwide.</p>
                    <div class="hero-ctas">
                        <a href="#work" class="pill pill-primary">See My Work</a>
                        <a href="#contact" class="pill pill-outline">Let's Talk</a>
                    </div>
                </div>
                <div class="hero-visual">
                    <img src="assets/oyindamola_portrait.png" alt="Portrait of Oyindamola Kehinde Waheed">
                </div>
            </div>
            <div class="container hero-meta">
                <dl class="stats-row">
                    <div class="stat"><dd class="display">5+</dd><dt>Years in ops &amp; support</dt></div>
                    <div class="stat"><dd class="display">3</dd><dt>Core disciplines</dt></div>
                    <div class="stat"><dd class="display">&lt;24h</dd><dt>Response time</dt></div>
                </dl>
                <p class="employer-label micro-label">Organizations I've worked with</p>
                <div class="employer-strip">
                    <span>CVS Pharmacy</span><span>Sagility Health</span><span>University of Ibadan</span><span>Abiodun Foundation College</span><span>Lawleezy Healthcare</span>
                </div>
            </div>
        </section>

        <div class="marquee" aria-hidden="true">
            <div class="marquee-track">
                <div class="marquee-set"><span>Customer Service</span><span>—</span><span>AI Brand Management</span><span>—</span><span>Graphic Design</span><span>—</span><span>Remote Worldwide</span><span>—</span></div>
                <div class="marquee-set"><span>Customer Service</span><span>—</span><span>AI Brand Management</span><span>—</span><span>Graphic Design</span><span>—</span><span>Remote Worldwide</span><span>—</span></div>
            </div>
        </div>
```

- [ ] **Step 2: Append to `styles.css`:**

```css
/* --- Hero --- */
.hero { padding-top: clamp(48px, 7vw, 96px); }
.hero-grid { display: grid; grid-template-columns: 1.25fr 1fr; gap: clamp(32px, 5vw, 72px); align-items: end; }
.hero-title { font-size: clamp(2.75rem, 7vw, 4.75rem); margin-bottom: 24px; }
.hero-sub { max-width: 52ch; margin-bottom: 32px; }
.hero-ctas { display: flex; flex-wrap: wrap; gap: 14px; }
.hero-visual {
    background: var(--bg-surface); border: 1px solid var(--hairline); border-radius: var(--radius);
    padding: 24px 24px 0; display: flex; align-items: flex-end; justify-content: center;
}
.hero-visual img { max-height: 440px; object-fit: contain; }
.hero-meta { margin-top: clamp(40px, 6vw, 72px); }
.stats-row {
    display: flex; flex-wrap: wrap; gap: 0;
    border-top: 1px solid var(--hairline); border-bottom: 1px solid var(--hairline);
}
.stat { flex: 1 1 180px; padding: 24px; border-right: 1px solid var(--hairline); }
.stat:last-child { border-right: none; }
.stat dd { font-size: clamp(1.75rem, 3vw, 2.5rem); }
.stat dt { font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px; }
.employer-label { margin-top: 40px; margin-bottom: 12px; }
.employer-strip { display: flex; flex-wrap: wrap; gap: 16px 32px; }
.employer-strip span {
    font-family: var(--font-head); font-weight: 700; text-transform: uppercase;
    font-size: 0.9rem; letter-spacing: 0.02em; color: var(--text-secondary);
}

/* --- Marquee (shared pattern) --- */
.marquee { overflow: hidden; border-top: 1px solid var(--hairline); border-bottom: 1px solid var(--hairline); padding: 16px 0; }
.marquee-track { display: flex; width: max-content; animation: marquee 30s linear infinite; }
.marquee-set {
    display: flex; gap: 40px; padding-right: 40px; white-space: nowrap;
    font-family: var(--font-head); font-weight: 700; text-transform: uppercase; font-size: 1.05rem;
}
.marquee:hover .marquee-track { animation-play-state: paused; }
@keyframes marquee { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .marquee-track { animation: none; } }
```

- [ ] **Step 3: Verify**

```bash
curl -s http://localhost:4173/ | grep -c 'marquee-set'
```

Expected: `2`. Browser: huge uppercase headline with italic "done properly.", portrait on surface block, 3-stat hairline row, employer strip, marquee scrolling seamlessly (pauses on hover); no horizontal page scrollbar.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: hero, stats row, employer strip, roles marquee"
```

---

### Task 4: Core service cards, secondary skills, tools marquee

**Files:**
- Modify: `index.html` (replace `TASK 4 INSERTS` comment), `styles.css` (append)

**Interfaces:**
- Consumes: `.hairline-card`, `.tag-row`, `.micro-label`, `.display`, `.marquee*` (T1/T3).
- Produces: `#services` anchor target.

- [ ] **Step 1: Replace `<!-- TASK 4 INSERTS: services + skills + tools marquee -->` with:**

```html
        <section class="services" id="services">
            <div class="container">
                <div class="section-head">
                    <p class="micro-label">What I Do</p>
                    <h2 class="display section-title">Three disciplines, <span class="italic-accent">one operator.</span></h2>
                </div>
                <div class="service-grid">
                    <article class="hairline-card service-card">
                        <span class="service-num">01</span>
                        <h3 class="display">Customer Service Representative</h3>
                        <p>Empathetic frontline support that keeps customers loyal — ticketing, escalations, billing queries, and retention across chat, email, and phone.</p>
                        <ul class="tag-row"><li>Zendesk</li><li>CRM platforms</li><li>Ticketing systems</li><li>Live chat</li><li>Email support</li><li>Care-portal systems</li><li>Escalation workflows</li></ul>
                    </article>
                    <article class="hairline-card service-card">
                        <span class="service-num">02</span>
                        <h3 class="display">AI Brand Manager</h3>
                        <p>Brand voice systems, AI-assisted content pipelines, and persona mapping that keep your brand consistent everywhere it speaks.</p>
                        <ul class="tag-row"><li>Claude</li><li>ChatGPT</li><li>Jasper</li><li>Midjourney</li><li>Prompt engineering</li><li>Content calendars</li><li>Brand voice guides</li></ul>
                    </article>
                    <article class="hairline-card service-card">
                        <span class="service-num">03</span>
                        <h3 class="display">Graphic Designer</h3>
                        <p>Clean, editorial social assets, slide systems, and marketing graphics designed to sell without shouting.</p>
                        <ul class="tag-row"><li>Canva</li><li>Photoshop</li><li>Midjourney</li><li>Slide systems</li><li>Social templates</li><li>Brand kits</li></ul>
                    </article>
                </div>
                <div class="skills-list">
                    <p class="micro-label">Also in my toolkit</p>
                    <div class="skill-row"><span class="skill-name">Data Analysis</span><span class="skill-tools">SQL · Power BI · Excel</span></div>
                    <div class="skill-row"><span class="skill-name">Executive Assistance</span><span class="skill-tools">Notion · MS Teams · SOP design</span></div>
                    <div class="skill-row"><span class="skill-name">Social Media Management</span><span class="skill-tools">Buffer · Later · Copywriting</span></div>
                    <div class="skill-row"><span class="skill-name">Video Editing</span><span class="skill-tools">CapCut · Premiere Pro</span></div>
                </div>
            </div>
        </section>

        <div class="marquee marquee-tools" aria-hidden="true">
            <div class="marquee-track">
                <div class="marquee-set"><span>Zendesk</span><span>CRM</span><span>Claude</span><span>ChatGPT</span><span>Jasper</span><span>Midjourney</span><span>Canva</span><span>Photoshop</span><span>CapCut</span><span>Premiere Pro</span><span>SQL</span><span>Power BI</span><span>Excel</span><span>Notion</span><span>MS Teams</span><span>Buffer</span><span>Later</span><span>Google Workspace</span></div>
                <div class="marquee-set"><span>Zendesk</span><span>CRM</span><span>Claude</span><span>ChatGPT</span><span>Jasper</span><span>Midjourney</span><span>Canva</span><span>Photoshop</span><span>CapCut</span><span>Premiere Pro</span><span>SQL</span><span>Power BI</span><span>Excel</span><span>Notion</span><span>MS Teams</span><span>Buffer</span><span>Later</span><span>Google Workspace</span></div>
            </div>
        </div>
```

- [ ] **Step 2: Append to `styles.css`:**

```css
/* --- Services --- */
.service-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.service-card { padding: 32px; display: flex; flex-direction: column; gap: 16px; transition: border-color 0.3s var(--ease); }
.service-card:hover { border-color: var(--accent); }
.service-num { font-family: var(--font-head); font-weight: 700; color: var(--accent-text); font-size: 0.9rem; }
.service-card h3 { font-size: 1.25rem; }
.service-card .tag-row { margin-top: auto; }
.skills-list { margin-top: clamp(40px, 6vw, 64px); }
.skill-row {
    display: flex; align-items: baseline; justify-content: space-between; gap: 16px; flex-wrap: wrap;
    padding: 18px 0; border-bottom: 1px solid var(--hairline);
}
.skill-row:first-of-type { border-top: 1px solid var(--hairline); }
.skill-name { font-family: var(--font-head); font-weight: 700; text-transform: uppercase; font-size: 1rem; }
.skill-tools { color: var(--text-secondary); font-size: 0.85rem; }
.marquee-tools .marquee-set { font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); gap: 32px; padding-right: 32px; }
```

- [ ] **Step 3: Verify**

```bash
curl -s http://localhost:4173/ | grep -c 'service-card'
curl -s http://localhost:4173/ | grep -o 'Google Workspace' | wc -l
```

Expected: `3`, then `2`. Browser: three hairline cards (gold border on hover), 4 skill rows, tools marquee scrolling.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: core service cards, secondary skills list, tools marquee"
```

---

### Task 5: Filterable work gallery + on-site lightbox

**Files:**
- Modify: `index.html` (replace `TASK 5 INSERTS: work gallery` and `TASK 5 INSERTS: lightbox` comments), `styles.css` (append), `app.js` (add `initGallery`, `initLightbox` + calls)

**Interfaces:**
- Consumes: `logAuditEvent` (T1), `.micro-label`/`.display` (T1).
- Produces: `#work` anchor; `.work-tile[hidden]` filtering convention consumed by the lightbox's visible-pool logic; `body.no-scroll` (defined T1).

- [ ] **Step 1: Replace `<!-- TASK 5 INSERTS: work gallery -->` with** (10 tiles; every tile follows the identical pattern — all 10 written out):

```html
        <section class="work" id="work">
            <div class="container">
                <div class="section-head">
                    <p class="micro-label">Selected Work</p>
                    <h2 class="display section-title">The work speaks <span class="italic-accent">for itself.</span></h2>
                </div>
                <div class="filter-row" role="group" aria-label="Filter work by category">
                    <button class="filter-chip active" data-filter="all">All</button>
                    <button class="filter-chip" data-filter="brand">Brand &amp; Social</button>
                    <button class="filter-chip" data-filter="design">Graphic Design</button>
                    <button class="filter-chip" data-filter="video">Video</button>
                    <button class="filter-chip" data-filter="data">Data &amp; Ops</button>
                </div>
                <div class="work-grid">
                    <figure class="work-tile" data-category="brand" data-title="AI Brand Voice System" data-category-label="Brand &amp; Social">
                        <button class="tile-btn" aria-label="View AI Brand Voice System larger"><span class="tile-media"><img src="assets/work/ai-brand-voice-system.png" alt="AI Brand Voice System work sample"></span></button>
                        <figcaption><strong>AI Brand Voice System</strong><span>Brand &amp; Social</span></figcaption>
                    </figure>
                    <figure class="work-tile" data-category="brand" data-title="Organic Content Calendar" data-category-label="Brand &amp; Social">
                        <button class="tile-btn" aria-label="View Organic Content Calendar larger"><span class="tile-media"><img src="assets/work/organic-content-calendar.png" alt="Organic Content Calendar work sample"></span></button>
                        <figcaption><strong>Organic Content Calendar</strong><span>Brand &amp; Social</span></figcaption>
                    </figure>
                    <figure class="work-tile" data-category="brand" data-title="Engagement Growth Campaign (+180%)" data-category-label="Brand &amp; Social">
                        <button class="tile-btn" aria-label="View Engagement Growth Campaign larger"><span class="tile-media"><img src="assets/work/engagement-growth-campaign.png" alt="Engagement Growth Campaign work sample"></span></button>
                        <figcaption><strong>Engagement Growth Campaign (+180%)</strong><span>Brand &amp; Social</span></figcaption>
                    </figure>
                    <figure class="work-tile" data-category="design" data-title="Social Media Asset Suite" data-category-label="Graphic Design">
                        <button class="tile-btn" aria-label="View Social Media Asset Suite larger"><span class="tile-media"><img src="assets/work/social-asset-suite.png" alt="Social Media Asset Suite work sample"></span></button>
                        <figcaption><strong>Social Media Asset Suite</strong><span>Graphic Design</span></figcaption>
                    </figure>
                    <figure class="work-tile" data-category="design" data-title="Presentation &amp; Slide Design" data-category-label="Graphic Design">
                        <button class="tile-btn" aria-label="View Presentation and Slide Design larger"><span class="tile-media"><img src="assets/work/slide-design.png" alt="Presentation and slide design work sample"></span></button>
                        <figcaption><strong>Presentation &amp; Slide Design</strong><span>Graphic Design</span></figcaption>
                    </figure>
                    <figure class="work-tile" data-category="design" data-title="Marketing Graphics Pack" data-category-label="Graphic Design">
                        <button class="tile-btn" aria-label="View Marketing Graphics Pack larger"><span class="tile-media"><img src="assets/work/marketing-graphics-pack.png" alt="Marketing Graphics Pack work sample"></span></button>
                        <figcaption><strong>Marketing Graphics Pack</strong><span>Graphic Design</span></figcaption>
                    </figure>
                    <figure class="work-tile" data-category="video" data-title="Short-form Reels Editing" data-category-label="Video">
                        <button class="tile-btn" aria-label="View Short-form Reels Editing larger"><span class="tile-media"><img src="assets/work/reels-editing.png" alt="Short-form reels editing work sample"></span></button>
                        <figcaption><strong>Short-form Reels Editing</strong><span>Video</span></figcaption>
                    </figure>
                    <figure class="work-tile" data-category="video" data-title="Promo Clips &amp; Captions" data-category-label="Video">
                        <button class="tile-btn" aria-label="View Promo Clips and Captions larger"><span class="tile-media"><img src="assets/work/promo-clips.png" alt="Promo clips and captions work sample"></span></button>
                        <figcaption><strong>Promo Clips &amp; Captions</strong><span>Video</span></figcaption>
                    </figure>
                    <figure class="work-tile" data-category="data" data-title="Power BI Feedback Dashboard" data-category-label="Data &amp; Ops">
                        <button class="tile-btn" aria-label="View Power BI Feedback Dashboard larger"><span class="tile-media"><img src="assets/work/powerbi-dashboard.png" alt="Power BI feedback dashboard work sample"></span></button>
                        <figcaption><strong>Power BI Feedback Dashboard</strong><span>Data &amp; Ops</span></figcaption>
                    </figure>
                    <figure class="work-tile" data-category="data" data-title="Notion SOP Library" data-category-label="Data &amp; Ops">
                        <button class="tile-btn" aria-label="View Notion SOP Library larger"><span class="tile-media"><img src="assets/work/notion-sop-library.png" alt="Notion SOP library work sample"></span></button>
                        <figcaption><strong>Notion SOP Library</strong><span>Data &amp; Ops</span></figcaption>
                    </figure>
                </div>
                <p class="work-note">Real samples are being added — every project is viewable right here, no redirects.</p>
            </div>
        </section>
```

- [ ] **Step 2: Replace `<!-- TASK 5 INSERTS: lightbox -->` (before the `app.js` script tag) with:**

```html
    <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Work sample preview" hidden>
        <button class="lightbox-btn lightbox-close" id="lightboxClose" aria-label="Close preview"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
        <button class="lightbox-btn lightbox-prev" id="lightboxPrev" aria-label="Previous sample"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5m6 6-6-6 6-6"/></svg></button>
        <figure class="lightbox-figure">
            <div class="lightbox-media" id="lightboxMedia"></div>
            <figcaption id="lightboxCaption"></figcaption>
        </figure>
        <button class="lightbox-btn lightbox-next" id="lightboxNext" aria-label="Next sample"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button>
    </div>
```

- [ ] **Step 3: Append to `styles.css`:**

```css
/* --- Work gallery --- */
.filter-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 32px; }
.filter-chip {
    padding: 10px 22px; border: 1px solid var(--hairline); border-radius: var(--pill-radius);
    font-size: 0.85rem; font-weight: 500; color: var(--text-secondary);
    transition: color 0.3s var(--ease), border-color 0.3s var(--ease), background 0.3s var(--ease);
}
.filter-chip:hover { border-color: var(--accent); color: var(--text-primary); }
.filter-chip.active { background: var(--accent); border-color: var(--accent); color: var(--pill-ink); }
.work-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.work-tile[hidden] { display: none; }
.tile-btn { display: block; width: 100%; }
.tile-media {
    position: relative; display: block; aspect-ratio: 4 / 3; overflow: hidden;
    background: var(--bg-surface); border: 1px solid var(--hairline); border-radius: var(--radius);
}
.tile-media::before {
    content: 'Sample coming soon'; position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-secondary);
}
.tile-media img { position: relative; z-index: 1; width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s var(--ease); }
.tile-btn:hover .tile-media img { transform: scale(1.03); }
.work-tile figcaption { display: flex; justify-content: space-between; gap: 12px; padding: 12px 2px 0; font-size: 0.85rem; }
.work-tile figcaption strong { font-weight: 600; color: var(--text-primary); }
.work-tile figcaption span { color: var(--text-secondary); }
.work-note { margin-top: 28px; font-size: 0.85rem; color: var(--text-secondary); }

/* --- Lightbox --- */
.lightbox {
    position: fixed; inset: 0; z-index: 150;
    display: flex; align-items: center; justify-content: center; gap: 16px;
    background: rgba(10, 10, 9, 0.92); padding: 24px;
}
.lightbox[hidden] { display: none; }
.lightbox-figure { max-width: min(880px, 82vw); }
.lightbox-media { background: var(--bg-surface); border: 1px solid var(--hairline); border-radius: var(--radius); }
.lightbox-media img { max-height: 72vh; width: 100%; object-fit: contain; }
.lightbox-placeholder {
    display: flex; align-items: center; justify-content: center; width: min(680px, 70vw); height: 48vh;
    font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-secondary);
}
.lightbox figcaption { color: #f4f2ed; padding-top: 14px; font-size: 0.9rem; }
.lightbox-btn {
    display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto;
    width: 48px; height: 48px; border: 1px solid rgba(255, 255, 255, 0.25); border-radius: var(--pill-radius); color: #f4f2ed;
}
.lightbox-btn:hover { border-color: #c5a880; }
.lightbox-close { position: absolute; top: 24px; right: 24px; }
```

- [ ] **Step 4: Add to `app.js`** — update init block to include `initGallery(); initLightbox();` after `initStickyNav();`, then append:

```js
/* --- Work gallery filters --- */
function initGallery() {
    const chips = document.querySelectorAll('.filter-chip');
    const tiles = Array.from(document.querySelectorAll('.work-tile'));
    tiles.forEach(tile => {
        const img = tile.querySelector('img');
        if (!img) return;
        img.addEventListener('error', () => img.remove());
        if (img.complete && img.naturalWidth === 0) img.remove();
    });
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.toggle('active', c === chip));
            const filter = chip.dataset.filter;
            tiles.forEach(tile => {
                tile.hidden = filter !== 'all' && tile.dataset.category !== filter;
            });
            logAuditEvent('Gallery Filtered', 'Filter applied: ' + filter, 'User', 'SUCCESS');
        });
    });
}

/* --- Lightbox (on-site work preview) --- */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const media = document.getElementById('lightboxMedia');
    const caption = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    const tiles = Array.from(document.querySelectorAll('.work-tile'));
    let current = 0;
    let lastFocus = null;

    function visibleTiles() { return tiles.filter(t => !t.hidden); }

    function makePlaceholder() {
        const ph = document.createElement('div');
        ph.className = 'lightbox-placeholder';
        ph.textContent = 'Sample coming soon';
        return ph;
    }

    function render(index) {
        const pool = visibleTiles();
        if (!pool.length) return;
        current = (index + pool.length) % pool.length;
        const tile = pool[current];
        const img = tile.querySelector('img');
        media.innerHTML = '';
        if (img) {
            const clone = img.cloneNode();
            clone.addEventListener('error', () => {
                if (clone.parentNode === media) media.replaceChild(makePlaceholder(), clone);
            });
            media.appendChild(clone);
        } else {
            media.appendChild(makePlaceholder());
        }
        caption.textContent = tile.dataset.title + ' — ' + tile.dataset.categoryLabel;
    }

    function open(tile) {
        lastFocus = document.activeElement;
        render(visibleTiles().indexOf(tile));
        lightbox.hidden = false;
        document.body.classList.add('no-scroll');
        closeBtn.focus();
        logAuditEvent('Lightbox Opened', 'Viewing: ' + tile.dataset.title, 'User', 'SUCCESS');
    }

    function close() {
        lightbox.hidden = true;
        document.body.classList.remove('no-scroll');
        if (lastFocus) lastFocus.focus();
    }

    tiles.forEach(tile => {
        tile.querySelector('.tile-btn').addEventListener('click', () => open(tile));
    });
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', () => render(current - 1));
    nextBtn.addEventListener('click', () => render(current + 1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => {
        if (lightbox.hidden) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') render(current - 1);
        if (e.key === 'ArrowRight') render(current + 1);
        if (e.key === 'Tab') {
            const focusables = lightbox.querySelectorAll('button');
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
            else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
        }
    });
}
```

- [ ] **Step 5: Verify**

```bash
curl -s http://localhost:4173/ | grep -c 'work-tile'
curl -s http://localhost:4173/ | grep -c 'filter-chip'
```

Expected: `10`, then `5`. Browser: tiles show "Sample coming soon" placeholder blocks (no images yet — no broken-image icons); each chip filters correctly ("Video" → 2 tiles); clicking a tile opens the lightbox; arrows cycle only visible tiles; ESC and backdrop close; focus returns to the tile.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: filterable work gallery with on-site lightbox"
```

---

### Task 6: About, testimonials, process, experience & certifications

**Files:**
- Modify: `index.html` (replace `TASK 6 INSERTS` comment), `styles.css` (append)

**Interfaces:**
- Consumes: `.hairline-card`, `.micro-label`, `.display`, `.pill-outline` (T1).
- Produces: `#about`, `#process` anchor targets.

- [ ] **Step 1: Replace `<!-- TASK 6 INSERTS: about, testimonials, process, experience -->` with:**

```html
        <section class="about" id="about">
            <div class="container about-grid">
                <div class="about-visual">
                    <img src="assets/about_candid.png" alt="Oyindamola working at her desk">
                </div>
                <div class="about-copy">
                    <p class="micro-label">About</p>
                    <h2 class="display section-title">The person behind <span class="italic-accent">the systems.</span></h2>
                    <p>I didn't take the traditional path. My training is in scientific research — a B.Sc. and M.Sc. in Human Anatomy — where I learned to see operations as systems: patterns, precision, and processes that hold up under pressure.</p>
                    <p>That rigor carried me through frontline support and administrative operations at CVS Pharmacy and Sagility Health, and today it powers everything I do — from resolving a customer's toughest day to building AI brand systems and designing assets that feel human.</p>
                    <ul class="tag-row about-chips"><li>B.Sc. Anatomy</li><li>M.Sc. Human Anatomy</li></ul>
                    <a href="OYINDAMOLA RESUME(pdfgear.com).pdf" download="Oyindamola_Resume.pdf" class="pill pill-outline">Get My Resume (PDF)</a>
                </div>
            </div>
        </section>

        <section class="testimonials">
            <div class="container">
                <div class="section-head">
                    <p class="micro-label">Testimonials</p>
                    <h2 class="display section-title">Kind words, <span class="italic-accent">earned.</span></h2>
                </div>
                <!-- PLACEHOLDER TESTIMONIALS — swap with real quotes before wide sharing (spec §8) -->
                <div class="quote-grid">
                    <blockquote class="hairline-card quote-card"><p>"Oyindamola turned our support inbox from a fire drill into a system. Response times dropped and customers noticed."</p><cite>Operations Lead, healthcare services</cite></blockquote>
                    <blockquote class="hairline-card quote-card"><p>"The brand voice prompts she built write like our best copywriter on their best day."</p><cite>Founder, e-commerce startup</cite></blockquote>
                    <blockquote class="hairline-card quote-card"><p>"Clean, consistent design work delivered faster than agencies we'd paid triple for."</p><cite>Marketing Manager, SaaS</cite></blockquote>
                    <blockquote class="hairline-card quote-card"><p>"She documents everything. Handovers that used to take weeks now take a call."</p><cite>CEO, creative agency</cite></blockquote>
                </div>
            </div>
        </section>

        <section class="process" id="process">
            <div class="container">
                <div class="section-head">
                    <p class="micro-label">How We'd Work</p>
                    <h2 class="display section-title">A 4-step <span class="italic-accent">process.</span></h2>
                </div>
                <ol class="process-steps">
                    <li class="process-step"><span class="step-num">1</span><div><h3>Discovery Call</h3><p>We talk goals, scope, and fit. Book via the contact form or email.</p></div></li>
                    <li class="process-step"><span class="step-num">2</span><div><h3>Audit &amp; Proposal</h3><p>I review your current support, brand, and content setup, then send a clear plan with scope and timeline.</p></div></li>
                    <li class="process-step"><span class="step-num">3</span><div><h3>Build &amp; Iterate</h3><p>I execute with weekly check-ins and transparent reporting. You always know what's shipping.</p></div></li>
                    <li class="process-step"><span class="step-num">4</span><div><h3>Handover &amp; Support</h3><p>Documentation and SOPs so your team can run it — with ongoing support if you want it.</p></div></li>
                </ol>
            </div>
        </section>

        <section class="experience">
            <div class="container">
                <div class="section-head">
                    <p class="micro-label">Experience</p>
                    <h2 class="display section-title">Where I've <span class="italic-accent">been.</span></h2>
                </div>
                <ul class="xp-list">
                    <li class="xp-row"><span class="xp-dates">Oct 2024 – Jul 2025</span><span class="xp-role">Customer Service Representative</span><span class="xp-org">CVS Pharmacy · Remote</span></li>
                    <li class="xp-row"><span class="xp-dates">Jan 2023 – Jun 2024</span><span class="xp-role">Healthcare Representative</span><span class="xp-org">Sagility Health · Remote</span></li>
                    <li class="xp-row"><span class="xp-dates">Nov 2022 – Dec 2023</span><span class="xp-role">Tutor &amp; Content Designer</span><span class="xp-org">Abiodun Foundation College</span></li>
                    <li class="xp-row"><span class="xp-dates">Feb 2019 – Sep 2022</span><span class="xp-role">Locum Pharmacist &amp; Operations Support</span><span class="xp-org">Lawleezy Healthcare Pharmacy</span></li>
                    <li class="xp-row"><span class="xp-dates">Jun 2021 – Dec 2021</span><span class="xp-role">Laboratory Attendant &amp; Data Analyst</span><span class="xp-org">Human Anatomy Dept., University of Ibadan</span></li>
                </ul>
                <!-- CERTIFICATIONS: client will supply entries (spec §8). Uncomment and duplicate rows when they arrive:
                <div class="certs">
                    <p class="micro-label">Certifications</p>
                    <ul class="xp-list">
                        <li class="xp-row"><span class="xp-dates">YEAR</span><span class="xp-role">Certificate name</span><span class="xp-org">Issuer</span></li>
                    </ul>
                </div>
                -->
            </div>
        </section>
```

- [ ] **Step 2: Append to `styles.css`:**

```css
/* --- About --- */
.about-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: clamp(32px, 5vw, 72px); align-items: center; }
.about-visual { background: var(--bg-surface); border: 1px solid var(--hairline); border-radius: var(--radius); padding: 20px; }
.about-visual img { border-radius: var(--radius); }
.about-copy p { margin-bottom: 18px; }
.about-copy .section-title { margin-bottom: 24px; }
.about-chips { margin: 8px 0 28px; }

/* --- Testimonials --- */
.quote-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.quote-card { padding: 28px; display: flex; flex-direction: column; gap: 20px; }
.quote-card p { font-size: 0.95rem; }
.quote-card cite { font-style: normal; font-size: 0.8rem; color: var(--text-secondary); margin-top: auto; }

/* --- Process --- */
.process-steps { max-width: 720px; }
.process-step { display: flex; gap: 28px; padding: 28px 0; border-bottom: 1px solid var(--hairline); }
.process-step:first-child { border-top: 1px solid var(--hairline); }
.step-num {
    flex: 0 0 44px; height: 44px; display: inline-flex; align-items: center; justify-content: center;
    border: 1px solid var(--accent); border-radius: var(--pill-radius);
    font-family: var(--font-head); font-weight: 700; color: var(--accent-text);
}
.process-step h3 { font-size: 1.05rem; text-transform: uppercase; font-family: var(--font-head); margin-bottom: 6px; }

/* --- Experience --- */
.xp-row {
    display: grid; grid-template-columns: 180px 1.4fr 1fr; gap: 16px; align-items: baseline;
    padding: 18px 0; border-bottom: 1px solid var(--hairline);
}
.xp-row:first-child { border-top: 1px solid var(--hairline); }
.xp-dates { font-size: 0.8rem; color: var(--text-secondary); letter-spacing: 0.04em; }
.xp-role { font-family: var(--font-head); font-weight: 700; text-transform: uppercase; font-size: 0.95rem; }
.xp-org { font-size: 0.9rem; color: var(--text-secondary); text-align: right; }
.certs { margin-top: 48px; }
```

- [ ] **Step 3: Verify**

```bash
curl -s http://localhost:4173/ | grep -c 'quote-card'
curl -s http://localhost:4173/ | grep -c 'xp-row'
curl -s http://localhost:4173/ | grep -c 'process-step'
```

Expected: `4`, `6`, `4`. (The `xp-row` count is 6 because the served HTML includes the commented-out certification template row alongside the 5 visible rows.) Browser: about splits image/copy, 4 quote cards, numbered process rows, 5 visible experience rows with no descriptions, resume pill downloads the PDF.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: about, testimonials, process, experience sections"
```

---

### Task 7: FAQ, big CTA, contact form + audit modal (ported)

**Files:**
- Modify: `index.html` (replace `TASK 7 INSERTS: faq, big cta, contact` and `TASK 7 INSERTS: audit modal` comments), `styles.css` (append), `app.js` (add `initContactForm`, `initAuditModal` + calls)

**Interfaces:**
- Consumes: `logAuditEvent`, `storageGet` (T1); ported element IDs per Global Constraints.
- Produces: `#faq`, `#contact` anchors; working form + audit viewer.

- [ ] **Step 1: Replace `<!-- TASK 7 INSERTS: faq, big cta, contact -->` with:**

```html
        <section class="faq" id="faq">
            <div class="container">
                <div class="section-head">
                    <p class="micro-label">FAQs</p>
                    <h2 class="display section-title">Got questions? <span class="italic-accent">Here are answers.</span></h2>
                </div>
                <div class="faq-grid">
                    <details class="faq-item"><summary>Do you work across time zones?</summary><p>Yes — fully remote, worldwide. I overlap comfortably with US and EU business hours and communicate async-first the rest of the time.</p></details>
                    <details class="faq-item"><summary>What are your core services?</summary><p>Customer service representation, AI brand management, and graphic design — backed by data analysis, executive assistance, social media management, and video editing.</p></details>
                    <details class="faq-item"><summary>What tools do you use daily?</summary><p>Zendesk and CRM platforms for support; Claude, ChatGPT, Jasper, and Midjourney for AI brand work; Canva and Photoshop for design; SQL, Power BI, and Excel for data; Notion, MS Teams, Buffer, and Later for operations.</p></details>
                    <details class="faq-item"><summary>How do we start working together?</summary><p>Four steps: a discovery call, an audit and proposal, build-and-iterate with weekly check-ins, then handover with full documentation. See the process section above.</p></details>
                    <details class="faq-item"><summary>Can I see samples of your work?</summary><p>Yes — the Selected Work gallery above shows samples by category, all viewable right here on the site. More available on request.</p></details>
                    <details class="faq-item"><summary>How quickly do you respond?</summary><p>Within 24 hours, usually much faster.</p></details>
                    <details class="faq-item"><summary>Which industries have you worked in?</summary><p>Healthcare and pharmacy retail, education, and tech and e-commerce startups.</p></details>
                    <details class="faq-item"><summary>Are you open to full-time roles?</summary><p>Yes — open to full-time remote roles as well as contract and project engagements.</p></details>
                </div>
            </div>
        </section>

        <section class="big-cta">
            <div class="container big-cta-inner">
                <h2 class="display section-title">Not sure what you need? <span class="italic-accent">Let's have a chat.</span></h2>
                <p>Tell me where it hurts — support, brand, or design — and I'll tell you honestly what would help.</p>
                <div class="hero-ctas">
                    <a href="mailto:oyindamolaw8@gmail.com" class="pill pill-primary">Book a Call</a>
                    <a href="#contact" class="pill pill-outline">Fill the Brief</a>
                </div>
            </div>
        </section>

        <section class="contact" id="contact">
            <div class="container contact-grid">
                <div class="contact-info">
                    <p class="micro-label">Say Hello</p>
                    <h2 class="display section-title">Let's build systems <span class="italic-accent">that perform.</span></h2>
                    <p>Have a support, brand, or design challenge? Drop a message — I reply within 24 hours.</p>
                    <ul class="contact-details">
                        <li><span>Email</span><a href="mailto:oyindamolaw8@gmail.com">oyindamolaw8@gmail.com</a></li>
                        <li><span>Phone</span><a href="tel:+2347041107313">+234 704 110 7313</a></li>
                        <li><span>Availability</span>Remote — Worldwide</li>
                    </ul>
                </div>
                <form id="contactForm" class="contact-form" novalidate>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="contactName">Name</label>
                            <input type="text" id="contactName" name="name" placeholder="John Doe" required aria-describedby="nameError">
                            <span class="error-msg" id="nameError" role="alert">Please enter your name.</span>
                        </div>
                        <div class="form-group">
                            <label for="contactEmail">Email</label>
                            <input type="email" id="contactEmail" name="email" placeholder="john@example.com" required aria-describedby="emailError">
                            <span class="error-msg" id="emailError" role="alert">Please enter a valid email address.</span>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="contactIndustry">Industry / Niche</label>
                            <select id="contactIndustry" name="industry">
                                <option value="saas">SaaS &amp; Software Tech</option>
                                <option value="ecommerce">E-Commerce &amp; Brands</option>
                                <option value="creatives">Creative &amp; Agency</option>
                                <option value="education">Education &amp; E-Learning</option>
                                <option value="other">Other Industry</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="contactProject">Project Scope</label>
                            <select id="contactProject" name="project">
                                <option value="support">Customer Service &amp; Support</option>
                                <option value="strategy">AI Brand Management</option>
                                <option value="design">Graphic Design</option>
                                <option value="consulting">General Consulting</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="contactMessage">Project Details</label>
                        <textarea id="contactMessage" name="message" rows="4" placeholder="Tell me about your goals..." required aria-describedby="messageError"></textarea>
                        <span class="error-msg" id="messageError" role="alert">Please share some details about your project.</span>
                    </div>
                    <button type="submit" class="pill pill-primary btn-submit" id="contactSubmitBtn">
                        <span class="btn-text">Send Message</span>
                        <span class="btn-wait">Sending…</span>
                    </button>
                    <div class="form-feedback success-feedback" id="formSuccessFeedback" role="status">Request submitted! Oyindamola will respond within 24 hours.</div>
                    <div class="form-feedback error-feedback" id="formErrorFeedback" role="alert">Submission failed. Please correct the highlighted errors.</div>
                </form>
            </div>
        </section>
```

- [ ] **Step 2: Replace `<!-- TASK 7 INSERTS: audit modal -->` with:**

```html
    <div class="modal" id="auditLogsModal" role="dialog" aria-modal="true" aria-label="System activity audit logs">
        <div class="modal-content hairline-card">
            <div class="modal-header">
                <h3 class="display">System Activity Audit Logs</h3>
                <button class="close-modal" id="closeModalBtn" aria-label="Close audit log">&times;</button>
            </div>
            <div class="modal-body">
                <div class="audit-table-wrapper" tabindex="0" aria-label="Audit log entries">
                    <table class="audit-table">
                        <thead><tr><th>Timestamp</th><th>Action Type</th><th>Target Entity</th><th>Actor</th><th>Status</th></tr></thead>
                        <tbody id="auditLogsTableBody"></tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
```

- [ ] **Step 3: Append to `styles.css`:**

```css
/* --- FAQ --- */
.faq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 40px; }
.faq-item { border-bottom: 1px solid var(--hairline); }
.faq-item summary {
    cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; gap: 16px;
    padding: 20px 0; font-family: var(--font-head); font-weight: 700; text-transform: uppercase; font-size: 0.9rem;
}
.faq-item summary::-webkit-details-marker { display: none; }
.faq-item summary::after { content: '+'; color: var(--accent-text); font-size: 1.2rem; transition: transform 0.3s var(--ease); }
.faq-item[open] summary::after { transform: rotate(45deg); }
.faq-item p { padding: 0 0 20px; font-size: 0.95rem; }

/* --- Big CTA --- */
.big-cta { border-top: 1px solid var(--hairline); border-bottom: 1px solid var(--hairline); }
.big-cta-inner { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 20px; }
.big-cta-inner .section-title { max-width: none; }
.big-cta .hero-ctas { justify-content: center; }

/* --- Contact --- */
.contact-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: clamp(32px, 5vw, 72px); }
.contact-info .section-title { margin-bottom: 20px; }
.contact-details { margin-top: 32px; }
.contact-details li {
    display: flex; flex-direction: column; gap: 2px; padding: 14px 0;
    border-bottom: 1px solid var(--hairline); font-size: 0.95rem; color: var(--text-primary);
}
.contact-details li span { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--accent-text); }
.contact-details a:hover { color: var(--accent-text); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
.form-group label { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }
.form-group input, .form-group select, .form-group textarea {
    font: inherit; color: var(--text-primary); background: transparent;
    border: 1px solid var(--hairline); border-radius: var(--radius); padding: 13px 16px;
    transition: border-color 0.3s var(--ease);
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: var(--accent); }
.form-group select { background: var(--bg-main); }
.form-group .invalid { border-color: var(--danger); }
.error-msg { display: none; font-size: 0.8rem; color: var(--danger); }
.error-msg.visible { display: block; }
.btn-submit { border: none; }
.btn-submit .btn-wait { display: none; }
.btn-submit.submitting .btn-text { display: none; }
.btn-submit.submitting .btn-wait { display: inline; }
.form-feedback { display: none; margin-top: 16px; font-size: 0.9rem; padding: 14px 16px; border-radius: var(--radius); border: 1px solid var(--hairline); }
.form-feedback.visible { display: block; }
.success-feedback { color: var(--accent-text); border-color: var(--accent); }
.error-feedback { color: var(--danger); border-color: var(--danger); }

/* --- Audit modal --- */
.modal {
    position: fixed; inset: 0; z-index: 140; display: none;
    align-items: center; justify-content: center; background: rgba(10, 10, 9, 0.8); padding: 24px;
}
.modal.visible { display: flex; }
.modal-content { background: var(--bg-main); max-width: 860px; width: 100%; max-height: 80vh; overflow: auto; }
.modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 24px; border-bottom: 1px solid var(--hairline);
}
.modal-header h3 { font-size: 1rem; }
.close-modal { font-size: 1.5rem; line-height: 1; }
.modal-body { padding: 24px; }
.audit-table-wrapper { overflow-x: auto; }
.audit-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.audit-table th, .audit-table td { text-align: left; padding: 10px 12px; border-bottom: 1px solid var(--hairline); }
.audit-table th { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); }
.status-badge { border: 1px solid var(--hairline); border-radius: var(--pill-radius); padding: 2px 10px; font-size: 0.7rem; }
.status-badge.success { color: var(--accent-text); border-color: var(--accent); }
```

- [ ] **Step 4: Add to `app.js`** — update init block to include `initContactForm(); initAuditModal();`, then append (ported from previous `app.js`, IDs unchanged; only the FontAwesome spinner markup was replaced by the `.btn-wait` text span):

```js
/* --- Contact form validation (ported) --- */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const contactName = document.getElementById('contactName');
    const contactEmail = document.getElementById('contactEmail');
    const contactIndustry = document.getElementById('contactIndustry');
    const contactProject = document.getElementById('contactProject');
    const contactMessage = document.getElementById('contactMessage');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const successFeedback = document.getElementById('formSuccessFeedback');
    const errorFeedback = document.getElementById('formErrorFeedback');
    const submitBtn = document.getElementById('contactSubmitBtn');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        successFeedback.classList.remove('visible');
        errorFeedback.classList.remove('visible');
        let isValid = true;

        if (contactName.value.trim() === '') {
            contactName.classList.add('invalid');
            nameError.classList.add('visible');
            isValid = false;
        } else {
            contactName.classList.remove('invalid');
            nameError.classList.remove('visible');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactEmail.value.trim())) {
            contactEmail.classList.add('invalid');
            emailError.classList.add('visible');
            isValid = false;
        } else {
            contactEmail.classList.remove('invalid');
            emailError.classList.remove('visible');
        }

        if (contactMessage.value.trim() === '') {
            contactMessage.classList.add('invalid');
            messageError.classList.add('visible');
            isValid = false;
        } else {
            contactMessage.classList.remove('invalid');
            messageError.classList.remove('visible');
        }

        if (!isValid) {
            errorFeedback.classList.add('visible');
            logAuditEvent('Contact Submission Rejected', 'Validation failed on inputs', 'User', 'VALIDATION_FAILED');
            return;
        }

        submitBtn.classList.add('submitting');
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.classList.remove('submitting');
            submitBtn.disabled = false;
            successFeedback.classList.add('visible');
            logAuditEvent(
                'Contact Submission Created',
                'Inquiry for project: ' + contactProject.value + ' in ' + contactIndustry.value + ' niche',
                'Visitor (' + contactName.value.trim() + ')',
                'SUCCESS'
            );
            contactForm.reset();
        }, 1500);
    });
}

/* --- Audit log modal (ported) --- */
function initAuditModal() {
    const viewAuditLogsBtn = document.getElementById('viewAuditLogsBtn');
    const auditLogsModal = document.getElementById('auditLogsModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const auditLogsTableBody = document.getElementById('auditLogsTableBody');

    let lastFocus = null;

    function openModal() {
        lastFocus = document.activeElement;
        loadAuditTable();
        auditLogsModal.classList.add('visible');
        closeModalBtn.focus();
        logAuditEvent('Audit Modal Viewed', 'Admin viewer opened system audit reports', 'System', 'SUCCESS');
    }

    function closeModal() {
        auditLogsModal.classList.remove('visible');
        if (lastFocus) lastFocus.focus();
    }

    viewAuditLogsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
    closeModalBtn.addEventListener('click', closeModal);
    auditLogsModal.addEventListener('click', (e) => {
        if (e.target === auditLogsModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (!auditLogsModal.classList.contains('visible')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'Tab') {
            const focusables = auditLogsModal.querySelectorAll('button, [tabindex="0"]');
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
            else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
        }
    });

    function loadAuditTable() {
        auditLogsTableBody.innerHTML = '';
        let logs = [];
        try { logs = JSON.parse(storageGet('system-audit-logs')) || []; } catch (err) { logs = []; }
        logs.forEach(log => {
            const row = document.createElement('tr');
            const date = new Date(log.timestamp);
            const formattedTime = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const statusClass = log.status === 'SUCCESS' ? 'success' : 'info';
            row.innerHTML =
                '<td><strong>' + escapeHtml(formattedTime) + '</strong></td>' +
                '<td>' + escapeHtml(log.actionType) + '</td>' +
                '<td>' + escapeHtml(log.targetEntity) + '</td>' +
                '<td>' + escapeHtml(log.actor) + '</td>' +
                '<td><span class="status-badge ' + statusClass + '">' + escapeHtml(log.status) + '</span></td>';
            auditLogsTableBody.appendChild(row);
        });
    }
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
```

- [ ] **Step 5: Verify**

```bash
curl -s http://localhost:4173/ | grep -c '<details'
curl -s http://localhost:4173/ | grep -c 'form-group'
```

Expected: `8`, then `5`. Browser: accordion opens/closes with rotating `+`; empty submit shows inline errors + error banner; valid submit shows "Sending…" then success banner and clears the form; "System Audit Log" in the footer opens the modal listing theme/filter/form events; backdrop and × close it.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: FAQ, big CTA, contact form and audit log (ported)"
```

---

### Task 8: Scroll reveal + responsive breakpoints

**Files:**
- Modify: `index.html` (add `reveal` classes), `styles.css` (append), `app.js` (add `initReveal` + call)

**Interfaces:**
- Consumes: everything built in Tasks 1–7.
- Produces: `.reveal` / `.in-view` convention; final breakpoint behavior.

- [ ] **Step 1: Add the `reveal` class in `index.html`** to exactly these elements: every `.section-head`, `.hero-copy`, `.hero-visual`, `.hero-meta`, each `.service-card`, `.skills-list`, each `.work-tile`, `.about-visual`, `.about-copy`, each `.quote-card`, each `.process-step`, each `.xp-row`, each `.faq-item`, `.big-cta-inner`, `.contact-info`, `.contact-form` (e.g. `class="hairline-card service-card reveal"`).

- [ ] **Step 2: Add to `app.js`** — update init block to include `initReveal();` last, then append:

```js
/* --- Scroll reveal --- */
function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('in-view'));
        return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => observer.observe(el));
}
```

- [ ] **Step 3: Append to `styles.css`:**

```css
/* --- Scroll reveal --- */
.reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s var(--ease), transform 0.7s var(--ease); }
.reveal.in-view { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; } }

/* --- Responsive --- */
@media (max-width: 1024px) {
    .hero-grid { grid-template-columns: 1fr; align-items: start; }
    .hero-visual { max-width: 480px; }
    .service-grid { grid-template-columns: 1fr; }
    .quote-grid { grid-template-columns: repeat(2, 1fr); }
    .work-grid { grid-template-columns: repeat(2, 1fr); }
    .about-grid, .contact-grid { grid-template-columns: 1fr; }
    .footer-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
    .faq-grid { grid-template-columns: 1fr; }
    .form-row { grid-template-columns: 1fr; }
    .xp-row { grid-template-columns: 1fr; gap: 4px; }
    .xp-org { text-align: left; }
    .stats-row { flex-direction: column; }
    .stat { border-right: none; border-bottom: 1px solid var(--hairline); }
    .stat:last-child { border-bottom: none; }
    .filter-row { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 8px; -webkit-overflow-scrolling: touch; }
    .filter-chip { flex: 0 0 auto; }
}

@media (max-width: 480px) {
    .work-grid, .quote-grid, .footer-grid { grid-template-columns: 1fr; }
    .footer-meta { flex-direction: column; align-items: flex-start; }
    .lightbox { flex-wrap: wrap; }
    .lightbox-prev, .lightbox-next { order: 2; }
}
```

- [ ] **Step 4: Verify**

```bash
curl -s http://localhost:4173/ | grep -c 'reveal'
```

Expected: ≥ 30. Browser at 1280px, 768px, and 375px widths in BOTH themes: no horizontal scrollbar, sections fade in on scroll, grids collapse per the rules above, filter chips scroll horizontally on mobile, overlay menu works. Emulate reduced motion (DevTools → Rendering): marquees static, content visible without scrolling animations.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: scroll reveal and responsive breakpoints"
```

---

### Task 9: frontend-design polish pass + full verification

**Files:**
- Modify: `styles.css` (refinements only), `index.html` (only if a polish fix requires markup tweak — no structural/ID changes)

**Interfaces:**
- Consumes: the complete site. Produces: the final, verified deliverable.

- [ ] **Step 1: Polish pass with the frontend-design skill loaded.** Walk every section top-to-bottom in both themes and refine within the token system: optical spacing balance, type-scale rhythm, hover/focus states, marquee speeds, hero portrait crop, footer logotype clipping. Allowed: changing CSS values, adding CSS rules. Not allowed: renaming classes/IDs, restructuring HTML, new colors outside tokens, new dependencies.

- [ ] **Step 2: Run the spec §10 verification checklist** (spec: `docs/superpowers/specs/2026-07-07-portfolio-redesign-design.md`):

Console clean at load and during interaction. Snapshots at desktop (1280), tablet (768), mobile (375) in both themes. Manual flows: overlay menu; theme persists across reload; every filter chip; lightbox open/prev/next/ESC/backdrop; every accordion item; form paths — empty submit (inline errors), bad email (email error), valid submit (sending → success → reset); audit log records events and opens from footer; back-to-top; marquee smoothness; reduced-motion emulation.

- [ ] **Step 3: Confirm spec conformance.** Re-read spec §4 section list against the rendered page; confirm all 15 structural elements present, no city names in served HTML (`curl -s http://localhost:4173/ | grep -ci 'lagos\|ibadan, nigeria'` → expected `0`; note "University of Ibadan" as an institution name is allowed and excluded from this grep), three roles in correct order in hero micro-label.

- [ ] **Step 4: Final commit**

```bash
git add -A && git commit -m "style: frontend-design polish pass and final verification"
```

---

## Post-plan self-review notes

- **Spec coverage:** §3 tokens → T1; §4.1 nav → T2; §4.2–4.3 hero/marquee → T3; §4.4–4.6 services/skills/tools → T4; §4.7 gallery → T5; §4.8–4.11 about/testimonials/process/experience → T6; §4.12–4.14 FAQ/CTA/contact + audit modal → T7; §4.15 footer → T2; §5 behaviors → T1/T2/T5/T7/T8; §6 responsive/a11y → T8 (+ per-task aria); §7 files → T1; §10 verification → T9. Deferred content (spec §8) intentionally not implemented: real images, real quotes, certifications entries, extra socials.
- **Known deviation:** none.
- **Type consistency:** `logAuditEvent(actionType, targetEntity, actor, status)` signature identical in T1 definition and T5/T7 call sites; `storageGet`/`storageSet` used consistently; lightbox IDs match between T5 markup and T5 JS; ported form IDs match T7 markup exactly.
