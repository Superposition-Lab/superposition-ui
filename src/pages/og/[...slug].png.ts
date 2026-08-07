/**
 * One social card per post, at `/og/<slug>.png`.
 *
 * The card is generated from the same frontmatter the page uses, so a shared
 * link can never disagree with the article.
 */
import { formatIssue, formatMonthYear, getWritings, type Writing } from '~/lib/writings';
import { pngResponse, renderOgImage } from '~/lib/og';

import type { APIRoute, GetStaticPaths } from 'astro';

export const getStaticPaths = (async () => {
  const writings = await getWritings();
  return writings.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { entry } = props as { entry: Writing };
  const { issue, title, tag, publishedAt } = entry.data;

  return pngResponse(
    await renderOgImage({
      title,
      meta: [formatIssue(issue), tag, formatMonthYear(publishedAt)].join('  ·  '),
    }),
  );
};
