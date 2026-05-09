import { z } from 'zod'

const passwordRules = z
  .string()
  .min(8, 'At least 8 characters')
  .regex(/[A-Z]/, 'Must contain an uppercase letter')
  .regex(/[0-9]/, 'Must contain a number')
  .regex(/[^a-zA-Z0-9]/, 'Must contain a special character')

export const signupSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: passwordRules,
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Required'),
  rememberMe: z.boolean().optional(),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: passwordRules,
})
