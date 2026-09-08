import { glob } from 'astro/loaders';
// `z` re-exported from `astro:content` is deprecated in Astro 7; `astro/zod` is
// the same instance the content layer validates with.
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

/**
 * The research journal.
 *
 * The schema is the contract for a post. A missing or malformed field fails the
 * build rather than shipping a broken page, and every consumer — the homepage
 * list, the post page, the RSS feed, the OG image — reads typed data from here.
 *
 * To publish № 002: drop `src/content/writings/002-slug.mdx` in place with this
 * frontmatter. Nothing else needs editing.
 */
const writings = defineCollection({
  loader: glob({ base: './src/content/writings', pattern: '**/*.{md,mdx}' }),
  // A function schema, because `image()` resolves a frontmatter path against
  // the post's own directory and hands back the metadata `<Image>` needs.
  schema: ({ image }) =>
    z.object({
      /** Issue number. Rendered as "№ 001" and used for ordering. */
      issue: z.number().int().positive(),

      title: z.string().min(1),

      /** The standfirst under the headline. Also the meta description. */
      standfirst: z.string().min(1),

      /** Shown as "August 2026" on the index and as the machine-readable date. */
      publishedAt: z.coerce.date(),

      /** The article category. */
      tag: z.enum(['Analysis', 'Research', 'Note']),

      /** Editorial artwork; credits are optional for original illustrations. */
      art: z
        .object({
          src: image(),
          alt: z.string().min(1),
          title: z.string().min(1),
          credit: z.string().min(1).optional(),
          href: z.url().optional(),
        })
        .optional(),

      /**
       * Overrides the description used for SEO and RSS. Defaults to the
       * standfirst, which is usually the right summary already.
       */
      description: z.string().optional(),

      /** Drafts build locally but are excluded from the index, RSS and sitemap. */
      draft: z.boolean().default(false),
    }),
});

export const collections = { writings };
