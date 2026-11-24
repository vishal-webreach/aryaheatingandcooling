// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://pioneerheatingcooling.com',
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
    // Body text
    {
      provider: fontProviders.google(),
      name: 'Barlow',
      cssVariable: '--font-barlow',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Arial', 'sans-serif'],
    },
    // Headings, buttons and labels
    {
      provider: fontProviders.google(),
      name: 'Barlow Condensed',
      cssVariable: '--font-barlow-condensed',
      weights: [600, 700, 800],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Arial Narrow', 'Arial', 'sans-serif'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
