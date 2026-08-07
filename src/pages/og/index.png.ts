/** The homepage social card. Built once at build time to `/og/index.png`. */
import { pngResponse, renderOgImage } from '~/lib/og';

import type { APIRoute } from 'astro';

// The headline, not the tagline: the card should read like the page it links to.
const HOMEPAGE_CARD_TITLE = 'Between two states of computing.';

export const GET: APIRoute = async () =>
  pngResponse(await renderOgImage({ title: HOMEPAGE_CARD_TITLE }));
