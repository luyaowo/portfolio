import { defineMiddleware } from 'astro:middleware';

const keystaticAssets = `
<link rel="stylesheet" href="/keystatic-theme.css">
<script src="/keystatic-tools.js" defer></script>
`;

export const onRequest = defineMiddleware(async ({ url }, next) => {
  const response = await next();
  if (!url.pathname.startsWith('/keystatic')) return response;

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  const html = await response.text();
  const headers = new Headers(response.headers);
  headers.delete('content-length');

  const body = html.includes('<astro-island')
    ? html.replace('<astro-island', `${keystaticAssets}<astro-island`)
    : `${html}${keystaticAssets}`;

  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
