# DamolaKenny Portfolio — Design Rework Spec

**Date:** 2026-07-07
**Status:** Approved design, pending client spec review
**Scope:** Full restyle + restructure of the one-page portfolio (clean rebuild of `index.html`, `styles.css`, `app.js`). No framework migration; same static Vercel deployment.

## 1. Goal

Rework the site from its current warm editorial style (serif, cream, doodles) into a stark minimal-editorial design in the spirit of two references: the Belvaphilips Imagery screenshot (bold uppercase grotesque type, hairline borders, generous whitespace, accent-colored footer with giant clipped logotype, numbered process, FAQ accordion) and kvngart.netlify.app (monochrome restraint, marquee text strips, image-led grids) — adapted to the client's brand: **dark-first, champagne gold accent**.

The page projects **three primary roles**: Customer Service Representative, AI Brand Manager, Graphic Designer. Data Analysis, Executive Assistance, Social Media Management, and Video Editing appear as secondary skills.

## 2. Decisions log

| # | Decision | Choice |
|---|----------|--------|
| 1 | Scope | Restyle + restructure; clean rebuild of the three files |
| 2 | Color scheme | **Dark-first** with **champagne gold** accent; light mode via toggle (client rejected the yellow/light proposal, likes dark mode) |
| 3 | Work imagery | Styled placeholders now, swappable via `assets/work/`; client sends real samples later |
| 4 | Work viewing | Everything on-site: filterable gallery + lightbox. **No external redirects** |
| 5 | Testimonials | Placeholder quotes with generic attributions; swap before wide sharing |
| 6 | Role hierarchy | 3 primary roles featured; other 4 demoted to compact skills list |
| 7 | Location | No city references anywhere. Framing: "Remote — Worldwide" |
| 8 | Experience | Compact list rows (dates — role — company), no descriptions; certifications sub-list; layout accommodates ~10+ entries |
| 9 | Kept features | Contact form + validation; audit-log modal; theme toggle (dark default) |
| 10 | Dropped | Typewriter effect, static announcement bar (replaced by marquee), Tool Stack section (redundant), FontAwesome CDN (inline SVG instead), doodles/cursive signature |
| 11 | Logo | `DAMOLA` + italic `kenny` wordmark treatment preserved exactly (Playfair Display Italic) |
| 12 | Tools presentation | 6–8 tools per core service card + full-toolkit marquee (~18 tools) to avoid looking limiting |
| 13 | Implementation | frontend-design skill to be used during the build (user request) |

## 3. Design system

### 3.1 Typography

| Role | Face | Usage |
|------|------|-------|
| Headlines | **Archivo** 700/800 | Uppercase, tight tracking (−0.02em). Hero: `clamp(2.75rem, 7vw, 4.75rem)`; section titles: `clamp(2rem, 4.5vw, 3.25rem)` |
| Body | **Inter** 400/500 | ~16px, line-height ≥1.6 |
| Accent italic | **Playfair Display Italic** 400/600 | Single emphasized words inside headlines (mirrors the logo's roman/italic contrast) + the logo's "kenny" |
| Micro-labels | Inter 600 | 0.75rem, uppercase, letter-spacing 0.14em, gold — section tags ("SERVICES", "FAQS") |

Google Fonts: Archivo, Inter, Playfair Display (italic). Alex Brush and Lato are removed.

### 3.2 Color tokens

Dark theme (default, `body.dark-theme`):

- `--bg-main: #121210` (warm near-black) · `--bg-surface: #1a1a17`
- `--text-primary: #f4f2ed` · `--text-secondary: #a8a49b`
- `--hairline: rgba(255,255,255,0.12)`
- `--accent: #c5a880` (champagne gold) — micro-labels, footer block, emphasis, focus rings
- Footer block: gold background with near-black text (the screenshot's loud-footer moment, in brand color)

Light theme (via toggle, `body.light-theme`):

- `--bg-main: #ffffff` · `--bg-surface: #f6f6f4`
- `--text-primary: #111111` · `--text-secondary: #5f5c55`
- `--hairline: #e5e5e2`
- `--accent-text: #85693f` (darkened gold for AA-compliant small text on white); surfaces/large text may use `#c5a880`

### 3.3 Components

Pill buttons (solid + hairline-outline variants), sharp-cornered cards (max 4px radius) with 1px hairline borders, thin dividers, uppercase micro-labels, chips/tags, grayscale-leaning imagery on muted surface blocks, CSS marquee strips.

## 4. Page structure (single page, top to bottom)

1. **Nav** — wordmark left (`DAMOLA` + italic `kenny`), center links (About · Services · Work · Process · FAQ), right: theme toggle + primary pill "Let's Talk" (primary pill = gold background, near-black text, identical in both themes). Sticky; hairline bottom border appears on scroll. Mobile: hamburger → full-screen overlay menu.
2. **Hero** — left: huge uppercase headline projecting the three roles with one italic accent word (working copy: "CUSTOMER CARE, AI BRANDS & DESIGN — *done properly.*"), one short paragraph, two pills ("See My Work" → gallery, "Let's Talk" → contact). Right: portrait (`assets/oyindamola_portrait.png`) on a muted surface block. Below: merged **stats row** (5+ years in ops & support · 3 core disciplines · <24h response) and **employer strip** as text logos: CVS Pharmacy · Sagility Health · University of Ibadan · Abiodun Foundation College · Lawleezy Healthcare.
3. **Roles marquee** — auto-scrolling loop: `CUSTOMER SERVICE — AI BRAND MANAGEMENT — GRAPHIC DESIGN — REMOTE WORLDWIDE —`.
4. **Core services ("WHAT I DO")** — three large hairline feature cards:
   - *Customer Service Representative* — empathetic frontline support, ticketing, escalation, retention. Tools: Zendesk, CRM platforms, ticketing systems, live chat, email support, care-portal systems, escalation workflows.
   - *AI Brand Manager* — brand voice systems, AI content pipelines, persona mapping. Tools: Claude, ChatGPT, Jasper, Midjourney, prompt engineering, content calendars, brand voice guides.
   - *Graphic Designer* — social assets, slide design, marketing graphics. Tools: Canva, Photoshop, Midjourney, slide systems, social templates, brand kits.
5. **Secondary skills ("ALSO IN MY TOOLKIT")** — compact 4-row list: Data Analysis (SQL · Power BI · Excel) · Executive Assistance (Notion · MS Teams · SOP design) · Social Media Management (Buffer · Later · copywriting) · Video Editing (CapCut · Premiere Pro).
6. **Tools marquee** — second scrolling strip listing the full toolkit (~18 names): Zendesk · CRM · Claude · ChatGPT · Jasper · Midjourney · Canva · Photoshop · CapCut · Premiere Pro · SQL · Power BI · Excel · Notion · MS Teams · Buffer · Later · Google Workspace.
7. **Work gallery ("SELECTED WORK")** — filter chips: All · Brand & Social · Graphic Design · Video · Data & Ops. Ten tiles (placeholder blocks until images arrive), each: image slot + title + category label. Clicking opens an on-site **lightbox** (large view, caption, prev/next, ESC/backdrop close). Tile inventory:
   - Brand & Social: AI Brand Voice System · Organic Content Calendar · Engagement Growth Campaign (+180%)
   - Graphic Design: Social Media Asset Suite · Presentation & Slide Design · Marketing Graphics Pack
   - Video: Short-form Reels Editing · Promo Clips & Captions
   - Data & Ops: Power BI Feedback Dashboard · Notion SOP Library
8. **About ("THE PERSON BEHIND THE SYSTEMS")** — portrait (`assets/about_candid.png`) + the science-to-operations story condensed to two paragraphs, B.Sc./M.Sc. chips, "Get My Resume" pill (existing PDF, kept).
9. **Testimonials** — four hairline quote cards; placeholder quotes attributed generically (e.g., "CEO, e-commerce startup", "Operations Lead, healthcare services", "Founder, creative agency", "Marketing Manager, SaaS").
10. **Process ("A 4-STEP PROCESS")** — numbered timeline: 1 Discovery Call → 2 Audit & Proposal → 3 Build & Iterate (weekly check-ins) → 4 Handover & Support (documentation + SOPs).
11. **Experience & Certifications ("WHERE I'VE BEEN")** — hairline list rows, dates — role — company, no descriptions, no cities:
    - Oct 2024 – Jul 2025 — Customer Service Representative — CVS Pharmacy (Remote)
    - Jan 2023 – Jun 2024 — Healthcare Representative — Sagility Health (Remote)
    - Nov 2022 – Dec 2023 — Tutor & Content Designer — Abiodun Foundation College
    - Feb 2019 – Sep 2022 — Locum Pharmacist & Operations Support — Lawleezy Healthcare Pharmacy
    - Jun 2021 – Dec 2021 — Laboratory Attendant & Data Analyst — Human Anatomy Dept., University of Ibadan
    - **Certifications** sub-list beneath — renders only when entries exist; client will supply additional roles + certificates.
12. **FAQ ("GOT QUESTIONS?")** — two-column accordion, native `<details>/<summary>`, 8 questions: remote/timezone availability · core services · daily tools · how to start (points at process) · work samples (points at gallery) · response time (<24h) · industries served (healthcare, pharmacy retail, education, tech & e-commerce startups) · open to full-time remote roles and contract work.
13. **Big CTA** — "NOT SURE WHAT YOU NEED? *Let's have a chat.*" + pills: "Book a Call" (mailto) · "Fill the Brief" (scroll to form).
14. **Contact ("SAY HELLO")** — info column (email `oyindamolaw8@gmail.com`, phone, "Remote — Worldwide" availability line, **no city**) + the existing form ported: name, email, industry select, project-scope select, message, inline validation, success/error feedback. Hairline inputs, pill submit.
15. **Footer (gold block)** — link columns (Menu / Services / Contact), social icon row, copyright, restyled audit-log link, "BACK TO TOP" pill, and the giant clipped `DAMOLAkenny` logotype across the bottom edge.

## 5. Behavior (vanilla JS, no libraries)

| Module | Behavior |
|--------|----------|
| Theme | Dark default; toggle switches class + persists to localStorage (ported, default flipped); guarded try/catch |
| Mobile menu | Hamburger toggles full-screen overlay; closes on link click; `aria-expanded` |
| Sticky nav | Scroll listener adds border/backdrop class |
| Marquees | CSS keyframes, duplicated content for seamless loop, pause on hover |
| Gallery filter | Chips show/hide tiles by `data-category`; "All" default |
| Lightbox | Opens on tile click; large image + caption; prev/next; ESC + backdrop close; focus trapped while open |
| FAQ | Native `<details>` — no JS required to function |
| Scroll reveal | IntersectionObserver fade-up; disabled under `prefers-reduced-motion` (marquees also stop) |
| Contact form | Ported validation unchanged (required name/email/message, email regex, inline errors, success/error feedback). No backend — same simulated submit + audit-log entry as today |
| Audit log | Ported logic unchanged; modal restyled to new system |
| Misc | Smooth anchor scroll; back-to-top |

## 6. Responsive & accessibility

- Breakpoints ~1024 / 768 / 480px. Hero stacks (portrait below headline), service cards 3→1, gallery 3→2→1, footer columns stack, giant logotype scales with `vw`, filter chips horizontally scrollable on mobile.
- Semantic landmarks, single `h1`, visible focus styles, `aria-expanded`/`aria-controls` on menu + lightbox, alt text on all imagery, AA contrast in both themes (darkened gold `#85693f` for small gold text on white).
- Missing/not-yet-provided gallery images degrade to the styled placeholder block — never a broken image.
- `color-scheme` meta + updated title/description leading with the three roles; og tags kept.

## 7. Files

| File | Action |
|------|--------|
| `index.html` | Rewritten to the structure above |
| `styles.css` | Rewritten from zero around the token system |
| `app.js` | Rewritten; form-validation + audit-log modules ported from current file |
| `assets/` | Existing portraits reused; new `assets/work/` directory for client samples |
| Old design | Preserved in git history only |

## 8. Deferred content (layout ready, client-provided later)

- Real work images → drop into `assets/work/` or send in chat (placeholders until then)
- Real testimonial quotes (placeholders clearly generic until swapped)
- Additional experience entries + certifications
- Which social links to show (currently LinkedIn, X/Twitter, email; confirm Instagram/others)
- Confirm keeping the phone number in Contact (kept for now)
- Final headline copy may be polished during the build; constraint: must project the three primary roles, uppercase + one italic accent word

## 9. Out of scope

Framework/CMS migration, form backend/email delivery, blog, e-commerce, multi-page routing, analytics.

## 10. Verification plan

Serve locally; console clean; snapshots at desktop/tablet/mobile in **both themes**; manual flows: overlay menu, theme persistence across reload, every filter chip, lightbox open/nav/close, accordion, form validation paths (empty / bad email / success), audit log records + opens, back-to-top, marquee smoothness; `prefers-reduced-motion` emulation check.
