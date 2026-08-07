# Superposition — website

The company site and research journal for **Superposition**, a research and development lab working on quantum computers and cryptography.

Two page types today: a homepage (animated hero + journal index) and long-form articles. It is built to grow into a full journal, and later a products showcase.

---

## Quick start

```bash
npm install
```

```bash
npm run dev
```

The site runs at <http://localhost:4321>. A component gallery lives at <http://localhost:4321/styleguide> — every design token and figure component on one page. It is **development only** and is not emitted in a production build.

## Stack

| Concern   | Choice                         | Why                                                                                                |
| --------- | ------------------------------ | -------------------------------------------------------------------------------------------------- |
| Framework | [Astro](https://astro.build) 7 | Content-first, ships zero JavaScript by default. The only script on the site is one scroll reveal. |
| Language  | TypeScript (strict)            | `astro/tsconfigs/strictest`, plus `verbatimModuleSyntax`.                                          |
| Content   | MDX + content collections      | Posts are files in git, validated by a Zod schema at build time.                                   |
| Styling   | CSS tokens + Tailwind v4       | Tokens are plain CSS; Tailwind reads them via `@theme inline`. One source of truth.                |
| Fonts     | Astro font pipeline            | Source Serif 4, self-hosted, subset and preloaded. No third-party request.                         |
| OG images | Satori + resvg                 | Rendered at build time into static PNGs. No image service.                                         |
| Output    | Static (`dist/`)               | No adapter, so it deploys anywhere.                                                                |

## Commands

| Command             | Does                                                     |
| ------------------- | -------------------------------------------------------- |
| `npm run dev`       | Dev server with HMR at `localhost:4321`                  |
| `npm run build`     | Production build to `dist/`                              |
| `npm run preview`   | Serve `dist/` locally                                    |
| `npm run typecheck` | `astro check` — types across `.astro`, `.ts` and `.mdx`  |
| `npm run lint`      | ESLint, including accessibility rules on Astro templates |
| `npm run format`    | Prettier, write                                          |
| `npm run verify`    | Everything CI runs: format check, lint, typecheck, build |

Run `npm run verify` before opening a pull request. CI runs exactly the same thing.

## Project layout

```
src/
├── components/
│   ├── figures/         diagram components used inside articles
│   ├── hero/            the homepage hero and its animation
│   └── seo/             head tags and JSON-LD
├── content/writings/    the journal. One .mdx file per post.
├── layouts/             BaseLayout (document shell), PostLayout (article chrome)
├── lib/                 og.ts (social cards), writings.ts (collection queries)
├── pages/               routes. File path = URL.
├── styles/              tokens.css is the source of truth for the look
├── config.ts            site name, URL, nav — change the identity here
└── content.config.ts    the post schema
docs/
├── design-system.md     tokens, components, how to extend them
└── design-handoff/      the original design reference, preserved as delivered
```

## Publishing a post

Add one file. Nothing else needs editing — the homepage index, RSS feed, sitemap, social card and page route all derive from it.

```bash
touch src/content/writings/my-post-slug.mdx
```

```mdx
---
issue: 2
title: The headline
standfirst: The italic line under the headline. Also the meta description.
publishedAt: 2026-09-14
tag: Analysis
---

Body copy starts here.
```

The filename becomes the URL: `src/content/writings/my-post-slug.mdx` → `/writings/my-post-slug/`.

Full details, including the figure components and the frontmatter reference, are in [docs/design-system.md](docs/design-system.md) and [CONTRIBUTING.md](CONTRIBUTING.md).

## Deployment

The build is fully static, so `dist/` can be served by anything. No adapter is configured — that is deliberate, and keeps hosting portable.

```bash
npm run build
```

Then point your host at `dist/`. Common setups:

| Host             | Build command   | Output directory |
| ---------------- | --------------- | ---------------- |
| Cloudflare Pages | `npm run build` | `dist`           |
| Vercel           | `npm run build` | `dist`           |
| Netlify          | `npm run build` | `dist`           |
| GitHub Pages     | `npm run build` | `dist`           |

Before the first deploy, set `SITE.url` in [`src/config.ts`](src/config.ts) to the real domain. It drives canonical URLs, the sitemap, RSS and social card URLs, and it is currently a placeholder.

If a page ever needs server rendering, install the matching Astro adapter and set `output` in `astro.config.ts`; nothing else in the codebase assumes static output.

## Analytics

Off by default — with no configuration the site ships no tracking script and makes no third-party request.

To enable, copy `.env.example` to `.env` and set a provider. Both options are cookieless and need no consent banner:

```
PUBLIC_ANALYTICS_PROVIDER=plausible
PUBLIC_ANALYTICS_ID=superposition.xyz
```

The values are validated by the schema in `astro.config.ts`, and a provider set without an id fails the build rather than deploying blind.

## Testing

There is no test suite. That was a deliberate call for a site whose only logic is date formatting and a sort: the quality gate is `npm run verify` — strict types across every file type, ESLint with accessibility rules over the markup, and a build that fails on a bad post schema.

The code is structured so tests drop in without refactoring when they earn their place:

- **Unit** — the pure functions in `src/lib/writings.ts` and `src/components/hero/orbit-system.ts` take arguments and return values, with no Astro imports. Add Vitest and test them directly.
- **End-to-end** — add Playwright against `npm run preview`. Page rendering, link integrity, and `@axe-core/playwright` for accessibility are the checks worth having first.

## License

All rights reserved. © 2026 Superposition.
