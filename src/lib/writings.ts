/**
 * Query helpers for the writings collection.
 *
 * Every page that lists or links posts goes through here, so the rules about
 * drafts and ordering are stated once. `import.meta.env.PROD` is the only
 * place draft visibility is decided.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type Writing = CollectionEntry<'writings'>;

/** Posts, newest issue first. Drafts are hidden in production builds. */
export async function getWritings(): Promise<Writing[]> {
  const entries = await getCollection('writings', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );

  return entries.sort((a, b) => b.data.issue - a.data.issue);
}

/** The post the homepage CTA points at. `undefined` if nothing is published. */
export async function getLatestWriting(): Promise<Writing | undefined> {
  const [latest] = await getWritings();
  return latest;
}

/** "№ 001" — always three digits, so the index column stays aligned. */
export function formatIssue(issue: number): string {
  return `№ ${String(issue).padStart(3, '0')}`;
}

/** "August 2026". */
export function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** Site-relative URL for a post. */
export function writingPath(entry: Writing): string {
  return `/writings/${entry.id}/`;
}
