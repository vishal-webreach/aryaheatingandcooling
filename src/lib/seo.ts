import type { CollectionEntry } from 'astro:content';

/** A schema.org node placed in the page's JSON-LD graph. */
export type SchemaNode = Record<string, unknown>;

/** FAQPage schema for a page that shows the given questions. */
export function faqSchema(faqs: CollectionEntry<'faqs'>[], pageUrl: string): SchemaNode {
  return {
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.data.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.data.answer },
    })),
  };
}

/** Breadcrumb trail from the home page down to the current page. */
export function breadcrumbSchema(trail: { name: string; url: string }[], pageUrl: string): SchemaNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
