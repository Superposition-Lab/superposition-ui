/**
 * Build-time Open Graph image generation.
 *
 * Satori lays out a small element tree and emits SVG; resvg rasterises it to
 * PNG. Both run at build time, so the generated cards are static files with no
 * runtime dependency and no external image service.
 *
 * The fonts are vendored in `src/assets/fonts` rather than fetched: Satori
 * cannot read the woff2 files that Astro's font pipeline produces, and a build
 * that reaches out to Google Fonts is a build that fails offline.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';

import { OG_IMAGE_SIZE, SITE } from '~/config';

/**
 * Token values, restated as literals.
 *
 * Satori resolves no CSS custom properties, so these cannot be read from
 * tokens.css. `--sp-navy` is an OKLCH value, which Satori also cannot parse;
 * the hex below is its sRGB equivalent, as recorded in the design handoff.
 * If a token changes, change it here too — the check in `og.test-invariant`
 * comment below is a reminder, not a guarantee.
 */
const OG_COLORS = {
  navy: '#141e2b',
  onDark: '#eef1f3',
  onDarkSecondary: '#c3cdd4',
  cyan: '#0088b0',
  magenta: '#d6006c',
} as const;

/*
 * Resolved from the project root, not from `import.meta.url`.
 *
 * This module is bundled into `dist/.prerender/chunks/` before it runs, so
 * `import.meta.url` points at the chunk and a relative path misses the source
 * tree entirely. `npm run build` always runs with the package root as its
 * working directory, which is the stable anchor here.
 */
const FONT_DIR = new URL('src/assets/fonts/', `file://${process.cwd()}/`);

let fontCache: Array<{ name: string; data: Buffer; weight: 400 | 600; style: 'normal' }> | null =
  null;

async function loadFonts() {
  if (fontCache) return fontCache;

  const [regular, semibold] = await Promise.all([
    readFile(fileURLToPath(new URL('SourceSerif4-Regular.ttf', FONT_DIR))),
    readFile(fileURLToPath(new URL('SourceSerif4-SemiBold.ttf', FONT_DIR))),
  ]);

  fontCache = [
    { name: 'Source Serif 4', data: regular, weight: 400, style: 'normal' },
    { name: 'Source Serif 4', data: semibold, weight: 600, style: 'normal' },
  ];

  return fontCache;
}

/** Minimal hyperscript. Satori accepts React-shaped nodes; this builds them. */
type Node = { type: string; props: Record<string, unknown> };

function h(
  type: string,
  props: Record<string, unknown> = {},
  ...children: Array<Node | string | false | undefined>
): Node {
  const kids = children.filter((c): c is Node | string => Boolean(c));
  return {
    type,
    props: { ...props, children: kids.length === 1 ? kids[0] : kids.length ? kids : undefined },
  };
}

/** The two-dot mark. Blend modes are unsupported here, so the dots simply overlap. */
function logoMark(size: number): Node {
  const dot = (color: string, offset: number) =>
    h('div', {
      style: {
        position: 'absolute',
        left: offset,
        top: 0,
        width: size,
        height: size,
        borderRadius: size,
        background: color,
      },
    });

  return h(
    'div',
    {
      style: {
        display: 'flex',
        position: 'relative',
        width: size * 2 - size * (6 / 14),
        height: size,
      },
    },
    dot(OG_COLORS.cyan, 0),
    dot(OG_COLORS.magenta, size - size * (6 / 14)),
  );
}

export interface OgCard {
  /** The large line. A post title, or the site tagline on the homepage. */
  title: string;
  /** The small line under it: "№ 001 · Analysis · August 2026". */
  meta?: string | undefined;
}

/** Renders a card to PNG bytes. */
export async function renderOgImage({ title, meta }: OgCard): Promise<Uint8Array> {
  const fonts = await loadFonts();

  // Long titles need to step down a size or they overflow the card.
  const titleSize = title.length > 70 ? 58 : title.length > 45 ? 68 : 78;

  const tree = h(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: OG_COLORS.navy,
        color: OG_COLORS.onDark,
        fontFamily: 'Source Serif 4',
        padding: '72px 80px',
      },
    },

    // Brand
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: 14 } },
      logoMark(26),
      h('div', { style: { fontSize: 32, fontWeight: 600 } }, SITE.name),
    ),

    // Title
    h(
      'div',
      {
        style: {
          display: 'flex',
          fontSize: titleSize,
          fontWeight: 600,
          lineHeight: 1.1,
          letterSpacing: '-0.025em',
          maxWidth: 1000,
        },
      },
      title,
    ),

    // Meta, or a plain cyan rule when there is none.
    meta
      ? h(
          'div',
          { style: { display: 'flex', fontSize: 28, color: OG_COLORS.onDarkSecondary } },
          meta,
        )
      : h('div', { style: { display: 'flex', width: 120, height: 4, background: OG_COLORS.cyan } }),
  );

  const svg = await satori(tree as never, {
    width: OG_IMAGE_SIZE.width,
    height: OG_IMAGE_SIZE.height,
    fonts,
  });

  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: OG_IMAGE_SIZE.width },
  })
    .render()
    .asPng();

  return new Uint8Array(png);
}

/** Shared response wrapper, so both endpoints set the same headers. */
export function pngResponse(bytes: Uint8Array): Response {
  return new Response(bytes as unknown as BodyInit, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
