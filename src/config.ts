/**
 * Site-wide constants.
 *
 * This is the one place to change the site's identity. It is imported by
 * `astro.config.ts`, so it must stay free of `astro:*` imports and of any
 * runtime-only dependency.
 */

export const SITE = {
  /** Canonical origin, no trailing slash. Drives sitemap, RSS and OG URLs. */
  url: 'https://superposition.pages.dev',
  name: 'Superposition',
  title: 'Superposition — research & development',
  description:
    'Superposition is a research and development lab working on quantum computers and cryptography.',
  /** Used in the footer and in the RSS copyright field. */
  foundedYear: 2026,
  locale: 'en',
  /** BCP 47 tag for <html lang>. */
  htmlLang: 'en-US',
} as const;

export const NAV_LINKS = [{ label: 'Writings', href: '/#writings' }] as const;

/** Open Graph image dimensions. Fixed by the OG spec, not a design choice. */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;
