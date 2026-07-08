# DamolaKenny Portfolio — Editorial Redesign Spec

**Date:** 2026-07-08
**Status:** Approved design, pending client spec review
**Scope:** Re-art-direction of the existing one-page portfolio into a print-magazine aesthetic. Restyle + relayout of the three existing files (`index.html`, `styles.css`, `app.js`). All content and every feature preserved; same static Vercel deployment.

## 1. Goal

The current site (dark-first minimal-editorial: Archivo/Inter/Playfair, champagne gold, symmetric hairline-card grids) reads as generic "tasteful AI" design. Rebuild the **visual language** into a genuinely art-directed print magazine so it reads as hand-designed — which also demonstrates the design skill the subject is selling. No content or feature is lost; the layout and type system are what transform.

## 2. Diagnosis — what currently reads as AI-generated (what we are fixing)

- **Inter body** (the most common AI body font; on the frontend-design avoid-list) + **Archivo** grotesque + **Playfair italic accent words inside uppercase headlines** — the "BOLD CAPS *with an italic word*" move is a template cliché.
- Everything centered in one 1200px column; uppercase gold micro-labels above every section head; symmetric hairline-card grids; uniform 4px radius; pill buttons with `translateY(-2px)` hovers; evenly distributed `clamp()` spacing.
- The whole thing is *systematic and symmetric* — which reads as machine-made. Hand-designed work has a point of view, asymmetry, idiosyncratic devices, and intentional "wrong" choices.

## 3. Decisions log

| # | Decision | Choice |
|---|----------|--------|
| 1 | Aesthetic direction | **Editorial / print magazine** — art-directed like a real design magazine |
| 2 | Palette mood | **Warm paper + ink, light-first**; dark ("ink") mode via toggle (supersedes the prior dark-default; client approved light-first) |
| 3 | Accent ink | **Deep oxblood / maroon** `#7a2e2e` |
| 4 | Scope | **Re-art-direct layout, keep all content + features**; same 3 files, same deploy |
| 5 | Typefaces | **Fraunces** (display/masthead), **Newsreader** (body/reading), **Fragment Mono** (furniture: folios, captions, kickers). Replaces Archivo/Inter/Playfair entirely |
| 6 | Corners | **Radius 0** everywhere — no pills, no rounded cards |
| 7 | Buttons | Oxblood underline text-links + hard-edged "stamp" buttons; no pills |
| 8 | Imagery | CSS **duotone plates** that develop to full color on hover (no new assets) |

## 4. Design system

### 4.1 Typefaces

Loaded from Google Fonts (replacing Archivo/Inter/Playfair). `font-display: swap`, `preconnect` retained.

- **Fraunces** — display, mastheads, section titles, feature numerals, drop caps, pull quotes. Variable; use optical size (`opsz`) high on large display, and dial character axes **SOFT** and **WONK** up slightly for hand-set warmth. Weights ~400–900, roman + italic.
  - Requested axes: `ital,opsz,wght,SOFT,WONK@0,9..144,400..900,0..100,0..1;1,9..144,400..900,0..100,0..1`
- **Newsreader** — body/reading text, feature paragraphs, FAQ answers, testimonial bodies. Optical-size serif made for editorial reading; real italics for quotes. Axes: `ital,opsz,wght@0,6..72,400..600;1,6..72,400..600`.
- **Fragment Mono** — "furniture": folios/page numbers, running heads, kickers, captions, dateline, form labels, nav items. `ital@0;1`.

Fallback stacks: Fraunces → `Georgia, 'Times New Roman', serif`; Newsreader → `Georgia, serif`; Fragment Mono → `'SFMono-Regular', ui-monospace, monospace`.

### 4.2 Type scale (fluid)

| Token | Font | Size | Notes |
|-------|------|------|-------|
| Cover headline (`h1`) | Fraunces | `clamp(3.2rem, 9vw, 8rem)` | line-height 0.95, wght ~560, opsz max, set asymmetrically |
| Section title (`h2`) | Fraunces | `clamp(2.2rem, 5vw, 4rem)` | line-height 1.02 |
| Feature numeral | Fraunces | `clamp(3rem, 8vw, 7rem)` | oxblood, hanging in margin |
| Pull quote | Fraunces italic | `clamp(1.6rem, 3.5vw, 2.6rem)` | oxblood, wide measure |
| Lead paragraph | Newsreader | `1.35rem` | opens features; drop cap |
| Body | Newsreader | `1.125rem` | line-height 1.6, measure ~66ch |
| Drop cap | Fraunces | ~3 lines (`~4.2em`, float) | oxblood |
| Kicker / running head / caption / folio / nav / form label | Fragment Mono | `0.75rem` | uppercase, letter-spacing 0.16em |

### 4.3 Color tokens

**Paper (light, default — `body.light-theme`):**
- `--paper: #f3efe4` (warm newsprint) · `--paper-inset: #eae4d5`
- `--ink: #1a1714` (warm near-black) · `--ink-soft: #55504a` (secondary)
- `--accent: #7a2e2e` (oxblood; ~8:1 on paper — AA for all text) · `--accent-text: #7a2e2e`
- `--rule: rgba(26,23,20,0.22)` (hairline) · `--rule-strong: rgba(26,23,20,0.55)` (double rules)
- `--danger: #9a2f1c` (distinct from oxblood — warmer/oranger, for form errors)

**Ink (dark, via toggle — `body.dark-theme`):**
- `--paper: #1a1714` · `--paper-inset: #221e1a`
- `--ink: #f0ead9` (warm off-white) · `--ink-soft: #a8a094`
- `--accent: #c25b53` (brightened oxblood; use for **large/decorative** text, rules, drop caps, numerals) · `--accent-text: #e0968b` (small text/links; ~6:1 on ink paper — AA)
- `--rule: rgba(240,234,217,0.18)` · `--rule-strong: rgba(240,234,217,0.5)`
- `--danger: #e08a80`

**Accent usage rule (both themes):** small text set in oxblood (links, kickers, running heads, captions) uses `--accent-text`; large/display oxblood (headlines, numerals, drop caps, pull quotes, rules) uses `--accent`. In paper mode the two tokens are identical; in ink mode `--accent-text` is the brightened AA-safe shade. This keeps every oxblood text run AA-compliant in both themes.

Class names stay `light-theme` / `dark-theme` so `app.js` theme logic ports unchanged; **default flips to `light-theme`** (paper). The pre-paint theme script's default flips to light. localStorage key stays `portfolio-theme`.

### 4.4 Anti-slop rules (applied globally)

1. **Radius 0** on everything (`--radius: 0`). No pills (`--pill-radius` removed).
2. No hairline-card grid, no centered gold micro-labels, no pill buttons, no `translateY` hover bounces.
3. **Asymmetry by default:** 12-column grid, generous uneven outer margins, body set to ~66ch measure offset within a wider grid, margin-note column.
4. **Editorial devices** replace boxes: drop caps, pull quotes breaking the column, running heads (`01 — SERVICES` mono small caps + folio), hairline + double rules, hanging numerals, dot-leader contents rows, mono captions/folios.

### 4.5 Editorial devices catalog (reusable)

- **Drop cap** (`.drop-cap`): Fraunces, oxblood, `float:left`, ~3 lines, on lead paragraphs (hero intro, about lead).
- **Pull quote** (`.pull-quote`): Fraunces italic oxblood, wide measure, top/bottom hairline rules.
- **Running head** (`.running-head`): mono small caps + folio number (`№`), above each section, with a rule.
- **Double rule** (`.rule-double`): 3px top border + 1px line beneath (two stacked borders) in `--rule-strong`.
- **Hanging numeral** (`.numeral`): large Fraunces oxblood figure in the left margin.
- **Dot leader row** (`.leader-row`): flex row with dotted leader filling space between label and value (contents-page style).
- **Margin note** (`.margin-note`): mono small text set in the outer margin (facts, asides).
- **Mono caption/folio** (`.caption`, `.folio`): Fragment Mono small caps under images and plates.
- **Duotone plate** (`.plate`): image with oxblood/cream duotone that develops to full color on hover (see §6.3).
- **Dateline divider**: oxblood diamond `◆` between ticker items.
- **Paper grain**: fixed inline-SVG noise overlay, low opacity, `pointer-events:none`, `mix-blend-mode: multiply` (paper) / `screen` (ink); suppressed in print.

## 5. Section-by-section transformation

All existing sections, copy, and features are kept; each is restyled into a magazine element.

1. **Masthead (nav).** Running header: `DAMOLA KENNY` in Fraunces at left, nav items in mono small caps, folio at right (`№ 01 · PORTFOLIO`); full-width double-rule beneath; hairline appears on scroll. "Let's Talk" becomes an oxblood underline text-link. Theme toggle becomes a mono `PAPER ⁄ INK` label switch. Mobile: hamburger → full-screen overlay set in Fraunces.
2. **Hero → the cover.** Asymmetric oversized Fraunces headline (not centered); dateline in mono (`REMOTE — WORLDWIDE · PORTFOLIO № 01`); three roles as a masthead credit line; portrait as a **duotone plate** with hairline frame + mono caption/folio; top issue line + double-rule. Stats become three large Fraunces figures divided by vertical rules ("by the numbers"). CTAs: oxblood underline-link + stamp button.
3. **Roles ticker (was marquee).** Newspaper dateline: small-caps serif items separated by oxblood `◆`, framed by hairline rules top/bottom. (Tools ticker identical treatment.)
4. **Services → editorial index.** Full-width ruled feature rows: giant oxblood Fraunces numerals (`01`–`03`) hanging in the margin, role title in Fraunces, description at narrow measure, tools as a mono caption line. No cards. Secondary skills → tight ruled contents list.
5. **Tools ticker.** Dateline treatment (as §3).
6. **Selected Work → photo plates.** Asymmetric plate layout (varying tile sizes; e.g. one wide plate + stacked pairs), each a duotone that develops to full color on hover, with mono caption + folio + category beneath (`PLATE 03 — GRAPHIC DESIGN`). Filter chips → mono small-caps text toggles, active one underlined oxblood. Lightbox → framed "spread" with figure-legend caption. Placeholder "sample coming soon" behavior retained for empty slots.
7. **About → the feature article.** Two-column feature; large oxblood **drop cap** on the lead; candid photo as duotone plate + caption; B.Sc./M.Sc. facts as **margin notes** in mono; resume link as oxblood underline-link.
8. **Testimonials → pull quotes.** Four large Fraunces-italic oxblood pull quotes, wide measure, em-dash attribution in mono small caps, divided by rules. (Placeholder quotes retained.)
9. **Process → numbered steps.** Big Fraunces numerals with hanging rules; titles Fraunces, body Newsreader.
10. **Experience → the contents page.** Ruled index with dot leaders: date (mono, left) — role (Fraunces) — company (Newsreader italic). Commented certifications template retained in the same rhythm.
11. **FAQ → the interview.** Q in oxblood Fraunces bold, A in Newsreader, divided by hairlines; native `<details>` behavior kept.
12. **Big CTA → editorial call.** Large Fraunces line + oxblood underline-link + stamp button, centered on paper with rules.
13. **Contact → the correspondence page.** Underline-only inputs (no boxes, no radius) on paper; submit is a hard-edged oxblood **stamp** button; info column as mono-labelled correspondence details (availability "Remote — Worldwide", no city names).
14. **Footer → the colophon.** Inverse (ink) paper for a back-cover feel: giant Fraunces `DAMOLAKENNY` logotype, credits/links in mono small caps, audit-log link retained, `PAPER ⁄ INK`/back-to-top controls.
15. **Audit-log modal.** Restyled to the system: ink-on-paper dialog, hairline rules, mono column heads; all current dialog semantics/focus-trap/Escape retained.

## 6. Interaction & components

### 6.1 Buttons & links
- **`.link-underline`** (primary CTA/nav): oxblood text; underline drawn via `background-image` linear-gradient sized `0 → 100%` on hover/focus (no color swap). Used for nav CTA, resume, "Book a Call", inline links.
- **`.stamp-btn`** (form submit, key CTAs): rectangular, 1px solid `--accent`, ink label in mono small caps; hover inverts to accent fill / paper text; `:active` letterpress inset shadow. Replaces all pills.

### 6.2 Form inputs
Underline-only: transparent background, `border-bottom: 1px solid var(--ink)`, no other borders, radius 0; focus → `border-bottom-color: var(--accent)` + label lift. Error state → `--danger` underline + `role="alert"` message (existing ARIA wiring kept). Selects and textarea match.

### 6.3 Duotone plates
Image element with `filter: grayscale(1) contrast(1.04)` under two color layers (oxblood + paper) via `mix-blend-mode` (multiply/screen) or `background-blend-mode`. Hover/focus fades the color layers out (`opacity 0`) to reveal the full-color image (a "develop" effect), `transition ~0.5s`. **Progressive enhancement:** if `mix-blend-mode` unsupported (`@supports`), show the plain full-color image (no broken state). Empty gallery slots keep the "sample coming soon" placeholder.

### 6.4 Theme toggle
Mono `PAPER ⁄ INK` label switch (replaces sun/moon). Toggles `light-theme`/`dark-theme` on `<body>`, persists to `portfolio-theme`. Uses `classList` add/remove (never `className =`) to preserve `menu-open`/`no-scroll` state — as in current code.

### 6.5 Tickers
CSS-only marquees restyled as datelines (small-caps serif + `◆` dividers + rules); duplicated track for seamless loop; pause on hover; disabled under `prefers-reduced-motion`.

## 7. Motion

One orchestrated moment + quiet ambient reveals.
- **Cover load sequence:** top double-rule draws left→right; Fraunces headline sets line-by-line (staggered `animation-delay`); duotone portrait develops in; dateline types on.
- **Scroll reveals:** reuse the existing IntersectionObserver `.reveal` → editorial variant (text rises a few px, plates fade in). Once-only; `unobserve` after.
- **Signature interactions:** link underlines draw in; work plates develop duotone→color; drop caps + pull quotes as visual rest-stops. No pill lifts, no `translateY` bounces.
- **`prefers-reduced-motion: reduce`:** all reveals/tickers/sequences static and fully visible; grain is static regardless.

## 8. Technical scope

- **Files:** `index.html`, `styles.css`, `app.js` only. Static, no build step, same Vercel deploy. `.claude/dev-server.mjs` local server retained for verification.
- **Fonts:** swap Google Fonts request to Fraunces + Newsreader + Fragment Mono; `preconnect` + `font-display: swap`; keep the pre-paint theme `<script>` in `<head>` (default → light).
- **Paper grain:** tiny inline-SVG `feTurbulence` texture (data-URI, no external request), fixed overlay, `pointer-events:none`.
- **Duotone:** CSS-only per §6.3; no new image assets.
- **JS:** all modules preserved (`initTheme`, `initMenu`, `initStickyNav`, `initGallery`, `initLightbox`, `initContactForm`, `initAuditModal`, `initReveal`, storage guards, audit core). Changes are additive/adaptive (toggle label, duotone hover if any JS needed — prefer CSS-only). No new libraries.
- **Accessibility:** AA contrast verified for oxblood-on-paper and ink-mode `--accent-text`; all current ARIA (form `aria-describedby`/`role=alert`, dialog semantics + focus traps, `aria-expanded`, single `h1`) retained; decorative folios/drop caps/`◆` marked `aria-hidden` where appropriate; focus-visible rings in oxblood.
- **Performance:** variable fonts requested with bounded axes; grain is a single small data-URI; no added network requests beyond the font swap.

## 9. Preserved features (must still work after redesign)

Theme toggle (+persistence, pre-paint apply) · mobile overlay menu · sticky-nav hairline · both tickers · work filters + lightbox (now duotone/develop) + placeholder fallback · contact form validation (empty/bad-email/success→reset) + audit logging · audit-log modal (open/Escape/backdrop/focus-restore) · scroll reveals · reduced-motion handling.

## 10. Out of scope / deferred client content

Framework/CMS migration, form backend, blog, e-commerce, analytics. Deferred content the new layout only reframes: real work images (`assets/work/`), real testimonials, extra experience/certifications, real social URLs, absolute `og:image` once domain is known.

## 11. Verification plan

Serve locally; console clean at load and during interaction. Snapshots at desktop (1280), tablet (768), mobile (375) in **both** paper and ink modes. Manual flows: cover load sequence; theme toggle persistence across reload; overlay menu; every work filter + plate develop-on-hover; lightbox open/nav/Escape/backdrop/focus-restore; each FAQ item; form paths (empty → inline errors, bad email, valid → success → reset); audit log records + opens + closes with focus restore; both tickers; drop caps/pull quotes/dot-leaders render correctly; `prefers-reduced-motion` emulation. Confirm no city names in served HTML and the three roles appear in order.
