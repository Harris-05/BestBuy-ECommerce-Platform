import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  categoryId: z.string().cuid(),
  images: z.array(z.string().url()).min(1),
})
