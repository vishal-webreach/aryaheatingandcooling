import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';

/** Loads a collection sorted by its `order` field. */
export async function getOrdered<K extends CollectionKey>(collection: K) {
  const entries = await getCollection(collection);
  return entries.sort((a, b) => a.data.order - b.data.order);
}

/** Loads the FAQs written for one page, e.g. "home" or "about". */
export async function getFaqs(page: string) {
  const faqs = await getOrdered('faqs');
  return faqs.filter((faq) => faq.data.page === page);
}

/** Path of a main service's page, e.g. /services/residential-hvac/. */
export function categoryPath(category: CollectionEntry<'serviceCategories'>) {
  return `/services/${category.data.slug}/`;
}

/** Path of a service's own page, or undefined while it has none. */
export function servicePath(category: CollectionEntry<'serviceCategories'>, service: CollectionEntry<'services'>) {
  return service.data.pageSlug ? `/services/${category.data.slug}/${service.data.pageSlug}/` : undefined;
}

/** Loads the main services, each with the services that belong to it. */
export async function getServiceGroups() {
  const [categories, services] = await Promise.all([getOrdered('serviceCategories'), getOrdered('services')]);
  return categories.map((category) => ({
    category,
    services: services.filter((service) => service.data.category.id === category.id),
  }));
}
