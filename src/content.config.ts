import { defineCollection, z } from 'astro:content';

const essays = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    
    z.object({
      title: z.string(),
      date: z.date(),
      summary: z.string().optional(),
      cover: image().optional(),
    }),
});

const work = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      summary: z.string(),
      cover: image().or(z.string()),
      metaLeft: z.string(),
      metaRight: z.string(),
    }),
});

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    date: z.date(),
  }),
});

export const collections = { essays, notes, work };
