# Contributing

## Before you push

```bash
npm run verify
```

That runs the format check, ESLint, `astro check` and a production build — the same four steps as CI, in the same order. If it passes locally it passes in CI.

## Publishing a post

### 1. Create the file

The filename is the URL slug. Keep it lowercase and hyphenated, and make it descriptive rather than numeric — `google-zkp-quantum-attack-bitcoin.mdx`, not `002.mdx`. The issue number lives in the frontmatter, so a post can be renumbered without breaking its link.

```
src/content/writings/<slug>.mdx   →   /writings/<slug>/
```

### 2. Write the frontmatter

Every field is validated by the schema in [`src/content.config.ts`](src/content.config.ts). A missing or malformed field fails the build with a message naming the file and the field.

```yaml
---
issue: 2 # positive integer. Rendered as "№ 002". Also the sort key.
title: The headline # plain text, no markdown
standfirst: One or two sentences. # the italic line, and the meta description
publishedAt: 2026-09-14 # YYYY-MM-DD
tag: Analysis # Analysis | Research | Note
description: Optional. # overrides standfirst for SEO and RSS
draft: false # true hides it from the index, RSS and sitemap in prod
---
```

Drafts still render at their URL in `npm run dev`, so you can share a local preview. In a production build they are excluded from the homepage list, the feed and the sitemap, and the page itself is marked `noindex`.

### 3. Write the body

Ordinary markdown. Headings start at `##` — the `#` level belongs to the article title, which the layout renders from frontmatter.

Body paragraphs are justified with automatic hyphenation. Tables, code fences, blockquotes and lists are all styled already; use them without wrappers.

### 4. Add figures

Figures are components, not images. Import what you need at the top of the MDX file, below the frontmatter:

```mdx
import TrustChain from '~/components/figures/TrustChain.astro';
```

The four available figures and every prop they take are documented in [docs/design-system.md](docs/design-system.md#figures). Number them sequentially from 1 within a post — the `n` prop is not inferred, so that renumbering stays under your control when you insert a figure.

To see all figures and every state at once:

```bash
npm run dev
```

Then open <http://localhost:4321/styleguide>.

## Changing the design

**Never hard-code a color, radius or shadow in a component.** Every value lives in [`src/styles/tokens.css`](src/styles/tokens.css), which Tailwind reads through `@theme inline`. Tailwind's stock palette is cleared, so `bg-red-500` does not exist — an off-palette color is a build-time impossibility rather than a code review catch.

To retune the design, edit the token. Every component and utility follows.

If you need a genuinely new value, add it to `tokens.css` first (under the `--sp-` namespace if it is specific to this site rather than to the Broadsheet design system), then use it.

## Styling components

Use Astro's scoped `<style>` block inside the component. Do not add global stylesheets — `src/styles/global.css` is the only one, and it is imported once by `BaseLayout`.

One gotcha worth knowing: **Astro scoped selectors add no specificity.** A rule in a parent layout like `.prose > *` will beat a rule in a child component. Scope the parent rule to exclude the child (see the `:not(figure)` rule in `PostLayout.astro`) rather than piling on `!important`.

## Animation

Anything that moves must be invisible to `prefers-reduced-motion: reduce`. `base.css` has a global backstop that flattens durations, but guard your own animations too — the backstop is a safety net, not the design.

Decorative motion is also `aria-hidden`. The hero animation carries no information, so it is hidden from assistive technology entirely.

## Commit hygiene

Keep the content and the code separate where you can. A commit that adds a post should touch `src/content/writings/` and nothing else — if it also needs a component change, that is a sign the component needs a prop, and it is worth splitting into two commits.
