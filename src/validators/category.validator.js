import { z } from 'zod';

const createCategorySchema = z.object({
  name: z.string(),
  slug: z.string().optional(),
});

const createImageSchema = z.object({
  image: z.any(),
});

export { createCategorySchema, createImageSchema };
