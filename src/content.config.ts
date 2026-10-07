import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// The main services; each one groups the entries in `services`.
const serviceCategories = defineCollection({
  loader: file('src/content/service-categories.json'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      image: image(),
      imageAlt: z.string(),
      order: z.number(),
    }),
});

const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      category: reference('serviceCategories'),
      image: image().optional(),
      imageAlt: z.string().optional(),
      /** Position within its category. */
      order: z.number(),
    }),
});

const gallery = defineCollection({
  loader: file('src/content/gallery.json'),
  schema: ({ image }) =>
    z.object({
      image: image(),
      alt: z.string(),
      order: z.number(),
    }),
});

const areas = defineCollection({
  loader: file('src/content/areas.json'),
  schema: z.object({
    name: z.string(),
    order: z.number(),
  }),
});

const faqs = defineCollection({
  loader: file('src/content/faqs.json'),
  schema: z.object({
    /** The page the question is shown on, e.g. "home" or "about". */
    page: z.string(),
    question: z.string(),
    answer: z.string(),
    order: z.number(),
  }),
});

const reviews = defineCollection({
  loader: file('src/content/reviews.json'),
  schema: z.object({
    author: z.string(),
    rating: z.number().int().min(1).max(5),
    /** Day the review was added, YYYY-MM-DD. */
    date: z.string(),
    text: z.string(),
    order: z.number(),
  }),
});

export const collections = { serviceCategories, services, gallery, areas, faqs, reviews };
