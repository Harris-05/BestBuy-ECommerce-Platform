import { z } from 'zod'

export const addressSchema = z.object({
  fullName: z.string().min(2),
  line1: z.string().min(5),
  city: z.string().min(2),
  postalCode: z.string().min(3),
  country: z.string().min(2),
})

export const createOrderSchema = z.object({
  address: addressSchema,
})
