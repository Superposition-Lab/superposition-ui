# Design system

The look comes from **Broadsheet**, a print-register design system: paper and ink, two process accents, one serif doing every job. The original design reference is preserved verbatim in [`design-handoff/`](design-handoff/) — those `.dc.html` files are the visual spec this codebase implements.

Run `npm run dev` and open <http://localhost:4321/styleguide> to see everything below rendered.

---

## Tokens

[`src/styles/tokens.css`](../src/styles/tokens.css) is the source of truth. Nothing else in the codebase writes a hex value.

Tailwind reads the tokens through `@theme inline` in [`src/styles/theme.css`](../src/styles/theme.css). `inline` matters: it means Tailwind substitutes a `var()` reference into the utility instead of re-declaring the value, so the token is defined exactly once. Tailwind's stock palette is cleared with `--color-*: initial`, so only design-system colors exist as utilities.

### Ground

| Token             | Value                   | Role                                          |
| ----------------- | ----------------------- | --------------------------------------------- |
| `--color-bg`      | `#f3f2f2`               | paper — the page                              |
| `--color-surface` | `#eae9e9`               | a raised surface on paper                     |
| `--color-text`    | `#201e1d`               | ink — body copy                               |
| `--color-divider` | 16% ink                 | hairlines                                     |
| `--sp-navy`       | `oklch(0.21 0.055 235)` | the hero band. Site-specific, not Broadsheet. |

### Ramps

Three ramps — `neutral`, `accent` (cyan), `accent-2` (magenta) — each 100 to 900. They were generated in OKLCH on one shared lightness scale, so step 700 of any ramp has the same visual weight as step 700 of any other. That is what makes them substitutable.

- **Cyan is the interactive color.** Links and small text on paper take `--color-accent-700`; `--color-accent` is the hover state and the fill for primary buttons.
- **Magenta is a spot color.** Tags, the one figure arc, the "never revealed" label. Using it for anything routine spends its impact.
- **`--color-process-yellow`** is a print-treatment ink, not an interface accent. On this site it appears once, on the hero's outer orbit ring. Body copy and chrome never take it.

### Site tokens

Namespaced `--sp-` and defined below a divider comment in `tokens.css`. These are Superposition's, not Broadsheet's, so a future Broadsheet update can drop in above them untouched.

| Token                       | Role                                          |
| --------------------------- | --------------------------------------------- |
| `--sp-on-dark`              | text on the navy band                         |
| `--sp-on-dark-secondary`    | secondary text on navy                        |
| `--sp-on-paper-secondary`   | standfirst, figure body copy                  |
| `--sp-on-paper-tertiary`    | meta, captions, footer                        |
| `--sp-on-paper-muted`       | struck-through / dropped states               |
| `--sp-rule-muted`           | dashed borders on paper                       |
| `--sp-wrap` / `--sp-gutter` | the 1200px content column and its padding     |
| `--sp-measure`              | 840px — the reading measure for article prose |

### Type

Source Serif 4 sets **everything**: headings, body, and UI chrome. Weights 400 and 600, plus true italic 400. There is no second family.

The font is self-hosted by Astro's font pipeline (see the `fonts` block in `astro.config.ts`), which subsets it, preloads it, and generates a metric-matched fallback so there is no layout shift while it loads. `--font-source-serif` is published by that pipeline; `--font-heading` and `--font-body` point at it.

Monospace is a system stack (`--font-mono`), used only for code.

---

## House details

Two treatments carry the identity. Both are load-bearing — remove them and the site is just a serif on grey.

**Misregistration.** Display headlines carry a two-color text-shadow, cyan down-right and magenta up-left, at roughly 0.02em. It reads as a press drifting out of register. Applied at display sizes only — at body size it turns to mud. See `.headline` in `Hero.astro`.

**Optical alignment.** Large headings take `margin-left: -0.035em` so the first glyph's stem, not its sidebearing, lines up with the copy below.

**The mark.** Two 14px dots, cyan and magenta, overlapping by 6px. The blend mode flips with the ground: `screen` on navy (lightens), `multiply` on paper (darkens). `LogoMark.astro` takes an `on` prop for this — passing the wrong one makes the mark disappear into its background.

---

## Components

Broadsheet's class-based components live in [`src/styles/components.css`](../src/styles/components.css). Only the ones this site uses are ported; the full set (cards, forms, dialogs, the CMYK print treatments) is in [`design-handoff/styles.css`](design-handoff/styles.css). Copy a block down when a page needs it.

Ported: `.btn` (`.btn-primary`, `.btn-secondary`), `.tag` (`.tag-accent`, `.tag-accent-2`, `.tag-neutral`, `.tag-outline`), `.nav` / `.nav-brand`, `.table`, `.hr`.

Everything else is an Astro component with scoped styles.

---

## Figures

The article diagrams are HTML and CSS, not images — they stay sharp, respond to the tokens, and are searchable. Each takes props, so the next post reuses the component rather than copying markup.

All four wrap [`Figure.astro`](../src/components/figures/Figure.astro), which owns the caption, the numbering and the measure.

### `TrustChain`

A left-to-right chain of boxes joined by arrows. Wraps on narrow screens.

```astro
<TrustChain
  n={1}
  caption="The trust chain."
  links={[
    {
      label: 'Private circuit',
      note: 'never revealed',
      tone: 'private',
      grow: 1.35,
      minWidth: 170,
    },
    { label: 'SHA-256 commitment' },
    { label: 'Proof', tone: 'result', grow: 0.9 },
  ]}
/>
```

Tones: `private` (dashed rule over a halftone screen — the thing never revealed), `plain` (default), `result` (cyan on cyan tint — what the chain produces).

### `PipelineLoop`

Stacked numbered steps joined by vertical connectors, with an optional magenta feedback arc. Steps are numbered automatically from their array position. The arc is drawn with a half-border and a radius rather than SVG, so it inherits token colors; it hides below 720px, where it would overlap the steps.

```astro
<PipelineLoop
  n={2}
  caption="The pipeline, with the anti-cheating loop."
  loop={{ from: 1, to: 2, label: 'the hash loops back as the seed' }}
  steps={[{ title: 'Commit', body: 'Hash the circuit, publish the hash.' }]}
/>
```

### `ChipRows`

Labelled rows of chips. Reading down a column shows an item surviving or falling out.

Chip states: `kept` (default), `dropped` (dashed and struck through), `highlight` (cyan — what remains).

### `CellGrid`

A tape diagram: label, a row of equal-width cells, an annotation.

Cell states: `outline`, `filled`, `flagged` (solid magenta), `broken` (dashed magenta), `skipped` (dashed grey).

---

## The hero animation

Three layers, all CSS, all `aria-hidden`, all static under `prefers-reduced-motion`.

1. **[`InterferenceRipples`](../src/components/hero/InterferenceRipples.astro)** — two full-bleed `repeating-radial-gradient` layers of 2px rings, cyan and magenta, breathing on 16s and 19s. Neither layer is the effect; the moiré where they cross is. The periods (44px / 52px) and durations are deliberately mismatched so the pattern never repeats cleanly.

2. **[`OrbitSystem`](../src/components/hero/OrbitSystem.astro)** — a 620px atom: a pulsing core, three tilted orbit planes, a dotted outer ring, five twinkling stars. Its geometry is data in [`orbit-system.ts`](../src/components/hero/orbit-system.ts), so a plane can be retuned, added or removed in one place.

   The trick worth understanding is **billboarding**. Each electron rides a plane tilted 60–75° away from the viewer. Left alone it would squash into an ellipse and read flat. So each dot sits inside a counter-rotating wrapper and then takes a static inverse tilt — `rotateZ(-planeZ) rotateX(-planeX)` — which makes it face the viewer at every point of the orbit. That is what makes a flat gradient read as a sphere travelling in depth. `billboardTransform()` computes it, so it cannot drift out of sync with a plane's angles.

3. The headline's misregistration shadow, described above.

To change the atom, edit `ORBIT_PLANES` in `orbit-system.ts` — not the markup.

---

## Accessibility

- Focus rings are 2px cyan with a 2px offset, on `:focus-visible` only. Never remove them.
- A skip link sits first in the document, visible on focus.
- Decorative motion is `aria-hidden` and stops under `prefers-reduced-motion`. `base.css` has a global backstop, but guard component animations too.
- ESLint runs `eslint-plugin-jsx-a11y` over Astro templates, so most markup-level regressions fail `npm run lint`.
