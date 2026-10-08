// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://aryaheatingandcooling.com',
  // Every page URL ends with a slash, e.g. /about/
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    react(),
    sitemap({
      // Pages marked `placeholder` in service-categories.json are noindex, so keep them out.
      filter: (page) => !page.includes('/services/hvac-contracts/'),
    }),
  ],
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Manrope',
      cssVariable: '--font-manrope',
      weights: ['400 800'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Arial', 'sans-serif'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
