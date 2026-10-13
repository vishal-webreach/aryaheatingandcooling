import type { APIRoute } from 'astro';
import { site } from '../data/site';

// The client preview build blocks every crawler; the live site allows them and lists the sitemap.
export const GET: APIRoute = ({ site: siteUrl }) => {
  const lines = site.preview
    ? ['User-agent: *', 'Disallow: /']
    : ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL('/sitemap-index.xml', siteUrl).href}`];

  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
