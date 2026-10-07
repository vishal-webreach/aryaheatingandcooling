import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { getFaqs, getOrdered, getServiceGroups } from '../lib/content';

// Plain-text summary of the business for AI assistants and crawlers.
export const GET: APIRoute = async ({ site: siteUrl }) => {
  const [serviceGroups, areas, faqs] = await Promise.all([
    getServiceGroups(),
    getOrdered('areas'),
    // Only the general questions; page-specific FAQs stay on their own pages.
    getFaqs('home'),
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
    `- [About](${new URL('/about/', siteUrl).href}): Company background, what to expect and how the process works`,
    `- [Services](${new URL('/services/', siteUrl).href}): Residential HVAC, commercial HVAC and HVAC contracts`,
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
    ...serviceGroups.flatMap(({ category, services }) => [
      `### ${category.data.title}`,
      '',
      category.data.summary,
      '',
      ...services.map((service) => `- ${service.data.title}: ${service.data.summary}`),
      '',
    ]),
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
