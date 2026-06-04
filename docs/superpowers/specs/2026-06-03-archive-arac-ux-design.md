# Archive Arac UX Design Spec

**Date:** 2026-06-03  
**Status:** Approved for Phase 1 implementation (spec only — no code in this deliverable)  
**Scope:** Navigation, Weave Motion animation, honest copy, platform footer links  
**Out of scope (this doc):** LandscapeSection / Navbar implementation (Phase 1 follows this spec)

---

## Executive summary

Archive Arac (oidib.io) presents a credible web-intelligence platform—strands index, Silk Analyzer, Identity Lock, Studio, Vault—but two UX gaps undermine trust and wayfinding:

1. **Misleading “Growth of the Weave” chart** — Chart.js line graph with percentage deltas (+82%, +45%, +30%) and copy (“Our data tracks…”) reads like live analytics. It is illustrative fiction on a marketing surface.
2. **Broken mobile navigation** — Below `lg`, users see only a Mission pill; seven platform routes and home anchors are hidden.

**Chosen direction (parent-approved defaults):**

| Area | Decision |
|------|----------|
| **Weave section** | Replace chart with **Weave Motion** — animated silk threads for AI Intent, Spatial WebGL, and Physics Micro-UX; clearly labeled illustrative, not live data |
| **Navigation** | Sticky header everywhere; unified product names; **mobile slide-over drawer** (not bottom bar — too many destinations) |
| **Auth** | **Defer** full Google/GitHub account login (Option D). Keep anonymous `clientId` vault + existing X/TikTok OAuth in Studio Social. Document Clerk (or similar) as Phase 2 path |
| **Footer** | Add compact platform footer with nav links on all `PlatformShell` pages (home keeps full marketing footer) |

Phase 1 delivers nav + animation + copy honesty + platform footer. Phase 2 adds optional account auth and real analytics feed if product requires it.

---

## Information architecture

### Site map (primary routes)

| Route | Nav label (canonical) | Role |
|-------|----------------------|------|
| `/` | Home | Marketing + index + embedded analyzer |
| `/#weave` | Weave | Landscape / Weave Motion section |
| `/#index` | Index | Strand database grid |
| `/#analyzer` | *(not in primary nav)* | Home-embedded Silk Analyzer — scroll target only (same tool as `/analyze`) |
| `/mission` | Mission | Product journey explainer |
| `/analyze` | **Silk Analyzer** | Canonical URL for analyze + compare (shared `AnalyzerSection`) |
| `/identity` | Identity Lock | Name/domain/handle discovery & lock |
| `/studio` | Studio | Build, host, connect (Wix, social) |
| `/compose` | Strand Composer | Export strand stack / scaffolds |
| `/collections` | Collections | Batch URL sets & benchmark runs |
| `/vault` | Vault | Saved reports, locks, briefs, sync |

**Naming rule:** Nav and CTAs use **canonical labels** in the table above. Page `<h1>` may stay poetic (“Weave your launch stack”) but nav, footer, and breadcrumbs use canonical names.

### Desktop navigation (`≥ lg`)

Sticky top bar (existing cream blur treatment). Single row:

```
[ Logo: ARCHIVE ARAC ]

Weave · Index  |  Identity Lock · Studio · Silk Analyzer · Strand Composer · Collections · Vault · Mission
```

- **Home anchors** (`/#weave`, `/#index` only in nav): cream/muted hover → accent orange. Home `#analyzer` section remains for scroll discovery; nav links to `/analyze` only (no duplicate Analyzer entry).
- **Platform links**: ink hover → accent orange.
- **Active route** (platform pages): subtle underline or `text-[#E67E22]` on current item.
- **No auth button in Phase 1** — vault sync remains anonymous via `archive-arac:client-id` in localStorage.

### Mobile navigation (`< lg`)

**Pattern: sticky header + right slide-over drawer** (not bottom tab bar — 10+ destinations exceed comfortable thumb targets).

**Header (always visible):**

```
[ Logo ]                    [ Menu ≡ ]
```

- Menu opens drawer (~85vw max 320px) from the right; backdrop `bg-[#2C2A29]/40`.
- Focus trap, `Escape` closes, body scroll lock while open.
- **Do not** replace header with Mission-only pill (current bug).

**Drawer sections:**

1. **On the home page** — Weave, Index (hash links only).
2. **Platform** — Identity Lock, Studio, Silk Analyzer → `/analyze`, Strand Composer, Collections, Vault, Mission (full routes).
3. **Footer row in drawer** — “Illustrative trends on home · not live analytics” (one line, reinforces honesty).

Drawer closes on link tap. Sticky header persists on scroll.

### Platform footer (new)

Home page keeps existing dark marketing `Footer`. Platform pages (`PlatformShell`) get a **compact `PlatformFooter`**:

- Two link rows: Platform (Identity Lock, Studio, Silk Analyzer → `/analyze`, …) + Home sections (Weave, Index).
- Copyright line reused from home footer.
- Placed at bottom of every platform page inside `PlatformShell`.

---

## Per-page “what this does” blocks

Short explainer blocks (1–2 sentences + optional bullet) for Mission page, empty states, or future `/help`. Wording below is implementation-ready copy.

### Home (`/`)

**What this is:** The front door—curated strand index, illustrative weave trends, and a quick path into the Silk Analyzer without leaving the page.

**You can:** Browse breakthrough UI patterns, open strand detail modals, run a URL scan, jump to any platform tool.

### Mission (`/mission`)

**What this is:** A plain-language map of the product—four moves (Unravel → Claim → Spin → Vault) with links into real tools.

**You can:** Understand the flow end-to-end before committing to Identity Lock or Studio.

### Silk Analyzer (`/analyze`)

**What this is:** Paste any public URL; get tech stack, design/interaction signals, UX & accessibility notes, performance hints, innovation score, and strand recommendations. Compare two sites side-by-side.

**You can:** Save reports to Vault, share links, export Markdown.

### Identity Lock (`/identity`)

**What this is:** Brand-name discovery with live domain (RDAP) and social-handle checks. Rank candidates, approve one, export a lock package, optionally checkout via Stripe.

**You can:** Save locks to Vault; bundle with Studio hosting.

### Studio (`/studio`)

**What this is:** Build and connect—hosting tiers, Cursor/Wix/Lovable paths, social monitoring (X/TikTok OAuth, read-only), Wix site linking.

**You can:** Save studio briefs to Vault; deep-link to Social, Wix, or Identity Lock subflows.

### Vault (`/vault`)

**What this is:** Your local-first workspace keyed by anonymous client ID, with optional server sync—analyzer reports, identity locks, studio briefs, registrar orders, connected social/Wix metadata.

**You can:** Review, delete, sync, open deep links (`?id=`).

### Strand Composer (`/compose`)

**What this is:** Pick up to five strands from the index and export a launch manifest or full scaffold package for your repo.

**You can:** Copy export text; tune project name and export mode.

### Collections (`/collections`)

**What this is:** Named URL lists for batch analysis—benchmark sets, competitor boards, audit queues.

**You can:** Create collections, add/remove URLs, run batch analyze against the set.

---

## Weave Motion — animation specification

Replaces `LandscapeSection` Chart.js canvas and misleading stat bullets.

### Purpose

Communicate three interface **trends as concepts**, not metrics. Motion suggests interwoven futures (intent, spatial depth, physical micro-feedback) without implying measured growth rates.

### Layout

Preserve existing **3-column grid on `lg`**: left column = title + honest copy + beat-aligned descriptors; right 2 cols = animation stage.

**Animation stage:** `aspect-[16/10]` (or match current chart container height ~280–360px), rounded-3xl, `bg-[#F9F7F3]`, subtle border — same shell as today’s chart container.

**SVG viewBox:** `0 0 800 500` (responsive `width: 100%`, `height: 100%`).

### Visual elements

Three Bézier “silk threads” (2.5–3px stroke, round caps):

| Thread | Color | Concept label | Stroke style |
|--------|-------|---------------|--------------|
| 1 | `#9C7C5B` | AI Intent-Driven | Solid |
| 2 | `#8BA896` | Spatial WebGL | Solid |
| 3 | `#2C2A29` | Physics Micro-UX | Dashed (`stroke-dasharray: 8 6`) |

Optional faint grid: horizontal lines at 20% opacity `#D1CEC7` (decorative, no Y-axis numbers).

**Intro chip** (above SVG, centered in stage):

> Illustrative trends · not live data

`text-[10px] uppercase tracking-widest text-[#5A5653]`, pill border `#C4A882/40`.

### Timeline (one loop ≈ **18–20s**, seamless)

Longer cycle is intentional when the motion reads as worth watching. Default **18s**; stretch to **20s** in QA if the weave feels rushed.

| Time | Beat | Visual | Left-column descriptor (replaces +% bullets) |
|------|------|--------|-----------------------------------------------|
| 0.0–1.0s | Intro | Chip visible: “Illustrative trends · not live data” | All descriptors muted |
| 1.0–3.5s | **Web foundation** | Faint grid / web structure constructs (threads not yet labeled) | Still muted |
| 3.5–6.5s | Thread 1 | `#9C7C5B` draws along path (`stroke-dashoffset` 1→0) | — |
| 6.5–7.5s | Title 1 | Thread 1 complete → **AI Intent-Driven** label fades in | “Interfaces that infer what you mean, not just what you click.” |
| 7.5–10.5s | Thread 2 weave | `#8BA896` enters, **crosses over** thread 1 (over-under knot) | — |
| 10.5–11.5s | Title 2 | **Spatial WebGL** label fades in | “Depth, parallax, and scene-like layouts beyond flat grids.” |
| 11.5–14.5s | Thread 3 | `#2C2A29` dashed thread completes the braid | — |
| 14.5–15.5s | Title 3 | **Physics Micro-UX** label fades in | “Motion with weight—scroll, drag, and spring that feel tangible.” |
| 15.5–17.5s | Full weave hold | All three threads + labels visible; optional subtle knot pulse (≤5% opacity) | All three active |
| 17.5–18.0s+ | Loop reset | Smooth dashoffset / cross-fade reset **without flash**; chip stays | Descriptors fade to muted → loop |

**Loop rule:** Use `animation-iteration-count: infinite` on a master CSS keyframe **or** a single `requestAnimationFrame` timeline that resets dash offsets with 400ms ease — **no flash to white**.

### Technical approach (recommended)

**Primary: inline SVG + CSS `@keyframes` on `stroke-dashoffset` and opacity**

| Option | Verdict |
|--------|---------|
| **SVG + CSS** | **Selected.** Crisp at any DPR, ~0 JS for playback, trivial `prefers-reduced-motion` override, removes Chart.js from this section, easy to match brand colors exactly |
| Canvas | Rejected — more code for paths, blurrier on retina, heavier reduced-motion duplicate |
| Framer Motion | Rejected — bundle cost for one marketing loop; CSS sufficient |

**Implementation notes:**

- Paths defined once in SVG with `pathLength="1"` (or computed length via `getTotalLength()` once on mount for precision).
- Animate with CSS classes toggled by `@media (prefers-reduced-motion: no-preference)`.
- Sequencing: either (a) staggered animation-delay per path on one keyframe set, or (b) lightweight `useEffect` interval that adds phase classes — prefer (a) for zero JS.
- Remove Chart.js imports from `LandscapeSection` when implementing; drop dependency if unused elsewhere.
- `aria-hidden="true"` on decorative SVG; meaning conveyed in text + intro chip.

### Accessibility

**`prefers-reduced-motion: reduce`:**

- Hide animated SVG (or show static final frame: all three paths fully drawn, no pulse).
- Show **static three-card stack** in animation stage:

  ```
  [ AI Intent-Driven ]  [ Spatial WebGL ]  [ Physics Micro-UX ]
  ```

  Each card: color dot, title, one-line descriptor from table above.

- Intro chip remains: “Illustrative trends · not live data”.

**Otherwise:** No autoplay video; no seizure-inducing flash; contrast meets existing cream/ink palette.

### Copy replacements in Weave section

| Current | Replacement |
|---------|-------------|
| “Our data tracks the shift from static grids to…” | “We illustrate how interfaces are shifting from static grids toward…” |
| “(+82%)”, “(+45%)”, “(+30%)” bullets | Descriptors synced to animation beats (table above) |
| Chart legend implying 2023–2026 data | Remove entirely |
| Tooltip “%” Y-axis | Remove entirely |

**KnowledgeGateway** links on terms (UI, Spatial Silk, Intent-Driven) stay unchanged.

---

## Auth & identity (deferred)

### Phase 1 (ship)

- **Anonymous vault:** `getOrCreateClientId()` → `localStorage` key `archive-arac:client-id`; server vault sync keyed by same ID.
- **OAuth (existing):** X and TikTok in Studio Social — read-only monitoring, not registration.
- **Stripe:** Identity Lock checkout continues without account login.

### Phase 2 (future — not v1)

- Optional **Clerk** (or Auth0) for Google/GitHub sign-in.
- Map authenticated user → merge or adopt anonymous vault on first login.
- No nav “Sign in” until Phase 2 unless marketing asks for waitlist-only CTA.

---

## Out of v1 scope

| Item | Notes |
|------|-------|
| Real analytics feed for weave trends | Would need data source + privacy review |
| Google/GitHub account auth | Option D defer |
| Live-updating chart | Contradicts honest illustrative positioning |
| Bottom tab bar mobile nav | Too many links; drawer chosen |
| Chart.js retention | Remove from Weave section; uninstall package if no other consumers |

---

## Implementation phases

### Phase 1 — Nav, Weave Motion, copy, platform footer

1. **`Navbar`** — desktop link set + canonical labels; mobile drawer; remove Mission-only mobile pill.
2. **`WeaveMotion` component** — SVG/CSS animation + reduced-motion static cards; swap into `LandscapeSection` (or rename section).
3. **Copy pass** — Weave section honesty; scan for “Our data tracks” / “+NN%” elsewhere (`knowledgeGloss.ts` action strings may still reference chart — update to Weave Motion).
4. **`PlatformFooter`** — add to `PlatformShell`; link groups per IA section.
5. **QA** — mobile drawer a11y, reduced motion, loop smoothness, Lighthouse CLS on animation container.

**Acceptance criteria:**

- Mobile user can reach every platform route in ≤2 taps (menu → link).
- Weave section states “illustrative · not live data” above animation.
- No percentage growth claims in Weave section.
- Platform pages show footer nav; home unchanged.

### Phase 2 — Auth & data (if prioritized)

1. Clerk (or chosen provider) + vault merge strategy.
2. Optional real trend data pipeline (product decision).
3. Signed-in nav avatar / account menu.

---

## Self-review (spec quality)

| Check | Result |
|-------|--------|
| TBD placeholders | None — drawer chosen, SVG+CSS chosen, timings specified |
| Internal contradictions | None — “no live data” consistent across animation, copy, drawer footnote |
| Ambiguity on nav labels | Resolved via canonical naming table |
| Chart.js vs animation | Explicit removal path |
| Mobile pattern | Drawer with rationale vs bottom bar |
| Auth | Phase 1 vs 2 split explicit |

**Spec ready for Phase 1 implementation without further design gate.**

---

## Resolved decisions (2026-06-03)

| Topic | Decision |
|-------|----------|
| **Loop duration** | **18–20s** — longer when animation quality warrants; web foundation → thread draw → title appear × 3 → hold → smooth loop |
| **Silk Analyzer nav** | **Collapsed** — one nav link: **Silk Analyzer → `/analyze`**. Home `#analyzer` section stays for scroll-only discovery; same `AnalyzerSection` component on both surfaces |
| **Phase 2 auth** | Optional **Clerk** when cross-device vault merge is needed; no Phase 1 sign-in UI |
