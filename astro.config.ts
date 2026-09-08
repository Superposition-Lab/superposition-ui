import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@tailwindcss/vite';
import { defineConfig, envField, fontProviders } from 'astro/config';

import { SITE } from './src/config';

// https://astro.build/config
export default defineConfig({
  site: SITE.url,

  // Fully static output. No adapter is configured on purpose: `dist/` deploys
  // as-is to any static host. Add an adapter only if a page ever needs SSR.
  output: 'static',

  integrations: [mdx(), sitemap()],

  // Typed, validated environment variables. Analytics is opt-in: with no
  // provider set the site ships zero tracking and zero extra requests.
  env: {
    schema: {
      PUBLIC_ANALYTICS_PROVIDER: envField.enum({
        context: 'client',
        access: 'public',
        values: ['none', 'plausible', 'cloudflare'],
        default: 'none',
      }),
      /** Plausible: the site domain. Cloudflare: the Web Analytics token. */
      PUBLIC_ANALYTICS_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
    },
  },

  vite: {
    plugins: [tailwind()],
  },

  // Self-hosted, subset and preloaded at build time. The design system asks for
  // Source Serif 4 everywhere; declaring it here means no third-party font
  // request at runtime and an automatically metric-matched fallback.
  fonts: [
    {
      name: 'Source Serif 4',
      cssVariable: '--font-source-serif',
      provider: fontProviders.google(),
      weights: [400, 600],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Iowan Old Style', 'Georgia', 'serif'],
    },
  ],

  markdown: {
    shikiConfig: {
      // Syntax colors follow the same color-scheme as the page, including without JS.
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: 'light-dark()',
      wrap: false,
    },
  },
});
