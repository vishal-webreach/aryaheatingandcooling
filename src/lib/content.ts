import { getCollection, type CollectionKey } from 'astro:content';

/** Loads a collection sorted by its `order` field. */
export async function getOrdered<K extends CollectionKey>(collection: K) {
  const entries = await getCollection(collection);
  return entries.sort((a, b) => a.data.order - b.data.order);
}
