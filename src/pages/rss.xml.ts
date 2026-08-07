/**
 * The journal feed. Drafts are excluded because `getWritings` excludes them.
 */
import rss from '@astrojs/rss';

import { SITE } from '~/config';
import { formatIssue, getWritings, writingPath } from '~/lib/writings';

import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const writings = await getWritings();

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    trailingSlash: true,
    items: writings.map((entry) => ({
      // The issue number belongs in the feed title: subscribers see a list of
      // headlines with no other cue that these are numbered.
      title: `${formatIssue(entry.data.issue)} — ${entry.data.title}`,
      description: entry.data.description ?? entry.data.standfirst,
      pubDate: entry.data.publishedAt,
      link: writingPath(entry),
      categories: [entry.data.tag],
    })),
    customData: `<language>${SITE.locale}</language>`,
  });
};
