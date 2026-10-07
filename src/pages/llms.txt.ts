import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { getOrdered } from '../lib/content';

// Plain-text summary of the business for AI assistants and crawlers.
export const GET: APIRoute = async ({ site: siteUrl }) => {
  const [services, areas, faqs] = await Promise.all([
    getOrdered('services'),
    getOrdered('areas'),
    getOrdered('faqs'),
  ]);

  const home = new URL('/', siteUrl).href;

  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    '## Pages',
    '',
    `- [Home](${home}): Services, service areas, FAQs and free quote request`,
    `- [Sitemap](${new URL('/sitemap-index.xml', siteUrl).href}): All pages on the site`,
    '',
    '## Contact',
    '',
    `- Website: ${home}`,
    `- Phone: ${site.phone.display}`,
    `- Email: ${site.email.display}`,
    '- Hours: Open 24 hours, 7 days a week',
    '- Location: Ashburn, VA and Northern Virginia',
    '',
    '## Services',
    '',
    ...services.map((service) => `- ${service.data.title}: ${service.data.summary}`),
    '',
    '## Service areas',
    '',
    `${areas.map((area) => area.data.name).join(', ')} (all in Virginia).`,
    '',
    '## Frequently asked questions',
    '',
    ...faqs.flatMap((faq) => [`### ${faq.data.question}`, '', faq.data.answer, '']),
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
