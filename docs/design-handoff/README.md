# Handoff: Superposition — company site (home + first post)

## Overview
Marketing/publishing site for **Superposition**, a research and development lab working on quantum computers and cryptography. This first version has two pages: a homepage (hero + writings list) and one long-form article ("№ 001"). The site will grow into a research journal and, later, a products showcase. Tone: academic, understated, stealth-lab.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, not production code to ship. The task is to **recreate these designs in a real web codebase**. No target environment exists yet; recommended stack: **Astro** (content-driven, markdown blog pipeline, zero-JS by default — the animations are the only scripted part) or Next.js if the team prefers React. Blog posts should be authored as Markdown/MDX so future issues (№ 002…) are just new files.

The design files use a small design-system stylesheet (`styles.css`, included) via CSS variables and a few classes (`.nav`, `.btn`, `.tag`, `.table`). Port the tokens; the classes are trivial to recreate.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy and animations are final as rendered in the bundled HTML. Recreate pixel-perfectly. (The `.dc.html` files carry some tooling markup — trust the rendered output and the specs below, not every wrapper element.)

## Design Tokens
From the "Broadsheet" design system (`styles.css` in this bundle carries all of them as CSS variables):

- **Paper (page bg)**: `#f3f2f2` · **Ink (text)**: `#201e1d`
- **Accent (cyan, interactive)**: `#0088b0` — ramp 100–900 in styles.css; use `--color-accent-700` (`≈#00607c`) for small text/links on paper
- **Accent 2 (magenta, rare spot color)**: `#d6006c` + ramp
- **Process yellow (press treatments only)**: `#edbb00`
- **Hero navy (custom, this site only)**: `oklch(0.21 0.055 235)` ≈ `#141e2b`
- Dark-surface text: `#eef1f3`; dark-surface secondary: `#c3cdd4`
- Paper secondary text: `#45423f`; tertiary/meta: `#55524f`
- **Font**: "Source Serif 4" (Google Fonts; weights 400, 600, italic 400) for EVERYTHING — headings, body, UI chrome. Code: `ui-monospace, 'SF Mono', Menlo, monospace`
- Radius: 2px (`--radius-md`). Spacing/shadows: see `styles.css` variables.
- Focus ring: `outline: 2px solid #0088b0; outline-offset: 2px` on `:focus-visible`. Selection: cyan tint.
- Links: `--color-accent-700` default, `--color-accent` on hover.

## Screens / Views

### 1. Homepage (`Superposition Home.dc.html`)

**Purpose**: introduce the lab, point to the journal.

**Layout**: full-width dark hero band, then paper. Content column `max-width: 1200px`, centered, side padding `clamp(24px, 5vw, 64px)`.

**Nav** (inside hero band, not sticky): flex row, padding `15px`/gutter. Brand left ("Superposition", Source Serif 600 18px, with logo mark), one link "Writings" right (`#c3cdd4`, 14px, hover cyan).
- **Logo mark**: two 14px circles side by side overlapping ~6px (cyan `#0088b0` left, magenta `#d6006c` right), `mix-blend-mode: screen` on dark (use `multiply` on paper).

**Hero** (navy band `oklch(0.21 0.055 235)`, text `#eef1f3`):
- Padding: `clamp(80px,12vh,130px)` top, `clamp(80px,11vh,120px)` bottom.
- H1: "Between / two states / of computing." (3 lines, `<br>`), Source Serif 600, `clamp(48px, 6.5vw, 84px)`, line-height 1.06, letter-spacing −0.025em, misregistration text-shadow: `0.022em 0.016em 0 rgba(0,163,209,0.55), -0.02em -0.014em 0 rgba(214,0,108,0.4)`.
- Sub: "Superposition is a research and development lab working on quantum computers and cryptography." — 19px/30px, `#c3cdd4`, max-width 42ch, 44px below H1.
- CTA: primary button "Read № 001" → post page. Solid cyan `#0088b0`, paper text, hover `--color-accent-600`, active `--color-accent-700`, radius 2px.

**Hero background animation** (decorative, `aria-hidden`, disable under `prefers-reduced-motion`):
1. *Interference ripples*: two full-bleed layers (`inset: -25%`), each a `repeating-radial-gradient` of 2px rings — cyan `rgba(102,199,228,0.13)` at 32%/42% with 44px period; magenta `rgba(240,118,178,0.10)` at 68%/58% with 52px period. Each layer scales 1→1.22 (resp. 1.18→1) ease-in-out infinite, 16s and 19s. The moiré between them is the effect.
2. *3D atom/orbit system*: 620×620px, right side of hero, vertically centered, `perspective: 1100px`.
   - Core: 14px sphere (radial-gradient `circle at 32% 28%, #fff, #cfeaf2 45%, #6fa8bd`), pulsing glow (box-shadow 16px→30px cyan-white, 4s).
   - Three orbit planes, each `transform-style: preserve-3d`: rotateX(68°) rotateZ(24°) full-size; rotateX(62°) rotateZ(−38°) inset 70px; rotateX(74°) rotateZ(82°) inset 145px. Each plane: 1px solid circle border (cyan `rgba(130,210,235,0.38)` / magenta `rgba(240,140,190,0.32)` / yellow `rgba(237,187,0,0.28)`).
   - Electrons: spheres riding each ring — a rotating wrapper (`rotate 360°` linear infinite: 11s cyan ×2 dots (one delayed −5.5s), 17s reverse magenta, 23s yellow), each dot **counter-rotated + inverse-tilted so it billboards to the viewer** (child chain: counter-spin animation, then static `rotateZ(−planeZ) rotateX(−planeX)`), shaded as spheres via radial-gradient highlight at 32%/28% (cyan `#e9fbff→#7fd4ec→#0e4c60`, magenta `#ffe9f4→#f08cbe→#6e1042`, yellow `#fff8e0→#edd06a→#6e5606`) + soft glow box-shadow. Sizes 16/11/14/12px.
   - One dotted outer ring (inset −30px, `rgba(238,241,243,0.18)`, rotateX(72°) rotateZ(−8°)); five 2–3px twinkle dots (opacity 0.2↔0.9, 5–8s, staggered delays).

**Writings section** (paper, id `writings`): kicker "WRITINGS" (13px, 0.08em tracking, uppercase, `#55524f`), then one row per post — flex baseline row, gap 28px: "№ 001" (Source Serif 600 17px, cyan-700) · title (italic Source Serif 400, `clamp(22px,2.6vw,32px)`, with normal-style cyan "→") · date "August 2026" (14px `#55524f`). Whole row is the link, no underline, text inherits ink. Section fades/rises in on scroll (opacity 0 / translateY(22px) → visible, 0.7s ease, IntersectionObserver at 0.15 threshold, once).

**Footer**: "© 2026 Superposition — research & development", 13px `#55524f`.

### 2. Post page (`Superposition Post 001.dc.html`)

**Purpose**: long-form research article, № 001.

**Layout**: slim navy header band with the same nav (brand links home). Article on paper, same 1200px wrap; all article content `max-width: 840px`, flush left.

**Article header**: meta row (flex, baseline, 14px gaps): "№ 001" (cyan-700, 600 17px) · tag "Analysis" (magenta tag: bg `--color-accent-2-100`, text `--color-accent-2-800`, 11px, 3px 10px, radius ~1.5px) · "AUGUST 2026" (13px uppercase `#55524f`). H1 `clamp(36px,4.6vw,56px)`/1.12, −0.02em, 600. Standfirst in **true italic** 400, 22px/34px, `#45423f`.

**Body**: 17px/28px, justified with `hyphens: auto`; H2 30px/36px Source Serif 600 with 84px top margin; paragraphs 24–26px top margin. Inline code: monospace 14.5px on `--color-neutral-100`, 1px 5px, radius 2px. Code blocks: monospace 13.5px/22px, `--color-neutral-100` bg, 18px 22px padding, horizontal scroll. Tables: themed header + row rules (`.table` in styles.css), 15px. Closing disclaimer: italic serif 15.5px `#55524f`.

**Figures** (all pure HTML/CSS — recreate as components, not images; captions 13.5px `#55524f`, "Fig. N — …"):
1. **Trust chain** (after standfirst): horizontal flex strip of boxes joined by "→" glyphs. "Private circuit" box: dashed `#9a9795` border, halftone dot bg (`radial-gradient` dots, 7px grid), label + magenta-800 "NEVER REVEALED". Middle boxes 1px ink borders: "SHA-256 commitment", "9,024 tests derived from that same hash", "Simulation inside the zkVM". Final "Proof" box: cyan border + `--color-accent-100` bg + accent-800 text. Wraps on narrow screens.
2. **Pipeline with feedback loop**: four stacked ink-bordered step boxes (title 600 16px + 14.5px grey copy) joined by 1px vertical connectors at 40px left inset; a magenta arc on the right (border-right+radius, no left border) looping from box 1 to box 2 with a magenta arrowhead and italic side-label "the hash loops back as the seed — change the circuit and every test changes" (max-width 760px figure, 190px right padding for the arc).
3. **Trust-by-mode**: three rows (Mode 1/2/3 labels, 110px column) of chips; kept items 1px ink border, dropped items dashed grey border + strikethrough + `#8a8886`; mode 3's "source + pinned toolchain" chip cyan (accent border, accent-100 bg, accent-800 text).
4. **Two-pass desync**: 3-row grid (130px label / cells / 130px annotation). Instruction row: 6 outlined cells, 3rd is magenta "malformed" (accent-2 border + accent-2-100 bg). Execution row: 6 filled `--color-neutral-200` cells with "✓" → italic note "the gate fires". Counting row: 2 ✓ cells, then magenta dashed "×", then grey dashed "skipped" ×3 → magenta italic "the meter reads 0".

**Content**: full article copy is in the bundled HTML — use it verbatim, including all external links (whitepaper, Trail of Bits, Wikipedia refs, GitHub repo).

## Interactions & Behavior
- Nav links + writings rows: color transition to cyan on hover; no underlines in nav/rows, default underline behavior acceptable for in-body links.
- Scroll-reveal (home writings section): IntersectionObserver, once, 0.7s ease; skip entirely under `prefers-reduced-motion`.
- All hero animation CSS keyframes are in the `<style>` of the home file (`sp-orbit`, `sp-ripple-a/b`, `sp-pulse`, `sp-twinkle`).
- Responsive: fluid paddings/clamp type as specced; hero orbit may bleed off-canvas on narrow screens (it is pinned right: `right: max(-40px, calc(50vw - 660px))`); writings row wraps (`flex-wrap`).

## State Management
None — static content site. Blog index should be generated from the content collection (one entry so far).

## Assets
No raster assets. Logo mark, diagrams and animations are all CSS/HTML. Fonts from Google Fonts (Source Serif 4).

## Files
- `Superposition Home.dc.html` — homepage design reference
- `Superposition Post 001.dc.html` — article design reference
- `styles.css` — design-system token sheet + base components (link target for both pages; adjust path or port tokens)
- `print-plates.js` — design-system script for its CMYK image treatments; not used by these two pages, included for future imagery
