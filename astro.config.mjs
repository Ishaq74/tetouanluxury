import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react()
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'ar', 'es'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  }
});
