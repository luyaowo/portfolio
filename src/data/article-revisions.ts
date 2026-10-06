// Verified revisions of existing articles, kept outside Keystatic's content schema.
// Agent and Token: befc98c (2026-09-03); Claude Code: bd9739d (2026-09-03).
// Add a date here when an article is revised; layout-only changes do not count.
const revisionDates: Record<string, string> = {
  'ai-design/agent': '2026-09-03',
  'ai-design/token': '2026-09-03',
  'ai-design/claude-code': '2026-09-03',
};

export function getArticleRevision(post: { collection: string; slug: string; data: { date: Date } }): Date | undefined {
  const value = revisionDates[`${post.collection}/${post.slug}`];
  if (!value) return undefined;
  const date = new Date(value);
  return date > post.data.date ? date : undefined;
}
