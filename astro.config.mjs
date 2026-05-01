// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

const keystaticTheme = () => ({
  name: 'keystatic-warm-theme',
  hooks: {
    'astro:config:setup': ({ injectScript }) => {
      injectScript(
        'page',
        `if (location.pathname.startsWith('/keystatic') && !document.querySelector('link[href="/keystatic-theme.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/keystatic-theme.css';
  document.head.appendChild(link);
}`
      );
    },
  },
});

// https://astro.build/config
export default defineConfig({
  site: 'https://luyao.studio',
  adapter: vercel(),
  integrations: [keystaticTheme(), react(), markdoc(), keystatic(), sitemap()],
});
