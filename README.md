# Superposition

The company site and research journal for **Superposition**, a research and development lab working on quantum computers and cryptography.

---

## Quick start

```bash
npm install
```

```bash
npm run dev
```

The site runs at <http://localhost:4321>. A component gallery lives at <http://localhost:4321/styleguide> — every design token and figure component on one page. It is **development only** and is not emitted in a production build.

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
