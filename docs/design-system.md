# Design system

The current site uses the Cobalt direction: paper, deep ultramarine, grainy architectural artwork, Source Serif 4, and IBM Plex Mono metadata. The homepage, every writing, 404, and development styleguide share the same navigation, footer, and tokens. The original Broadsheet references in `design-handoff/` are historical.

The original logo is retained: two 14 px cyan and magenta dots overlapping by 6 px. Its dedicated `--color-brand-cyan` and `--color-brand-magenta` tokens preserve the original inks independently of the new interface palette. `LogoMark` still uses multiply on paper and screen on dark. The favicon is unchanged.

## Tokens and typography

The color values below describe light mode. `src/styles/tokens.css` is the source of truth. Components use scoped styles and token references; Tailwind maps these through `src/styles/theme.css`. Build-time social cards mirror the same colors in `src/lib/og.ts`, because Satori cannot resolve CSS variables.

| Role                    | Token / value                          |
| ----------------------- | -------------------------------------- |
| Paper                   | `--color-bg`, `#f3f2f2`                |
| Ink                     | `--color-text`, `#141333`              |
| Interactive cobalt      | `--color-accent`, `#1510b8`            |
| Secondary figure states | `--color-accent-2`, violet             |
| Dark sections           | `--sp-navy`, `#08062d`                 |
| Secondary text          | `--sp-on-paper-secondary`, `#57566a`   |
| Hairlines               | `--color-divider`, `#d4d3de`           |
| Content width           | `--sp-wrap`, 1440 px including gutters |
| Reading width           | `--sp-measure`, 760 px                 |

Source Serif 4 remains self-hosted through Astro's font pipeline. Display headings use regular weight; the original wordmark and prose emphasis use semibold. IBM Plex Mono is bundled locally, with its license, for navigation, metadata, captions, and code. No font request goes to a third party at runtime.

## Light and dark mode

Color tokens use `light-dark()` with the page's `color-scheme`, so the system preference works even without JavaScript. The header button lets readers select a mode. An explicit choice is saved in `localStorage` under `superposition-theme`, applied in the document head before first paint, and synchronized between tabs. If storage is unavailable, switching still works on the current page. The original logo inks stay fixed; only the blend mode adapts to the page background.

Dark mode uses a deep violet ground, warm light text, and lighter cobalt/violet accents. Diagram colors, rules, table states, and captions share these tokens. Shiki emits light and dark syntax colors for code blocks. Hero artwork and the dark image sections keep their original treatment.

## Page structure

`Hero` pairs a dark text panel with a full-height image. `WritingsList` features the latest entry and lists the remainder as ruled rows, all linking to local article routes. `LabSection` introduces the lab. `SiteNav` and `SiteFooter` are shared across pages.

`PostLayout` renders the complete MDX body, with a wide article header and artwork followed by a 760 px reading column. Its secondary metadata column disappears at 900 px. Layouts stack at 760 px; article artwork retains its full composition at every width. Wide tables and code blocks scroll within their own containers.

## Artwork

The hero and lab images are references supplied for this redesign. Four new editorial illustrations were generated with the built-in Imagegen tool, then adjusted to the references' stronger ultramarine palette. These are visual metaphors, not scientific diagrams. Full prompts and file paths are recorded in [cobalt-art-prompts.json](cobalt-art-prompts.json).

All project images live in `src/assets/art/`. Astro produces responsive WebP sizes at build time. The original public-domain prints remain in the repository as unused historical assets.

The optional `art` frontmatter requires `src`, `alt`, and `title`. `credit` and `href` are optional for sourced artwork. The original illustrations display only their titles; creation records remain in the asset prompt document.

```yaml
art:
  src: ../../assets/art/cobalt-004-threshold.jpg
  alt: A colonnade leads toward a luminous doorway.
  title: The threshold
```

## Figures

The article diagrams are HTML and CSS, not images — they stay sharp, respond to the tokens, and are searchable. Each takes props, so the next post reuses the component rather than copying markup.

All diagrams wrap [`Figure.astro`](../src/components/figures/Figure.astro), which owns the caption, the numbering and the measure.

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

Tones: `private` (dashed rule over a halftone screen — the thing never revealed), `plain` (default), `result` (cobalt on cobalt tint — what the chain produces).

### `PipelineLoop`

Stacked numbered steps joined by vertical connectors, with an optional violet feedback arc. Steps are numbered automatically from their array position. The arc is drawn with a half-border and a radius rather than SVG, so it inherits token colors; it hides below 720px, where it would overlap the steps.

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

Chip states: `kept` (default), `dropped` (dashed and struck through), `highlight` (cobalt — what remains).

### `CellGrid`

A tape diagram: label, a row of equal-width cells, an annotation.

Cell states: `outline`, `filled`, `flagged` (solid violet), `broken` (dashed violet), `skipped` (dashed grey).

---

## Accessibility and validation

Keep the skip link, visible keyboard focus, sufficient text contrast, and reduced-motion handling. On dark sections the focus ring uses the light foreground color. Diagram state labels, patterns, and line styles remain intact independently of the palette. The proof chain stacks on phones; dense SVG charts retain a 640 px minimum drawing width inside a labeled, keyboard-focusable scroll region so labels remain readable.

Run `npm run verify` for formatting, lint, Astro/TypeScript checks, and the production build. Review full article layouts on desktop and mobile, including wide tables and diagrams. The development-only `/styleguide` route shows the shared components and figure states.
