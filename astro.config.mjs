// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://luyao.studio',
  adapter: vercel(),
  vite: {
    optimizeDeps: {
      // Keep the config fields and UI in the same dependency optimization pass.
      // Separate passes can instantiate two different Keystar contexts.
      include: ['@keystatic/core', '@keystatic/core/ui', '@keystatic/astro/ui'],
    },
  },
  integrations: [react(), markdoc(), keystatic(), sitemap({
    filter: (page) => !/^\/stats\/?$/.test(new URL(page).pathname),
  })],
});
