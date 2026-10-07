import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      image: image(),
      imageAlt: z.string(),
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
    question: z.string(),
    answer: z.string(),
    order: z.number(),
  }),
});

const reviews = defineCollection({
  loader: file('src/content/reviews.json'),
  schema: z.object({
    author: z.string(),
    location: z.string(),
    rating: z.number().int().min(1).max(5),
    text: z.string(),
    order: z.number(),
  }),
});

export const collections = { services, gallery, areas, faqs, reviews };
